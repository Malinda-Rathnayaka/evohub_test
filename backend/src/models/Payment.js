import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    designerId: { type: String, required: true },
    designerName: { type: String, required: true },
    projectCode: { type: String, required: true },
    projectTitle: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Paid', 'Processing', 'Pending'],
      default: 'Pending',
    },
    method: { type: String, default: 'Bank Transfer' },
    reference: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', PaymentSchema);
