import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  color: { type: String, default: '#FFD23F' }
}, { timestamps: true });

categorySchema.index({ user: 1, name: 1 }, { unique: true });

export const Category = mongoose.model('Category', categorySchema);
