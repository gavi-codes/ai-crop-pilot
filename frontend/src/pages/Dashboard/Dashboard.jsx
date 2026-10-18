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
  Award, 
  MessageSquare,
  Clock,
  Calendar,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Leaf,
  Check,
  LayoutGrid,
  ExternalLink
} from 'lucide-react';
import { advisorService } from '../../api/advisorService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const DEFAULT_RECOMMENDATION = {
    profile: {
      district: user?.district || 'Koppal',
      land_size: user?.land_size || 2.5,
      soil_type: user?.soil_type || 'Red Soil',
      soil_parameters: { nitrogen: 25, phosphorus: 15, potassium: 15, ph: 6.2, moisture: 35 }
    },
    weather: {
      temperature: 28,
      humidity: 68,
      rainfall: 12,
      condition: 'Partly Cloudy',
      advisory: 'Good conditions for crop growth'
    },
    crops: [
      { name: 'Maize', suitability: 'Optimal Vegetative Stage (94% Fit)' },
      { name: 'Groundnut', suitability: 'High Compatibility (Well-drained soil)' },
      { name: 'Paddy', suitability: 'Moist & Fertile Alluvial (96% Fit)' }
    ],
    fertilizer: {
      recommended_fertilizer: 'NPK (19:19:19)',
      quantity_per_acre: 50.0,
      total_quantity: Math.round(50 * (user?.land_size || 2.5)),
      days_to_apply: '7–10 days',
      reason: 'Optimal nitrogen and micronutrient replenishment for active vegetative stage.'
    },
    market: {
      crop: 'Maize',
      district: user?.district || 'Koppal',
      current_price: 1850.0,
      percentage_change: '+6.2%',
      trend: 'positive',
      forecast: [
        { day: 'Day 1', price: 1870.0 },
        { day: 'Day 2', price: 1910.0 },
        { day: 'Day 3', price: 1965.0 }
      ],
      recommendation: 'Market trend is positive'
    }
  };

  const fetchAdvisorData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await advisorService.getRecommendation();
      if (res && res.success && res.data) {
        setRecommendation(res.data);
      } else {
        setRecommendation(DEFAULT_RECOMMENDATION);
      }
    } catch (err) {
      console.warn("Dashboard recommendation notice:", err);
      setRecommendation(DEFAULT_RECOMMENDATION);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisorData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // 9 Module Cards for Operations Command Suite - Matching Reference Design
  const modules = [
    {
      title: 'Crop Health Scan',
      desc: 'Detect diseases, pests and stress using AI-powered image analysis.',
      path: '/disease',
      icon: Scan,
      badge: 'Active'
    },
    {
      title: 'Soil Diagnostics',
      desc: 'Analyze soil health, nutrients and pH for better decisions.',
      path: '/soil',
      icon: Sprout,
      badge: 'Ready'
    },
    {
      title: 'Fertilizer Planner',
      desc: 'Get personalized fertilizer recommendations for your crops.',
      path: '/fertilizer',
      icon: Droplet,
      badge: 'Recommended'
    },
    {
      title: 'Market Intelligence',
      desc: 'Track crop prices, market trends and best selling opportunities.',
      path: '/price',
      icon: TrendingUp,
      badge: 'Live'
    },
    {
      title: 'Weather Advisor',
      desc: 'Real-time weather updates and risk alerts for your farm.',
      path: '/weather',
      icon: CloudSun,
      badge: 'Active'
    },
    {
      title: 'Harvest Maturity',
      desc: 'Predict the right time for harvest and maximize your yield.',
      path: '/maturity',
      icon: Clock,
      badge: 'Monitoring'
    },
    {
      title: 'Smart Crop Calendar',
      desc: 'Plan your farming activities with AI-powered timelines.',
      path: '/calendar',
      icon: Calendar,
      badge: 'On Track'
    },
    {
      title: 'AgriBot Assistant',
      desc: 'Ask questions, get instant advice and expert guidance.',
      path: '/chat',
      icon: MessageSquare,
      badge: 'Online'
    },
    {
      title: 'Government Schemes',
      desc: 'Explore subsidies, loans and latest government schemes.',
      path: '/schemes',
      icon: Award,
      badge: 'Updated'
    },
  ];

  // Visual Agriculture Portfolio items with high-resolution crop imagery
  const cropPortfolio = [
    {
      name: 'Maize (Yellow Corn)',
      variety: 'Kaveri 50 Super',
      season: 'Kharif 2025',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80',
      status: 'Healthy (94%)',
      stage: 'Grain Filling',
      acreage: `${(user?.land_size ? (user.land_size * 0.48).toFixed(1) : '1.2')} Acres`,
      harvestDays: '22 Days to Harvest'
    },
    {
      name: 'Paddy (Rice)',
      variety: 'Sona Masuri',
      season: 'Kharif 2025',
      image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&q=80',
      status: 'Optimal (96%)',
      stage: 'Panicle Initiation',
      acreage: `${(user?.land_size ? (user.land_size * 0.32).toFixed(1) : '0.8')} Acres`,
      harvestDays: '38 Days to Harvest'
    },
    {
      name: 'Cotton',
      variety: 'Bt Cotton RCH-2',
      season: 'Kharif 2025',
      image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&q=80',
      status: 'Monitored (91%)',
      stage: 'Boll Development',
      acreage: `${(user?.land_size ? (user.land_size * 0.20).toFixed(1) : '0.5')} Acres`,
      harvestDays: '45 Days to Harvest'
    },
    {
      name: 'Groundnut (Peanut)',
      variety: 'TMV-2 Drought Fit',
      season: 'Rabi Pre-Sow',
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&q=80',
      status: 'Vigorous (93%)',
      stage: 'Flowering & Pegging',
      acreage: 'Intercrop Buffer',
      harvestDays: '60 Days to Harvest'
    }
  ];

  return (
    <div className="p-6 lg:p-10 space-y-9 max-w-7xl mx-auto font-sans bg-[#F8FAFC]">
      
      {/* ================= WELCOME BANNER (PRESERVED GREEN IDENTITY WITH AGRICULTURAL LANDSCAPE) ================= */}
      <div 
        className="relative overflow-hidden rounded-3xl p-7 lg:p-9 shadow-lg border border-emerald-950/20 text-white"
        style={{
          background: "linear-gradient(to right, #06281E 0%, #0B3D2E 48%, rgba(11, 61, 46, 0.45) 100%), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80') right center / cover no-repeat"
        }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2.5 max-w-xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || 'Ramesh Kumar'}!
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base font-normal leading-relaxed">
              Let's make your farm more productive, profitable and sustainable with AI.
            </p>
          </div>

          {/* Quick Farm Telemetry Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 bg-white/95 text-slate-800 p-2 sm:p-2.5 rounded-2xl border border-white/20 shadow-lg backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-2 border-r border-slate-200/80">
              <div className="h-8 w-8 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                <Sprout className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">My Farm</span>
                <span className="text-xs font-black text-slate-900 block">{user?.land_size || '12.5'} Acres</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 border-r border-slate-200/80">
              <div className="h-8 w-8 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                <Leaf className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Crop</span>
                <span className="text-xs font-black text-slate-900 block">Maize</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 border-r border-slate-200/80">
              <div className="h-8 w-8 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Season</span>
                <span className="text-xs font-black text-slate-900 block">Kharif 2025</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/soil')}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-[#14532D] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-slate-200 shadow-2xs"
            >
              <span>View Farm Details</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#16A34A]" />
            </button>
          </div>

        </div>
      </div>

      {/* ================= AUTONOMOUS AGRONOMY ADVISOR (CLEAN MINIMAL PREMIUM GREEN DESIGN) ================= */}
      <section className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs">
        
        {/* Advisor Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A] font-extrabold text-sm shrink-0">
              Ai
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1F2937] tracking-tight">
                Autonomous Agronomy Advisor
              </h2>
              <p className="text-xs font-medium text-[#64748B] mt-0.5">
                AI-driven insights for better decisions and higher yields
              </p>
            </div>
          </div>

          <button 
            onClick={fetchAdvisorData} 
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F8FAFC] text-[#1F2937] rounded-xl text-xs font-bold border border-[#E2E8F0] hover:border-[#16A34A] transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#16A34A] ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Recalculating...' : 'Recalculate Diagnostics'}</span>
          </button>
        </div>

        {/* 4 Advisor Sub-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
          
          {/* 1. Climate & Weather */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col justify-between shadow-2xs transition-all duration-200 hover:border-[#16A34A] hover:shadow-[0_4px_16px_rgba(22,163,74,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <CloudSun className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Climate & Weather</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] text-[10px] font-bold">
                  Favorable
                </span>
              </div>

              <div className="mt-2">
                <p className="text-3xl font-black text-[#1F2937] tracking-tight">
                  {recommendation?.weather?.temperature || 28}°C
                </p>
                <p className="text-xs text-[#64748B] font-medium mt-0.5">
                  Partly Cloudy
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-medium text-[#1F2937]">
                <div className="flex items-center gap-1.5">
                  <Droplet className="h-3.5 w-3.5 text-[#16A34A]" />
                  <span>Humidity: <strong>{recommendation?.weather?.humidity || 68}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CloudSun className="h-3.5 w-3.5 text-[#16A34A]" />
                  <span>Rainfall (7d): <strong>{recommendation?.weather?.rainfall || 12} mm</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] text-[11px] font-semibold p-2.5 rounded-xl text-center">
                Good conditions for crop growth
              </div>
            </div>
          </div>

          {/* 2. Crop Health */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col justify-between shadow-2xs transition-all duration-200 hover:border-[#16A34A] hover:shadow-[0_4px_16px_rgba(22,163,74,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <Leaf className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Crop Health</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] text-[10px] font-bold">
                  Healthy
                </span>
              </div>

              {/* Circular Gauge & Checklist */}
              <div className="flex items-center gap-4 mt-3">
                {/* SVG Progress Donut */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#E2E8F0]"
                      strokeWidth="3.2"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#16A34A]"
                      strokeDasharray="92, 100"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-[#1F2937]">92%</span>
                </div>

                {/* Health Indicators */}
                <div className="space-y-1.5 text-xs font-medium text-[#1F2937]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                    <span>No disease detected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                    <span>Good crop vigor</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                    <span>Normal leaf color</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
              <span>Field Surveillance:</span>
              <span className="font-bold text-[#15803D]">Continuous Active</span>
            </div>
          </div>

          {/* 3. Fertilizer Recommendation */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col justify-between shadow-2xs transition-all duration-200 hover:border-[#16A34A] hover:shadow-[0_4px_16px_rgba(22,163,74,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <Droplet className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Fertilizer Recommendation</h3>
                </div>
              </div>

              <div className="mt-1">
                <h4 className="text-base font-extrabold text-[#1F2937]">
                  {recommendation?.fertilizer?.recommended_fertilizer || 'NPK (19:19:19)'}
                </h4>
                <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Recommended Dose</p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-xl font-black text-[#1F2937]">
                    {recommendation?.fertilizer?.quantity_per_acre || 50} kg/acre
                  </span>
                  <span className="text-xs text-[#64748B] font-semibold">
                    (Total: {recommendation?.fertilizer?.total_quantity || 125} kg)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button 
                onClick={() => navigate('/fertilizer')}
                className="w-full py-2 px-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Apply in 7–10 days</span>
              </button>
            </div>
          </div>

          {/* 4. Price Forecast */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col justify-between shadow-2xs transition-all duration-200 hover:border-[#16A34A] hover:shadow-[0_4px_16px_rgba(22,163,74,0.06)]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <TrendingUp className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1F2937]">Price Forecast</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] text-[10px] font-bold">
                  Positive
                </span>
              </div>

              <div className="mt-1">
                <p className="text-xs font-bold text-[#1F2937]">
                  {recommendation?.market?.crop || 'Maize'}
                </p>
                <p className="text-[11px] text-[#64748B] font-medium mt-0.5">Expected Price (Next 30 days)</p>
                
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-[#1F2937]">
                      ₹ {recommendation?.market?.current_price || '1,850'}
                    </span>
                    <span className="text-[11px] text-[#64748B]">/quintal</span>
                  </div>

                  {/* Upward Mini Sparkline SVG */}
                  <svg className="w-14 h-7 shrink-0" viewBox="0 0 60 28" fill="none">
                    <path
                      d="M2 24 L14 18 L28 20 L42 10 L58 4"
                      stroke="#16A34A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#16A34A] flex items-center gap-1">
                <span>↑ +6.2%</span>
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">Market trend is positive</span>
            </div>
          </div>

        </div>

      </section>

      {/* ================= OPERATIONS COMMAND SUITE (PREMIUM 3X3 WHITE GRID WITH SUBTLE EMERALD HOVER) ================= */}
      <div className="space-y-5">
        
        {/* Section Header */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 border border-[#DCFCE7]">
            <LayoutGrid className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1F2937] tracking-tight">
              Operations Command Suite
            </h2>
            <p className="text-xs font-medium text-[#64748B]">
              Everything you need to manage your farm, powered by AI
            </p>
          </div>
        </div>

        {/* 3x3 Grid of 9 Clean White Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div 
                key={idx}
                tabIndex={0}
                role="button"
                onClick={() => navigate(mod.path)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(mod.path);
                  }
                }}
                className="group relative bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 flex flex-col justify-between shadow-2xs transition-all duration-200 ease-out cursor-pointer hover:border-[#16A34A] hover:shadow-[0_10px_25px_-5px_rgba(22,163,74,0.12),0_8px_10px_-6px_rgba(22,163,74,0.06)] hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 select-none"
              >
                {/* Card Top: Icon, Title & Badge */}
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#F0FDF4] group-hover:bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 transition-colors duration-200 border border-[#DCFCE7]/70">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-[#1F2937] group-hover:text-[#14532D] transition-colors duration-200">
                        {mod.title}
                      </h3>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] shrink-0">
                      {mod.badge}
                    </span>
                  </div>

                  {/* Card Description */}
                  <p className="text-xs font-medium text-[#64748B] leading-relaxed pl-0.5">
                    {mod.desc}
                  </p>
                </div>

                {/* Card Bottom: Navigation Arrow Indicator */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0]/60 flex items-center justify-end">
                  <div className="h-7 w-7 rounded-lg bg-slate-50 group-hover:bg-[#F0FDF4] flex items-center justify-center text-slate-400 group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all duration-200">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= COLORFUL AGRICULTURAL IMAGES SECTION: ACTIVE FIELD PORTFOLIO ================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 border border-[#DCFCE7]">
              <Leaf className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1F2937] tracking-tight">
                Active Crop Portfolio & Field Imagery
              </h2>
              <p className="text-xs font-medium text-[#64748B]">
                High-resolution satellite & close-up crop telemetry across your registered land
              </p>
            </div>
          </div>

          <span className="self-start sm:self-auto text-xs font-bold text-[#16A34A] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#DCFCE7]">
            4 Monitored Crops
          </span>
        </div>

        {/* 4 Colorful High-Resolution Agricultural Crop Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cropPortfolio.map((crop, idx) => (
            <div 
              key={idx}
              className="group bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:border-[#16A34A] hover:shadow-[0_8px_20px_rgba(22,163,74,0.1)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              onClick={() => navigate('/disease')}
            >
              <div>
                {/* Real High-Resolution Agriculture Photo */}
                <div className="h-40 w-full overflow-hidden relative bg-slate-100">
                  <img 
                    src={crop.image} 
                    alt={crop.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black text-[#14532D] shadow-xs">
                    {crop.season}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-bold shadow-xs">
                    {crop.status}
                  </div>
                </div>

                {/* Crop Specs */}
                <div className="p-4 space-y-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1F2937] group-hover:text-[#16A34A] transition-colors">
                      {crop.name}
                    </h3>
                    <p className="text-[11px] text-[#64748B] font-medium">
                      {crop.variety} • {crop.acreage}
                    </p>
                  </div>

                  <div className="pt-1.5 flex items-center justify-between text-xs text-[#1F2937]">
                    <span className="text-[11px] text-[#64748B]">Growth Stage:</span>
                    <span className="font-bold text-[#14532D]">{crop.stage}</span>
                  </div>

                  {/* Growth Progress Bar */}
                  <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 mt-2 overflow-hidden">
                    <div 
                      className="bg-[#16A34A] h-1.5 rounded-full" 
                      style={{ width: `${85 - idx * 12}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="px-4 pb-3.5 pt-1 text-[11px] font-bold text-[#16A34A] flex items-center justify-between group-hover:underline">
                <span>{crop.harvestDays}</span>
                <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
