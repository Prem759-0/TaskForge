import { Router } from 'express';
import { Task } from '../models/Task.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const buildQuery = (req) => {
  const { search, status, category, priority, tag } = req.query;
  const archived = req.query.archived === 'true';
  const query = { user: req.user.id, archived };
  if (status) query.status = status;
  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (tag) query.tags = tag;
  if (search) query.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }, { tags: new RegExp(search, 'i') }];
  return query;
};

router.get('/', async (req, res) => {
  const sortMap = { newest: '-createdAt', oldest: 'createdAt', due: 'dueDate', priority: 'priority', completion: '-completedAt' };
  const tasks = await Task.find(buildQuery(req)).sort(sortMap[req.query.sort] || '-createdAt');
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user.id });
  await ActivityLog.create({ user: req.user.id, task: task._id, action: 'created' });
  res.status(201).json(task);
});

router.patch('/:id', async (req, res) => {
  const patch = { ...req.body };
  if (patch.status === 'Completed') patch.completedAt = new Date();
  const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, patch, { new: true });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  await ActivityLog.create({ user: req.user.id, task: task._id, action: patch.status === 'Completed' ? 'completed' : 'updated' });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.status(204).end();
});

router.post('/:id/duplicate', async (req, res) => {
  const source = await Task.findOne({ _id: req.params.id, user: req.user.id }).lean();
  if (!source) return res.status(404).json({ message: 'Task not found' });
  delete source._id;
  const task = await Task.create({ ...source, title: `${source.title} Copy`, status: 'Todo', completedAt: undefined });
  res.status(201).json(task);
});

export default router;
