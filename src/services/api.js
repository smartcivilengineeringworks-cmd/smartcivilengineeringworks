import { projectsList as fallbackProjects } from '../data/projectsData';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Fetch all projects directly from backend database (no-cache)
  async getProjects() {
    try {
      const res = await fetch(`${API_BASE}/projects?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
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
          progress: p.progress !== undefined ? p.progress : 100,
          progressStage: p.progress_stage || 'Completed',
          location: p.location || 'Kigali, Rwanda',
          model: p.model || 'Design, Build & Supervision',
          scope: p.scope || ''
        }));
      }
      return fallbackProjects;
    } catch (err) {
      console.warn('Backend API fetch failed, using fallback data:', err.message);
      return fallbackProjects;
    }
  },

  // Create new project
  async createProject(projectData, token) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned HTTP ${res.status}. If uploading a large photo, please try a smaller image or an external image link.`);
      }

      if (!res.ok) throw new Error(data.message || data.error || 'Failed to create project');
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Upload timed out. If the image is large, it was automatically compressed; please try again or use an external URL link.');
      }
      throw err;
    }
  },

  // Update existing project
  async updateProject(projectData, token) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned HTTP ${res.status}.`);
      }

      if (!res.ok) throw new Error(data.message || data.error || 'Failed to update project');
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Save timed out. Please check your internet connection.');
      }
      throw err;
    }
  },

  // Delete project
  async deleteProject(id, token) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const res = await fetch(`${API_BASE}/projects?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: Number(id) }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      if (!res.ok) throw new Error(data.message || data.error || 'Failed to delete project');
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Delete request timed out. Please check connection and try again.');
      }
      throw err;
    }
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
