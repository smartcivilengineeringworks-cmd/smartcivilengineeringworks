import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowUp, Lock } from 'lucide-react';
import logo from '../images/civil-logo-big.png';

// Custom X (formerly Twitter) SVG Icon
const XIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Custom Instagram SVG Icon
const InstagramIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy text-slate-400 border-t border-white/5 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
 
          {/* Company Brief Info & Social Links */}
          <div className="flex flex-col space-y-5">
            <div className="flex items-center">
              <img src={logo} alt="Smart Civil Engineering Works Ltd Logo" className="h-20 w-auto object-contain" />
            </div>
 
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Delivering complete engineering, architectural, and project management solutions in Rwanda since 2017. Committed to premium quality and structural durability from concept to completion.
            </p>
 
            {/* Social Media Links */}
            <div className="flex items-center space-x-3.5">
              <a
                href="https://x.com/smartcivileng"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:border-accent hover:bg-accent/10 text-slate-400 hover:text-accent transition-all duration-200"
                aria-label="Follow us on X (Twitter)"
              >
                <XIcon />
              </a>
              <a
                href="https://www.instagram.com/smartcivilengineeringworks?igsh=MWR2NjhwbmpnYW96bA=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:border-accent hover:bg-accent/10 text-slate-400 hover:text-accent transition-all duration-200"
                aria-label="Follow us on Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="mailto:smartcivilengineeringworks@gmail.com"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:border-accent hover:bg-accent/10 text-slate-400 hover:text-accent transition-all duration-200"
                aria-label="Send us an Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>

            <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
              Licensed Engineering Consultancy
            </div>
          </div>
 
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-serif font-black text-xs tracking-widest uppercase relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-4 after:h-[2px] after:bg-accent pb-1.5">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs font-semibold tracking-wide">
              <li>
                <NavLink to="/" className="hover:text-accent transition-colors duration-200">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about" className="hover:text-accent transition-colors duration-200">About Company</NavLink>
              </li>
              <li>
                <NavLink to="/services" className="hover:text-accent transition-colors duration-200">Our Services</NavLink>
              </li>
              <li>
                <NavLink to="/projects" className="hover:text-accent transition-colors duration-200">Completed Projects</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="hover:text-accent transition-colors duration-200">Contact Us</NavLink>
              </li>
            </ul>
          </div>
 
          {/* Core Services */}
          <div className="space-y-4">
            <h3 className="text-white font-serif font-black text-xs tracking-widest uppercase relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-4 after:h-[2px] after:bg-accent pb-1.5">
              Capabilities
            </h3>
            <ul className="space-y-2 text-xs font-semibold tracking-wide">
              <li>
                <NavLink to="/services" className="hover:text-accent transition-colors duration-200">Engineering Studies</NavLink>
              </li>
              <li>
                <NavLink to="/services" className="hover:text-accent transition-colors duration-200">Architectural Services</NavLink>
              </li>
              <li>
                <NavLink to="/services" className="hover:text-accent transition-colors duration-200">Civil & Infrastructure</NavLink>
              </li>
              <li>
                <NavLink to="/services" className="hover:text-accent transition-colors duration-200">Structural Engineering</NavLink>
              </li>
              <li>
                <NavLink to="/services" className="hover:text-accent transition-colors duration-200">Project Supervision</NavLink>
              </li>
            </ul>
          </div>
 
          {/* Contact & Address */}
          <div className="space-y-4">
            <h3 className="text-white font-serif font-black text-xs tracking-widest uppercase relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-4 after:h-[2px] after:bg-accent pb-1.5">
              Office Details
            </h3>
            <ul className="space-y-3 text-xs font-semibold leading-relaxed">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>
                  Kabeza Village, Kigarama Cell, Kicukiro District, Kigali City, Rwanda
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span className="text-white">+250 788 326 103</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span className="break-all text-white">smartcivilengineeringworks@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col text-xs text-slate-400 space-y-0.5">
                  <span>Mon - Fri: 8:00 AM - 5:00 PM</span>
                  <span>Sat: 9:00 AM - 1:00 PM</span>
                  <span className="text-slate-600">Sun: Closed</span>
                </div>
              </li>
            </ul>
          </div>
 
        </div>
 
        {/* Divider */}
        <div className="border-t border-white/5 my-8"></div>
 
        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0 font-medium">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <span>© {currentYear} Smart Civil Engineering Works Ltd.</span>
            <div className="flex space-x-3 text-[10px] uppercase font-bold tracking-wider">
              <NavLink to="/privacy" className="hover:text-accent transition-colors">Privacy</NavLink>
              <span className="text-white/10">|</span>
              <NavLink to="/terms" className="hover:text-accent transition-colors">Terms</NavLink>
              <span className="text-white/10">|</span>
              <NavLink to="/cookies" className="hover:text-accent transition-colors">Cookies</NavLink>
              <span className="text-white/10">|</span>
              <NavLink to="/admin/login" className="hover:text-accent transition-colors flex items-center space-x-1">
                <Lock className="h-2.5 w-2.5" />
                <span>Admin</span>
              </NavLink>
            </div>
          </div>
 
          <div className="flex items-center space-x-4">
            <span>Kigali, Rwanda</span>
            <button
              onClick={handleScrollToTop}
              className="flex items-center justify-center h-9 w-9 bg-white/5 text-slate-400 hover:text-white rounded-full border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-200"
              aria-label="Back to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
 
      </div>
    </footer>
  );
};

export default Footer;
