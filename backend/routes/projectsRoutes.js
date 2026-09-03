import { Router } from 'express';
import { sql } from '../config/db.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

// 1. GET ALL PROJECTS (Public)
router.get('/', async (req, res) => {
  try {
    const projects = await sql`
      SELECT * FROM projects ORDER BY id ASC;
    `;
    return res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch projects from database' });
  }
});

// 2. CREATE PROJECT (Admin Protected)
router.post('/', verifyAdmin, async (req, res) => {
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
    return res.status(500).json({ success: false, message: 'Failed to create project' });
  }
});

// 3. UPDATE PROJECT (Admin Protected)
router.put('/', verifyAdmin, async (req, res) => {
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
    return res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

// 4. DELETE PROJECT (Admin Protected)
router.delete('/', verifyAdmin, async (req, res) => {
  try {
    const id = req.query?.id || req.body?.id;
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
    return res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

export default router;
