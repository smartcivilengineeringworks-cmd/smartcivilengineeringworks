import { sql } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'smart_civil_secret_key_2026_super_secure';

export function verifyAdminToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query?.action || (req.body && req.body.action);

  // 1. Verify Session
  if (req.method === 'GET' || action === 'verify') {
    const user = verifyAdminToken(req);
    if (!user) {
      return res.status(401).json({ valid: false, message: 'Unauthorized or token expired' });
    }
    return res.status(200).json({ valid: true, user });
  }

  // 2. Login
  if (req.method === 'POST') {
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
      return res.status(500).json({
        success: false,
        message: 'Database error: ' + (error.message || String(error)),
        error: error.message || String(error)
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
