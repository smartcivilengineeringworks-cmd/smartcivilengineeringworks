import { sql } from './db.js';
import { verifyAdminToken } from './auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. SUBMIT INQUIRY (Public contact form)
  if (req.method === 'POST') {
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
  }

  // 2. FETCH INQUIRIES (Admin Protected)
  if (req.method === 'GET') {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

    try {
      const inquiries = await sql`
        SELECT * FROM inquiries ORDER BY created_at DESC;
      `;
      return res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
    } catch (error) {
      console.error('Fetch inquiries error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch inquiries' });
    }
  }

  // 3. MARK AS READ (Admin Protected)
  if (req.method === 'PUT') {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin authentication required' });
    }

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
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
