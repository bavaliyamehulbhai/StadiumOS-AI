import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Target, Clock, Activity, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

const VolunteerPerformanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/volunteer-performance/volunteers/${id}`);
        setData(res.data);
      } catch (error) {
        console.error('Failed to load volunteer profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="p-8 text-center font-bold text-gray-500 animate-pulse">Loading Profile...</div>;
  if (!data) return <div className="p-8 text-center font-bold text-red-500">Failed to load profile or volunteer not found.</div>;

  const { volunteer, metrics, recentTasks, responseTrend } = data;

  const formatTime = (ms) => {
    if (!ms || ms === 0) return '0s';
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <DashboardHeader 
          title={`${volunteer.name}'s Performance Profile`} 
          subtitle="Individual volunteer performance tracking and history." 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Volunteer Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-3xl mx-auto mb-4">
              {volunteer.name.charAt(0)}
            </div>
            <h2 className="text-xl font-black text-gray-900">{volunteer.name}</h2>
            <div className="mt-2 flex items-center justify-center gap-2">
               <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  volunteer.availability === 'Available' ? 'bg-green-100 text-green-700' :
                  volunteer.availability === 'Busy' ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    volunteer.availability === 'Available' ? 'bg-green-500' :
                    volunteer.availability === 'Busy' ? 'bg-orange-500' : 'bg-gray-400'
                  }`}></span>
                  {volunteer.availability}
                </span>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-left space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email</span>
                <span className="text-sm font-medium text-gray-900">{volunteer.email}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Current Zone</span>
                <span className="text-sm font-medium text-gray-900">{volunteer.currentZone || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Skills</span>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills?.length > 0 ? volunteer.skills.map((s, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">
                      {s.replace('_', ' ')}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-500">General</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Performance Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-5 rounded-2xl border flex flex-col justify-between h-32 ${getScoreColor(metrics.performanceScore)}`}>
              <Activity className="w-6 h-6 mb-2 opacity-50" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Performance Score</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-black">{metrics.performanceScore}</h3>
                  <span className="text-sm font-bold opacity-50">/100</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
              <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tasks Completed</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-black text-gray-900">{metrics.completedTasks}</h3>
                  <span className="text-sm font-bold text-gray-400">/ {metrics.totalTasksAssigned}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
              <Clock className="w-6 h-6 text-orange-500 mb-2" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Response</p>
                <h3 className="text-2xl font-black text-gray-900">{formatTime(metrics.avgResponseTimeMs)}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
              <Target className="w-6 h-6 text-purple-500 mb-2" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completion Rate</p>
                <h3 className="text-3xl font-black text-gray-900">
                  {metrics.totalTasksAssigned > 0 ? Math.round((metrics.completedTasks / metrics.totalTasksAssigned) * 100) : 0}%
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-black text-gray-900 mb-4">Response Time Trend (Last 10 Tasks)</h3>
            <div className="h-48 flex items-end gap-2">
              {responseTrend.map((t, idx) => {
                const maxMs = Math.max(...responseTrend.map(rt => rt.responseTimeMs), 60000); // minimum 60s max for scale
                const height = t.responseTimeMs > 0 ? `${(t.responseTimeMs / maxMs) * 100}%` : '5%';
                return (
                  <div key={t.taskId} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                    {/* Tooltip */}
                    <div className="absolute -top-10 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                      {formatTime(t.responseTimeMs)}
                    </div>
                    {/* Bar */}
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-500 ${t.responseTimeMs > 180000 ? 'bg-red-200 group-hover:bg-red-400' : 'bg-blue-200 group-hover:bg-blue-400'}`}
                      style={{ height }}
                    ></div>
                    <div className="mt-2 text-[10px] text-gray-400 font-bold transform -rotate-45 origin-top-left translate-y-2 whitespace-nowrap overflow-hidden text-ellipsis w-8">
                       Task {idx+1}
                    </div>
                  </div>
                );
              })}
              {responseTrend.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                  Not enough completed tasks for trend data.
                </div>
              )}
            </div>
            <div className="mt-8 pt-4 border-t border-gray-100 text-xs font-medium text-gray-500 flex justify-between">
              <span>Fastest responses on the right (latest tasks)</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-200 rounded-sm"></div> &lt; 3 mins</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-200 rounded-sm"></div> &gt; 3 mins</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-black text-gray-900 mb-4">Recent Task History</h3>
            <div className="space-y-3">
              {recentTasks.map(task => (
                <div key={task._id} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      task.status === 'Completed' || task.status === 'Verified' ? 'bg-green-100 text-green-600' :
                      task.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {task.status === 'Completed' || task.status === 'Verified' ? <CheckCircle className="w-5 h-5" /> : 
                       task.status === 'Cancelled' ? <XCircle className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{task.title}</p>
                      <p className="text-xs font-medium text-gray-500">{new Date(task.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    task.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
              {recentTasks.length === 0 && (
                <p className="text-gray-500 text-sm font-medium">No tasks assigned yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VolunteerPerformanceDetails;
