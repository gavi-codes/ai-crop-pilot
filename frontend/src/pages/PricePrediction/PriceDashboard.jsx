import React, { useState, useEffect } from 'react';
import { priceService } from '../../api/priceService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
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
  ShieldCheck
} from 'lucide-react';

const PriceDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const district = user.district || 'Koppal';
  const [selectedCrop, setSelectedCrop] = useState('Cotton');

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
      name: d.month.split(' ')[0], // 'January', 'February'
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

  // Helper to determine AI selling advice
  const getSellingAdvice = () => {
    if (!data || !data.forecast || !data.forecast[0]) return null;
    const current = data.current_price;
    const nextMonth = data.forecast[0].price;
    const isBullish = nextMonth > current;
    const percentage = (((nextMonth - current) / current) * 100).toFixed(1);
    
    return {
      status: isBullish ? 'HOLD' : 'SELL NOW',
      color: isBullish ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200',
      badgeColor: isBullish ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white',
      advisory: isBullish 
        ? `Prices are predicted to rise by ${percentage}% next month. Holding your crop will optimize your revenue.`
        : `Prices are predicted to fall by ${Math.abs(percentage)}% next month. Sell immediately to maximize profit.`,
      tip: isBullish 
        ? "Ensure crop is stored in standard temperature conditions (15-25°C) with low moisture to prevent decay while holding."
        : "Coordinate with your local logistics service to schedule transport early and lock in current high prices."
    };
  };

  const advice = getSellingAdvice();

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Market Intelligence Hub</h1>
        <p className="text-sm text-slate-500 mt-2">
          Compare local mandis, analyze price trends, and execute smart selling decisions using your trained Random Forest model.
        </p>
      </div>

      {/* Select Crop Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Target Crop</label>
            <select 
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800"
            >
              <option value="Cotton">Cotton (Trained Model)</option>
              <option value="Paddy">Paddy (Rice - Trained Model)</option>
              <option value="Coconut">Coconut (Trained Model)</option>
              <option value="Coffee">Coffee (Trained Model)</option>
              <option value="Tea">Tea (Trained Model)</option>
              <option value="Ginger">Ginger (Trained Model)</option>
              <option value="Cashew">Cashew (Trained Model)</option>
              <option value="Pepper">Pepper (Trained Model)</option>
              <option value="Arecanut">Arecanut (Trained Model)</option>
              <option value="Cardamum">Cardamum (Trained Model)</option>
              <option value="Cocoa">Cocoa (Trained Model)</option>
              <option value="Groundnut">Groundnut (Trained Model)</option>
              <option value="Blackgram">Blackgram (Trained Model)</option>
            </select>
          </div>
          <button 
            onClick={() => fetchPrice(selectedCrop)}
            disabled={loading}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all h-[54px] w-full md:w-auto flex items-center justify-center gap-2"
          >
            {loading ? 'Analyzing...' : 'Refresh Forecast'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Querying regional mandi prices...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl text-center text-sm border border-rose-100">
          {error}
        </div>
      ) : data && (
        <div className="space-y-8">
          
          {/* Main Advisor Cards & Trend charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side: AI Selling Advisor Panel (Module 4) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                    <h2 className="font-extrabold text-slate-900 text-lg">AI Selling Advisor</h2>
                  </div>

                  {advice && (
                    <div className="space-y-6">
                      {/* Diagnostic Status */}
                      <div className={`p-5 rounded-2xl border text-center ${advice.color}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider block mb-1.5">Decision Directive</span>
                        <span className={`text-2xl font-black px-4 py-1.5 rounded-xl inline-block ${advice.badgeColor} shadow`}>
                          {advice.status}
                        </span>
                      </div>

                      {/* Advisory details */}
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3 items-start">
                          <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-650 leading-relaxed font-semibold">{advice.advisory}</p>
                        </div>

                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 flex gap-3 items-start">
                          <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-amber-700 uppercase block mb-0.5">Pilot Storage Advice</span>
                            <p className="text-xs text-amber-800 leading-relaxed font-semibold">{advice.tip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between text-xs text-slate-400 font-semibold">
                  <span>Target Year: {new Date().getFullYear()}</span>
                  <span>Model ID: RandomForest-v4</span>
                </div>
              </div>
            </div>

            {/* Right side: Trend Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6 justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <h2 className="font-extrabold text-slate-900 text-lg">Wholesale Price Trend</h2>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase">₹ / Quintal</span>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} fontWeight={600} />
                    <YAxis stroke="#94A3B8" fontSize={11} fontWeight={600} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Outfit' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, fontFamily: 'Outfit' }} />
                    <Line type="monotone" dataKey="Historical" name="Historical (Model)" stroke="#10B981" strokeWidth={3.5} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Forecast" name="AI Forecast" stroke="#6366F1" strokeWidth={3.5} strokeDasharray="5 5" dot={{ r: 4, strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Module 3: Best Market Mandi Recommendation */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-8">
            <div className="pb-4 border-b border-slate-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                  Best Market Recommendation (Mandi Analytics)
                </h2>
                <p className="text-xs text-slate-500 mt-1">Predictions calculated across 11 major Karnataka mandis after subtracting logistics expenses</p>
              </div>
              
              {data.best_mandi && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-2xl text-emerald-800">
                  <Truck className="h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-600">Top Rated Location</span>
                    <span className="font-black text-sm">{data.best_mandi.location} Mandi</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mandi comparison table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Mandi Location</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Model predicted Price</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Distance</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Logistics Cost</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Net Profitability</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.mandis.map((mandi, idx) => {
                    const isBest = idx === 0;
                    return (
                      <tr 
                        key={idx} 
                        className={`hover:bg-slate-50 transition-colors ${
                          isBest ? 'bg-emerald-50/20 font-semibold' : ''
                        }`}
                      >
                        <td className="p-4 text-sm font-bold text-slate-800 flex items-center gap-2">
                          <MapPin className={`h-4 w-4 ${isBest ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <span>{mandi.location}</span>
                        </td>
                        <td className="p-4 text-sm text-slate-650 font-bold">₹{mandi.price}</td>
                        <td className="p-4 text-sm text-slate-500 font-semibold">{mandi.distance} km</td>
                        <td className="p-4 text-sm text-rose-500 font-semibold">₹{mandi.transport_cost}</td>
                        <td className={`p-4 text-sm font-extrabold ${isBest ? 'text-emerald-600' : 'text-slate-800'}`}>
                          ₹{mandi.net_profitability}
                        </td>
                        <td className="p-4 text-center">
                          {isBest ? (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-lg shadow-sm">
                              Best Option
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                              Comparable
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
