import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../images/civil-logo-small.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll handler to shrink navbar height on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200/40 transition-all duration-300 ${
        scrolled ? 'shadow-md py-1' : 'shadow-sm py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          
          <NavLink to="/" className="flex items-center group">
            <img src={logo} alt="Smart Civil Engineering Works Ltd Logo" className="h-[80px] w-auto object-contain transition-all duration-300 group-hover:scale-102" />
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 font-sans">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-3 py-1.5 text-xs lg:text-sm font-bold tracking-wide uppercase transition-colors duration-300 ${
                    isActive 
                      ? 'text-accent' 
                      : 'text-slate-650 hover:text-navy'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            
            {/* Contact CTA */}
            <NavLink
              to="/contact"
              className="ml-8 flex items-center space-x-2 px-6 py-2.5 text-xs font-bold tracking-wider uppercase bg-accent hover:bg-navy text-white hover:text-white rounded-full transition-all duration-300 shadow-md shadow-accent/15 hover:scale-[1.02]"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Contact us</span>
            </NavLink>

            {/* Admin Login Icon Button */}
            <NavLink
              to="/admin/login"
              title="Manager / Admin Portal"
              className="flex items-center justify-center h-9 w-9 rounded-full bg-slate-100 hover:bg-navy text-slate-500 hover:text-white transition-all duration-200 border border-slate-200/80 shadow-xs group"
              aria-label="Admin Login"
            >
              <ShieldCheck className="h-4 w-4 text-slate-600 group-hover:text-accent transition-colors" />
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile quick admin icon */}
            <NavLink
              to="/admin/login"
              title="Admin Portal"
              className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
              aria-label="Admin Login"
            >
              <ShieldCheck className="h-4 w-4 text-accent" />
            </NavLink>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-655 hover:text-navy hover:bg-slate-100 focus:outline-none transition-colors duration-150"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-white border-b border-slate-200/50 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-8 space-y-2 sm:px-6 font-sans">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-accent/10 text-accent border-l-4 border-accent pl-3'
                        : 'text-slate-600 hover:text-navy hover:bg-slate-550'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <NavLink
                to="/contact"
                className="flex items-center justify-center space-x-2 w-full mt-6 px-4 py-3 bg-accent text-white font-bold uppercase text-xs tracking-wider rounded-full hover:bg-navy transition-all shadow-lg shadow-accent/20"
              >
                <Phone className="h-4 w-4" />
                <span>Contact us</span>
              </NavLink>

              <NavLink
                to="/admin/login"
                className="flex items-center justify-center space-x-2 w-full mt-2.5 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold uppercase text-[11px] tracking-wider rounded-xl hover:bg-navy hover:text-white transition-all border border-slate-200"
              >
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Manager Admin Portal</span>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
