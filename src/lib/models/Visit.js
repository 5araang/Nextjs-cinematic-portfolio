import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  page:      { type: String, required: true },
  referrer:  { type: String, default: '' },
  userAgent: { type: String, default: '' },
  ip:        { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Visit || mongoose.model('Visit', schema);
