import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';

export const getDesigners = async (req, res) => {
  try {
    const { active, skill } = req.query;
    const filter = { role: 'designer' };

    if (active !== undefined && active !== 'all') {
      filter.active = active === 'true';
    }
    if (skill && skill !== 'all') {
      filter.skills = skill;
    }

    const designers = await User.find(filter).select('-passwordHash').sort({ id: 1 });
    res.json({ success: true, count: designers.length, data: designers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDesignerById = async (req, res) => {
  try {
    const designer = await User.findOne({ id: req.params.id, role: 'designer' }).select('-passwordHash');
    if (!designer) {
      return res.status(404).json({ success: false, message: 'Designer not found' });
    }

    const projects = await Project.find({
      $or: [{ awardedTo: designer.id }, { 'bids.d': designer.id }],
    });

    res.json({
      success: true,
      data: {
        designer,
        projects,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDesigner = async (req, res) => {
  try {
    const { name, email, phone, skills, limit, portfolio } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A designer with this email already exists' });
    }

    const count = await User.countDocuments({ role: 'designer' });
    const newId = `D${count + 1}`;
    const initials = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const tempPassword = `evo${Math.floor(1000 + Math.random() * 9000)}`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    const designer = await User.create({
      id: newId,
      name,
      ini: initials,
      email,
      passwordHash,
      role: 'designer',
      phone: phone || '',
      skills: Array.isArray(skills) ? skills : (skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      rating: 4.5,
      active: true,
      limit: Number(limit) || 2,
      load: 0,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      earned: 0,
      bids: 0,
      won: 0,
      portfolio: portfolio || '',
      tempPassword,
    });

    res.status(201).json({
      success: true,
      message: 'Designer invited successfully',
      data: designer,
      tempCredentials: {
        id: newId,
        email,
        tempPassword,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDesigner = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.passwordHash;
    delete updates.id;

    const designer = await User.findOneAndUpdate(
      { id: req.params.id, role: 'designer' },
      updates,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!designer) {
      return res.status(404).json({ success: false, message: 'Designer not found' });
    }

    res.json({ success: true, data: designer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDesigner = async (req, res) => {
  try {
    const designer = await User.findOneAndDelete({ id: req.params.id, role: 'designer' });
    if (!designer) {
      return res.status(404).json({ success: false, message: 'Designer not found' });
    }
    res.json({ success: true, message: `Designer ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
