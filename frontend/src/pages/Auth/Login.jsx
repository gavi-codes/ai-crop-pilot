import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/authService';
import { 
  Leaf, 
  Phone, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Scan, 
  Sprout, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await authService.login({ 
        mobile: mobile.trim(), 
        password: password.trim() 
      });
      if (result.success) {
        localStorage.setItem('access_token', result.data.access_token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        navigate('/dashboard');
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

  const featurePills = [
    { icon: Scan, title: 'AI Disease Vision', desc: 'Scan leaf infections with 98.4% diagnostic precision.' },
    { icon: TrendingUp, title: 'Wholesale Mandi Forecasts', desc: 'Real-time price trend alerts across 2,400+ markets.' },
    { icon: Sprout, title: 'Soil NPK Telemetry', desc: 'Custom nutrient prescriptions tailored to your acreage.' },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] font-sans antialiased text-[#0F172A]">
      
      {/* ================= LEFT SHOWCASE PANEL (Desktop) ================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#06281E] relative overflow-hidden flex-col justify-between p-12 lg:p-16 text-white border-r border-emerald-950/30">
        
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
                  ENTERPRISE
                </span>
              </div>
              <p className="text-xs text-emerald-300/70 font-semibold tracking-wide">Autonomous Precision Agriculture</p>
            </div>
          </div>
        </div>

        {/* Main Pitch & Value Cards */}
        <div className="relative z-10 space-y-8 my-auto py-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-4">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Version 2.5 Next-Gen Release</span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Intelligent Farming, <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-lime-300 bg-clip-text text-transparent">
                Accelerated by AI.
              </span>
            </h2>
            <p className="text-emerald-100/70 text-sm xl:text-base mt-4 max-w-lg leading-relaxed font-normal">
              Empowering farmers with multi-spectral leaf scanning, real-time market sentiment forecasts, and automated agronomy advisories.
            </p>
          </div>

          {/* Feature Highlight Cards */}
          <div className="space-y-3.5">
            {featurePills.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all duration-300 backdrop-blur-xs"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-emerald-200/60 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Metrics Proof Bar */}
        <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-white">99.2%</p>
            <p className="text-[11px] font-semibold text-emerald-400/70 uppercase tracking-wider">Detection Accuracy</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <p className="text-2xl font-black text-white">2,400+</p>
            <p className="text-[11px] font-semibold text-emerald-400/70 uppercase tracking-wider">APMC Mandis Covered</p>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <p className="text-2xl font-black text-white">₹4,200/ac</p>
            <p className="text-[11px] font-semibold text-emerald-400/70 uppercase tracking-wider">Average Yield Gain</p>
          </div>
        </div>

      </div>

      {/* ================= RIGHT FORM PANEL ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 relative">
        
        {/* Subtle Ambient Light for mobile */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-tr from-[#10B981] to-[#84CC16] rounded-xl shadow-md">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900">AI CropPilot</span>
              <p className="text-[11px] font-bold text-emerald-600">Smart Farming OS</p>
            </div>
          </div>

          {/* Form Header */}
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Hub
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Enter your registered mobile credentials to access live field telemetry and AI advisors.
            </p>
          </div>

          {/* Error Message Toast */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-3 animate-shake">
              <ShieldCheck className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-rose-900 uppercase tracking-wider">Authentication Notice</p>
                <p className="text-xs font-medium text-rose-700 mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Mobile Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <input 
                  type="tel" 
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 font-semibold text-sm placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <span className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 font-semibold text-sm placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#0B3D2E] via-[#0D4D3A] to-[#10B981] hover:opacity-95 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating Field Pilot...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Control Center</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-sm font-medium text-slate-600">
              New to AI CropPilot?{' '}
              <Link 
                to="/register" 
                className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
              >
                <span>Create an Account</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>

          {/* Security Assurance */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>256-bit Encrypted Agri-Telemetry Session</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
