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
  CalendarCheck
} from 'lucide-react';

const SchemesDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  // Track application status for individual scheme ids
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
    
    // Simulate successful application submission after 1s
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
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <Award className="h-8 w-8 text-emerald-500" />
          Government Schemes & Subsidies
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Verify your eligibility and submit online subsidy requests directly to Central and State agricultural departments.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Matching criteria against government APIs...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl text-center text-sm border border-rose-100 font-bold">
          {error}
        </div>
      ) : data && (
        <div className="space-y-8">
          
          {/* Farmer Profile Matching Panel */}
          <div className="bg-white/95 border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-6 border-t-4 border-t-emerald-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Match Registry</span>
              <h2 className="text-xl font-bold text-slate-800">
                Hi {data.farmer.name || 'Farmer'}, you qualify for <span className="text-emerald-600 font-extrabold">{data.schemes.length} active programs</span>
              </h2>
              <p className="text-xs text-slate-500">Criteria evaluated using your registered farming telemetry.</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-sky-500" />
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">District</span>
                  <span className="text-xs font-extrabold text-slate-700">{data.farmer.district}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Layers className="h-4.5 w-4.5 text-indigo-500" />
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Land Size</span>
                  <span className="text-xs font-extrabold text-slate-700">{data.farmer.land_size} Acres</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Scale className="h-4.5 w-4.5 text-amber-500" />
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Soil Type</span>
                  <span className="text-xs font-extrabold text-slate-700">{data.farmer.soil_type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filtering tabs */}
          <div className="flex border-b border-slate-200">
            {['All', 'Central', 'State'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-all relative top-[2px] ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'All' ? 'Show All Schemes' : tab === 'Central' ? 'Central Government' : 'Karnataka State Subsidies'}
              </button>
            ))}
          </div>

          {/* Scheme cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getFilteredSchemes().map((scheme) => {
              const status = appliedSchemes[scheme.id];
              return (
                <div 
                  key={scheme.id}
                  className="bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                        scheme.category === 'Central' 
                          ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {scheme.category === 'Central' ? 'GoI Central' : 'Karnataka State'}
                      </span>
                      
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50/50 px-2.5 py-1 rounded-xl shadow-inner">
                        {scheme.subsidy_amount}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{scheme.name}</h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                        {scheme.description}
                      </p>
                    </div>

                    {/* Match reason alert box */}
                    <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex gap-2 items-start text-xs text-slate-500 font-semibold">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{scheme.match_reason}</span>
                    </div>

                    {/* Application Steps */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Application Steps</span>
                      <p className="text-[11px] text-slate-650 leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                        {scheme.steps}
                      </p>
                    </div>
                  </div>

                  {/* Apply action button */}
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    {status === 'Success' ? (
                      <div className="w-full bg-emerald-50 border border-emerald-100 text-emerald-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Application Submitted (Pending Dept. Review)</span>
                      </div>
                    ) : status === 'Pending' ? (
                      <button 
                        disabled
                        className="w-full bg-slate-150 text-slate-400 py-3 rounded-2xl font-bold cursor-wait flex items-center justify-center gap-2"
                      >
                        <div className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Documents...</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApply(scheme.id)}
                        className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-2xl font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Apply Online</span>
                        <ChevronRight className="h-4.5 w-4.5" />
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
