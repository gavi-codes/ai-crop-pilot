import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fertilizerService } from '../../api/fertilizerService';
import { 
  Droplet, 
  CheckCircle2, 
  MapPin, 
  HelpCircle,
  TrendingUp,
  Scale,
  Sprout,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

const FertilizerForm = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const landSize = user.land_size || 1.0;

  const [formData, setFormData] = useState({
    crop: '', 
    growth_stage: 'Vegetative',
    soil_report_id: location.state?.soil_report_id || ''
  });
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fertilizerService.recommend(formData);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fertilizer Planner</h1>
        <p className="text-sm text-slate-500 mt-2">
          Calculate precise nutrient dosage requirements customized for your crop type, growth stage, and field area.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 border-t-4 border-t-indigo-500 flex flex-col justify-between h-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Target Crop</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="crop" 
                      value={formData.crop}
                      onChange={handleChange} 
                      placeholder="e.g. Cotton, Paddy, Coconut" 
                      className="w-full pl-4 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-800 text-sm" 
                      required 
                    />
                    <Sprout className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Growth Stage</label>
                  <div className="relative">
                    <select 
                      name="growth_stage" 
                      value={formData.growth_stage}
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-800 text-sm bg-white" 
                      required
                    >
                      <option value="Seedling">Seedling</option>
                      <option value="Vegetative">Vegetative</option>
                      <option value="Flowering">Flowering</option>
                      <option value="Fruiting">Fruiting</option>
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
                  <Layers className="h-5 w-5 text-indigo-500 shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Farm Area (Profile)</span>
                    <span className="text-sm font-extrabold text-slate-800">{landSize} Acres</span>
                  </div>
                </div>
              </div>
              
              {formData.soil_report_id && (
                <div className="flex items-center gap-2 text-[10px] bg-emerald-50 border border-emerald-100/50 text-emerald-700 p-3 rounded-xl font-bold">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Linked Soil Telemetry: Report #{formData.soil_report_id}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white py-3.5 rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Calculating dosage...</span>
                  </>
                ) : (
                  <>
                    <Droplet className="h-5 w-5" />
                    <span>Calculate Prescription</span>
                  </>
                )}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Prescription Output Console */}
        <div className="lg:col-span-3">
          {result ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 animate-fadeIn">
              
              {/* Header Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Prescription Output</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">Dosage Calculations</h2>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold">
                  <Scale className="h-4.5 w-4.5" />
                  DB Mapped
                </span>
              </div>

              {/* Glowing Product Badge */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 text-center border border-slate-800 relative overflow-hidden shadow-lg shadow-indigo-900/10">
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">Recommended Product</span>
                <span className="text-3xl font-black text-indigo-400 tracking-tight block">{result.recommended_fertilizer}</span>
              </div>

              {/* Stats Box Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Metric 1 */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dosage per Acre</span>
                  <p className="text-xl font-black text-slate-850 mt-1">{result.quantity_per_acre} kg <span className="text-xs font-medium text-slate-500">/ acre</span></p>
                </div>
                
                {/* Metric 2 */}
                <div className="bg-emerald-50/50 border border-emerald-100/50 p-4 rounded-2xl text-center flex flex-col justify-center shadow-sm">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Total Quantity Required</span>
                  <p className="text-xl font-black text-emerald-700 mt-1">
                    {roundTotal(result.quantity_per_acre, landSize)} kg 
                    <span className="text-xs font-semibold text-emerald-600/70 block mt-0.5">Calculated for {landSize} acres</span>
                  </p>
                </div>

              </div>

              {/* Tip alert banner */}
              <div className="text-xs text-slate-500 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex gap-3 items-start leading-relaxed font-semibold">
                <HelpCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Application Guideline</span>
                  <span>Apply during early morning or late evening hours when soil is moist. Keep granules away from direct root-stem contact to prevent fertilizer burn. Water the crop immediately after application.</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full bg-slate-50 border border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12 text-slate-400">
              <Droplet className="h-12 w-12 text-slate-300 mb-3 animate-pulse" />
              <p className="font-bold text-slate-500 text-sm">Waiting for Planner Details</p>
              <p className="text-[10px] text-slate-400 font-medium max-w-xs mt-1 leading-relaxed">
                Provide the crop name and choose its corresponding growth stage on the left panel to request chemical prescriptions.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Helper function to calculate and round total quantity
const roundTotal = (qtyPerAcre, landSize) => {
  return (parseFloat(qtyPerAcre) * parseFloat(landSize)).toFixed(1);
};

export default FertilizerForm;
