import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { soilService } from '../../api/soilService';
import { 
  Sprout, 
  Settings, 
  Sliders, 
  CheckCircle2, 
  Info,
  ChevronRight,
  FlaskConical,
  Gauge,
  Activity,
  Award
} from 'lucide-react';

const SOIL_TYPE_MAPPING = {
  'Red Soil': { nitrogen: 25, phosphorus: 15, potassium: 15, ph: 6.2, moisture: 35 },
  'Black Soil': { nitrogen: 45, phosphorus: 22, potassium: 25, ph: 7.6, moisture: 55 },
  'Clayey Soil': { nitrogen: 35, phosphorus: 18, potassium: 30, ph: 6.8, moisture: 60 },
  'Sandy Soil': { nitrogen: 15, phosphorus: 10, potassium: 12, ph: 6.0, moisture: 25 },
  'Alluvial Soil': { nitrogen: 50, phosphorus: 25, potassium: 35, ph: 7.0, moisture: 45 }
};

const SoilForm = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [advancedMode, setAdvancedMode] = useState(false);
  const [selectedSoilType, setSelectedSoilType] = useState(user.soil_type || 'Red Soil');
  
  const [formData, setFormData] = useState({
    nitrogen: '25', 
    phosphorus: '15', 
    potassium: '15', 
    ph: '6.2', 
    moisture: '35'
  });
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSoilTypeChange = (e) => {
    const type = e.target.value;
    setSelectedSoilType(type);
    if (!advancedMode && SOIL_TYPE_MAPPING[type]) {
      const mapping = SOIL_TYPE_MAPPING[type];
      setFormData({
        nitrogen: String(mapping.nitrogen),
        phosphorus: String(mapping.phosphorus),
        potassium: String(mapping.potassium),
        ph: String(mapping.ph),
        moisture: String(mapping.moisture)
      });
    }
  };

  const toggleMode = () => {
    const nextMode = !advancedMode;
    setAdvancedMode(nextMode);
    
    if (!nextMode) {
      const mapping = SOIL_TYPE_MAPPING[selectedSoilType] || SOIL_TYPE_MAPPING['Red Soil'];
      setFormData({
        nitrogen: String(mapping.nitrogen),
        phosphorus: String(mapping.phosphorus),
        potassium: String(mapping.potassium),
        ph: String(mapping.ph),
        moisture: String(mapping.moisture)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const submissionData = advancedMode 
        ? formData 
        : SOIL_TYPE_MAPPING[selectedSoilType];

      const res = await soilService.analyze(submissionData);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze soil');
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    navigate('/fertilizer', { state: { soil_report_id: result.id } });
  };

  // Helper to determine pH classification name and color
  const getPhVerdict = (phVal) => {
    const ph = parseFloat(phVal);
    if (ph < 6.0) return { label: 'Acidic Soil', color: 'bg-rose-50 text-rose-600 border-rose-100', barColor: 'bg-rose-500' };
    if (ph > 7.2) return { label: 'Alkaline Soil', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', barColor: 'bg-indigo-500' };
    return { label: 'Neutral/Ideal Soil', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', barColor: 'bg-emerald-500' };
  };

  const phVerdict = result ? getPhVerdict(result.ph) : null;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Soil Diagnostics Console</h1>
        <p className="text-sm text-slate-500 mt-2">
          Verify critical nutrient indexes, trace pH balance, and calculate optimal plant compatibility levels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Diagnostics Input Setup */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 border-t-4 border-t-emerald-500 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-emerald-500 animate-pulse" />
                  <h2 className="font-bold text-slate-900 text-base">Telemetry Input</h2>
                </div>
                
                <button 
                  type="button" 
                  onClick={toggleMode}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                    advancedMode 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>{advancedMode ? 'Lab Mode' : 'Quick Mode'}</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!advancedMode ? (
                  /* Quick Mode Dropdown */
                  <div className="p-4.5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Soil Type Selector</label>
                    <select 
                      value={selectedSoilType}
                      onChange={handleSoilTypeChange}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-sm text-slate-800"
                    >
                      <option value="Red Soil">Red Soil (Pre-filled from profile)</option>
                      <option value="Black Soil">Black Soil</option>
                      <option value="Clayey Soil">Clayey Soil</option>
                      <option value="Sandy Soil">Sandy Soil</option>
                      <option value="Alluvial Soil">Alluvial Soil</option>
                    </select>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Matches regional telemetry configurations for standard Karnataka profiles.
                    </p>
                  </div>
                ) : (
                  /* Advanced Mode Numeric Inputs */
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider mb-1">Nitrogen (N ppm)</label>
                        <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 bg-slate-50/50" required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider mb-1">Phosphorus (P ppm)</label>
                        <input type="number" name="phosphorus" value={formData.phosphorus} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 bg-slate-50/50" required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider mb-1">Potassium (K ppm)</label>
                        <input type="number" name="potassium" value={formData.potassium} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 bg-slate-50/50" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider mb-1">pH level</label>
                          <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 bg-slate-50/50" required />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-450 uppercase tracking-wider mb-1">Moisture (%)</label>
                          <input type="number" name="moisture" value={formData.moisture} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 bg-slate-50/50" required />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Diagnosing Soil...</span>
                    </>
                  ) : (
                    <>
                      <FlaskConical className="h-5 w-5" />
                      <span>Diagnose Soil Health</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 text-xs font-bold text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Lab Diagnostic Results Panel */}
        <div className="lg:col-span-3">
          {result ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 animate-fadeIn">
              
              {/* Header Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Diagnosis Registry</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">Lab Diagnostic Report</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  Verified Status
                </span>
              </div>

              {/* Colorful Visual progress bars representing N-P-K */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NPK & pH Vitals Spectrum</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Nitrogen (N) */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-blue-600 uppercase">Nitrogen (N)</span>
                      <span className="text-slate-900">{result.nitrogen} ppm</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (result.nitrogen/70)*100)}%` }} />
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold block">Target level: 30-50 ppm</span>
                  </div>

                  {/* Phosphorus (P) */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-rose-600 uppercase">Phosphorus (P)</span>
                      <span className="text-slate-900">{result.phosphorus} ppm</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${Math.min(100, (result.phosphorus/40)*100)}%` }} />
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold block">Target level: 15-25 ppm</span>
                  </div>

                  {/* Potassium (K) */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-purple-600 uppercase">Potassium (K)</span>
                      <span className="text-slate-900">{result.potassium} ppm</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(100, (result.potassium/40)*100)}%` }} />
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold block">Target level: 15-30 ppm</span>
                  </div>

                </div>

                {/* pH Level Indicator */}
                <div className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${phVerdict.color}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">pH Balance</span>
                    <h4 className="text-base font-black">{phVerdict.label} (pH {result.ph})</h4>
                  </div>
                  
                  <div className="w-full md:w-48 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div className={`${phVerdict.barColor} h-2.5 rounded-full`} style={{ width: `${(result.ph/14)*100}%` }} />
                  </div>
                </div>
              </div>

              {/* Health Verdict Panel */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 rounded-2xl flex items-start gap-3 shadow-lg shadow-slate-900/10">
                <Activity className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Health Verdict</span>
                  <p className="text-sm font-semibold leading-relaxed mt-1">{result.health_verdict}</p>
                </div>
              </div>

              {/* Suitable Crops section */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Highly Suitable Crops</span>
                <div className="flex flex-wrap gap-2.5">
                  {result.suitable_crops.map(crop => (
                    <span 
                      key={crop} 
                      className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold px-3.5 py-1.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all select-none"
                    >
                      <Sprout className="h-3.5 w-3.5 text-emerald-500" />
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleProceed}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3.5 rounded-2xl font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Fertilizer Planning</span>
                <ChevronRight className="h-5 w-5 animate-pulse" />
              </button>

            </div>
          ) : (
            <div className="h-full bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12 text-slate-400">
              <FlaskConical className="h-12 w-12 text-slate-300 mb-3 animate-pulse" />
              <p className="font-bold text-slate-500 text-sm">Waiting for Analysis Input</p>
              <p className="text-[10px] text-slate-400 font-medium max-w-xs mt-1 leading-relaxed">
                Choose a soil category or input lab telemetry coordinates on the left panel to execute diagnostic checks.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SoilForm;
