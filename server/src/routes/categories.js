import { Router } from 'express';
import { Category } from '../models/Category.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const categories = await Category.find({ user: req.user.id }).sort('name');
  res.json(categories);
});

router.post('/', async (req, res) => {
  const category = await Category.create({ ...req.body, user: req.user.id });
  res.status(201).json(category);
});

router.patch('/:id', async (req, res) => {
  const category = await Category.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
});

router.delete('/:id', async (req, res) => {
  await Category.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.status(204).end();
});

export default router;
