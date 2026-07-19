import React, { useState, useEffect } from 'react';
import { Users, Activity, Clock, Target, Search, Filter, AlertTriangle, ShieldAlert, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { useSocket } from '../../socket/hooks/useSocket';

const VolunteerPerformanceCenter = () => {
  const [overview, setOverview] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const { socket } = useSocket();

  const fetchPerformanceData = async () => {
    try {
      const [overviewRes, volsRes] = await Promise.all([
        api.get('/volunteer-performance/overview'),
        api.get('/volunteer-performance/volunteers')
      ]);
      setOverview(overviewRes.data);
      setVolunteers(volsRes.data);
    } catch (error) {
      console.error('Failed to load performance data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();

    if (socket) {
      socket.on('volunteer.performance.updated', () => {
        // Debounce or just fetch to keep UI fresh when a task completes
        fetchPerformanceData();
      });
      socket.on('volunteer.status.updated', fetchPerformanceData);
    }

    return () => {
      if (socket) {
        socket.off('volunteer.performance.updated');
        socket.off('volunteer.status.updated');
      }
    };
  }, [socket]);

  const handleAiRecommendation = async () => {
    setAiLoading(true);
    try {
      // Simulate an incident context for the demo
      const context = {
        requiredSkill: 'MEDICAL',
        zone: 'North Stand',
        emergencyLevel: 'Critical'
      };
      const res = await api.post('/volunteer-performance/recommend', context);
      setAiRecommendations(res.data);
    } catch (error) {
      console.error(error);
      setAiRecommendations({ fallbackUsed: true, recommendations: [], reason: 'Failed to connect to AI Engine.' });
    } finally {
      setAiLoading(false);
    }
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = filterSkill ? v.skills?.includes(filterSkill) : true;
    return matchesSearch && matchesSkill;
  });

  if (loading) {
    return <div className="p-8 text-center font-bold text-gray-500 animate-pulse">Loading Performance Center...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-start">
        <DashboardHeader 
          title="Volunteer Performance Center" 
          subtitle="Real-time analytics, response tracking, and AI-driven workforce management." 
        />
        <button 
          onClick={handleAiRecommendation}
          disabled={aiLoading}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          {aiLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Bot className="w-5 h-5" />
          )}
          Smart Assign AI
        </button>
      </div>

      {/* Overview KPIs */}
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl"><Users className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Available Workforce</p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-black text-gray-900">{overview.workforce.available}</h3>
                <span className="text-xs font-bold text-gray-400 mb-1">/ {overview.workforce.total}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-xl"><Target className="w-6 h-6 text-emerald-600" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <h3 className="text-2xl font-black text-gray-900">{overview.tasks.completionRate}%</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-xl"><Clock className="w-6 h-6 text-orange-600" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
              <h3 className="text-2xl font-black text-gray-900">{overview.tasks.avgResponseTimeFormatted}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-xl"><Activity className="w-6 h-6 text-purple-600" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Performance</p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-black text-gray-900">{overview.workforce.averageScore}</h3>
                <span className="text-xs font-bold text-gray-400 mb-1">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendation Panel */}
      {aiRecommendations && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h3 className="text-lg font-black text-purple-900">AI Dispatch Recommendations</h3>
              <p className="text-sm font-medium text-purple-700">Scenario: Medical Incident (North Stand)</p>
            </div>
            {aiRecommendations.fallbackUsed && (
              <span className="ml-auto bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Rate Limited (Deterministic Fallback)
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecommendations.recommendations.map((rec, idx) => (
              <div key={rec.id} className="bg-white p-4 rounded-xl shadow-sm border border-purple-100/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    {rec.name}
                  </h4>
                  <button className="text-xs font-bold bg-purple-50 text-purple-700 px-2 py-1 rounded hover:bg-purple-100">
                    Assign
                  </button>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rec.reason}</p>
              </div>
            ))}
            {aiRecommendations.recommendations.length === 0 && (
              <p className="text-sm font-bold text-gray-500">No suitable volunteers found.</p>
            )}
          </div>
        </div>
      )}

      {/* Volunteer Directory */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gray-50/50">
          <h3 className="text-lg font-black text-gray-900">Volunteer Directory</h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search volunteer..." 
                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 bg-white"
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
            >
              <option value="">All Skills</option>
              <option value="MEDICAL">Medical</option>
              <option value="SECURITY">Security</option>
              <option value="CROWD_CONTROL">Crowd Control</option>
              <option value="EMERGENCY_RESPONSE">Emergency Response</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Volunteer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Skills</th>
                <th className="px-6 py-4">Zone</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredVolunteers.map(volunteer => (
                <tr key={volunteer._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black">
                        {volunteer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{volunteer.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{volunteer.completedTasks} tasks completed</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      volunteer.availability === 'Available' ? 'bg-green-100 text-green-700' :
                      volunteer.availability === 'Busy' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        volunteer.availability === 'Available' ? 'bg-green-500' :
                        volunteer.availability === 'Busy' ? 'bg-orange-500' : 'bg-gray-400'
                      }`}></span>
                      {volunteer.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills && volunteer.skills.length > 0 ? volunteer.skills.map((skill, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                          {skill.replace('_', ' ')}
                        </span>
                      )) : (
                        <span className="text-xs text-gray-400 font-medium">General</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {volunteer.currentZone || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-[3px] border-gray-100 relative">
                      <svg className="w-full h-full absolute top-0 left-0 -rotate-90">
                        <circle cx="21" cy="21" r="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-100"></circle>
                        <circle 
                          cx="21" cy="21" r="18" fill="none" stroke="currentColor" strokeWidth="3" 
                          strokeDasharray="113" strokeDashoffset={113 - (113 * (volunteer.performanceScore || 0)) / 100}
                          className={volunteer.performanceScore >= 85 ? "text-emerald-500" : volunteer.performanceScore >= 70 ? "text-blue-500" : "text-orange-500"}
                        ></circle>
                      </svg>
                      <span className="text-xs font-black text-gray-900 relative z-10">{volunteer.performanceScore || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link 
                      to={`/organizer/volunteers/${volunteer._id}/performance`}
                      className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg transition-colors inline-block"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredVolunteers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No volunteers match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPerformanceCenter;
