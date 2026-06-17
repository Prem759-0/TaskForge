import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  dueDate: Date,
  priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  category: { type: String, default: 'Personal' },
  tags: [{ type: String, trim: true }],
  estimatedMinutes: { type: Number, default: 30 },
  status: { type: String, enum: ['Backlog', 'Todo', 'In Progress', 'Review', 'Completed'], default: 'Todo' },
  archived: { type: Boolean, default: false },
  completedAt: Date
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);
