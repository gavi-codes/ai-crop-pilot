import React, { useState, useEffect } from 'react';
import { schemeService } from '../../api/schemeService';
import { 
  Award, 
  MapPin, 
  Layers, 
  Scale, 
  ChevronRight, 
  Info, 
  CheckCircle, 
  HelpCircle, 
  TrendingUp, 
  FileCheck2, 
  CalendarCheck,
  Sparkles,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const SchemesDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  const [appliedSchemes, setAppliedSchemes] = useState({});

  const fetchSchemes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await schemeService.getEligibleSchemes();
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load eligible schemes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleApply = (schemeId) => {
    setAppliedSchemes(prev => ({
      ...prev,
      [schemeId]: 'Pending'
    }));
    
    setTimeout(() => {
      setAppliedSchemes(prev => ({
        ...prev,
        [schemeId]: 'Success'
      }));
    }, 1200);
  };

  const getFilteredSchemes = () => {
    if (!data) return [];
    if (activeTab === 'All') return data.schemes;
    return data.schemes.filter(s => s.category === activeTab);
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Central & State Direct Benefit Subsidies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Government Schemes & Subsidies
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 max-w-2xl">
            Evaluate your farm profile against Ministry of Agriculture programs to claim drip irrigation, seed, and input assistance.
          </p>
        </div>

        <button 
          onClick={fetchSchemes}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Re-match Eligibility</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-3xl border border-slate-200/80">
          <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-extrabold text-slate-700 animate-pulse">Evaluating farm acreage and location against government portals...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-50 text-rose-700 rounded-3xl border border-rose-200 text-center font-bold text-sm">
          {error}
        </div>
      ) : data && (
        <div className="space-y-8">
          
          {/* Eligibility Overview Banner */}
          <div className="bg-gradient-to-r from-[#06281E] via-[#0B3D2E] to-[#0D4D3A] rounded-3xl p-6 sm:p-8 text-white border border-emerald-900/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 block">
                Eligibility Evaluation
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Hi {data.farmer.name || 'Farmer'}, you qualify for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300">{data.schemes.length} Active Grants</span>
              </h2>
              <p className="text-xs text-emerald-100/75 max-w-lg font-medium leading-relaxed">
                Calculated by cross-referencing your district location, total acreage, and registered soil profile against active FY 2026-27 allocations.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-md">
              <div className="px-3.5 py-2 bg-white/10 rounded-xl text-center">
                <span className="text-[9px] font-bold text-emerald-300 uppercase block">District</span>
                <span className="text-xs font-black text-white">{data.farmer.district}</span>
              </div>
              <div className="px-3.5 py-2 bg-white/10 rounded-xl text-center">
                <span className="text-[9px] font-bold text-emerald-300 uppercase block">Total Area</span>
                <span className="text-xs font-black text-white">{data.farmer.land_size} ac</span>
              </div>
              <div className="px-3.5 py-2 bg-white/10 rounded-xl text-center">
                <span className="text-[9px] font-bold text-emerald-300 uppercase block">Soil Profile</span>
                <span className="text-xs font-black text-white">{data.farmer.soil_type}</span>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'All', label: 'All Eligible Programs' },
              { id: 'Central', label: 'GoI Central Schemes' },
              { id: 'State', label: 'Karnataka State Subsidies' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scheme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getFilteredSchemes().map((scheme) => {
              const status = appliedSchemes[scheme.id];
              const isCentral = scheme.category === 'Central';

              return (
                <div 
                  key={scheme.id}
                  className="bg-white border border-slate-200/90 shadow-sm rounded-3xl p-6 sm:p-7 flex flex-col justify-between card-hover transition-all duration-300 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    
                    {/* Badge Strip */}
                    <div className="flex justify-between items-start gap-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        isCentral 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {isCentral ? 'Central (GoI)' : 'Karnataka State'}
                      </span>
                      
                      <span className="text-sm font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl shadow-2xs">
                        {scheme.subsidy_amount}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">{scheme.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
                        {scheme.description}
                      </p>
                    </div>

                    {/* Match Reason */}
                    <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-200/60 flex gap-2.5 items-start text-xs text-emerald-900 font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{scheme.match_reason}</span>
                    </div>

                    {/* Application Steps */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Required Protocol</span>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 whitespace-pre-line">
                        {scheme.steps}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    {status === 'Success' ? (
                      <div className="w-full bg-emerald-100 border border-emerald-200 text-emerald-800 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-2xs">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                        <span>Application Registered (Tracking: #AGR-2026-{scheme.id})</span>
                      </div>
                    ) : status === 'Pending' ? (
                      <button 
                        disabled
                        className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-2xl font-black text-xs cursor-wait flex items-center justify-center gap-2"
                      >
                        <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        <span>Verifying DBT Portals...</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApply(scheme.id)}
                        className="w-full py-3.5 rounded-2xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <span>Apply Online via DBT Direct Gateway</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};

export default SchemesDashboard;
