import { projectsList as fallbackProjects } from '../data/projectsData';

const API_BASE = '/api';

export const api = {
  // Fetch all projects (with fallback)
  async getProjects() {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        // Map database fields to frontend fields
        return data.data.map((p) => ({
          ...p,
          id: p.id,
          title: p.title,
          category: p.category,
          desc: p.description || '',
          image: p.image_url || fallbackProjects.find(fb => fb.id === p.id)?.image || '',
          year: p.year || 'Ongoing',
          status: p.status || 'Completed',
          progress: p.progress || 100,
          progressStage: p.progress_stage || 'Completed',
          location: p.location || 'Kigali, Rwanda',
          model: p.model || 'Design, Build & Supervision',
          scope: p.scope || ''
        }));
      }
      return fallbackProjects;
    } catch (err) {
      console.warn('API fetch failed, using fallback data:', err.message);
      return fallbackProjects;
    }
  },

  // Create new project
  async createProject(projectData, token) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create project');
    return data;
  },

  // Update existing project
  async updateProject(projectData, token) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update project');
    return data;
  },

  // Delete project
  async deleteProject(id, token) {
    const res = await fetch(`${API_BASE}/projects?id=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete project');
    return data;
  },

  // Admin login
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  // Verify auth token
  async verifyAuth(token) {
    const res = await fetch(`${API_BASE}/auth`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.valid ? data.user : false;
  },

  // Fetch contact inquiries (leads)
  async getInquiries(token) {
    const res = await fetch(`${API_BASE}/inquiries`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch inquiries');
    return data.data || [];
  },

  // Mark inquiry as read
  async markInquiryRead(id, token) {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ id, is_read: true })
    });
    return await res.json();
  }
};
