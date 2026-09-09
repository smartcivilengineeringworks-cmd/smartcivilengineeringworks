import React from 'react';
import { ShieldCheck, Compass, Target, Users, HardHat, Award, BookOpen, FileDown } from 'lucide-react';
import { leadershipTeam, staffTeam } from '../data/teamData';
import { useProjects } from '../context/ProjectsContext';

const About = () => {
  const { projects } = useProjects();
  const coreValues = [
    {
      icon: Award,
      title: 'Multidisciplinary Quality',
      desc: 'Integrating complex engineering studies with creative architecture to ensure every structure matches top-tier engineering specifications.'
    },
    {
      icon: ShieldCheck,
      title: 'Strict Compliance',
      desc: 'Maintaining absolute alignment with the laws governing companies in Rwanda and ensuring tax and regulatory obligations are fully met.'
    },
    {
      icon: Target,
      title: 'Client-Centered Focus',
      desc: 'Tailoring construction methods and budgeting models to align exactly with the timeline and financial constraints of each partner.'
    },
    {
      icon: Users,
      title: 'Collaborative Supervision',
      desc: 'Enforcing active communication lines between developers, site supervisors, and structural auditors to reduce project delays.'
    },
    {
      icon: HardHat,
      title: 'Safety First Culture',
      desc: 'Mandating strict on-site occupational health and safety standards to protect the lives of workers and preserve project integrity.'
    },
    {
      icon: BookOpen,
      title: 'Continuous Innovation',
      desc: 'Adopting modern structural materials, concrete testing practices, and advanced 3D visual mapping tools for architectural work.'
    }
  ];

  // Find a project image for the header background
  const headerBg = projects.find(p => p.id === 12)?.image || projects[0]?.image || '';

  const renderAvatar = (member) => {
    if (member.avatar) {
      return (
        <img
          src={member.avatar}
          alt={member.name}
          className="h-full w-full object-cover"
        />
      );
    }

    const initials = member.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return (
      <div className="h-full w-full flex items-center justify-center bg-navy text-white font-sans font-black text-xl tracking-wider uppercase select-none">
        {initials}
      </div>
    );
  };

  return (
    <div className="pt-16 bg-warm-bg text-slate-700">

      {/* Page Header (Keeps deep blue theme for high-end contrast) */}
      <section className="bg-navy text-white py-16 md:py-24 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url('${headerBg}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/90 to-navy/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-accent text-[10px] sm:text-xs font-sans font-bold tracking-widest uppercase bg-accent/15 px-4 py-1.5 rounded-full border border-accent/25">
            Established Since 2017
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight uppercase leading-tight text-white">
            A Legacy of Engineering Excellence
          </h1>
          <p className="text-slate-300 font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Smart Civil Engineering Works Limited is a premier multidisciplinary engineering consultancy and project management firm registered in Rwanda.
          </p>
        </div>
      </section>

      {/* Main Info Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-warm-bg text-center">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif font-black text-navy uppercase leading-snug">
            About Our Company
          </h2>
          <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-slate-600 font-medium text-left max-w-2xl mx-auto">
            <p>
              Smart Civil Engineering Works Limited is a multidisciplinary engineering consultancy and project management firm registered in Rwanda since 2017. The company provides comprehensive services spanning engineering studies, architectural design, geotechnical investigations, civil engineering, structural engineering, infrastructure planning, construction supervision, and project management.
            </p>
            <p>
              With a firm commitment to quality and innovation, the company delivers complete project development services — from initial feasibility studies and site investigations through detailed design, tender documentation, construction supervision, and project completion. Smart Civil Engineering Works Limited is fully licensed to operate in Rwanda, complying with all national legal, engineering, and tax obligations.
            </p>
          </div>

          <div className="border-y border-slate-200/60 py-4 italic text-accent font-sans bg-accent/5 rounded-xl text-xs sm:text-sm font-bold leading-relaxed text-center max-w-2xl mx-auto px-6 mt-4">
            “Delivering Complete Engineering Solutions from Concept to Completion”
          </div>

          <div className="pt-2 flex justify-center">
            <a
              href="/docs/SMART-CIVIL-ENGINEERING-WORKS-COMPANY-PROFILE.pdf"
              download="SMART-CIVIL-ENGINEERING-WORKS-COMPANY-PROFILE.pdf"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-navy hover:bg-accent text-white hover:text-white rounded-full font-sans text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <FileDown className="h-4 w-4 text-accent" />
              <span>Download Official Company Profile (PDF)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Vision & Mission Grid */}
      <section className="bg-slate-100 py-12 md:py-16 border-y border-slate-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Vision */}
            <div className="bg-white border border-slate-200/50 p-6 md:p-8 rounded-2xl shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-1.5 w-full bg-accent" />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-lg font-serif font-black text-navy uppercase mb-2 group-hover:text-accent transition-colors">
                Our Vision
              </h3>
              <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed font-medium">
                To become a leading multidisciplinary consultancy firm delivering world-class engineering, architectural and infrastructure solutions throughout Rwanda and the East African region.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white border border-slate-200/50 p-6 md:p-8 rounded-2xl shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-1.5 w-full bg-accent" />
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent mb-4">
                <Target className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-lg font-serif font-black text-navy uppercase mb-2 group-hover:text-accent transition-colors">
                Our Mission
              </h3>
              <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed font-medium">
                To provide sustainable, innovative and practical engineering solutions that contribute to economic development and create lasting value for our clients and communities.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-warm-bg">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <span className="text-accent text-[10px] sm:text-xs font-sans font-bold tracking-widest uppercase bg-accent/10 px-3 py-1 rounded-full">
            Principles
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-black text-navy uppercase">
            Our Core Values
          </h2>
          <p className="text-slate-500 font-sans text-xs sm:text-sm font-medium">
            Six foundational principles that guide every design, audit, and construction supervisor on our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="bg-white border border-slate-200/50 p-6 rounded-2xl space-y-4 hover:border-accent/20 transition-all shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-accent border border-slate-100 shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-navy font-sans font-bold text-sm uppercase tracking-wide">
                  {val.title}
                </h3>
                <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed font-medium">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leadership / Board Section */}
      <section className="bg-slate-100 text-slate-700 py-12 md:py-16 border-t border-slate-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <span className="text-accent text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-accent/15 px-3 py-1 rounded-full inline-block">
              Leadership
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-black uppercase text-navy">
              Meet Our Board
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Visionary engineering leaders driving Smart Civil Engineering Works Ltd forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {leadershipTeam.map((member, idx) => (
              <div key={idx} className="bg-white border border-slate-200/50 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center space-y-6 hover:border-accent/20 transition-all duration-300 shadow-md w-full">
                <div className="h-28 w-28 rounded-full overflow-hidden bg-slate-100 shadow-md border-2 border-white shrink-0">
                  {renderAvatar(member)}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-navy uppercase">{member.name}</h3>
                  <span className="text-xs text-accent font-bold uppercase tracking-widest">{member.role}</span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md font-medium">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering & Technical Staff Section */}
      <section className="bg-warm-bg text-slate-700 py-12 md:py-16 border-t border-slate-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
            <span className="text-accent text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-accent/10 px-3 py-1 rounded-full inline-block">
              Technical Staff
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-black uppercase text-navy">
              Engineering & Technical Specialists
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Multidisciplinary civil engineers, architects, quantity surveyors, and site supervisors delivering project perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {staffTeam.map((member, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between hover:border-accent/40 transition-all duration-300 shadow-md group"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-sm uppercase tracking-wider shrink-0 shadow-sm group-hover:bg-accent transition-colors">
                      {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-navy uppercase leading-tight group-hover:text-accent transition-colors">
                        {member.name}
                      </h3>
                      <span className="text-[11px] text-accent font-bold uppercase tracking-wider block">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                  <span>Department</span>
                  <span className="text-navy font-bold bg-slate-100 px-2.5 py-0.5 rounded-full">{member.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
