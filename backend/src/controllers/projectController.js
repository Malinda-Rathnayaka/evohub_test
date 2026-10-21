import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { Payment } from '../models/Payment.js';
import { rankProjectBids } from '../utils/ranking.js';

const sanitizeProjectForRole = (project, user) => {
  const pObj = project.toObject ? project.toObject() : { ...project };

  if (user?.role === 'designer') {
    if (pObj.status === 'open' || pObj.status === 'closed') {
      pObj.bids = (pObj.bids || []).filter((b) => b.d === user.id);
    }
  }
  return pObj;
};

export const getProjects = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }

    let projects = await Project.find(filter).sort({ createdAt: -1 });

    if (req.user?.role === 'designer') {
      const userDesignerId = req.user.id;
      projects = projects.filter((p) => {
        if (p.visibility === 'Selected designers' && !p.visibleTo.includes(userDesignerId)) {
          return false;
        }
        return true;
      });

      const sanitized = projects.map((p) => sanitizeProjectForRole(p, req.user));
      return res.json({ success: true, count: sanitized.length, data: sanitized });
    }

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const sanitized = sanitizeProjectForRole(project, req.user);

    if (req.user?.role === 'admin' && project.bids && project.bids.length > 0) {
      const designers = await User.find({ role: 'designer' });
      const ranked = rankProjectBids(project.bids, designers);
      sanitized.rankedBids = ranked;
    }

    res.json({ success: true, data: sanitized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const count = await Project.countDocuments();
    const newId = req.body.id || `P${count + 1}`;
    const code = req.body.code || newId;

    const projectData = {
      ...req.body,
      id: newId,
      code,
      status: req.body.status || 'open',
      opens: req.body.opens || Date.now(),
      closes: req.body.closes || Date.now() + 48 * 3600 * 1000,
      activity: [
        {
          at: Date.now(),
          text: `Project created and opened for bidding by Admin.`,
        },
      ],
    };

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, message: `Project ${req.params.id} removed` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitBid = async (req, res) => {
  try {
    const designerId = req.user?.id || req.body.designerId;
    const { amount, days, note, portfolio } = req.body;

    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Bidding is not open for this project' });
    }

    const existingIndex = project.bids.findIndex((b) => b.d === designerId);
    const bidItem = {
      d: designerId,
      amount: Number(amount),
      days: Number(days),
      note: note || '',
      portfolio: portfolio || '',
      at: Date.now(),
    };

    if (existingIndex >= 0) {
      project.bids[existingIndex] = bidItem;
      project.activity.push({
        at: Date.now(),
        text: `Designer ${designerId} updated their sealed bid.`,
      });
    } else {
      project.bids.push(bidItem);
      project.activity.push({
        at: Date.now(),
        text: `Designer ${designerId} submitted a sealed bid.`,
      });
      await User.findOneAndUpdate({ id: designerId }, { $inc: { bids: 1 } });
    }

    await project.save();
    res.json({ success: true, message: 'Bid submitted successfully', data: sanitizeProjectForRole(project, req.user) });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const withdrawBid = async (req, res) => {
  try {
    const designerId = req.user?.id || req.body.designerId;
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.bids = project.bids.filter((b) => b.d !== designerId);
    project.activity.push({
      at: Date.now(),
      text: `Designer ${designerId} withdrew their bid.`,
    });

    await project.save();
    res.json({ success: true, message: 'Bid withdrawn successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const awardProject = async (req, res) => {
  try {
    const { designerId, amount, reason } = req.body;
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.status = 'awarded';
    project.awardedTo = designerId;
    project.award = {
      amount: Number(amount),
      at: Date.now(),
      reason: reason || 'Rank #1 lowest sealed bid + best turnaround.',
    };

    project.activity.push({
      at: Date.now(),
      text: `Project awarded to designer ${designerId} for LKR ${Number(amount).toLocaleString()}.`,
    });

    await project.save();

    await User.findOneAndUpdate(
      { id: designerId },
      {
        $inc: { won: 1, load: 1 },
      }
    );

    res.json({ success: true, message: `Awarded to ${designerId}`, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const submitDelivery = async (req, res) => {
  try {
    const { note, files } = req.body;
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const nextV = (project.deliveries?.length || 0) + 1;
    const newDelivery = {
      v: nextV,
      at: Date.now(),
      note: note || '',
      status: 'In review',
      files: files || [{ name: `deliverable-v${nextV}.zip`, size: '14.2 MB' }],
    };

    project.deliveries.push(newDelivery);
    project.status = 'review';
    project.activity.push({
      at: Date.now(),
      text: `Version ${nextV} submitted for client review.`,
    });

    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const approveDelivery = async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.deliveries && project.deliveries.length > 0) {
      project.deliveries[project.deliveries.length - 1].status = 'Approved';
    }

    project.status = 'completed';
    project.activity.push({
      at: Date.now(),
      text: `Client approved final delivery. Project marked completed. Payment scheduled.`,
    });

    await project.save();

    if (project.awardedTo) {
      const awardAmount = project.award?.amount || project.max;
      const designer = await User.findOneAndUpdate(
        { id: project.awardedTo },
        {
          $inc: {
            load: -1,
            earned: awardAmount,
          },
        },
        { new: true }
      );

      const payCount = await Payment.countDocuments();
      await Payment.create({
        id: `PAY-${2254 + payCount}`,
        date: new Date().toISOString().split('T')[0],
        designerId: project.awardedTo,
        designerName: designer?.name || project.awardedTo,
        projectCode: project.code,
        projectTitle: project.title,
        amount: awardAmount,
        status: 'Pending',
        method: 'Bank Transfer',
        reference: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      });
    }

    res.json({ success: true, message: 'Project approved and completed', data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const requestRevision = async (req, res) => {
  try {
    const { note, clientFiles } = req.body;
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.deliveries && project.deliveries.length > 0) {
      project.deliveries[project.deliveries.length - 1].status = 'Revision requested';
    }

    project.revUsed = (project.revUsed || 0) + 1;
    project.status = 'progress';

    if (clientFiles && Array.isArray(clientFiles)) {
      project.clientFiles = [...project.clientFiles, ...clientFiles];
    }

    project.activity.push({
      at: Date.now(),
      text: `Revision #${project.revUsed} requested: ${note || 'Changes requested by client'}`,
    });

    await project.save();
    res.json({ success: true, message: 'Revision requested', data: project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text, by } = req.body;
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const senderName = by || req.user?.name || 'Admin';
    project.comments.push({
      by: senderName,
      text,
      at: Date.now(),
    });

    await project.save();
    res.json({ success: true, data: project.comments });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
