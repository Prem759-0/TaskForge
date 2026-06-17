import { Router } from 'express';
import { subDays, startOfDay } from 'date-fns';
import { Task } from '../models/Task.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/summary', async (req, res) => {
  const user = req.user.id;
  const [total, completed, archived, categoryDistribution, weekly] = await Promise.all([
    Task.countDocuments({ user, archived: false }),
    Task.countDocuments({ user, status: 'Completed', archived: false }),
    Task.countDocuments({ user, archived: true }),
    Task.aggregate([{ $match: { user: Task.schema.path('user').cast(user), archived: false } }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
    Task.aggregate([{ $match: { user: Task.schema.path('user').cast(user), completedAt: { $gte: subDays(new Date(), 7) } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
  ]);
  const pending = total - completed;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;
  res.json({ total, completed, pending, archived, completionRate, productivityScore: Math.min(100, completionRate + weekly.length * 3), weekly, categoryDistribution, today: startOfDay(new Date()) });
});

export default router;
