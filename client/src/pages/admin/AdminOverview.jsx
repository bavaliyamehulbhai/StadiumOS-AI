import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Map, Calendar, AlertTriangle, Activity, Database, Server, Bot, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/overview');
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin overview', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading overview...</div>;

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Control Center</h1>
          <p className="text-gray-500 mt-1">Global platform overview and health metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><Map size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Stadiums</p>
            <p className="text-2xl font-bold">{stats?.activeStadiums || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Calendar size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Matches</p>
            <p className="text-2xl font-bold">{stats?.activeMatches || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Critical Alerts</p>
            <p className="text-2xl font-bold">{stats?.criticalAlerts || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity size={20} /> System Health</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3"><Server className="text-gray-500" size={18} /> <span>API Services</span></div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Online</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3"><Database className="text-gray-500" size={18} /> <span>Database (MongoDB)</span></div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Connected</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3"><Bot className="text-gray-500" size={18} /> <span>AI Engine (Groq)</span></div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Operational</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
           <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/users" className="block p-4 border rounded-xl hover:bg-gray-50 text-left transition-all hover:shadow-md hover:-translate-y-1">
                 <p className="font-bold text-gray-900 flex items-center justify-between">Manage Users <ArrowRight size={16} className="text-gray-400" /></p>
                 <p className="text-xs text-gray-500 mt-2">Add, edit, or deactivate platform accounts.</p>
              </Link>
              <Link to="/admin/emergency-rules" className="block p-4 border border-red-200 bg-red-50 hover:bg-red-100 text-left transition-all hover:shadow-md hover:-translate-y-1 rounded-xl">
                 <p className="font-bold text-red-700 flex items-center justify-between"><span className="flex items-center gap-2"><AlertTriangle size={16}/> Emergency Mode</span> <ArrowRight size={16} className="text-red-400" /></p>
                 <p className="text-xs text-red-600 mt-2">Activate global stadium lockdown protocols.</p>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
