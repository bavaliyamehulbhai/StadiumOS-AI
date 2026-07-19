import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AnalyticsKPICard from '../../components/analytics/AnalyticsKPICard';
import AIExecutiveSummary from '../../components/analytics/AIExecutiveSummary';
import TrendChart from '../../components/analytics/TrendChart';
import ReportGenerator from '../../components/analytics/ReportGenerator';
import { Activity, AlertTriangle, CheckCircle, HeartPulse, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '../../socket/hooks/useSocket';
import { SOCKET_EVENTS } from '../../socket/utils/socketEvents';

const AnalyticsCenter = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [trends, setTrends] = useState({ incidents: [] });
  const { socket } = useSocket();

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/overview');
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load analytics');
    }
  };

  const fetchTrends = async () => {
    try {
      const res = await api.get('/analytics/trends');
      setTrends(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchAnalytics(), fetchTrends()]);
      setLoading(false);
    };
    init();
  }, []);

  // Socket listen for live updates
  useEffect(() => {
    if (!socket || !data) return;

    const handleIncidentUpdate = (incident) => {
      // Simple incremental logic for demo: refetch on new critical incident
      if (incident?.priority === 'Critical') {
        fetchAnalytics();
      }
    };
    
    const handleEmergencyUpdate = () => {
      fetchAnalytics();
    };

    socket.on(SOCKET_EVENTS.INCIDENT_CREATED, handleIncidentUpdate);
    socket.on(SOCKET_EVENTS.INCIDENT_UPDATED, handleIncidentUpdate);
    socket.on(SOCKET_EVENTS.EMERGENCY_BROADCAST_ACTIVE, handleEmergencyUpdate);
    socket.on(SOCKET_EVENTS.EMERGENCY_BROADCAST_RESOLVED, handleEmergencyUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.INCIDENT_CREATED, handleIncidentUpdate);
      socket.off(SOCKET_EVENTS.INCIDENT_UPDATED, handleIncidentUpdate);
      socket.off(SOCKET_EVENTS.EMERGENCY_BROADCAST_ACTIVE, handleEmergencyUpdate);
      socket.off(SOCKET_EVENTS.EMERGENCY_BROADCAST_RESOLVED, handleEmergencyUpdate);
    };
  }, [socket, data]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Center</h1>
          <p className="text-slate-500 mt-1">
            {user?.role === 'Admin' ? 'Global Operational Analytics across all stadiums.' : 'Operational Analytics for your assigned stadium.'}
          </p>
        </div>
        <ReportGenerator analyticsData={data} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsKPICard 
          title="Stadium Health Score" 
          value={`${data?.healthScore || 0}/100`} 
          icon={HeartPulse} 
          color={data?.healthScore > 80 ? 'green' : data?.healthScore > 50 ? 'yellow' : 'red'}
          trend={{ isPositive: data?.healthScore > 80, value: 4 }}
        />
        <AnalyticsKPICard 
          title="Active Incidents" 
          value={data?.incidents?.active || 0}
          subValue={`/ ${data?.incidents?.total || 0} Total`}
          icon={Activity} 
          color="blue"
          trend={{ isPositive: false, value: 12 }}
        />
        <AnalyticsKPICard 
          title="Volunteer Readiness" 
          value={`${Math.round(((data?.volunteers?.completed || 0) / (data?.volunteers?.total || 1)) * 100)}%`}
          icon={CheckCircle} 
          color="green"
        />
        <AnalyticsKPICard 
          title="Active Emergencies" 
          value={data?.emergencies?.active || 0}
          icon={AlertTriangle} 
          color="red"
        />
      </div>

      {/* AI Summary */}
      <div className="my-6">
        <AIExecutiveSummary analyticsData={data} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart 
          title="Incident Trends (Last 7 Days)" 
          data={trends.incidents} 
          color="#3b82f6" 
        />
        {/* Placeholder for future charts */}
        <div className="bg-slate-50 border rounded-xl flex items-center justify-center min-h-[300px] text-slate-400">
          More Charts Coming Soon
        </div>
      </div>

    </div>
  );
};

export default AnalyticsCenter;
