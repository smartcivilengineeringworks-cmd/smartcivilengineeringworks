import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop',
      title: 'Delivering Complete Engineering Solutions',
      subtitle: 'From Concept to Completion',
      desc: 'Smart Civil Engineering Works Limited provides multidisciplinary engineering consultancy, detailed architectural design, and robust project supervision services in Rwanda.'
    },
    {
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop',
      title: 'Innovative Architectural & Structural Design',
      subtitle: 'Built for Durability and Aesthetics',
      desc: 'We combine state-of-the-art 3D rendering with precise structural integrity testing to draft blueprints that stand the test of time.'
    },
    {
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=1600&auto=format&fit=crop',
      title: 'Infrastructure & Project Management',
      subtitle: 'On Time. On Budget. Under Control.',
      desc: 'With over 26+ key projects completed across Rwanda, our experienced supervision team guarantees flawless construction execution and high quality standards.'
    }
  ];

  // Auto transition slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[85svh] w-full bg-slate-950 overflow-hidden flex items-center">
      {/* Background Images Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 0.85, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
        </AnimatePresence>
        
        {/* Gradients Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 z-10" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          {/* Animated Accent Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 mb-6 shadow-md"
          >
            <CheckCircle className="h-3.5 w-3.5 text-accent" />
            <span className="text-accent font-sans text-[10px] sm:text-xs font-bold tracking-widest uppercase">
              Engineering & Consultancy
            </span>
          </motion.div>
 
          {/* Animated Slide Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-6"
            >
              <span className="block text-accent font-sans text-xs sm:text-sm font-bold tracking-widest uppercase">
                {slides[currentSlide].subtitle}
              </span>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-sans font-black text-white leading-tight tracking-tight uppercase">
                {slides[currentSlide].title}
              </h1>
              
              <p className="text-slate-200 font-sans text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
                {slides[currentSlide].desc}
              </p>
            </motion.div>
          </AnimatePresence>
 
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4 mt-10 font-sans"
          >
            <NavLink
              to="/projects"
              className="flex items-center space-x-2 px-8 py-3.5 bg-accent hover:bg-white text-navy hover:text-navy text-xs font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-xl shadow-accent/20 hover:scale-[1.02]"
            >
              <span>Explore Projects</span>
              <ArrowRight className="h-4 w-4" />
            </NavLink>
            <NavLink
              to="/contact"
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-widest uppercase rounded-full border border-white/15 hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
            >
              Request Consultation
            </NavLink>
          </motion.div>
        </div>
      </div>

      {/* Manual Navigation Controls */}
      <div className="absolute bottom-12 right-8 z-30 hidden sm:flex items-center space-x-3">
        <button
          onClick={prevSlide}
          className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 hover:border-white/10 transition-all duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={nextSlide}
          className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 hover:border-white/10 transition-all duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-8 z-30 flex items-center space-x-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-accent' : 'w-2 bg-white/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
