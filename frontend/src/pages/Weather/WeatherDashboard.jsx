import React, { useState, useEffect } from 'react';
import { weatherService } from '../../api/weatherService';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  Sun, 
  CloudRain, 
  Compass, 
  AlertTriangle, 
  Calendar,
  Sparkles
} from 'lucide-react';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const district = user.district || 'Koppal';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await weatherService.getWeather(district);
        if (res.success) {
          setWeatherData(res.data);
        } else {
          setError(res.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [district]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Syncing climate telemetry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl text-center text-sm border border-rose-100 max-w-md mx-auto mt-10">
        {error}
      </div>
    );
  }

  const current = weatherData.current;
  const isRainy = current.rainfall > 20 || current.humidity > 80;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Weather Advisor</h1>
        <p className="text-sm text-slate-500 mt-2">
          Monitor real-time microclimate indicators and view specialized agricultural field advisories.
        </p>
      </div>

      {/* Main Glassmorphic Climate Header */}
      <div className={`relative overflow-hidden rounded-3xl shadow-2xl text-white p-8 ${
        isRainy 
          ? 'bg-gradient-to-br from-indigo-500 via-sky-600 to-indigo-800 shadow-indigo-500/20' 
          : 'bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 shadow-orange-500/20'
      }`}>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(current.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <h2 className="text-4xl font-black tracking-tight">{district} Climate</h2>
            <p className="text-white/80 text-sm font-semibold max-w-md leading-relaxed">
              Karnataka Regional Agricultural Meteorological Center telemetry.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-5xl font-black block tracking-tighter">{current.temperature}°C</span>
              <span className="text-xs font-bold text-white/70 tracking-wider uppercase block mt-1">Outdoor Temperature</span>
            </div>
            <div className="p-4 bg-white/25 rounded-2xl backdrop-blur-md border border-white/20">
              {isRainy ? <CloudRain className="h-12 w-12 text-blue-200" /> : <Sun className="h-12 w-12 text-yellow-300 animate-spin-slow" />}
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Banner Panel */}
      <div className={`p-6 rounded-3xl shadow-xl shadow-slate-200/50 flex gap-4 items-start border ${
        weatherData.advisory.includes('avoid') || weatherData.advisory.includes('High') 
          ? 'bg-amber-50 border-amber-200 text-amber-900 shadow-amber-500/5' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-emerald-500/5'
      }`}>
        <div className={`p-3 rounded-2xl shrink-0 ${
          weatherData.advisory.includes('avoid') || weatherData.advisory.includes('High') 
            ? 'bg-amber-100 text-amber-700' 
            : 'bg-emerald-100 text-emerald-700'
        }`}>
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider block opacity-70">Agricultural Safety Advisory</span>
          <p className="text-sm font-extrabold leading-relaxed">{weatherData.advisory}</p>
        </div>
      </div>

      {/* Climate Indicators Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white/95 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1.5 transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-sky-500">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dry/Wet</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
              <Thermometer className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block">{current.temperature}°C</span>
            <span className="text-xs font-semibold text-slate-450 mt-1 block">Temperature</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white/95 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-blue-500">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Moisture</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CloudRain className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-blue-600 block">{current.rainfall} mm</span>
            <span className="text-xs font-semibold text-slate-450 mt-1 block">Daily Rainfall</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white/95 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1.5 transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-teal-500">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Humidity</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Droplets className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-teal-600 block">{current.humidity}%</span>
            <span className="text-xs font-semibold text-slate-450 mt-1 block">Relative Humidity</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white/95 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-400/10 hover:-translate-y-1.5 transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-slate-500">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wind</span>
            <div className="p-2 bg-slate-100 text-slate-650 rounded-xl">
              <Wind className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800 block">{current.wind_speed} km/h</span>
            <span className="text-xs font-semibold text-slate-450 mt-1 block">Velocity & Vectors</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WeatherDashboard;
