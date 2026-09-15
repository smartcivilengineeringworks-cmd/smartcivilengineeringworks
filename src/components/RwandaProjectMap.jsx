import React, { useState } from 'react';
import { MapPin, Building2, CheckCircle2, ChevronRight, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

const regionsData = [
  {
    id: 'kigali',
    name: 'Kigali City',
    districts: 'Kicukiro, Nyarugenge & Gasabo',
    count: 14,
    coordinates: { x: 50, y: 52 },
    description: 'Corporate headquarters and high-density residential multi-storey developments, commercial buildings, and luxury private villas.',
    keyProjects: [
      'G+3 Residential Apartment (Kicukiro)',
      'Nyabyondo Commercial Building (Kigali)',
      'G+1 Residential Houses (Rebero Village)',
      'Busanza Commercial Complex'
    ]
  },
  {
    id: 'musanze',
    name: 'Musanze District',
    districts: 'Northern Province',
    count: 4,
    coordinates: { x: 38, y: 26 },
    description: 'Premier mixed-use commercial hubs, multi-purpose retail complexes, and structural engineering projects.',
    keyProjects: [
      'Musanze Mixed Use Complex',
      'Northern Commercial Centre'
    ]
  },
  {
    id: 'muhanga',
    name: 'Muhanga District',
    districts: 'Southern Province',
    count: 3,
    coordinates: { x: 40, y: 62 },
    description: 'Institutional headquarters, office developments, and commercial structures serving the southern corridor.',
    keyProjects: [
      'RDIS Muhanga Regional Office',
      'Muhanga Commercial Facility'
    ]
  },
  {
    id: 'kirehe',
    name: 'Kirehe District',
    districts: 'Eastern Province',
    count: 2,
    coordinates: { x: 86, y: 68 },
    description: 'Large-span sports infrastructure, public civic facilities, and specialized structural calculations.',
    keyProjects: [
      'Structural Design of Kirehe Gymnasium'
    ]
  },
  {
    id: 'busogo',
    name: 'Busogo Sector',
    districts: 'Northern Corridor',
    count: 2,
    coordinates: { x: 34, y: 34 },
    description: 'Commercial logistics, fuel depot retail facilities, and industrial service hubs.',
    keyProjects: [
      'Busogo Modern Petrol Station & Commercial Depot'
    ]
  },
  {
    id: 'rwamagana',
    name: 'Muyumbu / Rwamagana',
    districts: 'Eastern Province',
    count: 1,
    coordinates: { x: 64, y: 48 },
    description: 'Educational workshops, technical institutes, and community infrastructure.',
    keyProjects: [
      'Muyumbu TVET Educational Infrastructure Block'
    ]
  }
];

const RwandaProjectMap = () => {
  const [activeRegion, setActiveRegion] = useState(regionsData[0]);

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-10 shadow-xl max-w-6xl mx-auto font-sans">
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <span className="text-accent text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-accent/10 px-3.5 py-1.5 rounded-full inline-flex items-center space-x-1.5">
          <Navigation className="h-3 w-3 text-accent" />
          <span>National Coverage</span>
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-black uppercase text-navy tracking-tight">
          Nationwide Project Footprint Across Rwanda
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Smart Civil Engineering Works Ltd delivers structural consultancy, architecture, and site supervision across Kigali and key provincial corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Map Visual */}
        <div className="lg:col-span-7 bg-navy rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border border-white/5 min-h-[380px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 h-48 w-48 bg-accent/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Interactive Regional Map
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-accent bg-accent/15 px-2.5 py-1 rounded-full border border-accent/20">
              26+ Completed Projects
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative my-6 w-full aspect-[4/3] max-h-[300px] flex items-center justify-center">
            {/* Stylized Rwanda boundary outline */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-h-[280px] filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
            >
              {/* Generalized Rwanda Polygon Contour */}
              <path
                d="M 32 18 Q 45 12 60 20 Q 75 22 84 35 Q 92 48 88 68 Q 80 82 66 84 Q 48 85 36 78 Q 22 72 18 55 Q 16 38 24 26 Z"
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="1.2"
                strokeDasharray="2 1"
              />

              {/* Major arterial axes */}
              <line x1="50" y1="52" x2="38" y2="26" stroke="#fbbf24" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="1 1" />
              <line x1="50" y1="52" x2="40" y2="62" stroke="#fbbf24" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="1 1" />
              <line x1="50" y1="52" x2="86" y2="68" stroke="#fbbf24" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="1 1" />
              <line x1="50" y1="52" x2="64" y2="48" stroke="#fbbf24" strokeWidth="0.6" strokeOpacity="0.4" strokeDasharray="1 1" />

              {/* Markers for each region */}
              {regionsData.map((reg) => {
                const isSelected = activeRegion.id === reg.id;
                return (
                  <g
                    key={reg.id}
                    onClick={() => setActiveRegion(reg)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring for active selection */}
                    {isSelected && (
                      <circle
                        cx={reg.coordinates.x}
                        cy={reg.coordinates.y}
                        r="6"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="1"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={reg.coordinates.x}
                      cy={reg.coordinates.y}
                      r={isSelected ? '4' : '3'}
                      fill={isSelected ? '#fbbf24' : '#ffffff'}
                      stroke="#0f172a"
                      strokeWidth="1"
                      className="transition-all duration-300"
                    />
                    <text
                      x={reg.coordinates.x}
                      y={reg.coordinates.y - 5}
                      textAnchor="middle"
                      fill={isSelected ? '#fbbf24' : '#cbd5e1'}
                      fontSize="3.2"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="select-none tracking-wide"
                    >
                      {reg.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-3">
            <span>Click any marker to inspect projects in that province</span>
            <span className="font-bold text-slate-200">Republic of Rwanda</span>
          </div>
        </div>

        {/* Right: Selected Region Details */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Region Switcher Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {regionsData.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeRegion.id === r.id
                    ? 'bg-accent text-navy shadow-md font-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.name} ({r.count})
              </button>
            ))}
          </div>

          {/* Region Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-accent">
                  {activeRegion.districts}
                </span>
                <h3 className="text-xl font-serif font-black text-navy uppercase">
                  {activeRegion.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-navy">{activeRegion.count}</span>
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Projects
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              {activeRegion.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-black uppercase tracking-wider text-navy block">
                Highlighted Works:
              </span>
              <ul className="space-y-1.5">
                {activeRegion.keyProjects.map((p, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Link
                to={`/projects?q=${encodeURIComponent(activeRegion.name.split(' ')[0])}`}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-navy hover:text-accent uppercase tracking-wider transition-colors group"
              >
                <span>View projects in {activeRegion.name}</span>
                <ChevronRight className="h-3.5 w-3.5 text-accent transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RwandaProjectMap;
