import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Hammer, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        scrolled ? 'shadow-md py-3' : 'shadow-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white transition-all duration-300 group-hover:scale-105 shadow-md shadow-accent/20">
              <Hammer className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-xl leading-tight tracking-wide text-navy group-hover:text-accent transition-colors duration-300 uppercase">
                Smart Civil
              </span>
              <span className="text-[10px] font-sans font-bold tracking-widest uppercase mt-0.5 text-slate-500">
                Engineering Works Ltd
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 font-sans">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-5 py-2 text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
                    isActive 
                      ? 'text-accent font-black' 
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
                        className="absolute bottom-0 left-5 right-5 h-[2px] bg-accent rounded-full"
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
              className="ml-6 flex items-center space-x-2 px-5 py-3 text-[10px] font-black tracking-widest uppercase bg-accent hover:bg-navy text-white hover:text-white rounded-xl transition-all duration-300 shadow-md shadow-accent/15 hover:scale-[1.02]"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Get in Touch</span>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-650 hover:text-navy hover:bg-slate-100 focus:outline-none transition-colors duration-150"
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
                    `block px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-accent/10 text-accent border-l-4 border-accent pl-3'
                        : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <NavLink
                to="/contact"
                className="flex items-center justify-center space-x-2 w-full mt-6 px-4 py-4 bg-accent text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-navy transition-all shadow-lg shadow-accent/20"
              >
                <Phone className="h-4 w-4" />
                <span>Get in Touch</span>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
