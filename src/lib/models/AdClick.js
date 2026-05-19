import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  label: { type: String, required: true },
  url:   { type: String, default: '' },
  page:  { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.AdClick || mongoose.model('AdClick', schema);
