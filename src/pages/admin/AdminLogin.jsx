import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, Building2 } from 'lucide-react';
import { api } from '../../services/api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(username, password);
      if (data && data.success && data.token) {
        localStorage.setItem('smart_admin_token', data.token);
        localStorage.setItem('smart_admin_user', JSON.stringify(data.user));
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 font-sans text-slate-700 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 h-96 w-96 bg-accent/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-accent/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Card Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white shadow-xl shadow-accent/20 mb-2">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-white uppercase tracking-tight">
            Company Portal
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Smart Civil Engineering Works Ltd — Management Console
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 space-y-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-accent uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Administrator Authentication</span>
          </div>

          {error && (
            <div className="flex items-start space-x-2 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                Manager Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-navy focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-navy focus:outline-none focus:border-accent focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-navy hover:bg-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <Link to="/" className="hover:text-accent font-bold transition-colors">
              ← Return to Website
            </Link>
            <span>Powered by Neon DB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
