import { Router } from 'express';
import { sql } from '../config/db.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

// 1. SUBMIT INQUIRY (Public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const inserted = await sql`
      INSERT INTO inquiries (name, email, phone, subject, message)
      VALUES (${name}, ${email}, ${phone || ''}, ${subject || 'New Project Inquiry'}, ${message})
      RETURNING *;
    `;

    return res.status(201).json({
      success: true,
      message: 'Inquiry received. The Smart Civil team will contact you shortly.',
      data: inserted[0]
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record inquiry' });
  }
});

// 2. FETCH INQUIRIES (Admin Protected)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const inquiries = await sql`
      SELECT * FROM inquiries ORDER BY created_at DESC;
    `;
    return res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
  }
});

// 3. MARK AS READ (Admin Protected)
router.put('/', verifyAdmin, async (req, res) => {
  try {
    const { id, is_read = true } = req.body || {};
    if (!id) {
      return res.status(400).json({ success: false, message: 'Inquiry ID required' });
    }

    await sql`
      UPDATE inquiries SET is_read = ${Boolean(is_read)} WHERE id = ${Number(id)};
    `;
    return res.status(200).json({ success: true, message: 'Inquiry updated' });
  } catch (error) {
    console.error('Update inquiry error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update inquiry' });
  }
});

export default router;
