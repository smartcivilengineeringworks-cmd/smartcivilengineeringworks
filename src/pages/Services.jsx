import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  Building2, 
  Route, 
  Boxes, 
  ClipboardCheck, 
  HardHat, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import FaqAccordion from '../components/FaqAccordion';
import { serviceCategories } from '../data/servicesData';
import { useProjects } from '../context/ProjectsContext';

const iconMap = {
  Compass,
  Building2,
  Route,
  Boxes,
  ClipboardCheck,
  HardHat
};

const Services = () => {
  const { projects } = useProjects();
  const [activeTab, setActiveTab] = useState(serviceCategories[0].id);
  const activeCategory = serviceCategories.find(cat => cat.id === activeTab);
  const ActiveIcon = iconMap[activeCategory.iconName] || HardHat;

  const headerBg = projects.find(p => p.id === 8)?.image || projects[0]?.image || '';

  return (
    <div className="pt-16 font-sans bg-warm-bg text-slate-700">
      
      {/* Header (Keeps corporate blue theme for contrast) */}
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('${headerBg}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/90 to-navy/40" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-accent text-[10px] sm:text-xs font-sans font-bold tracking-widest uppercase bg-accent/15 px-4 py-1.5 rounded-full border border-accent/25">
            What We Do
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight uppercase leading-tight text-white">
            Engineering & Consultancy Services
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            From initial geotechnical soil investigations to photorealistic 3D blueprints and on-site supervisor controls.
          </p>
        </div>
      </section>

      {/* Services Exploration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <h2 className="text-2xl md:text-3xl font-serif font-black text-navy uppercase mb-2">
            Explore Our Full Range
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            Select a division below to discover the specific engineering capabilities and civil activities we offer.
          </p>
        </div>

        {/* Categories Tab buttons */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Vertical Tabs Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col space-y-2 border-r border-slate-200/50 pr-0 lg:pr-8">
            {serviceCategories.map((category) => {
              const Icon = iconMap[category.iconName] || HardHat;
              const isActive = category.id === activeTab;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center space-x-4 py-3 px-4.5 rounded-xl text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-accent text-white shadow-xl scale-[1.01]' 
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/50 shadow-md'
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isActive ? 'bg-white/10 text-white' : 'bg-slate-50 text-accent border border-slate-200/50 shadow-sm'
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs tracking-wider uppercase font-sans">{category.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content Area */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Division Intro */}
                <div className="space-y-4 bg-navy text-white p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-md border border-white/5">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 bg-accent/5 rounded-full filter blur-2xl opacity-40 pointer-events-none" />
                  <div className="relative z-10 flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-lg">
                      <ActiveIcon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-wide text-white">
                      {activeCategory.title}
                    </h3>
                  </div>
                  <p className="relative z-10 text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                    {activeCategory.desc}
                  </p>
                </div>

                {/* Sub-services Grid List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeCategory.items.map((item, index) => (
                    <div 
                      key={index}
                      className="bg-white border border-slate-200/50 p-5 md:p-6 rounded-2xl shadow-md hover:border-accent/20 transition-all flex items-start space-x-4 text-slate-700"
                    >
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-navy text-xs sm:text-sm uppercase leading-snug tracking-wide font-sans">
                          {item.name}
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                          {item.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </section>

      {/* Frequently Asked Questions Accordion Section */}
      <section className="bg-slate-100 py-10 md:py-16 border-t border-slate-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <span className="text-accent text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-accent/10 px-3 py-1 rounded-full font-sans">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-navy uppercase">
              Permits, Audits & Operations
            </h2>
            <p className="text-slate-600 font-sans text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
              Find quick answers to common regulatory, calculation, and supervisions questions regarding building in Rwanda.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* FAQ/Info Banner */}
      <section className="bg-navy text-white py-16 md:py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-accent/5 rounded-full filter blur-2xl opacity-30 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10 font-sans">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20 mx-auto shadow-md">
            <HelpCircle className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-tight text-white">Need Custom Technical Specifications?</h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Our engineering team regularly drafts customized bills of quantities (BOQ) and site layouts. Let us know what details you require for your tender proposal.
          </p>
          <div className="pt-2">
            <a
              href="mailto:smartcivilengineeringworks@gmail.com"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-accent hover:bg-white text-white hover:text-navy text-xs font-bold tracking-wider uppercase rounded-full transition-all shadow-lg hover:scale-[1.01]"
            >
              Request Technical Details
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
