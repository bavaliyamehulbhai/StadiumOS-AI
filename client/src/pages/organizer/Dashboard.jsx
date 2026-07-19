import React from 'react';
import { Users, AlertTriangle, TrendingUp, UserCheck, Play, FileText, ClipboardList, Bot, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SkeletonDashboard from '@/components/dashboard/SkeletonDashboard';
import { useOrganizerDashboard } from '@/hooks/useDashboard';
import { useSocket } from '@/socket/hooks/useSocket';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProgressRing from '@/components/dashboard/ProgressRing';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import AIOperationsCenterCard from '@/components/crowd-ai/AIOperationsCenterCard';
import LiveCounter from '@/components/dashboard/LiveCounter';
import AIInsightPanel from '@/components/dashboard/AIInsightPanel';

const mockChartData = [
  { time: '18:00', density: 10000 },
  { time: '18:30', density: 20000 },
  { time: '19:00', density: 45000 },
  { time: '19:30', density: 60000 },
  { time: '20:00', density: 63452 },
  { time: '20:30', density: 63452 }
];

const OrganizerDashboard = () => {
  const { data: initialData, isLoading, isError, refetch } = useOrganizerDashboard();
  const [liveStats, setLiveStats] = React.useState(null);
  const [liveActivities, setLiveActivities] = React.useState([]);
  const [aiBrief, setAiBrief] = React.useState('');
  
  const { socket } = useSocket();

  React.useEffect(() => {
    if (initialData) {
      if (!liveStats) setLiveStats(initialData.stats);
      if (liveActivities.length === 0) setLiveActivities(initialData.recentActivities || []);
    }
  }, [initialData]);

  React.useEffect(() => {
    if (socket) {
      socket.on('dashboard:kpi:updated', (data) => {
        setLiveStats(data.stats);
        setLiveActivities(data.activities);
        setAiBrief(data.aiBrief);
      });
    }

    return () => {
      if (socket) {
        socket.off('dashboard:kpi:updated');
      }
    }
  }, [socket]);

  if (isLoading) return <SkeletonDashboard />;

  if (isError || (!initialData && !liveStats)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load dashboard</h2>
        <button onClick={() => refetch()} className="text-blue-600 hover:underline">Retry</button>
      </div>
    );
  }

  const currentStats = liveStats || initialData?.stats || {};
  
  const displayCrowd = currentStats.crowdDensity || '0%';
  const displayIncidents = currentStats.liveIncidents || 0;
  const displayVolunteers = currentStats.availableVolunteers || 0;
  const pendingTasks = currentStats.pendingTasks || 0;
  const healthScore = currentStats.healthScore || 94;

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Organizer Analytics" 
        subtitle="Real-time stadium overview and AI operational intelligence." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Stadium Health Score (New Phase 6 Feature) */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-6 shadow-sm flex flex-col justify-between text-white lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-indigo-100">Stadium Health</h3>
            <Activity className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <LiveCounter value={healthScore} />
              <span className="text-indigo-200 font-medium">/ 100</span>
            </div>
            <p className="text-sm text-indigo-100 mt-1">{healthScore >= 90 ? 'Excellent' : healthScore >= 75 ? 'Good' : 'Needs Attention'}</p>
          </div>
        </div>

        {/* Active Incidents */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Incidents</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="text-red-600">
              <LiveCounter value={displayIncidents} />
            </div>
            <p className="text-sm text-gray-500 mt-1">Requiring attention</p>
          </div>
        </div>

        {/* Crowd Density */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-600">Highest Crowd Density</h3>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-gray-900">
              <LiveCounter value={displayCrowd} />
            </div>
            <p className="text-sm text-gray-500 mt-1">of total capacity</p>
          </div>
        </div>

        {/* Active Volunteers */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-600">Volunteers Available</h3>
            <UserCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-gray-900">
              <LiveCounter value={displayVolunteers} />
            </div>
            <p className="text-sm text-gray-500 mt-1">Currently unassigned</p>
          </div>
        </div>

        {/* AI Insight Panel */}
        <div className="lg:col-span-1">
          <AIInsightPanel aiBrief={aiBrief} criticalIncidents={currentStats.criticalIncidents || 0} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crowd Trend Prediction */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Crowd Trend Prediction</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `${val/1000}k`} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="density" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDensity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Operations Brain - Top 400 Tip */}
        <div className="lg:col-span-1">
          <AIOperationsCenterCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-900">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Volunteer Performance</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <p className="text-2xl font-bold text-blue-600">{pendingTasks}</p>
              <p className="text-xs font-bold text-blue-600 mt-1 uppercase tracking-wider">Total Assigned</p>
            </div>
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
              <p className="text-2xl font-bold text-emerald-600">1</p>
              <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider">Completed</p>
            </div>
            <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100 text-center">
              <p className="text-2xl font-bold text-blue-500">28m</p>
              <p className="text-xs font-bold text-blue-500 mt-1 uppercase tracking-wider">Avg Resolution</p>
            </div>
            <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 text-center">
              <p className="text-2xl font-bold text-red-600">0</p>
              <p className="text-xs font-bold text-red-600 mt-1 uppercase tracking-wider">Critical Handled</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1 pr-6">
              <div className="flex justify-between text-sm font-medium mb-2 text-gray-700">
                <span>Completion Rate</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div className="hidden sm:block">
              <ProgressRing percentage={25} size={80} strokeWidth={8} color="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col max-h-96">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Operations Activity</h3>
          <div className="overflow-y-auto pr-2 flex-1">
            <ActivityTimeline activities={liveActivities.length > 0 ? liveActivities : (initialData?.recentActivities || [])} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrganizerDashboard;
