import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, CloudSun, TrendingUp, Scan, Droplet, Sparkles, ChevronRight, Thermometer, MapPin, Info, RefreshCw, Gauge, Award, MessageSquare
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

  const modules = [
    {
      title: 'Soil Analysis',
      desc: 'Check macro-nutrients & pH balance',
      path: '/soil',
      colorClass: 'text-[#16A34A]',
      bgClass: 'bg-[#DCFCE7]',
      shadowClass: 'hover:shadow-[#16A34A]/20 hover:shadow-lg',
      icon: Sprout,
    },
    {
      title: 'Fertilizers',
      desc: 'Calculate growth stage recommendations',
      path: '/fertilizer',
      colorClass: 'text-[#EAB308]',
      bgClass: 'bg-[#FEF9C3]',
      shadowClass: 'hover:shadow-[#EAB308]/20 hover:shadow-lg',
      icon: Droplet,
    },
    {
      title: 'Crop Disease Scan',
      desc: 'Diagnose leaf infections instantly',
      path: '/disease',
      colorClass: 'text-[#F97316]',
      bgClass: 'bg-[#FFEDD5]',
      shadowClass: 'hover:shadow-[#F97316]/20 hover:shadow-lg',
      icon: Scan,
    },
    {
      title: 'Market Prices',
      desc: 'AI wholesale forecasts & sentiment',
      path: '/price',
      colorClass: 'text-[#2563EB]',
      bgClass: 'bg-[#DBEAFE]',
      shadowClass: 'hover:shadow-[#2563EB]/20 hover:shadow-lg',
      icon: TrendingUp,
    },
    {
      title: 'Weather Forecast',
      desc: 'Localized conditions & farm alerts',
      path: '/weather',
      colorClass: 'text-[#2563EB]',
      bgClass: 'bg-[#DBEAFE]',
      shadowClass: 'hover:shadow-[#2563EB]/20 hover:shadow-lg',
      icon: CloudSun,
    },
    {
      title: 'Agri-bot Assistant',
      desc: 'Conversational voice crop guide',
      path: '/chat',
      colorClass: 'text-[#7C3AED]',
      bgClass: 'bg-[#EDE9FE]',
      shadowClass: 'hover:shadow-[#7C3AED]/20 hover:shadow-lg',
      icon: MessageSquare,
    },
    {
      title: 'Government Schemes',
      desc: 'Eligible central & state programs',
      path: '/schemes',
      colorClass: 'text-[#16A34A]',
      bgClass: 'bg-[#DCFCE7]',
      shadowClass: 'hover:shadow-[#16A34A]/20 hover:shadow-lg',
      icon: Award,
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Pilot Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 shadow-md border border-black/5" style={{ background: 'linear-gradient(to right, #0B3D2E, #16A34A)' }}>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Good Morning, {user?.name || 'Farmer'} 👋
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl font-medium">
              AI CropPilot is monitoring your farm conditions and preparing intelligent recommendations.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-5 py-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm text-white">
              <span className="text-[11px] uppercase font-bold text-white/60 block tracking-wider">Location</span>
              <span className="font-bold">{user?.district || 'Karnataka'}</span>
            </div>
            <div className="px-5 py-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm text-white">
              <span className="text-[11px] uppercase font-bold text-white/60 block tracking-wider">Farm Size</span>
              <span className="font-bold">{user?.land_size || '0'} Acres</span>
            </div>
          </div>
        </div>
      </div>

      {/* Farm Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Soil Health', value: recommendation ? `pH ${recommendation.profile.soil_parameters.ph}` : '--', icon: Sprout, color: '#16A34A', bg: '#DCFCE7' },
          { label: 'Temperature', value: recommendation ? `${recommendation.weather.temperature}°C` : '--', icon: Thermometer, color: '#F97316', bg: '#FFEDD5' },
          { label: 'Humidity', value: recommendation ? `${recommendation.weather.humidity}%` : '--', icon: Droplet, color: '#2563EB', bg: '#DBEAFE' },
          { label: 'Market Trend', value: recommendation ? (recommendation.market?.forecast?.[0]?.price > recommendation.market?.current_price ? 'Bullish' : 'Bearish') : '--', icon: TrendingUp, color: '#7C3AED', bg: '#EDE9FE' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">{stat.label}</span>
                <span className="text-lg font-bold text-[#17221D]">{stat.value}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* One-Click Smart Advisor Hub */}
      <section className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-[#17221D] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#16A34A]" />
              Smart Crop & Fertilizer Advisor
            </h2>
            <p className="text-xs text-[#64748B] mt-1 font-medium">Aggregates weather, profile values, and soil parameters automatically</p>
          </div>
          <button 
            onClick={fetchAdvisorData} 
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#F7FAF8] hover:bg-[#DCFCE7] text-[#16A34A] rounded-xl text-xs font-bold transition-all disabled:opacity-50 border border-slate-100"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="h-10 w-10 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-[#64748B] animate-pulse">Running diagnostic checks...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 rounded-2xl text-center border border-rose-100 flex flex-col items-center justify-center gap-3">
            <p className="text-rose-600 text-sm font-semibold">{error}</p>
            <button onClick={fetchAdvisorData} className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm">
              Retry
            </button>
          </div>
        ) : recommendation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Live Weather Conditions */}
            <div className="bg-white border border-[#2563EB]/20 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#2563EB] tracking-wider">Live Conditions</span>
                <h3 className="text-base font-bold text-[#17221D] mt-1 mb-3 flex items-center gap-1.5">
                  <CloudSun className="h-4 w-4 text-[#2563EB]" />
                  Local Weather
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-[#DBEAFE]/50 p-3 rounded-xl border border-[#2563EB]/10">
                    <span className="text-[10px] font-semibold text-[#64748B] block">Temperature</span>
                    <span className="text-base font-bold text-[#17221D]">{recommendation.weather.temperature}°C</span>
                  </div>
                  <div className="bg-[#DBEAFE]/50 p-3 rounded-xl border border-[#2563EB]/10">
                    <span className="text-[10px] font-semibold text-[#64748B] block">Humidity</span>
                    <span className="text-base font-bold text-[#17221D]">{recommendation.weather.humidity}%</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#DBEAFE]/60 border border-[#2563EB]/20 p-3 rounded-xl mt-3">
                <span className="text-[10px] font-bold text-[#2563EB] uppercase block mb-1">Advisory</span>
                <p className="text-xs text-[#17221D] leading-relaxed font-medium">{recommendation.weather.advisory}</p>
              </div>
            </div>

            {/* 2. Suitable Crops */}
            <div className="bg-white border border-[#16A34A]/20 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#16A34A] tracking-wider">Recommendations</span>
                <h3 className="text-base font-bold text-[#17221D] mt-1 mb-3 flex items-center gap-1.5">
                  <Sprout className="h-4 w-4 text-[#16A34A]" />
                  Crops to Plant
                </h3>
                <div className="space-y-2">
                  {recommendation.crops.map((crop, idx) => (
                    <div key={idx} className="bg-[#DCFCE7]/50 p-3 rounded-xl border border-[#16A34A]/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#17221D] block text-sm">{crop.name}</span>
                        <span className="text-[10px] font-medium text-[#64748B] block mt-0.5 truncate max-w-[140px]">{crop.suitability}</span>
                      </div>
                      <span className="text-[10px] bg-[#16A34A] text-white font-bold px-2 py-1 rounded-md shrink-0">High Match</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-[10px] text-[#64748B] leading-relaxed flex gap-1.5 items-start bg-[#F7FAF8] p-2 rounded-lg">
                <Info className="h-3.5 w-3.5 text-[#16A34A] shrink-0" />
                <span>Computed utilizing soil parameters for <strong>{recommendation.profile.soil_type}</strong>.</span>
              </div>
            </div>

            {/* 3. Personalized Fertilizer Prescription */}
            <div className="bg-white border border-[#EAB308]/30 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#EAB308] tracking-wider">Prescription</span>
                <h3 className="text-base font-bold text-[#17221D] mt-1 mb-3 flex items-center gap-1.5">
                  <Droplet className="h-4 w-4 text-[#EAB308]" />
                  Fertilizer Output
                </h3>
                <div className="bg-[#FEF9C3]/50 p-4 rounded-xl border border-[#EAB308]/20 text-center mb-3">
                  <span className="text-[11px] font-semibold text-[#64748B] block mb-1">Recommended Product</span>
                  <span className="text-lg font-bold text-[#17221D] block">{recommendation.fertilizer.recommended_fertilizer}</span>
                </div>
              </div>
              <div className="space-y-2 mt-auto">
                <div className="flex justify-between text-xs py-1.5 border-b border-slate-100">
                  <span className="text-[#64748B] font-medium">Quantity per Acre:</span>
                  <span className="font-bold text-[#17221D]">{recommendation.fertilizer.quantity_per_acre} kg</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-[#64748B] font-bold">Total ({recommendation.profile.land_size} ac):</span>
                  <span className="font-bold text-[#EAB308]">{recommendation.fertilizer.total_quantity} kg</span>
                </div>
                <div className="text-[10px] text-[#17221D] bg-[#FEF9C3]/80 p-2 rounded-lg text-center font-medium">
                  {recommendation.fertilizer.reason}
                </div>
              </div>
            </div>

            {/* 4. Live Crop Market Advice */}
            <div className="bg-white border border-[#7C3AED]/20 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7C3AED] tracking-wider">Live Market Advisor</span>
                <h3 className="text-base font-bold text-[#17221D] mt-1 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-[#7C3AED]" />
                  Wholesale Advisor
                </h3>
                {recommendation.market && recommendation.market.current_price ? (
                  <div className="bg-[#EDE9FE]/50 p-4 rounded-xl border border-[#7C3AED]/10 text-center mb-3">
                    <span className="text-[11px] font-bold text-[#64748B] block mb-1">
                      {recommendation.market.crop}
                    </span>
                    <span className="text-lg font-bold text-[#17221D] block">
                      ₹{recommendation.market.current_price}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-semibold block mt-0.5">/ Quintal</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mt-2 ${
                      recommendation.market.forecast[0]?.price > recommendation.market.current_price
                        ? 'bg-[#DCFCE7] text-[#16A34A]'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {recommendation.market.forecast[0]?.price > recommendation.market.current_price
                        ? 'Bullish (Hold)'
                        : 'Bearish (Sell)'}
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-6 text-[#64748B] text-xs font-medium">
                    No market details loaded.
                  </div>
                )}
              </div>
              <div className="text-[10px] text-[#17221D] bg-[#EDE9FE]/70 border border-[#7C3AED]/10 p-2.5 rounded-xl text-center font-medium leading-relaxed mt-auto">
                {recommendation.market && recommendation.market.forecast && recommendation.market.forecast[0]?.price > recommendation.market.current_price
                  ? `${recommendation.market.crop} price is predicted to rise to ₹${recommendation.market.forecast[0]?.price} next month. Advice: Hold.`
                  : `${recommendation.market?.crop || 'Crop'} price is predicted to trend down. Advice: Liquidate.`}
              </div>
            </div>
            
          </div>
        ) : (
          <div className="text-center py-10 bg-[#F7FAF8] rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="h-8 w-8 text-slate-300 mx-auto mb-3" />
            <p className="text-[#64748B] text-sm font-medium">Click refresh to load your smart farm insights.</p>
          </div>
        )}
      </section>

      {/* Navigation Control Modules */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#17221D] tracking-tight flex items-center gap-2">
              Operations Command
            </h2>
            <p className="text-xs font-semibold text-[#64748B] mt-1">Select a module to initiate task</p>
          </div>
        </div>
        
        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div 
                key={idx}
                onClick={() => navigate(mod.path)}
                className={`group cursor-pointer rounded-[20px] bg-white border border-slate-100 transition-all duration-300 hover:-translate-y-1 ${mod.shadowClass} p-5 flex flex-col shadow-sm`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`h-11 w-11 rounded-[14px] flex items-center justify-center ${mod.bgClass} ${mod.colorClass} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-[#F7FAF8] flex items-center justify-center group-hover:bg-slate-100 transition-colors duration-300">
                    <ChevronRight className="h-4 w-4 text-[#64748B]" />
                  </div>
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-lg font-bold text-[#17221D] tracking-tight transition-colors duration-300">
                    {mod.title}
                  </h3>
                  <p className="text-xs font-medium text-[#64748B] mt-1.5 leading-relaxed">
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
