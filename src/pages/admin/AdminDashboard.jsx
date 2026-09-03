import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  LogOut,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  Mail,
  Phone,
  Clock,
  X,
  AlertCircle,
  RefreshCw,
  Sliders,
  Globe,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../../services/api';

const categories = ['Residential', 'Commercial', 'Educational', 'Infrastructure', 'Structural'];

const defaultImages = [
  '/projects/Busanza Commercial House — Commercial Building.png',
  '/projects/Busogo Petrol Station — Commercial and Industrial.png',
  '/projects/G+1 Residential House for 3 Tigers — Residential Building.png',
  '/projects/G+1 Residential House for Bruno — Residential Building.png',
  '/projects/G+1 Residential House — Residential Building (2).png',
  '/projects/G+1 Residential House — Residential Building (3).png',
  '/projects/G+1 Residential House — Residential Building.png',
  '/projects/G+1 Residential Houses (Rebero Village) — Residential Development.png',
  '/projects/G+1 Twin Residential House — Residential Development.png',
  '/projects/G+2 Residential House — Residential Building.png',
  '/projects/G+3 Residential Apartment — Residential  Multi-storey.png',
  '/projects/Musanze Mixed Use Complex — Mixed Use Development.png',
  '/projects/Muyumbu TVET — Educational Infrastructure.png',
  '/projects/Nyabyondo Commercial Building — Commercial Building.png',
  '/projects/RDIS Muhanga Office — Commercial  Office Building.png',
  '/projects/Rebero Commercial Building for Sentabyo — Commercial Building.png',
  '/projects/Structural Design of Kirehe Gymnasium — Structural Engineering.png'
];

const emptyProjectForm = {
  id: null,
  title: '',
  category: 'Residential',
  description: '',
  image_url: defaultImages[0],
  year: '2025',
  status: 'Ongoing',
  progress: 80,
  progress_stage: 'Supervision & Execution Stage',
  location: 'Nyarugenge, Kigali',
  model: 'Design, Build & Supervision',
  scope: ''
};

// Client-side image optimizer to keep uploads lightweight (under 250KB) and fast
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    if (file.type === 'image/svg+xml') {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 900;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to high quality JPEG
        const compressed = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressed);
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = reject;
  });
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'inquiries'
  const [imageLoading, setImageLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [imageSourceTab, setImageSourceTab] = useState('external'); // 'external' | 'upload' | 'library'
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Success toast message
  const [toastMessage, setToastMessage] = useState('');

  const navigate = useNavigate();

  // Load auth and data
  useEffect(() => {
    const storedToken = localStorage.getItem('smart_admin_token');
    if (!storedToken) {
      navigate('/admin/login');
      return;
    }

    setToken(storedToken);

    api.verifyAuth(storedToken).then((validUser) => {
      if (!validUser) {
        localStorage.removeItem('smart_admin_token');
        navigate('/admin/login');
      } else {
        setUser(validUser);
        loadAllData(storedToken);
      }
    });
  }, [navigate]);

  const loadAllData = async (authToken) => {
    setLoading(true);
    try {
      const [projData, inqData] = await Promise.all([
        api.getProjects(),
        api.getInquiries(authToken).catch(() => [])
      ]);
      setProjects(projData);
      setInquiries(inqData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('smart_admin_token');
    localStorage.removeItem('smart_admin_user');
    navigate('/admin/login');
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingProject(null);
    setProjectForm(emptyProjectForm);
    setImageSourceTab('external');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (project) => {
    setEditingProject(project);
    const imgUrl = project.image || project.image_url || defaultImages[0];
    if (imgUrl.startsWith('http')) {
      setImageSourceTab('external');
    } else if (imgUrl.startsWith('data:')) {
      setImageSourceTab('upload');
    } else {
      setImageSourceTab('library');
    }

    setProjectForm({
      id: project.id,
      title: project.title,
      category: project.category,
      description: project.desc || project.description || '',
      image_url: imgUrl,
      year: project.year || '',
      status: project.status || 'Completed',
      progress: project.progress !== undefined ? project.progress : 100,
      progress_stage: project.progressStage || project.progress_stage || '',
      location: project.location || '',
      model: project.model || '',
      scope: project.scope || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Submit Add / Edit Project
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (!projectForm.title.trim()) {
        throw new Error('Project title is required');
      }

      // Automatically convert Google Drive sharing links to direct viewable image URLs
      let finalImageUrl = (projectForm.image_url || '').trim();
      const driveMatch = finalImageUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || finalImageUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        finalImageUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
      }

      const payload = {
        ...projectForm,
        image_url: finalImageUrl || defaultImages[0],
        description: projectForm.description || projectForm.title,
        progress: Number(projectForm.progress) || 0
      };

      if (editingProject) {
        await api.updateProject(payload, token);
        showToast(`Project "${projectForm.title}" successfully updated.`);
      } else {
        await api.createProject(payload, token);
        showToast(`Project "${projectForm.title}" successfully created.`);
      }

      setIsModalOpen(false);
      loadAllData(token);
    } catch (err) {
      setFormError(err.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteProject(deleteTarget.id, token);
      showToast(`Project "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      loadAllData(token);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.scope && p.scope.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' || p.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'All' || p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const ongoingCount = projects.filter((p) => p.status === 'Ongoing').length;
  const completedCount = projects.filter((p) => p.status === 'Completed').length;
  const unreadInquiries = inquiries.filter((i) => !i.is_read).length;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-700 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-navy text-white sticky top-0 z-40 shadow-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center text-white font-black">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif font-black text-sm uppercase tracking-wider block leading-none">
                Smart Civil Works
              </span>
              <span className="text-[10px] text-accent font-bold uppercase tracking-widest block mt-0.5">
                Admin Management Portal
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold">
            <span className="hidden sm:inline-block text-slate-300 font-medium">
              Logged in as <span className="text-white font-bold">{user?.username || 'Admin'}</span>
            </span>

            <Link
              to="/"
              target="_blank"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between text-xs font-bold animate-fade-in">
            <span className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{toastMessage}</span>
            </span>
            <button onClick={() => setToastMessage('')} className="text-white/80 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Dashboard Metrics Header */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
              Total Projects
            </span>
            <span className="text-2xl font-serif font-black text-navy">{projects.length}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
            <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ongoing Projects</span>
            </span>
            <span className="text-2xl font-serif font-black text-emerald-700">{ongoingCount}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">
              Completed Projects
            </span>
            <span className="text-2xl font-serif font-black text-navy">{completedCount}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
            <span className="text-accent text-[10px] font-bold uppercase tracking-wider block">
              Client Inquiries
            </span>
            <span className="text-2xl font-serif font-black text-navy">
              {inquiries.length} {unreadInquiries > 0 && <span className="text-xs text-rose-500 font-bold">({unreadInquiries} new)</span>}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Projects Portfolio ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'inquiries'
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>Client Inquiries</span>
              {unreadInquiries > 0 && (
                <span className="bg-accent text-white px-2 py-0.5 rounded-full text-[10px]">
                  {unreadInquiries}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'projects' && (
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-accent/20 flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Project</span>
            </button>
          )}
        </div>

        {/* TAB 1: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {/* Search & Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search project, location, scope..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-3 w-full md:w-auto text-xs font-semibold">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-accent text-xs"
                >
                  <option value="All">All Statuses</option>
                  <option value="Ongoing">Ongoing Projects</option>
                  <option value="Completed">Completed Projects</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-accent text-xs"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => loadAllData(token)}
                  title="Reload from Neon Database"
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Projects Table / Cards */}
            {loading ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                Loading projects from Neon PostgreSQL...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs font-bold">
                No projects found matching criteria.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Left: Thumbnail & Main Info */}
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className="h-16 w-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200 relative">
                          <img
                            src={project.image || project.image_url}
                            alt={project.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full">
                              {project.category}
                            </span>
                            {project.status === 'Ongoing' ? (
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Ongoing ({project.progress}%)</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                Completed {project.year}
                              </span>
                            )}
                          </div>
                          <h3 className="text-navy font-bold text-sm uppercase tracking-wide truncate max-w-md">
                            {project.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium">
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-accent" />
                              <span>{project.location}</span>
                            </span>
                            <span className="hidden sm:inline text-slate-300">•</span>
                            <span className="hidden sm:inline truncate max-w-xs">{project.model}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Progress & Actions */}
                      <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        {project.status === 'Ongoing' && (
                          <div className="hidden lg:block w-36 text-right">
                            <div className="text-[10px] text-emerald-700 font-bold mb-1">
                              {project.progressStage || 'Execution Phase'}
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(project)}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-navy hover:text-white text-navy text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(project)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INQUIRIES LEADS */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden p-6 space-y-4">
            <h2 className="text-base font-bold text-navy uppercase tracking-wide">
              Client Inquiries & Contact Submissions
            </h2>

            {inquiries.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-medium">
                No inquiries received yet. When visitors fill the Contact form, their leads will appear here in real-time.
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`p-4 rounded-xl border transition-all ${
                      inq.is_read
                        ? 'bg-white border-slate-200/70 text-slate-600'
                        : 'bg-accent/5 border-accent/20 text-navy font-semibold'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-navy">{inq.name}</span>
                        {!inq.is_read && (
                          <span className="bg-accent text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            New Lead
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      <div className="flex items-center space-x-1.5 text-slate-500">
                        <Mail className="h-3.5 w-3.5 text-accent" />
                        <a href={`mailto:${inq.email}`} className="text-accent hover:underline">
                          {inq.email}
                        </a>
                      </div>
                      {inq.phone && (
                        <div className="flex items-center space-x-1.5 text-slate-500">
                          <Phone className="h-3.5 w-3.5 text-accent" />
                          <a href={`tel:${inq.phone}`} className="hover:underline">
                            {inq.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-normal">
                      "{inq.message}"
                    </p>

                    {!inq.is_read && (
                      <div className="pt-2 text-right">
                        <button
                          onClick={async () => {
                            await api.markInquiryRead(inq.id, token);
                            loadAllData(token);
                          }}
                          className="text-[10px] font-bold text-accent hover:underline uppercase"
                        >
                          Mark as Contacted / Read ✓
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ADD / EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-serif font-black text-navy uppercase">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {editingProject
                    ? `Update parameters for "${editingProject.title}"`
                    : 'Publish a new construction or engineering project to the portfolio'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="flex items-start space-x-2 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-semibold">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider text-[10px]">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. G+2 Commercial House"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider text-[10px]">
                    Category *
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-accent"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider text-[10px]">
                    Location (District, City)
                  </label>
                  <input
                    type="text"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    placeholder="e.g. Nyarugenge, Kigali"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-wider text-[10px]">
                    Completion Year / Target
                  </label>
                  <input
                    type="text"
                    value={projectForm.year}
                    onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                    placeholder="e.g. 2025 or Ongoing"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Status & Progress Slider */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Project Status & Milestone
                  </span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setProjectForm({ ...projectForm, status: 'Ongoing', progress: 75 })}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                        projectForm.status === 'Ongoing'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      Ongoing Project
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectForm({ ...projectForm, status: 'Completed', progress: 100 })}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                        projectForm.status === 'Completed'
                          ? 'bg-navy text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                {projectForm.status === 'Ongoing' && (
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <label className="text-slate-500 font-bold">Execution Progress (%)</label>
                      <span className="text-emerald-700 font-black text-sm">{projectForm.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={projectForm.progress}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, progress: Number(e.target.value) })
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />

                    <div className="space-y-1">
                      <label className="text-slate-500 uppercase tracking-wider text-[10px]">
                        Current Stage Description
                      </label>
                      <input
                        type="text"
                        value={projectForm.progress_stage}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, progress_stage: e.target.value })
                        }
                        placeholder="e.g. Reinforced Concrete Frame Execution"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-accent text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Execution Model */}
              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider text-[10px]">
                  Execution Model
                </label>
                <input
                  type="text"
                  value={projectForm.model}
                  onChange={(e) => setProjectForm({ ...projectForm, model: e.target.value })}
                  placeholder="e.g. Design, Build & Supervision"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-accent"
                />
              </div>

              {/* Image Source Selector */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block">
                      Project Image Source
                    </label>
                    <span className="text-[10px] text-slate-400">Choose how to add your project picture:</span>
                  </div>

                  <div className="flex space-x-1 bg-slate-200/70 p-1 rounded-xl text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageSourceTab('external')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                        imageSourceTab === 'external'
                          ? 'bg-white text-navy shadow-sm'
                          : 'text-slate-600 hover:text-navy'
                      }`}
                    >
                      <Globe className="h-3 w-3 text-accent" />
                      <span>External Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageSourceTab('upload')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                        imageSourceTab === 'upload'
                          ? 'bg-white text-navy shadow-sm'
                          : 'text-slate-600 hover:text-navy'
                      }`}
                    >
                      <Upload className="h-3 w-3 text-accent" />
                      <span>Upload File</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageSourceTab('library')}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
                        imageSourceTab === 'library'
                          ? 'bg-white text-navy shadow-sm'
                          : 'text-slate-600 hover:text-navy'
                      }`}
                    >
                      <ImageIcon className="h-3 w-3 text-accent" />
                      <span>3D Library</span>
                    </button>
                  </div>
                </div>

                {/* 1. EXTERNAL LINK TAB */}
                {imageSourceTab === 'external' && (
                  <div className="space-y-2 pt-1">
                    <label className="text-slate-500 uppercase tracking-wider text-[9px] font-bold block">
                      Insert Direct External Image URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="url"
                        value={projectForm.image_url}
                        onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                        placeholder="https://images.unsplash.com/... or https://i.imgur.com/... or Google Drive direct link"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-accent text-xs"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      💡 <strong>External Image Tip:</strong> You can paste any image link from Google Drive, Dropbox, Cloudinary, Imgur, AWS S3, Unsplash, or any public web address.
                    </p>
                  </div>
                )}

                {/* 2. DIRECT DEVICE UPLOAD TAB */}
                {imageSourceTab === 'upload' && (
                  <div className="space-y-2 pt-1">
                    <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-accent rounded-xl bg-white cursor-pointer transition-colors group">
                      <Upload className="h-6 w-6 text-slate-400 group-hover:text-accent mb-1 transition-colors" />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-navy">
                        {imageLoading ? 'Optimizing photo for web...' : 'Click to select photo from device'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {imageLoading ? 'Resizing and compressing...' : 'Photos are automatically compressed for fast loading'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={imageLoading}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageLoading(true);
                            setFormError('');
                            try {
                              const compressed = await compressImage(file);
                              setProjectForm((prev) => ({ ...prev, image_url: compressed }));
                            } catch (err) {
                              console.error('Compression error:', err);
                              setFormError('Failed to process image. Please try another photo or external link.');
                            } finally {
                              setImageLoading(false);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                )}

                {/* 3. 3D LIBRARY TAB */}
                {imageSourceTab === 'library' && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">
                      Select from Company 3D Renders:
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {defaultImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="option"
                          onClick={() => setProjectForm({ ...projectForm, image_url: img })}
                          className={`h-12 w-16 object-cover rounded-lg border-2 cursor-pointer transition-all shrink-0 ${
                            projectForm.image_url === img
                              ? 'border-accent scale-105 shadow-md ring-2 ring-accent/30'
                              : 'border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* LIVE PREVIEW BOX */}
                {projectForm.image_url && (
                  <div className="flex items-center space-x-3 p-2.5 bg-white rounded-xl border border-slate-200 mt-2">
                    <div className="h-14 w-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={projectForm.image_url}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImages[0];
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Image Preview Active</span>
                      </span>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{projectForm.image_url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProjectForm({ ...projectForm, image_url: '' })}
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-bold px-2 py-1 cursor-pointer hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Scope & Technical Details */}
              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-wider text-[10px]">
                  Scope & Technical Details
                </label>
                <textarea
                  rows={4}
                  value={projectForm.scope}
                  onChange={(e) => setProjectForm({ ...projectForm, scope: e.target.value })}
                  placeholder="Detail structural calculations, soil testing, floor slabs execution, finishing..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-navy focus:outline-none focus:border-accent leading-relaxed"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-navy hover:bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-serif font-black text-navy uppercase">Delete Project</h3>
              <p className="text-xs text-slate-500 font-medium">
                Are you sure you want to delete <span className="font-bold text-navy">"{deleteTarget.title}"</span>? This will permanently remove it from Neon database and the public website.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
