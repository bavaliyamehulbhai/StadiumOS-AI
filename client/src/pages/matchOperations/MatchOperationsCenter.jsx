import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, RefreshCw, Activity, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../socket/hooks/useSocket';

// Component Imports
import OperationsKPIBar from '../../components/matchOperations/OperationsKPIBar';
import MatchLifecycleControls from '../../components/matchOperations/MatchLifecycleControls';
import OperationsTimeline from '../../components/matchOperations/OperationsTimeline';
import OperationsMap from '../../components/matchOperations/OperationsMap';

const MatchOperationsCenter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOperationsState = async () => {
    try {
      const res = await api.get(`/match-operations/${id}`);
      setState(res.data.data);
    } catch (error) {
      console.error(error);
      alert('Failed to load match operations state');
      navigate(`/${user.role.toLowerCase()}/operations`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationsState();

    if (socket) {
      // Listen for unified operations update
      socket.on('match.operations.updated', (data) => {
        if (data.matchId === id) fetchOperationsState();
      });
      // Listen for granular updates
      socket.on('crowd.updated', fetchOperationsState);
      socket.on('incident.created', fetchOperationsState);
      socket.on('incident.updated', fetchOperationsState);
      socket.on('task.created', fetchOperationsState);
      socket.on('task.updated', fetchOperationsState);

      return () => {
        socket.off('match.operations.updated');
        socket.off('crowd.updated');
        socket.off('incident.created');
        socket.off('incident.updated');
        socket.off('task.created');
        socket.off('task.updated');
      };
    }
  }, [id, socket]);

  if (loading) {
    return <div className="h-[calc(100vh-80px)] flex items-center justify-center font-bold text-gray-500 animate-pulse">Loading Operations Center...</div>;
  }

  if (!state || !state.match) return null;

  const isEmergency = state.match.commandMode === 'EMERGENCY';

  return (
    <div className={`space-y-4 pb-12 transition-colors duration-500 ${isEmergency ? 'bg-red-50/20' : ''}`}>
      
      {/* Dynamic Header */}
      <div className={`rounded-2xl p-4 flex justify-between items-center shadow-sm border ${
        isEmergency ? 'bg-red-600 text-white border-red-700' : 'bg-gray-900 text-white border-gray-900'
      }`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/${user.role.toLowerCase()}/operations`)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              {state.match.status === 'Live' && <Activity className={`w-4 h-4 ${isEmergency ? 'animate-pulse' : ''}`} />}
              <h1 className="text-xl font-black tracking-tight">{state.match.title}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                isEmergency ? 'bg-white text-red-600' : 
                state.match.status === 'Live' ? 'bg-green-500 text-white' : 
                'bg-gray-700 text-gray-300'
              }`}>
                {isEmergency ? 'EMERGENCY MODE' : state.match.status}
              </span>
            </div>
            <div className="text-sm font-medium opacity-80 flex gap-4 mt-1">
              <span>{state.match.stadium?.name}</span>
              <span>{state.match.kickoffTime} - {state.match.stage}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Health Score */}
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">Stadium Health</div>
            <div className="flex items-end gap-1 justify-end">
              <span className="text-2xl font-black leading-none">{state.health}</span>
              <span className="text-sm font-bold opacity-80 leading-none">/ 100</span>
            </div>
          </div>
          
          <MatchLifecycleControls match={state.match} onUpdate={fetchOperationsState} />
        </div>
      </div>

      {/* KPI Bar */}
      <OperationsKPIBar metrics={state.metrics} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 h-[calc(100vh-280px)] min-h-[600px]">
        
        {/* Digital Twin & Sub-Panels */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <div className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
             <OperationsMap stadium={state.match.stadium} matchId={state.match._id} />
          </div>
        </div>

        {/* Side Panels: AI & Timeline */}
        <div className="xl:col-span-1 flex flex-col gap-4 overflow-hidden">
          
          {/* Incident / Volunteer Quick Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 shrink-0">
             <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Live Command</h3>
             <div className="grid grid-cols-2 gap-3 mb-4">
               <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                 <div className="text-2xl font-black text-red-600">{state.activeIncidents?.length || 0}</div>
                 <div className="text-xs font-bold text-red-800 uppercase">Active Incidents</div>
               </div>
               <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                 <div className="text-2xl font-black text-blue-600">{state.activeTasks?.length || 0}</div>
                 <div className="text-xs font-bold text-blue-800 uppercase">Active Tasks</div>
               </div>
             </div>
             <button className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold shadow-sm transition-colors flex items-center justify-center gap-2">
               <ShieldAlert className="w-4 h-4" />
               Emergency Broadcast
             </button>
          </div>

          <div className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-200 p-0 overflow-hidden flex flex-col">
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Live Activity</h3>
               <button onClick={fetchOperationsState} className="p-1.5 hover:bg-white rounded-md transition-colors text-gray-400 hover:text-gray-900">
                 <RefreshCw className="w-4 h-4" />
               </button>
             </div>
             <div className="flex-grow overflow-y-auto">
               <OperationsTimeline events={state.recentActivity} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchOperationsCenter;
