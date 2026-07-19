import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, AlertTriangle, UserCheck, Bot } from 'lucide-react';
import api from '../../services/api';

const LiveStatusStrip = () => {
  const { data: status } = useQuery({
    queryKey: ['dashboard', 'live-status'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/live-status');
      return data.data;
    },
    refetchInterval: 30000 // Refetch every 30s for top bar
  });

  if (!status) return null;

  return (
    <div className="bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded-xl mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-gray-100">System Online</span>
      </div>
      <div className="flex items-center gap-2 text-gray-300">
        <Users className="w-4 h-4 text-blue-400" />
        {status.visitors?.toLocaleString() || 0} Visitors
      </div>
      <div className="flex items-center gap-2 text-gray-300">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        {status.criticalIncidents || 0} Critical Incidents
      </div>
      <div className="flex items-center gap-2 text-gray-300">
        <UserCheck className="w-4 h-4 text-emerald-400" />
        {status.activeVolunteers || 0} Volunteers Active
      </div>
      <div className="flex items-center gap-2 text-gray-300">
        <Bot className="w-4 h-4 text-purple-400" />
        AI Assistant Available
      </div>
    </div>
  );
};

export default LiveStatusStrip;
