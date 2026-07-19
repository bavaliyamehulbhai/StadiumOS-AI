import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, AlertTriangle, Play, WifiOff } from 'lucide-react';
import api from '../../services/api';
import { useSocket } from '../../socket/hooks/useSocket';
import toast from 'react-hot-toast';
import SystemKPIBar from '../../components/systemHealth/SystemKPIBar';
import ServiceStatusGrid from '../../components/systemHealth/ServiceStatusGrid';
import APIPerformanceChart from '../../components/systemHealth/APIPerformanceChart';
import HealthHistoryChart from '../../components/systemHealth/HealthHistoryChart';
import SystemIncidentList from '../../components/systemHealth/SystemIncidentList';

const SystemHealthDashboard = () => {
  const [healthData, setHealthData] = useState(null);
  const [history, setHistory] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  const fetchHealthData = async () => {
    try {
      const [healthRes, historyRes, incidentsRes] = await Promise.all([
        api.get('/system-health/detailed'),
        api.get('/system-health/history'),
        api.get('/system-health/incidents')
      ]);

      setHealthData(healthRes.data.data);
      setHistory(historyRes.data.data);
      setIncidents(incidentsRes.data.data);
    } catch (error) {
      console.error('Error fetching system health:', error);
      toast.error('Failed to load system health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();

    // Socket listeners for real-time updates
    if (socket) {
      socket.on('system.health.updated', (data) => {
        setHealthData(data);
        // Also append to history to keep chart moving
        setHistory(prev => {
          const newHistory = [...prev, {
            timestamp: data.timestamp,
            systemScore: data.score,
            apiLatency: data.services.api.avgLatency
          }];
          if (newHistory.length > 60) newHistory.shift();
          return newHistory;
        });
      });

      socket.on('system.incident.created', (incident) => {
        setIncidents(prev => [incident, ...prev]);
        toast.error(`System Alert: ${incident.title}`);
      });

      socket.on('system.incident.resolved', (incident) => {
        setIncidents(prev => prev.filter(i => i._id !== incident._id));
        toast.success(`System Recovered: ${incident.title}`);
      });
    }

    return () => {
      if (socket) {
        socket.off('system.health.updated');
        socket.off('system.incident.created');
        socket.off('system.incident.resolved');
      }
    };
  }, [socket]);

  const handleForceCheck = async () => {
    try {
      await api.post('/system-health/check');
      toast.success('Manual health check triggered');
      setTimeout(fetchHealthData, 1000); // Give it a sec to calculate
    } catch (error) {
      toast.error('Failed to trigger health check');
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Activity className="animate-spin text-blue-500" size={32} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🖥️ StadiumOS AI — System Health
            {isConnected ? (
              <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full ml-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> LIVE
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full ml-3">
                <WifiOff size={12} /> OFFLINE
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-1">Platform observability and infrastructure monitoring</p>
        </div>
        <button 
          onClick={handleForceCheck}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm"
        >
          <Play size={16} /> Run Health Check
        </button>
      </div>

      {/* KPI Bar */}
      {healthData && (
        <SystemKPIBar 
          score={healthData.score}
          api={healthData.services.api}
          socket={healthData.services.socket}
          ai={healthData.services.ai}
        />
      )}

      {/* Service Status Grid */}
      {healthData && <ServiceStatusGrid services={healthData.services} />}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-blue-500" /> API Performance (Latency)
          </h3>
          <APIPerformanceChart data={history} />
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" /> System Health Trend
          </h3>
          <HealthHistoryChart data={history} />
        </div>
      </div>

      {/* Active Incidents & Runtime */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" /> Active System Incidents
          </h3>
          <SystemIncidentList 
            incidents={incidents} 
            onIncidentUpdate={fetchHealthData}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Server Runtime</h3>
          {healthData?.runtime ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">Uptime</span>
                <span className="font-medium text-gray-900">{healthData.runtime.uptime}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">Memory (RSS)</span>
                <span className="font-medium text-gray-900">{healthData.runtime.memory.rss}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">CPU Usage</span>
                <span className="font-medium text-gray-900">{healthData.runtime.cpu.usagePercent}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">Environment</span>
                <span className="font-medium text-gray-900 capitalize">{healthData.runtime.environment}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 text-sm">Node.js Version</span>
                <span className="font-medium text-gray-900">{healthData.runtime.nodeVersion}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Data unavailable</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthDashboard;
