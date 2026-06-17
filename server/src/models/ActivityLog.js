import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  action: { type: String, required: true },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
