import React from 'react';
import { ClipboardList, AlertTriangle, CheckCircle2, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import SkeletonDashboard from '@/components/dashboard/SkeletonDashboard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import VolunteerStatusBadge from '@/components/volunteer/VolunteerStatusBadge';
import { useVolunteerDashboard } from '@/hooks/useDashboard';
import { BarChartCard } from '@/components/dashboard/ChartCard';

const taskChartData = [
  { name: 'Mon', value: 3 },
  { name: 'Tue', value: 5 },
  { name: 'Wed', value: 2 },
  { name: 'Thu', value: 8 },
  { name: 'Fri', value: 4 }
];

const VolunteerDashboard = () => {
  const { data: dashboardData, isLoading, isError, refetch } = useVolunteerDashboard();

  if (isLoading) return <SkeletonDashboard />;

  if (isError || !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load dashboard</h2>
        <button onClick={() => refetch()} className="text-blue-600 hover:underline">Retry</button>
      </div>
    );
  }

  const { stats, activeTasksList, nearbyIncidents } = dashboardData;

  const displayActiveTasks = stats.assignedTasks || 0;
  const displayPendingIncidents = stats.myIncidents || 2;
  const displayCompleted = stats.completedTasks || 12;

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Volunteer Hub" 
        subtitle="Manage your active tasks and incident reports." 
      >
        <VolunteerStatusBadge />
      </DashboardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ask AI */}
        <Link 
          to="/assistant"
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-sm flex flex-col justify-between hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-blue-100">Need Help?</h3>
            <Bot className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <p className="text-2xl font-bold">Ask AI Copilot</p>
          </div>
        </Link>
        {/* Active Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Tasks</h3>
            <ClipboardList className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{displayActiveTasks}</p>
          </div>
        </div>

        {/* Pending Incidents */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-600">Pending Incidents</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-600">{displayPendingIncidents}</p>
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-600">Completed Today</h3>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600">{displayCompleted}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Current Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">My Current Tasks</h3>
            
            <div className="space-y-4">
              {activeTasksList && activeTasksList.length > 0 ? activeTasksList.map((task) => (
                <div key={task._id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{task.location ? task.location : task.description}</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                    Mark Done
                  </button>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No active tasks assigned.</p>
              )}
            </div>
          </div>

          {/* Added Bar Chart for Volunteer Performance */}
          <BarChartCard 
            title="Tasks Completed This Week" 
            data={taskChartData} 
            color="#10b981"
          />
        </div>

        {/* Nearby Incidents */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Nearby Incidents</h3>
          
          {nearbyIncidents && nearbyIncidents.length > 0 ? nearbyIncidents.map((inc) => (
            <div key={inc._id} className="border border-red-200 bg-red-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                <AlertTriangle className="w-4 h-4" /> {inc.title}
              </div>
              <p className="text-sm text-red-600/80 mb-4">{inc.location}. {inc.description}</p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors">
                Respond
              </button>
            </div>
          )) : (
            <p className="text-gray-500 text-sm">No critical incidents nearby.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
