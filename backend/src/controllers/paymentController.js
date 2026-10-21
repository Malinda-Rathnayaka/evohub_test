import { Payment } from '../models/Payment.js';

export const getPayments = async (req, res) => {
  try {
    const { status, designerId } = req.query;
    const filter = {};

    if (req.user?.role === 'designer') {
      filter.designerId = req.user.id;
    } else if (designerId && designerId !== 'all') {
      filter.designerId = designerId;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    const payments = await Payment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const count = await Payment.countDocuments();
    const id = req.body.id || `PAY-${2255 + count}`;
    const payment = await Payment.create({
      ...req.body,
      id,
      date: req.body.date || new Date().toISOString().split('T')[0],
      reference: req.body.reference || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    });

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
