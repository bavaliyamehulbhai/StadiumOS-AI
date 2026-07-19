import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, Users, DollarSign, AlertTriangle, Car, ShieldCheck } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KPIWidget from '@/components/analytics-ai/KPIWidget';
import OperationalScoreCard from '@/components/analytics-ai/OperationalScoreCard';
import ExecutiveInsightCard from '@/components/analytics-ai/ExecutiveInsightCard';
import PredictionCard from '@/components/analytics-ai/PredictionCard';
import RecommendationCard from '@/components/analytics-ai/RecommendationCard';
import ExportReportButton from '@/components/analytics-ai/ExportReportButton';

const AIAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    try {
      const endpoint = force ? '/ai/analytics/generate' : '/ai/analytics/dashboard';
      const method = force ? 'post' : 'get';
      const res = await api[method](endpoint, force ? { force: true } : undefined);
      setReport(res.data.data);
    } catch (error) {
      toast.error('Failed to load AI Analytics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading && !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Bot className="w-16 h-16 text-indigo-500 animate-bounce" />
        <h2 className="text-xl font-bold text-gray-900">StadiumOS AI is crunching the numbers...</h2>
        <p className="text-gray-500 text-sm max-w-md text-center">Aggregating real-time crowd, parking, incident, and ticket data to generate your Executive Summary.</p>
      </div>
    );
  }

  const kpis = report?.kpis || {};
  const isOrganizer = user?.role === 'Organizer';

  return (
    <div className="space-y-8 pb-12 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <DashboardHeader
          title="CEO Analytics & Intelligence"
          subtitle="AI-powered operational insights, predictions, and recommendations."
        />
        <div className="flex items-center gap-3">
          <ExportReportButton />
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Regenerating...' : 'Refresh AI Analysis'}
          </button>
        </div>
      </div>

      {/* Top Section: Hero Score & Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OperationalScoreCard 
          healthScore={report?.healthScore} 
          strengths={report?.strengths}
          weaknesses={report?.weaknesses}
        />
        <ExecutiveInsightCard 
          summary={report?.summary} 
          generatedAt={report?.generatedAt}
        />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {!isOrganizer && (
          <KPIWidget
            title="Est. Revenue"
            value={`₹${(kpis.revenue || 0).toLocaleString()}`}
            icon={DollarSign}
            colorClass="bg-emerald-100 text-emerald-600"
          />
        )}
        <KPIWidget
          title="Attendance"
          value={(kpis.attendance || 0).toLocaleString()}
          icon={Users}
          colorClass="bg-blue-100 text-blue-600"
        />
        <KPIWidget
          title="Active Incidents"
          value={kpis.activeIncidents || 0}
          icon={AlertTriangle}
          colorClass="bg-rose-100 text-rose-600"
          trend={kpis.activeIncidents > 5 ? 'down' : 'up'}
        />
        <KPIWidget
          title="Parking Utilized"
          value={`${kpis.parkingUtilization || 0}%`}
          icon={Car}
          colorClass="bg-purple-100 text-purple-600"
        />
        <KPIWidget
          title="Available Volunteers"
          value={`~${kpis.availableVolunteers || 0}`}
          icon={ShieldCheck}
          colorClass="bg-amber-100 text-amber-600"
        />
      </div>

      {/* Bottom Section: Predictions & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionCard predictions={report?.predictions} />
        <RecommendationCard recommendations={report?.recommendations} />
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;
