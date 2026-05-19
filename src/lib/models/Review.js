import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  author:   { type: String, required: true },
  role:     { type: String, default: '' },
  company:  { type: String, default: '' },
  content:  { type: String, required: true },
  rating:   { type: Number, min: 1, max: 5, default: 5 },
  approved: { type: Boolean, default: true },
  avatar:   { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', schema);
