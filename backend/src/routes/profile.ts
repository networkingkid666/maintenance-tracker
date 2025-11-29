import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  // In production, fetch from database
  res.json({
    id: req.userId,
    email: 'admin@example.com',
    name: 'Admin User',
    preferences: {
      theme: 'light',
      notifications: true,
    },
  });
});

// Update user profile
router.put('/', authenticateToken, (req: AuthRequest, res) => {
  // In production, update in database
  const updatedProfile = {
    id: req.userId,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json(updatedProfile);
});

export default router;

