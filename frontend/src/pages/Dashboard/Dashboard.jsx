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
  MessageSquare
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
      setError(err.response?.data?.message || 'Failed to fetch recommendation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisorData();
  }, []);

  const modules = [
    {
      title: 'Soil Analysis',
      desc: 'Check macro-nutrients & pH balance',
      path: '/soil',
      color: 'from-emerald-500 to-teal-500',
      lightColor: 'from-emerald-50 to-teal-50/30',
      textColor: 'text-emerald-700',
      hoverShadow: 'hover:shadow-emerald-500/20',
      borderColor: 'border-emerald-100',
      icon: Sprout,
    },
    {
      title: 'Fertilizers',
      desc: 'Calculate growth stage recommendations',
      path: '/fertilizer',
      color: 'from-blue-500 to-indigo-500',
      lightColor: 'from-blue-50 to-indigo-50/30',
      textColor: 'text-blue-700',
      hoverShadow: 'hover:shadow-blue-500/20',
      borderColor: 'border-blue-100',
      icon: Droplet,
    },
    {
      title: 'Crop Disease Scan',
      desc: 'Diagnose leaf infections instantly',
      path: '/disease',
      color: 'from-amber-500 to-orange-500',
      lightColor: 'from-amber-50 to-orange-50/30',
      textColor: 'text-amber-700',
      hoverShadow: 'hover:shadow-amber-500/20',
      borderColor: 'border-amber-100',
      icon: Scan,
    },
    {
      title: 'Market Prices',
      desc: 'AI wholesale forecasts & sentiment',
      path: '/price',
      color: 'from-purple-500 to-violet-500',
      lightColor: 'from-purple-50 to-violet-50/30',
      textColor: 'text-purple-700',
      hoverShadow: 'hover:shadow-purple-500/20',
      borderColor: 'border-purple-100',
      icon: TrendingUp,
    },
    {
      title: 'Weather Forecast',
      desc: 'Localized conditions & farm alerts',
      path: '/weather',
      color: 'from-sky-500 to-cyan-500',
      lightColor: 'from-sky-50 to-cyan-50/30',
      textColor: 'text-sky-700',
      hoverShadow: 'hover:shadow-sky-500/20',
      borderColor: 'border-sky-100',
      icon: CloudSun,
    },
    {
      title: 'Agri-bot Assistant',
      desc: 'Conversational voice crop guide',
      path: '/chat',
      color: 'from-teal-500 to-emerald-600',
      lightColor: 'from-teal-50 to-emerald-50/30',
      textColor: 'text-teal-700',
      hoverShadow: 'hover:shadow-teal-500/20',
      borderColor: 'border-teal-100',
      icon: MessageSquare,
    },
    {
      title: 'Government Schemes',
      desc: 'Eligible central & state programs',
      path: '/schemes',
      color: 'from-orange-500 to-amber-500',
      lightColor: 'from-orange-50 to-amber-50/30',
      textColor: 'text-orange-700',
      hoverShadow: 'hover:shadow-orange-500/20',
      borderColor: 'border-orange-100',
      icon: Award,
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Pilot Welcome Banner */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-900/10 border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/30">
              <Sparkles className="h-3 w-3" />
              Pilot Active
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Welcome Back, {user?.name || 'Farmer'}
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              AI CropPilot has aggregated your local weather data for <span className="text-emerald-400 font-semibold">{user?.district}</span> and loaded your default profile settings. No manual updates needed.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-3 bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">District</span>
              <span className="font-bold text-slate-200">{user?.district || 'Karnataka'}</span>
            </div>
            <div className="px-4 py-3 bg-slate-800/80 backdrop-blur rounded-2xl border border-slate-700/50">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Farm Size</span>
              <span className="font-bold text-emerald-400">{user?.land_size || '0'} Acres</span>
            </div>
          </div>
        </div>
      </div>

      {/* One-Click Smart Advisor Hub */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              One-Click Smart Crop & Fertilizer Advisor
            </h2>
            <p className="text-xs text-slate-500 mt-1">Aggregates weather, profile values, and soil parameters automatically</p>
          </div>
          <button 
            onClick={fetchAdvisorData} 
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-250 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-slate-500 animate-pulse">Running diagnostic checks...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-center text-sm border border-rose-100">
            {error}
          </div>
        ) : recommendation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Live Weather Conditions */}
            <div className="bg-gradient-to-br from-sky-400 to-blue-650 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/35 hover:-translate-y-1.5 transition-all duration-305 rounded-3xl p-6 flex flex-col justify-between border border-blue-400/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-100 tracking-wider">Live Conditions</span>
                <h3 className="text-lg font-extrabold text-white mt-1 mb-4 flex items-center gap-2">
                  <CloudSun className="h-5 w-5 text-white" />
                  Local Weather
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] font-semibold text-blue-100 block">Temperature</span>
                    <span className="text-lg font-extrabold text-white">{recommendation.weather.temperature}°C</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                    <span className="text-[10px] font-semibold text-blue-100 block">Humidity</span>
                    <span className="text-lg font-extrabold text-white">{recommendation.weather.humidity}%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/15 border border-white/10 p-3.5 rounded-xl">
                <span className="text-[10px] font-bold text-blue-100 uppercase block mb-1">Advisory</span>
                <p className="text-xs text-white leading-relaxed font-semibold">{recommendation.weather.advisory}</p>
              </div>
            </div>

            {/* 2. Suitable Crops */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/35 hover:-translate-y-1.5 transition-all duration-305 rounded-3xl p-6 flex flex-col justify-between border border-emerald-400/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Recommendations</span>
                <h3 className="text-lg font-extrabold text-white mt-1 mb-4 flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-white" />
                  Crops to Plant
                </h3>
                
                <div className="space-y-3">
                  {recommendation.crops.map((crop, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block text-sm">{crop.name}</span>
                        <span className="text-[10px] font-semibold text-emerald-100 block mt-0.5">{crop.suitability}</span>
                      </div>
                      <span className="text-xs bg-white/20 text-white font-bold px-2 py-1 rounded-lg">High Match</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-[10px] text-emerald-100 leading-relaxed flex gap-1.5 items-start">
                <Info className="h-3.5 w-3.5 text-emerald-200 shrink-0 mt-0.5" />
                <span>Computed utilizing soil parameters for <strong>{recommendation.profile.soil_type}</strong> (pH: {recommendation.profile.soil_parameters.ph}).</span>
              </div>
            </div>

            {/* 3. Personalized Fertilizer Prescription */}
            <div className="bg-gradient-to-br from-indigo-500 via-indigo-650 to-purple-805 text-white shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/35 hover:-translate-y-1.5 transition-all duration-305 rounded-3xl p-6 flex flex-col justify-between border border-indigo-400/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-100 tracking-wider">Prescription</span>
                <h3 className="text-lg font-extrabold text-white mt-1 mb-4 flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-white" />
                  Fertilizer Output
                </h3>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center mb-3">
                  <span className="text-xs font-semibold text-indigo-150 block mb-1">Recommended Product</span>
                  <span className="text-xl font-black text-white block">{recommendation.fertilizer.recommended_fertilizer}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs py-1.5 border-b border-white/10">
                  <span className="text-indigo-100 font-medium">Quantity per Acre:</span>
                  <span className="font-bold text-white">{recommendation.fertilizer.quantity_per_acre} kg</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-indigo-100 font-extrabold">Total Needed ({recommendation.profile.land_size} ac):</span>
                  <span className="font-black text-white bg-white/20 px-2 py-0.5 rounded-lg">{recommendation.fertilizer.total_quantity} kg</span>
                </div>
                <div className="text-[10px] text-indigo-100 bg-white/10 backdrop-blur-md border border-white/10 p-2 rounded-lg text-center font-medium">
                  {recommendation.fertilizer.reason}
                </div>
              </div>
            </div>

            {/* 4. Live Crop Market Advice (Trained RF Model) */}
            <div className="bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-700 text-white shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/35 hover:-translate-y-1.5 transition-all duration-305 rounded-3xl p-6 flex flex-col justify-between border border-purple-400/20">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-100 tracking-wider">Live Market Advisor</span>
                <h3 className="text-lg font-extrabold text-white mt-1 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                  Wholesale Advisor
                </h3>

                {recommendation.market && recommendation.market.current_price ? (
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center mb-3">
                    <span className="text-xs font-bold text-purple-100 block mb-1">
                      {recommendation.market.crop} (Trained model)
                    </span>
                    <span className="text-xl font-black text-white block">
                      ₹{recommendation.market.current_price}
                    </span>
                    <span className="text-[10px] text-purple-200 font-semibold block mt-0.5">/ Quintal</span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full inline-block mt-3 bg-white/20 text-white shadow`}>
                      {recommendation.market.forecast[0]?.price > recommendation.market.current_price
                        ? '📈 Bullish (Hold Crop)'
                        : '📉 Bearish (Sell Now)'}
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-6 text-white/75 text-xs font-semibold">
                    No market details loaded.
                  </div>
                )}
              </div>

              <div className="text-[10px] text-purple-100 bg-white/10 border border-white/10 p-2.5 rounded-xl text-center font-medium leading-relaxed">
                {recommendation.market && recommendation.market.forecast && recommendation.market.forecast[0]?.price > recommendation.market.current_price
                  ? `${recommendation.market.crop} price is predicted to rise to ₹${recommendation.market.forecast[0]?.price} next month. Advice: Hold.`
                  : `${recommendation.market?.crop || 'Crop'} price is predicted to trend down. Advice: Liquidate.`}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm">
            Click pilot diagnosis check-up to fetch calculations.
          </div>
        )}
      </section>

      {/* Navigation Control Modules */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-5">Manual Control Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div 
                key={idx}
                onClick={() => navigate(mod.path)}
                className={`group bg-gradient-to-br ${mod.lightColor} hover:from-slate-950 hover:to-slate-850 border ${mod.borderColor} hover:border-slate-800 hover:text-white shadow-sm hover:shadow-2xl ${mod.hoverShadow} hover:-translate-y-1.5 transition-all duration-300 cursor-pointer p-6 rounded-3xl flex flex-col justify-between h-48`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className={`p-3 bg-gradient-to-tr ${mod.color} rounded-xl text-white shadow-lg shadow-slate-900/5 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="p-1 rounded-lg bg-white/60 group-hover:bg-white/10 text-slate-400 group-hover:text-white transition-colors border border-white/20">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-950 group-hover:text-emerald-400 transition-colors text-base">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 group-hover:text-slate-300 mt-1 leading-relaxed font-semibold">
                    {mod.desc}
                  </p>
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
