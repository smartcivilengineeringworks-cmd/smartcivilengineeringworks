import { sql } from './db.js';
import { verifyAdminToken } from './auth.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET ALL PROJECTS (Public)
  if (req.method === 'GET') {
    try {
      const projects = await sql`
        SELECT * FROM projects ORDER BY id ASC;
      `;
      return res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (error) {
      console.error('Fetch projects error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch projects from database',
        error: error.message || String(error)
      });
    }
  }

  // Admin authentication required for mutations (POST, PUT, DELETE)
  const admin = verifyAdminToken(req);
  if (!admin) {
    return res.status(401).json({ success: false, message: 'Admin authentication required' });
  }

  // 2. CREATE NEW PROJECT (Protected)
  if (req.method === 'POST') {
    try {
      const {
        title,
        category,
        description,
        image_url,
        year,
        status = 'Completed',
        progress = 100,
        progress_stage = 'Completed',
        location,
        model,
        scope
      } = req.body || {};

      if (!title || !category) {
        return res.status(400).json({ success: false, message: 'Title and Category are required' });
      }

      const inserted = await sql`
        INSERT INTO projects (
          title, category, description, image_url, year, status, progress, progress_stage, location, model, scope, updated_at
        ) VALUES (
          ${title}, ${category}, ${description || ''}, ${image_url || ''}, ${year || 'Ongoing'},
          ${status}, ${Number(progress) || 0}, ${progress_stage || ''}, ${location || 'Kigali, Rwanda'},
          ${model || 'Design, Build & Supervision'}, ${scope || ''}, CURRENT_TIMESTAMP
        )
        RETURNING *;
      `;

      return res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: inserted[0]
      });
    } catch (error) {
      console.error('Create project error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create project: ' + (error.message || String(error)),
        error: error.message || String(error)
      });
    }
  }

  // 3. UPDATE EXISTING PROJECT (Protected)
  if (req.method === 'PUT') {
    try {
      const {
        id,
        title,
        category,
        description,
        image_url,
        year,
        status,
        progress,
        progress_stage,
        location,
        model,
        scope
      } = req.body || {};

      if (!id) {
        return res.status(400).json({ success: false, message: 'Project ID is required' });
      }

      const updated = await sql`
        UPDATE projects SET
          title = COALESCE(${title}, title),
          category = COALESCE(${category}, category),
          description = COALESCE(${description}, description),
          image_url = COALESCE(${image_url}, image_url),
          year = COALESCE(${year}, year),
          status = COALESCE(${status}, status),
          progress = COALESCE(${Number(progress)}, progress),
          progress_stage = COALESCE(${progress_stage}, progress_stage),
          location = COALESCE(${location}, location),
          model = COALESCE(${model}, model),
          scope = COALESCE(${scope}, scope),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${Number(id)}
        RETURNING *;
      `;

      if (updated.length === 0) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: updated[0]
      });
    } catch (error) {
      console.error('Update project error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update project: ' + (error.message || String(error)),
        error: error.message || String(error)
      });
    }
  }

  // 4. DELETE PROJECT (Protected)
  if (req.method === 'DELETE') {
    try {
      const id = req.query?.id || (req.body && req.body.id);
      if (!id) {
        return res.status(400).json({ success: false, message: 'Project ID required for deletion' });
      }

      const deleted = await sql`
        DELETE FROM projects WHERE id = ${Number(id)} RETURNING id, title;
      `;

      if (deleted.length === 0) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      return res.status(200).json({
        success: true,
        message: `Project "${deleted[0].title}" deleted successfully`,
        data: deleted[0]
      });
    } catch (error) {
      console.error('Delete project error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete project: ' + (error.message || String(error)),
        error: error.message || String(error)
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
