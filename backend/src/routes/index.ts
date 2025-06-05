import { Router } from 'express';
import taskRoutes from './tasks';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Task routes
router.use('/tasks', taskRoutes);

export default router;
