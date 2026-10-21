import mongoose from 'mongoose';

const BidSchema = new mongoose.Schema(
  {
    d: { type: String, required: true },
    amount: { type: Number, required: true },
    days: { type: Number, required: true },
    note: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    at: { type: Number, required: true },
  },
  { _id: false }
);

const DeliverySchema = new mongoose.Schema(
  {
    v: { type: Number, required: true },
    at: { type: Number, required: true },
    note: { type: String, default: '' },
    status: {
      type: String,
      enum: ['In review', 'Revision requested', 'Approved'],
      default: 'In review',
    },
    files: [{ name: String, size: String }],
  },
  { _id: false }
);

const CommentSchema = new mongoose.Schema(
  {
    by: { type: String, required: true },
    text: { type: String, required: true },
    at: { type: Number, required: true },
  },
  { _id: false }
);

const ActivitySchema = new mongoose.Schema(
  {
    at: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    skill: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'open', 'closed', 'awarded', 'progress', 'review', 'completed'],
      default: 'open',
    },
    client: { type: String, required: true },
    max: { type: Number, required: true },
    opens: { type: Number, required: true },
    closes: { type: Number, required: true },
    days: { type: Number, required: true },
    revisions: { type: Number, default: 2 },
    minRating: { type: Number, default: 4.0 },
    brief: { type: String, default: '' },
    deliverables: { type: [String], default: [] },
    refs: [{ name: String, size: String }],
    clientFiles: [{ name: String, size: String }],
    bids: [BidSchema],
    awardedTo: { type: String, default: null },
    award: {
      amount: { type: Number },
      at: { type: Number },
      reason: { type: String, default: '' },
    },
    deliveries: [DeliverySchema],
    revUsed: { type: Number, default: 0 },
    comments: [CommentSchema],
    activity: [ActivitySchema],
    visibility: {
      type: String,
      enum: ['All designers', 'Selected designers'],
      default: 'All designers',
    },
    visibleTo: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', ProjectSchema);
