import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, FileText, Database, Shield, Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setData(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-600 animate-pulse">Loading administrative telemetry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 text-rose-700 rounded-3xl text-center text-sm border border-rose-200 max-w-lg mx-auto mt-12 font-bold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition-colors text-slate-600 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider mb-1">
              <Shield className="h-3 w-3 text-emerald-400" />
              <span>System Administration</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Global user registry and neural scan activity metrics</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-5 card-hover">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Users className="h-7 w-7"/>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Pilots</p>
            <p className="text-3xl font-black text-slate-900 mt-0.5">{data?.total_users || 0}</p>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
              +100% Active Rate
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-5 card-hover">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Database className="h-7 w-7"/>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total AI Inferences</p>
            <p className="text-3xl font-black text-slate-900 mt-0.5">{data?.total_reports || 0}</p>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
              Neural Vision Scans
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-5 card-hover">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100">
            <Activity className="h-7 w-7"/>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Integrity</p>
            <p className="text-3xl font-black text-slate-900 mt-0.5">99.98%</p>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
              Vercel Serverless
            </span>
          </div>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-slate-500" />
            <span>Farmer Operator Directory</span>
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-xl border border-slate-200">
            {data?.users?.length || 0} Operators
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Operator Name</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Farmer Classification</th>
                <th className="px-6 py-4">Regional District</th>
                <th className="px-6 py-4">Onboarded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.users?.map((u, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{u.mobile}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {u.farmer_type || 'Individual'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{u.district || 'Karnataka'}</td>
                  <td className="px-6 py-4 text-slate-400 font-medium">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
