import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from '../config/db.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smart_civil_secret_key_2026_super_secure';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const users = await sql`
      SELECT * FROM admin_users WHERE username = ${username.trim().toLowerCase()} LIMIT 1;
    `;

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, username: user.username, full_name: user.full_name }
    });
  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// GET /api/auth/verify
router.get('/verify', verifyAdmin, (req, res) => {
  return res.status(200).json({ valid: true, user: req.user });
});

// Default fallback for GET /api/auth
router.get('/', verifyAdmin, (req, res) => {
  return res.status(200).json({ valid: true, user: req.user });
});

// Default fallback for POST /api/auth
router.post('/', async (req, res) => {
  // Delegate to login logic if hitting root
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const users = await sql`
      SELECT * FROM admin_users WHERE username = ${username.trim().toLowerCase()} LIMIT 1;
    `;

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, full_name: user.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, username: user.username, full_name: user.full_name }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

export default router;
