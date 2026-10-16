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
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Gauge
} from 'lucide-react';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const district = user.district || 'Koppal';

  const fetchWeather = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchWeather();
  }, [district]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-600 animate-pulse">Syncing meteorological telemetry for {district}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 text-rose-700 rounded-3xl text-center text-sm border border-rose-200 max-w-lg mx-auto mt-12 font-bold">
        {error}
      </div>
    );
  }

  const current = weatherData.current;
  const isRainy = current.rainfall > 20 || current.humidity > 80;

  // Spray Window Calculation
  const isSpraySafe = current.wind_speed < 15 && current.rainfall < 5;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2 border border-amber-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Hyper-Local Microclimate Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Weather & Climate Advisor
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 max-w-2xl">
            Real-time atmospheric monitoring, rain accumulation telemetry, and pesticide spray timing windows calibrated for {district} district.
          </p>
        </div>

        <button 
          onClick={fetchWeather}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Update Forecast</span>
        </button>
      </div>

      {/* Atmospheric Hero Card */}
      <div className={`relative overflow-hidden rounded-3xl shadow-xl text-white p-8 sm:p-10 ${
        isRainy 
          ? 'bg-gradient-to-br from-indigo-950 via-sky-900 to-indigo-900 border border-sky-800' 
          : 'bg-gradient-to-br from-[#0B3D2E] via-emerald-800 to-teal-900 border border-emerald-700'
      }`}>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(current.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">{district} Sky Conditions</h2>
            <p className="text-white/80 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
              Karnataka Regional Agricultural Meteorological Network telemetry feeding real-time transpiration calculations.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white/10 p-5 rounded-3xl border border-white/20 backdrop-blur-md shrink-0">
            <div className="text-right">
              <span className="text-5xl sm:text-6xl font-black block tracking-tighter leading-none">{current.temperature}°C</span>
              <span className="text-[11px] font-extrabold text-white/80 tracking-wider uppercase block mt-1.5">Ambient Air Temp</span>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl">
              {isRainy ? <CloudRain className="h-12 w-12 text-sky-200" /> : <Sun className="h-12 w-12 text-amber-300 animate-spin-slow" />}
            </div>
          </div>
        </div>
      </div>

      {/* Agricultural Safety Advisory Banner */}
      <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${
        weatherData.advisory.includes('avoid') || weatherData.advisory.includes('High') 
          ? 'bg-amber-50/90 border-amber-200 text-amber-950' 
          : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${
            weatherData.advisory.includes('avoid') || weatherData.advisory.includes('High') 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest block opacity-70">
              Field Operations Advisory
            </span>
            <p className="text-sm sm:text-base font-extrabold mt-0.5 leading-relaxed">
              {weatherData.advisory}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-2xs">
          Validated
        </span>
      </div>

      {/* 4 Precision Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thermal Heat</span>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
              <Thermometer className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 block">{current.temperature}°C</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Ambient Temperature</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precipitation</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <CloudRain className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-blue-700 block">{current.rainfall} mm</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Daily Rain Accumulation</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Moisture Saturation</span>
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-2xl">
              <Droplets className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-teal-700 block">{current.humidity}%</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Relative Air Humidity</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm card-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wind Vector</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Wind className="h-5 w-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 block">{current.wind_speed} <span className="text-base font-semibold text-slate-500">km/h</span></span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Velocity & Drift Force</span>
          </div>
        </div>

      </div>

      {/* Spray Window & Irrigation Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Spray Window */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex items-start gap-4">
          <div className={`p-3.5 rounded-2xl shrink-0 ${isSpraySafe ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">Pesticide Spray Window</h3>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isSpraySafe ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isSpraySafe ? 'Favorable' : 'Unfavorable'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
              {isSpraySafe 
                ? 'Wind velocity is under 15 km/h with dry foliage. Ideal application hours: 06:30 AM to 09:30 AM to prevent thermal evaporation.'
                : 'Wind velocity exceeds spray drift threshold or rainfall risk is elevated. Postpone foliar spraying to prevent chemical runoff.'}
            </p>
          </div>
        </div>

        {/* Irrigation Scheduling */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex items-start gap-4">
          <div className="p-3.5 bg-blue-100 text-blue-800 rounded-2xl shrink-0">
            <Droplets className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">Irrigation Scheduling</h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                AI Schedule
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
              {current.rainfall > 10 
                ? 'Adequate soil saturation detected from precipitation. Halt drip/flood irrigation cycles for the next 48 hours to conserve groundwater.'
                : 'Moderate moisture loss anticipated. Drip irrigation recommended during early morning hours to replenish crop root zones.'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WeatherDashboard;
