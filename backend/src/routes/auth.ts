import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Mock user database (replace with real database)
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2a$10$example', // In production, hash passwords
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'mikashif666@gmail.com',
    password: '$2a$10$LvtNOlAER5gINXty876SZ.BwDmUKRYxYZzAnexTleKpOIpwjmFbBe', // Hashed: Ameen@5212
    name: 'Mikashif Admin',
    role: 'admin',
  },
];

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user (in production, query database)
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password using bcrypt
    // For the old demo user, accept any password; for others, verify with bcrypt
    if (user.password !== '$2a$10$example') {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'admin',
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists (in production, query database)
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password (in production)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (in production, save to database)
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      name,
      role: 'technician' as const, // Default role for new registrations
    };
    users.push(newUser);

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

