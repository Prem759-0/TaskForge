import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  goals: {
    daily: { type: Number, default: 3 },
    weekly: { type: Number, default: 15 },
    monthly: { type: Number, default: 60 }
  },
  streak: { type: Number, default: 0 },
  achievements: [{ title: String, earnedAt: Date }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
