import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

// Code-split legal & secondary pages with React lazy
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Code-split heavy admin modules to reduce initial client bundle size
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Components
import CookieConsent from './components/CookieConsent';
import WhatsAppButton from './components/WhatsAppButton';
import { ProjectsProvider } from './context/ProjectsContext';

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-10 h-10 border-3 border-accent/20 border-t-accent rounded-full animate-spin" />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading...</span>
    </div>
  </div>
);

// ScrollToTop behavior on page transition
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Show Navbar only for public routes */}
      {!isAdminRoute && <Navbar />}

      {/* Page Content */}
      <main className="flex-grow">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Legal pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            
            {/* Wildcard 404 handler */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* Show Footer, WhatsApp button & Cookie consent only for public routes */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
      {!isAdminRoute && <CookieConsent />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ProjectsProvider>
        <ScrollToTop />
        <AppContent />
      </ProjectsProvider>
    </Router>
  );
}

export default App;
