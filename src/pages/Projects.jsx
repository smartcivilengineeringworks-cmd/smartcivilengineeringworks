import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Layers, CheckCircle, Loader2 } from 'lucide-react';
import { useProjects } from '../context/ProjectsContext';

const Projects = () => {
  const { projects, loading } = useProjects();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'Ongoing', 'Commercial', 'Residential', 'Infrastructure', 'Structural'];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : activeCategory === 'Ongoing'
    ? projects.filter(proj => proj.status === 'Ongoing')
    : projects.filter(proj => proj.category === activeCategory);

  // Header background image from active projects
  const headerBgImage = projects.find(p => p.id === 17)?.image || projects[0]?.image || '';

  return (
    <div className="pt-16 font-sans bg-warm-bg text-slate-700">
      
      {/* Header (Keeps corporate blue theme) */}
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url('${headerBgImage}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/90 to-navy/40" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-accent text-[10px] sm:text-xs font-sans font-bold tracking-widest uppercase bg-accent/15 px-4 py-1.5 rounded-full border border-accent/25">
            Portfolio
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight uppercase leading-tight text-white">
            Projects Delivered
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            A showcase of our completed projects demonstrating our engineering expertise across Rwanda.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200/50 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/50 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-warm-bg">
        {loading && projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="h-8 w-8 text-accent animate-spin" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Connecting to Neon Database...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60 p-8 max-w-lg mx-auto">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Layers className="h-6 w-6" />
            </div>
            <p className="text-base font-bold text-navy uppercase tracking-wide">No Projects Found</p>
            <p className="text-xs text-slate-400 mt-1">There are no projects currently registered under this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-md hover:border-accent/20 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-slate-100 shrink-0">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-navy/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-white text-[10px] font-sans font-bold tracking-wider uppercase">
                  {project.category}
                </div>
              </div>
              
              {/* Text Info */}
              <div className="p-5 md:p-6 flex flex-col justify-between flex-grow">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold tracking-wider uppercase">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      <span>{project.location.split(',')[0]}</span>
                    </span>
                    {project.status === 'Ongoing' ? (
                      <span className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Ongoing</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                        <span>{project.year}</span>
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-navy font-serif font-black text-base sm:text-lg uppercase group-hover:text-accent transition-colors duration-250 leading-tight">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium line-clamp-2">
                    {project.desc}
                  </p>

                  {project.status === 'Ongoing' && (
                    <div className="pt-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                      <div className="flex justify-between items-center text-[10px] font-bold text-emerald-800 mb-1.5">
                        <span className="flex items-center space-x-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>Progress: {project.progressStage || 'Ongoing'}</span>
                        </span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-emerald-100/70 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${project.progress}%` }} 
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-slate-100 mt-5 pt-4 text-accent text-xs font-bold tracking-wider uppercase flex items-center justify-between">
                  <span>View Details</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </section>

      {/* Project Details Modal Sheet */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div 
              className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90svh] overflow-y-auto lg:overflow-hidden border border-slate-200/50"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 p-2.5 bg-navy/60 hover:bg-navy text-white rounded-full transition-colors duration-150"
                aria-label="Close details"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {/* Image Column */}
              <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-slate-900 relative shrink-0">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <span className="text-[10px] font-bold tracking-wider bg-accent text-white px-3.5 py-1 rounded-full uppercase font-sans">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-base sm:text-lg lg:text-xl font-black uppercase tracking-tight mt-2 leading-tight text-white">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>

              {/* Details Content Column */}
              <div className="w-full lg:w-1/2 p-6 lg:p-10 overflow-y-auto space-y-6 text-slate-700">
                
                {/* Meta details list */}
                <div className="grid grid-cols-2 gap-5 border-b border-slate-100 pb-6 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Execution Model</span>
                    <span className="block text-navy font-black leading-snug">
                      {selectedProject.model}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Standards Used</span>
                    <span className="block text-navy font-black flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                      <span>Rwandan & ISO</span>
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Location</span>
                    <span className="block text-navy font-black flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      <span>{selectedProject.location}</span>
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                      {selectedProject.status === 'Ongoing' ? 'Project Status' : 'Completion Year'}
                    </span>
                    <span className="block text-navy font-black flex items-center space-x-1">
                      {selectedProject.status === 'Ongoing' ? (
                        <span className="flex items-center space-x-1.5 text-emerald-700 font-black">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Ongoing Project</span>
                        </span>
                      ) : (
                        <>
                          <Calendar className="h-3.5 w-3.5 text-accent" />
                          <span>{selectedProject.year}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Progress Status Card (for Ongoing Projects) */}
                {selectedProject.status === 'Ongoing' && (
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-3 font-sans">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-black text-emerald-900 flex items-center space-x-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Project Status: Ongoing ({selectedProject.progressStage || 'Execution Phase'})</span>
                      </span>
                      <span className="font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-xs">
                        {selectedProject.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${selectedProject.progress}%` }} 
                      />
                    </div>
                    <div className="grid grid-cols-4 text-[9px] font-bold text-slate-500 text-center pt-1 gap-1">
                      <span className="text-emerald-700 font-black bg-emerald-100/50 py-1 rounded">✓ Feasibility</span>
                      <span className="text-emerald-700 font-black bg-emerald-100/50 py-1 rounded">✓ Structure Checks</span>
                      <span className="text-emerald-800 font-black bg-emerald-200/60 py-1 rounded">● RC Execution</span>
                      <span className="text-slate-400 py-1">Finishing</span>
                    </div>
                  </div>
                )}

                {/* Scope of Work */}
                <div className="space-y-3">
                  <h3 className="text-navy font-sans font-bold text-sm uppercase tracking-wide flex items-center space-x-2">
                    <Layers className="h-4.5 w-4.5 text-accent" />
                    <span>Scope & Technical Details</span>
                  </h3>
                  <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed font-medium">
                    {selectedProject.scope}
                  </p>
                  <p className="text-slate-500 font-sans text-xs sm:text-sm leading-relaxed pt-2 font-medium">
                    As a high-impact engineering project delivered by Smart Civil Works Ltd, this building conforms strictly to local structural and civil parameters. The site management team implemented strict occupational hazard controls, concrete durability assays, and routine inspection audits throughout execution.
                  </p>
                </div>

                {/* Close modal */}
                <div className="pt-4 font-sans">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-full py-3 bg-navy hover:bg-accent text-white hover:text-white text-xs font-bold tracking-wider uppercase rounded-full transition-all shadow-md"
                  >
                    Close Sheet
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Projects;
