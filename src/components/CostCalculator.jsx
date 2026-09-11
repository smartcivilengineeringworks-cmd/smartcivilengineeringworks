import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, CheckCircle2, ArrowRight } from 'lucide-react';

const typeMultipliers = {
  residential: 1.0,
  commercial: 1.25,
  tvet: 1.35,
  infrastructure: 1.45
};

const terrainMultipliers = {
  flat: 1.0,
  moderate: 1.15,
  steep: 1.35
};

const RWF_RATE = 1400;

const CostCalculator = () => {
  const [projectType, setProjectType] = useState('residential');
  const [scale, setScale] = useState(300); // sqm
  const [terrain, setTerrain] = useState('flat');
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'RWF'

  const [estimates, setEstimates] = useState({
    studies: 0,
    architectural: 0,
    structural: 0,
    supervision: 0,
    total: 0
  });

  useEffect(() => {
    const typeMult = typeMultipliers[projectType] || 1.0;
    const terrainMult = terrainMultipliers[terrain] || 1.0;

    // Base cost scaled by area, construction complexity and terrain slope
    const baseCost = Math.round((scale / 300) * 1000 * typeMult * terrainMult);

    const studiesCost = Math.round(baseCost * 0.15); // 15%
    const architecturalCost = Math.round(baseCost * 0.35); // 35%
    const structuralCost = Math.round(baseCost * 0.30); // 30%
    const supervisionCost = Math.round(baseCost * 0.20); // 20%
    const totalCost = studiesCost + architecturalCost + structuralCost + supervisionCost;

    setEstimates({
      studies: studiesCost,
      architectural: architecturalCost,
      structural: structuralCost,
      supervision: supervisionCost,
      total: totalCost
    });
  }, [scale, projectType, terrain]);

  const formatPrice = (usdAmount) => {
    if (currency === 'RWF') {
      return `${(usdAmount * RWF_RATE).toLocaleString()} RWF`;
    }
    return `$${usdAmount.toLocaleString()}`;
  };

  const navigate = useNavigate();

  const handleRequestQuote = () => {
    navigate('/contact', {
      state: {
        calculatorEstimate: {
          projectType,
          scale,
          terrain,
          estimatedTotal: formatPrice(estimates.total),
          currency
        }
      }
    });
  };

  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl p-6 md:p-10 shadow-2xl max-w-3xl mx-auto font-sans text-slate-650">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-display font-black text-navy uppercase tracking-wide flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-accent" />
              <span>Project Cost Estimator</span>
            </h3>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              Input your planned construction parameters to receive an instantly calculated fee proposal estimate for our design and engineering consultancy services.
            </p>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            {/* Project Type */}
            <div className="space-y-2">
              <label className="text-slate-500 uppercase tracking-wider text-[9px]">Construction Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'residential', label: 'Residential House' },
                  { id: 'commercial', label: 'Commercial Block' },
                  { id: 'tvet', label: 'TVET / School Block' },
                  { id: 'infrastructure', label: 'Infrastructure Works' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setProjectType(type.id)}
                    className={`py-3 px-4 rounded-full border text-center transition-all duration-200 text-xs ${
                      projectType === type.id
                        ? 'border-accent bg-accent/5 text-accent font-black shadow-md'
                        : 'border-slate-200/60 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizing scale slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-500 uppercase tracking-wider text-[9px]">Estimated Area</label>
                <span className="text-accent font-black">{scale} SQM</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="25"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            {/* Terrain Slope */}
            <div className="space-y-2">
              <label className="text-slate-500 uppercase tracking-wider text-[9px]">Terrain Slope Profile</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'flat', label: 'Flat (< 5°)' },
                  { id: 'moderate', label: 'Moderate (5-15°)' },
                  { id: 'steep', label: 'Steep (> 15°)' }
                ].map((slope) => (
                  <button
                    key={slope.id}
                    type="button"
                    onClick={() => setTerrain(slope.id)}
                    className={`py-3 px-2.5 rounded-full border text-center transition-all duration-200 text-xs ${
                      terrain === slope.id
                        ? 'border-accent bg-accent/5 text-accent font-black shadow-md'
                        : 'border-slate-200/60 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {slope.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Estimated Outputs */}
        <div className="lg:col-span-6 bg-navy text-white p-6 md:p-8 rounded-2xl relative overflow-hidden shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 h-28 w-28 bg-accent/10 rounded-full filter blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-slate-350 font-bold tracking-wider uppercase text-xs">Estimated Fees Breakdown</h4>
            <div className="inline-flex rounded-lg bg-white/10 p-0.5 border border-white/15">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                  currency === 'USD'
                    ? 'bg-accent text-navy shadow-xs font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('RWF')}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                  currency === 'RWF'
                    ? 'bg-accent text-navy shadow-xs font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                RWF
              </button>
            </div>
          </div>
          
          <div className="space-y-4 text-xs sm:text-sm font-semibold">
            {/* Studies */}
            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
              <span className="text-slate-300">Engineering Studies (15%):</span>
              <span className="text-slate-100 font-bold">{formatPrice(estimates.studies)}</span>
            </div>
            
            {/* Architecture */}
            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
              <span className="text-slate-300">Architectural & 3D Drafting (35%):</span>
              <span className="text-slate-100 font-bold">{formatPrice(estimates.architectural)}</span>
            </div>
            
            {/* Structural */}
            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
              <span className="text-slate-300">Structural Calculations (30%):</span>
              <span className="text-slate-100 font-bold">{formatPrice(estimates.structural)}</span>
            </div>
            
            {/* Supervision */}
            <div className="flex justify-between items-center py-2.5 border-b border-white/10">
              <span className="text-slate-300">QA/QC Supervision & Safety (20%):</span>
              <span className="text-slate-100 font-bold">{formatPrice(estimates.supervision)}</span>
            </div>

            {/* Total Fee Proposal */}
            <div className="flex justify-between items-center pt-4 border-t border-accent/30">
              <span className="text-accent uppercase tracking-wider font-black text-xs">Estimated Consultancy:</span>
              <span className="text-white font-serif font-black text-lg sm:text-xl">{formatPrice(estimates.total)}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleRequestQuote}
            className="w-full mt-5 py-3 px-4 bg-accent hover:bg-white text-navy font-bold uppercase text-xs tracking-wider rounded-xl transition-all duration-300 shadow-md flex items-center justify-center space-x-2 group hover:scale-[1.02] cursor-pointer"
          >
            <span>Request Formal Quote with this Estimate</span>
            <ArrowRight className="h-4 w-4 text-navy transition-transform group-hover:translate-x-1" />
          </button>

          <div className="mt-5 flex items-start space-x-2 text-[9px] text-slate-400 leading-normal font-medium">
            <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <span>Note: This is a planning estimate. Standard municipality stamps and soil lab core crashing fees are calculated separately.</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CostCalculator;
