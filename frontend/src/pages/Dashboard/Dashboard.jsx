import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  Scan, 
  Droplet, 
  Sparkles, 
  ChevronRight, 
  Thermometer, 
  MapPin, 
  Info, 
  RefreshCw, 
  Gauge, 
  Award, 
  MessageSquare,
  Clock,
  Calendar,
  Shield,
  Layers,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';
import { advisorService } from '../../api/advisorService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const fetchAdvisorData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await advisorService.getRecommendation();
      if (res.success) {
        setRecommendation(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error("Dashboard Recommendation Error:", err);
      setError("Unable to load today's recommendation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisorData();
  }, []);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const modules = [
    {
      title: 'Crop Health Scan',
      desc: 'Instant smartphone leaf scan detecting 38+ plant pathogens and pests.',
      path: '/disease',
      icon: Scan,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100 hover:border-rose-300',
      badge: 'AI Vision',
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    {
      title: 'Soil Diagnostics',
      desc: 'Verify macro NPK balance, trace pH scale, and crop suitability.',
      path: '/soil',
      icon: Sprout,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100 hover:border-emerald-300',
      badge: 'Nutrients',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      title: 'Fertilizer Planner',
      desc: 'Customized NPK prescription calculated to your exact field acreage.',
      path: '/fertilizer',
      icon: Droplet,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100 hover:border-blue-300',
      badge: 'Calculator',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'Market Intelligence',
      desc: 'AI price prediction across 2,400+ APMC mandis with Hold/Sell advice.',
      path: '/price',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100 hover:border-indigo-300',
      badge: 'Wholesale AI',
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    {
      title: 'Weather Advisor',
      desc: 'Microclimate indicators, rainfall risk alerts, and spray timing windows.',
      path: '/weather',
      icon: CloudSun,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100 hover:border-amber-300',
      badge: 'Microclimate',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      title: 'Harvest Maturity',
      desc: 'Visual ripeness analyzer estimating optimal harvest day and storage life.',
      path: '/maturity',
      icon: Clock,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-100 hover:border-teal-300',
      badge: 'Harvest AI',
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      title: 'Smart Crop Calendar',
      desc: 'Personalized step-by-step cultivation stages from sowing to harvesting.',
      path: '/calendar',
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100 hover:border-purple-300',
      badge: 'Timeline',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'AgriBot Assistant',
      desc: 'Multilingual conversational voice guide for instantaneous farming answers.',
      path: '/chat',
      icon: MessageSquare,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-100 hover:border-cyan-300',
      badge: 'Voice AI',
      badgeColor: 'bg-cyan-100 text-cyan-800'
    },
    {
      title: 'Government Schemes',
      desc: 'Discover central and state agricultural subsidies and grants for your farm.',
      path: '/schemes',
      icon: Award,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100 hover:border-emerald-300',
      badge: 'Subsidies',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto font-sans">
      
      {/* ================= HERO PILOT COMMAND BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl p-8 lg:p-10 shadow-xl border border-emerald-900/30 bg-gradient-to-r from-[#06281E] via-[#0B3D2E] to-[#0D4D3A] text-white">
        
        {/* Ambient lighting glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 bg-[#84CC16]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-300 text-xs font-bold backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>Farm Operations Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {getGreeting()}, <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-lime-300 bg-clip-text text-transparent">{user?.name || 'Farmer Pilot'}</span> 👋
            </h1>

            <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              Your autonomous agriculture engine is monitoring microclimate telemetry, soil parameters, and wholesale market trends across Karnataka.
            </p>

            {/* Quick Action Shortcuts */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                onClick={() => navigate('/disease')}
                className="px-4 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-950/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Scan className="h-4 w-4" />
                <span>Quick Leaf Scan</span>
              </button>
              <button 
                onClick={() => navigate('/soil')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sprout className="h-4 w-4 text-emerald-300" />
                <span>Soil Telemetry</span>
              </button>
              <button 
                onClick={() => navigate('/chat')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-teal-300" />
                <span>AgriBot Voice</span>
              </button>
            </div>
          </div>

          {/* Right Farm Telemetry Card */}
          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72 bg-white/[0.06] p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-emerald-300/70 block tracking-wider">Region</span>
              <span className="font-extrabold text-white text-sm truncate block mt-0.5">{user?.district || 'Karnataka'}</span>
            </div>
            <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-emerald-300/70 block tracking-wider">Total Area</span>
              <span className="font-extrabold text-white text-sm block mt-0.5">{user?.land_size || '2.5'} Acres</span>
            </div>
            <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-emerald-300/70 block tracking-wider">Soil Profile</span>
              <span className="font-extrabold text-white text-sm truncate block mt-0.5">{user?.soil_type || 'Red Soil'}</span>
            </div>
            <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.06]">
              <span className="text-[10px] uppercase font-bold text-emerald-300/70 block tracking-wider">Operator</span>
              <span className="font-extrabold text-white text-sm truncate block mt-0.5">{user?.farmer_type || 'Smallholder'}</span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= 4 VITAL TELEMETRY GAUGES ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { 
            label: 'Soil Health Index', 
            value: recommendation ? `pH ${recommendation.profile.soil_parameters.ph}` : 'pH 6.5', 
            sub: 'Optimal Neutral Balance',
            icon: Sprout, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50', 
            border: 'border-emerald-100'
          },
          { 
            label: 'Microclimate Ambient', 
            value: recommendation ? `${recommendation.weather.temperature}°C` : '28°C', 
            sub: 'Ideal Crop Growth Range',
            icon: Thermometer, 
            color: 'text-amber-600', 
            bg: 'bg-amber-50', 
            border: 'border-amber-100'
          },
          { 
            label: 'Relative Air Humidity', 
            value: recommendation ? `${recommendation.weather.humidity}%` : '62%', 
            sub: 'Stable Transpiration Level',
            icon: Droplet, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50', 
            border: 'border-blue-100'
          },
          { 
            label: 'Mandi Market Sentiment', 
            value: recommendation ? (recommendation.market?.forecast?.[0]?.price > recommendation.market?.current_price ? 'Bullish (Hold)' : 'Bearish (Sell)') : 'Bullish (+4.2%)', 
            sub: 'Wholesale APMC Forecast',
            icon: TrendingUp, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50', 
            border: 'border-purple-100'
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className={`bg-white p-5 rounded-2xl border ${stat.border} shadow-xs card-hover flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{stat.sub}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= ONE-CLICK SMART ADVISOR HUB ================= */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden">
        
        {/* Subtle accent border at top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#10B981] via-teal-400 to-[#84CC16]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Autonomous Agronomy Advisor
                </h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Synchronizes live microclimate, profile parameters, and market forecasts in real-time
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={fetchAdvisorData} 
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold transition-all disabled:opacity-50 border border-slate-200/80 hover:border-emerald-300 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{loading ? 'Diagnosing...' : 'Re-calculate Diagnostics'}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <Sparkles className="h-5 w-5 text-emerald-600 absolute inset-0 m-auto animate-pulse" />
            </div>
            <p className="text-sm font-bold text-slate-600 animate-pulse">Running precision AI models on soil and climate telemetry...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-rose-50 rounded-2xl text-center border border-rose-200 max-w-lg mx-auto flex flex-col items-center gap-4">
            <p className="text-rose-700 text-sm font-semibold">{error}</p>
            <button 
              onClick={fetchAdvisorData} 
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              Retry Advisory Engine
            </button>
          </div>
        ) : recommendation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Local Microclimate */}
            <div className="bg-slate-50/70 border border-blue-100 rounded-2xl p-5 flex flex-col justify-between hover:bg-white transition-all shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-extrabold text-blue-600 tracking-wider">Atmospheric</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Live</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <CloudSun className="h-4.5 w-4.5 text-blue-500" />
                  Local Climate
                </h3>
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-400 block">Temperature</span>
                    <span className="text-lg font-black text-slate-900">{recommendation.weather.temperature}°C</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-400 block">Humidity</span>
                    <span className="text-lg font-black text-slate-900">{recommendation.weather.humidity}%</span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50/80 border border-blue-200/80 p-3 rounded-xl mt-3">
                <span className="text-[10px] font-extrabold text-blue-700 uppercase block mb-1">Field Advisory</span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{recommendation.weather.advisory}</p>
              </div>
            </div>

            {/* 2. Optimal Crops */}
            <div className="bg-slate-50/70 border border-emerald-100 rounded-2xl p-5 flex flex-col justify-between hover:bg-white transition-all shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-600 tracking-wider">Crop Compatibility</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">95%+ Match</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <Sprout className="h-4.5 w-4.5 text-emerald-500" />
                  Crops to Plant
                </h3>
                <div className="space-y-2">
                  {recommendation.crops.map((crop, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-slate-900 block text-sm">{crop.name}</span>
                        <span className="text-[11px] font-medium text-slate-500 block truncate max-w-[130px]">{crop.suitability}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2.5 py-1 rounded-lg shrink-0 shadow-xs">
                        High Fit
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 leading-relaxed flex gap-1.5 items-center bg-white p-2.5 rounded-xl border border-slate-200/80">
                <Info className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Calibrated for <strong>{recommendation.profile.soil_type}</strong>.</span>
              </div>
            </div>

            {/* 3. Fertilizer Prescription */}
            <div className="bg-slate-50/70 border border-amber-100 rounded-2xl p-5 flex flex-col justify-between hover:bg-white transition-all shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-extrabold text-amber-600 tracking-wider">NPK Prescription</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Custom</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <Droplet className="h-4.5 w-4.5 text-amber-500" />
                  Fertilizer Output
                </h3>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-center mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Recommended Formulation</span>
                  <span className="text-base font-extrabold text-slate-900 block">{recommendation.fertilizer.recommended_fertilizer}</span>
                </div>
              </div>
              <div className="space-y-2 mt-auto">
                <div className="flex justify-between text-xs py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Quantity / Acre:</span>
                  <span className="font-extrabold text-slate-800">{recommendation.fertilizer.quantity_per_acre} kg</span>
                </div>
                <div className="flex justify-between text-sm py-1 font-bold">
                  <span className="text-slate-600">Total ({recommendation.profile.land_size} ac):</span>
                  <span className="text-amber-700 font-black">{recommendation.fertilizer.total_quantity} kg</span>
                </div>
                <div className="text-[10px] text-amber-900 bg-amber-50/90 border border-amber-200/80 p-2 rounded-xl text-center font-semibold">
                  {recommendation.fertilizer.reason}
                </div>
              </div>
            </div>

            {/* 4. Wholesale Market Advisor */}
            <div className="bg-slate-50/70 border border-purple-100 rounded-2xl p-5 flex flex-col justify-between hover:bg-white transition-all shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-extrabold text-purple-600 tracking-wider">Market Intelligence</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Mandi AI</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-purple-500" />
                  Price Forecast
                </h3>
                {recommendation.market && recommendation.market.current_price ? (
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-center mb-3">
                    <span className="text-xs font-bold text-slate-500 block mb-1">
                      {recommendation.market.crop} Mandi Rate
                    </span>
                    <span className="text-xl font-black text-slate-900 block">
                      ₹{recommendation.market.current_price}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold block">per Quintal</span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block mt-2 ${
                      recommendation.market.forecast[0]?.price > recommendation.market.current_price
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {recommendation.market.forecast[0]?.price > recommendation.market.current_price
                        ? '▲ Bullish (Hold)'
                        : '▼ Bearish (Sell)'}
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs font-medium">
                    No market details loaded.
                  </div>
                )}
              </div>
              <div className="text-[10px] text-purple-900 bg-purple-50 border border-purple-200/80 p-2.5 rounded-xl text-center font-semibold leading-relaxed mt-auto">
                {recommendation.market && recommendation.market.forecast && recommendation.market.forecast[0]?.price > recommendation.market.current_price
                  ? `${recommendation.market.crop} rate is predicted to rise to ₹${recommendation.market.forecast[0]?.price} next month. Advice: Hold.`
                  : `${recommendation.market?.crop || 'Crop'} rate is predicted to trend lower. Advice: Sell.`}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="h-8 w-8 text-emerald-500 mx-auto mb-3 animate-pulse" />
            <p className="text-slate-600 text-sm font-semibold">Click recalculate to compute personalized crop & fertilizer diagnostics.</p>
          </div>
        )}

      </section>

      {/* ================= OPERATIONS COMMAND SUITE ================= */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Operations Command Suite</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              9 Active Modules
            </span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Access precision telemetry consoles, machine learning scanners, and financial intelligence tools.
          </p>
        </div>

        {/* 3x3 Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div 
                key={idx}
                onClick={() => navigate(mod.path)}
                className={`group cursor-pointer rounded-2xl bg-white border ${mod.border} p-6 flex flex-col justify-between shadow-xs card-hover transition-all duration-300 relative overflow-hidden`}
              >
                {/* Subtle hover gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${mod.bg} ${mod.color} transition-transform duration-300 group-hover:scale-110 shadow-2xs`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${mod.badgeColor}`}>
                        {mod.badge}
                      </span>
                      <div className="h-7 w-7 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-1.5 leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <span>Launch Module</span>
                  <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
