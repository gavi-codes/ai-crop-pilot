import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/authService';
import { 
  Leaf, 
  User, 
  Phone, 
  Lock, 
  MapPin, 
  Layers, 
  Sprout, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    district: '',
    farmer_type: 'Individual',
    land_size: '2.5',
    soil_type: 'Red Soil'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const cleanData = {
      ...formData,
      mobile: formData.mobile.trim(),
      password: formData.password.trim(),
      land_size: parseFloat(formData.land_size) || 1.0
    };

    try {
      const result = await authService.register(cleanData);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       'Connection Error: Could not reach the server. Please verify your database connection.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const soilTypes = [
    { label: 'Red Soil', desc: 'Common in Southern India, ideal for pulses & groundnut' },
    { label: 'Black Soil', desc: 'Clay-rich cotton soil with high moisture retention' },
    { label: 'Alluvial Soil', desc: 'Highly fertile silt-rich soil for rice & sugarcane' },
    { label: 'Clayey Soil', desc: 'Dense texture, excellent water storage capacity' },
    { label: 'Sandy Soil', desc: 'Fast drainage, suitable for tuber crops & horticulture' },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] font-sans antialiased text-[#0F172A]">
      
      {/* ================= LEFT SHOWCASE PANEL (Desktop) ================= */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#06281E] relative overflow-hidden flex-col justify-between p-12 lg:p-14 text-white border-r border-emerald-950/30">
        
        {/* Ambient Gradient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#84CC16]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-[#10B981] to-[#84CC16] rounded-2xl shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-400/20">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">AI CropPilot</span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-400/25">
                  ONBOARDING
                </span>
              </div>
              <p className="text-xs text-emerald-300/70 font-semibold tracking-wide">Next-Gen Agronomy Suite</p>
            </div>
          </div>
        </div>

        {/* Onboarding Value Highlights */}
        <div className="relative z-10 space-y-6 my-auto py-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-4">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Instant Telemetry Setup</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Create Your Digital <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-lime-300 bg-clip-text text-transparent">
                Farm Profile.
              </span>
            </h2>
            <p className="text-emerald-100/70 text-sm mt-3 leading-relaxed font-normal">
              By setting your soil type, district, and land area, AI CropPilot personalizes your fertilizer dosages, crop calendars, and subsidy recommendations from day one.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Personalized NPK Recommendations', sub: 'Calibrated to your exact acre count and soil type.' },
              { title: 'Hyper-Local Weather Forecasts', sub: 'Live advisories and humidity warnings for your district.' },
              { title: 'AI Pest & Fungus Protection', sub: 'Instant smartphone leaf photography diagnostics.' },
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <div className="h-6 w-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300 text-xs font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{step.title}</h4>
                  <p className="text-[11px] text-emerald-200/60 mt-0.5">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security badge */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-3 text-xs text-emerald-200/70">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Zero subscription fees. Free precision agriculture for Indian farmers.</span>
        </div>

      </div>

      {/* ================= RIGHT FORM PANEL ================= */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
        
        <div className="w-full max-w-xl space-y-6">
          
          {/* Header */}
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Register New Farm Account
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1.5">
              Fill in your farm details to calibrate AI algorithms to your soil and regional climate.
            </p>
          </div>

          {/* Error Message Toast */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-shake">
              <ShieldCheck className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-rose-900 uppercase tracking-wider">Registration Notice</p>
                <p className="text-xs font-medium text-rose-700 mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input 
                    type="tel" 
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  District / Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Koppal, Dharwad"
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Farmer Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Farmer Classification
                </label>
                <select 
                  name="farmer_type" 
                  value={formData.farmer_type} 
                  onChange={handleChange}
                  className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
                >
                  <option value="Individual">Individual Smallholder</option>
                  <option value="FPO">FPO / Cooperative Member</option>
                  <option value="Commercial">Commercial Farm Owner</option>
                  <option value="Contract">Contract Farmer</option>
                </select>
              </div>

              {/* Land Size */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Land Size (Acres)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <input 
                    type="number" 
                    step="0.1"
                    name="land_size"
                    value={formData.land_size}
                    onChange={handleChange}
                    placeholder="e.g. 3.5"
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Primary Soil Type (Full Width) */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Predominant Soil Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Sprout className="h-4 w-4 text-emerald-600" />
                  </div>
                  <select 
                    name="soil_type" 
                    value={formData.soil_type} 
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
                  >
                    {soilTypes.map((st) => (
                      <option key={st.label} value={st.label}>
                        {st.label} — {st.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#0B3D2E] via-[#0D4D3A] to-[#10B981] hover:opacity-95 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 disabled:opacity-60 cursor-pointer mt-4"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering Farm Telemetry...</span>
                </>
              ) : (
                <>
                  <span>Complete Account Registration</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>

          {/* Switch to Login */}
          <div className="pt-3 border-t border-slate-200 text-center">
            <p className="text-sm font-medium text-slate-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
              >
                <span>Sign in here</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;
