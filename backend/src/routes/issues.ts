import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Mock database (replace with real database)
let issues: any[] = [];

// Get all issues
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  res.json(issues);
});

// Get issue by ID
router.get('/:id', authenticateToken, (req: AuthRequest, res) => {
  const issue = issues.find((i) => i.id === req.params.id);
  if (!issue) {
    return res.status(404).json({ error: 'Issue not found' });
  }
  res.json(issue);
});

// Create issue
router.post('/', authenticateToken, (req: AuthRequest, res) => {
  const { title, description, status, priority } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newIssue = {
    id: `issue_${Date.now()}`,
    title,
    description,
    status: status || 'pending',
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: req.userId,
  };

  issues.push(newIssue);
  res.status(201).json(newIssue);
});

// Update issue
router.put('/:id', authenticateToken, (req: AuthRequest, res) => {
  const issueIndex = issues.findIndex((i) => i.id === req.params.id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  issues[issueIndex] = {
    ...issues[issueIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json(issues[issueIndex]);
});

// Delete issue
router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  const issueIndex = issues.findIndex((i) => i.id === req.params.id);

  if (issueIndex === -1) {
    return res.status(404).json({ error: 'Issue not found' });
  }

  issues.splice(issueIndex, 1);
  res.json({ message: 'Issue deleted successfully' });
});

export default router;

