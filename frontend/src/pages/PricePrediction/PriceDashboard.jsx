import React, { useState, useEffect } from 'react';
import { priceService } from '../../api/priceService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  MapPin, 
  Truck, 
  Coins, 
  Sparkles, 
  Info, 
  Calendar, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck,
  RefreshCw,
  Award,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const PriceDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const district = user.district || 'Koppal';
  const [selectedCrop, setSelectedCrop] = useState('Cotton');

  const cropsList = [
    'Cotton', 'Paddy', 'Groundnut', 'Maize', 'Sugarcane', 
    'Wheat', 'Coconut', 'Coffee', 'Tea', 'Ginger', 
    'Cashew', 'Pepper', 'Arecanut', 'Cardamum'
  ];

  const fetchPrice = async (crop) => {
    setLoading(true);
    setError('');
    try {
      const res = await priceService.predictPrice(district, crop);
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch price data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice(selectedCrop);
  }, [district, selectedCrop]);

  const getChartData = () => {
    if (!data) return [];
    
    const historical = data.historical.map(d => ({
      name: d.month.split(' ')[0],
      Historical: d.price,
      Forecast: null
    }));
    
    const forecast = data.forecast.map(d => ({
      name: d.month.split(' ')[0],
      Historical: null,
      Forecast: d.price
    }));
    
    if (historical.length > 0 && forecast.length > 0) {
      forecast[0].Historical = historical[historical.length - 1].Historical;
    }
    
    return [...historical, ...forecast];
  };

  const getSellingAdvice = () => {
    if (!data || !data.forecast || !data.forecast[0]) return null;
    const current = data.current_price;
    const nextMonth = data.forecast[0].price;
    const isBullish = nextMonth > current;
    const percentage = (((nextMonth - current) / current) * 100).toFixed(1);
    
    return {
      status: isBullish ? 'HOLD STOCK' : 'LIQUIDATE / SELL',
      isBullish,
      percentage: Math.abs(percentage),
      badgeColor: isBullish 
        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
        : 'bg-rose-100 text-rose-800 border-rose-200',
      advisory: isBullish 
        ? `Wholesale rates are projected to increase by +${percentage}% next month due to high festive procurement demand. Holding inventory will maximize farm returns.`
        : `Wholesale rates are projected to decline by -${Math.abs(percentage)}% next month due to fresh market arrivals. Liquidate immediately to capture peak rates.`,
      tip: isBullish 
        ? 'Maintain storage moisture under 12% and inspect grain silos to avoid pest infestation while holding stock.'
        : 'Lock in pre-harvest contracts or book local transport immediately to dispatch harvest before price dips.'
    };
  };

  const advice = getSellingAdvice();

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-2 border border-indigo-200">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>APMC Mandi Wholesale Telemetry & AI Forecasting</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Market Intelligence Hub
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1 max-w-2xl">
            Compare wholesale rates across 11 regional Karnataka mandis, analyze historical pricing patterns, and optimize selling timing.
          </p>
        </div>

        <button 
          onClick={() => fetchPrice(selectedCrop)}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Commodity Selector Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
          Select Commodity / Crop
        </span>
        <div className="flex flex-wrap gap-2">
          {cropsList.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedCrop === crop 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-3xl border border-slate-200/80">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-extrabold text-slate-700 animate-pulse">Running Random Forest forecasting models across APMC terminals...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-50 text-rose-700 rounded-3xl border border-rose-200 text-center font-bold text-sm">
          {error}
        </div>
      ) : data && (
        <div className="space-y-8">
          
          {/* Main Grid: AI Selling Directive + Recharts Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: AI Directive Card */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between h-full space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      <h2 className="font-extrabold text-slate-900 text-lg">AI Selling Directive</h2>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Live Signal
                    </span>
                  </div>

                  {advice && (
                    <div className="space-y-6">
                      
                      {/* Big Sentiment Directive */}
                      <div className={`p-6 rounded-3xl border text-center ${advice.isBullish ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50/70 border-rose-200'}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">
                          Algorithmic Directive
                        </span>
                        <div className="flex items-center justify-center gap-2">
                          {advice.isBullish ? <ArrowUpRight className="h-6 w-6 text-emerald-600" /> : <ArrowDownRight className="h-6 w-6 text-rose-600" />}
                          <span className={`text-2xl font-black ${advice.isBullish ? 'text-emerald-900' : 'text-rose-900'}`}>
                            {advice.status}
                          </span>
                        </div>
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border inline-block mt-3 ${advice.badgeColor}`}>
                          {advice.isBullish ? `+${advice.percentage}% Projected Growth` : `-${advice.percentage}% Price Drop Warning`}
                        </span>
                      </div>

                      {/* Current Rate Spotlight */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Mandi Benchmark</span>
                          <span className="text-xl font-black text-slate-900 block mt-0.5">₹{data.current_price} <span className="text-xs font-medium text-slate-500">/ Quintal</span></span>
                        </div>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-xl">
                          {selectedCrop}
                        </span>
                      </div>

                      {/* Advisory details */}
                      <div className="space-y-3">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex gap-3 items-start">
                          <Info className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-700 leading-relaxed font-semibold">{advice.advisory}</p>
                        </div>

                        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 flex gap-3 items-start">
                          <ShieldCheck className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-amber-800 uppercase block mb-0.5">Storage Protocol</span>
                            <p className="text-xs text-amber-900 leading-relaxed font-semibold">{advice.tip}</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Engine: Random Forest v4</span>
                  <span>Horizon: 60 Days</span>
                </div>
              </div>
            </div>

            {/* Right Column: Wholesale Trend Chart */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-lg">Wholesale Price Trajectory</h2>
                      <p className="text-xs font-semibold text-slate-400">Historical Actuals vs. Machine Learning Forecast</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl">
                    ₹ / Quintal
                  </span>
                </div>

                <div className="h-[340px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={11} fontWeight={700} />
                      <YAxis stroke="#64748B" fontSize={11} fontWeight={700} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: '1px solid #E2E8F0', 
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', 
                          fontFamily: 'Outfit',
                          fontWeight: 700 
                        }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '10px' }} />
                      <Line 
                        type="monotone" 
                        dataKey="Historical" 
                        name="Historical Verified (₹)" 
                        stroke="#10B981" 
                        strokeWidth={3.5} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 7 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Forecast" 
                        name="AI Forecast (₹)" 
                        stroke="#6366F1" 
                        strokeWidth={3.5} 
                        strokeDasharray="6 6" 
                        dot={{ r: 5, strokeWidth: 2 }} 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs font-semibold text-slate-500 gap-2">
                <span>Green line represents verified mandi transactions.</span>
                <span>Dotted purple represents ML projected rate curve.</span>
              </div>
            </div>

          </div>

          {/* Mandi Analytics Comparison Table */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8">
            <div className="pb-5 border-b border-slate-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  <span>Top Regional Mandi Comparison (Net Profitability)</span>
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Model forecasts after deducting roundtrip freight logistics costs from your farm.
                </p>
              </div>
              
              {data.best_mandi && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-emerald-900">
                  <Truck className="h-5 w-5 shrink-0 text-emerald-700" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block text-emerald-800">Top Profit Mandi</span>
                    <span className="font-black text-sm">{data.best_mandi.location} APMC Terminal</span>
                  </div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-500">Mandi Location</th>
                    <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-500">Predicted Price</th>
                    <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-500">Haul Distance</th>
                    <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-500">Logistics Cost</th>
                    <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-500">Net Profitability</th>
                    <th className="p-4 text-xs font-extrabold uppercase tracking-wider text-slate-500 text-center">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.mandis.map((mandi, idx) => {
                    const isBest = idx === 0;
                    return (
                      <tr 
                        key={idx} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isBest ? 'bg-emerald-50/40 font-bold' : ''
                        }`}
                      >
                        <td className="p-4 text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          <MapPin className={`h-4 w-4 ${isBest ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{mandi.location}</span>
                        </td>
                        <td className="p-4 text-sm text-slate-800 font-black">₹{mandi.price}</td>
                        <td className="p-4 text-sm text-slate-500 font-semibold">{mandi.distance} km</td>
                        <td className="p-4 text-sm text-rose-600 font-bold">₹{mandi.transport_cost}</td>
                        <td className={`p-4 text-base font-black ${isBest ? 'text-emerald-800' : 'text-slate-900'}`}>
                          ₹{mandi.net_profitability}
                        </td>
                        <td className="p-4 text-center">
                          {isBest ? (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-3 py-1 rounded-full shadow-xs">
                              #1 Best Route
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                              Alternative
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      )}

    </div>
  );
};

export default PriceDashboard;
