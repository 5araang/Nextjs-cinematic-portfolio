import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  query:        { type: String, required: true, unique: true },
  count:        { type: Number, default: 1 },
  lastSearched: { type: Date, default: Date.now },
});

export default mongoose.models.Search || mongoose.model('Search', schema);
