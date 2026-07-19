import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, TrendingUp, Clock, Map as MapIcon, BarChart3, Activity } from 'lucide-react';
import { useSocket } from '@/socket/hooks/useSocket';
import api from '@/services/api';
import toast from 'react-hot-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CrowdMap from '@/components/crowd/CrowdMap';
import GateStatusCard from '@/components/crowd/GateStatusCard';

const CrowdDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);

  const { socket } = useSocket();

  const fetchCrowdData = async () => {
    try {
      const [analyticsRes, gatesRes] = await Promise.all([
        api.get('/crowd/analytics'),
        api.get('/crowd/category/Gate')
      ]);
      setAnalytics(analyticsRes.data.data);
      setGates(gatesRes.data.data);
    } catch (error) {
      console.error('Error fetching crowd data:', error);
      toast.error('Failed to load crowd analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrowdData();
    
    if (socket) {
      socket.on('crowd:updated', fetchCrowdData);
      socket.on('gate:occupancy:updated', fetchCrowdData);
      
      socket.on('crowd:prediction:ready', (data) => {
        toast.custom((t) => (
          <div className="bg-white rounded-lg shadow-lg border border-indigo-100 p-4 max-w-sm w-full flex flex-col gap-2">
            <div className="flex items-center gap-2 text-indigo-700 font-bold">
              <span className="text-xl">🤖</span> AI Crowd Alert: {data.zoneName}
            </div>
            <p className="text-sm text-gray-700">{data.prediction}</p>
            <div className="bg-indigo-50 text-indigo-800 text-xs p-2 rounded mt-1 border border-indigo-100">
              <span className="font-semibold">Action:</span> {data.recommendation}
            </div>
          </div>
        ), { duration: 8000 });
      });
    }

    return () => {
      if (socket) {
        socket.off('crowd:updated', fetchCrowdData);
        socket.off('gate:occupancy:updated', fetchCrowdData);
        socket.off('crowd:prediction:ready');
      }
    };
  }, [socket]);

  const triggerSimulation = async () => {
    try {
      await api.post('/crowd/simulate');
      toast.success('Simulation triggered');
      fetchCrowdData();
    } catch (error) {
      toast.error('Simulation failed');
    }
  };

  if (loading || !analytics) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Crowd Intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DashboardHeader 
          title="Crowd Intelligence" 
          subtitle="Real-time density, wait times, and congestion monitoring." 
        />
        <button 
          onClick={triggerSimulation}
          className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
        >
          <Activity className="w-4 h-4" />
          Simulate Traffic
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Live Visitors</p>
            <h3 className="text-2xl font-bold text-gray-900">{analytics.totalVisitors.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Overall Density</p>
            <h3 className="text-2xl font-bold text-gray-900">{analytics.overallDensity}%</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Longest Queue</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {analytics.longestQueue ? `${analytics.longestQueue.averageWaitTime} min` : '--'}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{analytics.longestQueue?.zone}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Critical Zones</p>
            <h3 className="text-2xl font-bold text-red-600">{analytics.criticalZonesCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Area */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><MapIcon className="w-5 h-5 text-gray-500"/> Live Density Map</h3>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Low</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Medium</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500"></span> High</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-600"></span> Critical</span>
            </div>
          </div>
          <div className="h-[450px] w-full bg-gray-50 relative">
            <CrowdMap />
          </div>
        </div>

        {/* Gate Status Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-[525px]">
          <h3 className="font-bold flex items-center gap-2 mb-4"><BarChart3 className="w-5 h-5 text-gray-500"/> Gate Occupancy</h3>
          <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
            {gates.map(gate => (
              <GateStatusCard key={gate._id} gate={gate} />
            ))}
            {gates.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No gates found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdDashboard;
