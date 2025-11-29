import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Mock database (replace with real database)
let reports: any[] = [];

// Get all reports
router.get('/', authenticateToken, (req: AuthRequest, res) => {
  res.json(reports);
});

// Get report by ID
router.get('/:id', authenticateToken, (req: AuthRequest, res) => {
  const report = reports.find((r) => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(report);
});

// Create report
router.post('/', authenticateToken, (req: AuthRequest, res) => {
  const { title, description, type, date } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newReport = {
    id: `report_${Date.now()}`,
    title,
    description,
    type: type || 'maintenance',
    date: date || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: req.userId,
  };

  reports.push(newReport);
  res.status(201).json(newReport);
});

// Update report
router.put('/:id', authenticateToken, (req: AuthRequest, res) => {
  const reportIndex = reports.findIndex((r) => r.id === req.params.id);

  if (reportIndex === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }

  reports[reportIndex] = {
    ...reports[reportIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json(reports[reportIndex]);
});

// Delete report
router.delete('/:id', authenticateToken, (req: AuthRequest, res) => {
  const reportIndex = reports.findIndex((r) => r.id === req.params.id);

  if (reportIndex === -1) {
    return res.status(404).json({ error: 'Report not found' });
  }

  reports.splice(reportIndex, 1);
  res.json({ message: 'Report deleted successfully' });
});

export default router;

