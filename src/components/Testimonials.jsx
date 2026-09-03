import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { reviews } from '../data/testimonialsData';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200/50 p-8 md:p-12 rounded-3xl shadow-xl relative font-sans text-slate-600">
      <div className="absolute top-6 left-6 text-accent/5 pointer-events-none">
        <Quote className="h-14 w-14 transform -rotate-180" />
      </div>

      <div className="relative z-10 text-center space-y-6">
        
        {/* Rating Stars */}
        <div className="flex justify-center space-x-1">
          {[...Array(reviews[currentIndex].rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
          ))}
        </div>

        {/* Quote text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-slate-700 font-serif italic text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-medium"
          >
            “{reviews[currentIndex].quote}”
          </motion.p>
        </AnimatePresence>

        {/* Divider line */}
        <div className="w-10 h-0.5 bg-accent/40 mx-auto"></div>

        {/* Reviewer Details */}
        <div className="space-y-1">
          <h4 className="font-display font-black text-sm uppercase text-navy tracking-wide">
            {reviews[currentIndex].author}
          </h4>
          {reviews[currentIndex].position && (
            <span className="text-xs text-slate-450 font-bold uppercase tracking-wider">
              {reviews[currentIndex].position}
            </span>
          )}
        </div>

        {/* Navigation Slider arrows */}
        <div className="flex justify-center space-x-3 pt-4">
          <button
            onClick={prevReview}
            className="h-10 w-10 flex items-center justify-center bg-slate-50 border border-slate-200/50 hover:bg-accent hover:text-white text-slate-650 rounded-full transition-all duration-200 focus:outline-none shadow-sm"
            aria-label="Previous review"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextReview}
            className="h-10 w-10 flex items-center justify-center bg-slate-50 border border-slate-200/50 hover:bg-accent hover:text-white text-slate-655 rounded-full transition-all duration-200 focus:outline-none shadow-sm"
            aria-label="Next review"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
