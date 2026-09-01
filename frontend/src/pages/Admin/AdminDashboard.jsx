import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, FileText, Database } from 'lucide-react';
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

  if (loading) return <div className="p-8 text-center text-lg text-slate-500">Loading admin data...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Overview of system users and crop scans</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users className="h-6 w-6"/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Registered Users</p>
              <p className="text-3xl font-bold text-slate-900">{data?.total_users || 0}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Database className="h-6 w-6"/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total AI Scans</p>
              <p className="text-3xl font-bold text-slate-900">{data?.total_reports || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Users className="h-4 w-4" /> User Directory
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Mobile</th>
                  <th className="px-6 py-3">Farmer Type</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data?.users?.map((user, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.mobile}</td>
                    <td className="px-6 py-4 text-slate-600">{user.farmer_type || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600">{user.village}, {user.district}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
