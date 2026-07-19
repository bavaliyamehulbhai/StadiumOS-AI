import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Filter, Search, Download, Map as MapIcon, List } from 'lucide-react';
import api from '@/services/api';
import TimelineItem from '@/components/audit/TimelineItem';
import OperationsReplay from '@/components/audit/OperationsReplay';
import { useSocket } from '@/socket/hooks/useSocket';
import toast from 'react-hot-toast';

const ActivityTimeline = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'replay'
  const { socket } = useSocket();

  // Filters
  const [filterModule, setFilterModule] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [filterModule, filterSeverity]);

  useEffect(() => {
    if (socket) {
      socket.on('audit:created', (newLog) => {
        // If it matches filters (or no filters), add it to top
        if ((!filterModule || newLog.module === filterModule) && 
            (!filterSeverity || newLog.severity === filterSeverity)) {
          setLogs(prev => [newLog, ...prev]);
        }
      });
    }
    return () => {
      if (socket) socket.off('audit:created');
    };
  }, [socket, filterModule, filterSeverity]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = '?limit=100';
      if (filterModule) query += `&module=${filterModule}`;
      if (filterSeverity) query += `&severity=${filterSeverity}`;
      
      const res = await api.get(`/audit${query}`);
      setLogs(res.data.data);
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success('Exporting audit logs to CSV...');
    // Real app: trigger CSV download
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <DashboardHeader 
          title="Activity Timeline" 
          subtitle="Enterprise Audit Log & Operations Replay"
        />
        
        {/* Top Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg p-1 border border-gray-200 flex shadow-sm">
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'timeline' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <List size={16} /> Timeline
            </button>
            <button 
              onClick={() => setViewMode('replay')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'replay' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <MapIcon size={16} /> Operations Replay
            </button>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {viewMode === 'replay' ? (
        <OperationsReplay logs={logs} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Filter Bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-gray-500">
              <Filter size={18} />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <select 
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">All Modules</option>
              <option value="Authentication">Authentication</option>
              <option value="Incident">Incidents</option>
              <option value="Crowd">Crowd</option>
              <option value="AI Engine">AI Engine</option>
              <option value="Emergency">Emergency</option>
            </select>

            <select 
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">All Severities</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Timeline Feed */}
          <div className="p-8">
            {loading ? (
              <div className="flex justify-center items-center py-20 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No activity logs found.</div>
            ) : (
              <div className="max-w-3xl mx-auto pl-4">
                {logs.map((log, index) => (
                  <TimelineItem 
                    key={log._id || index} 
                    log={log} 
                    isLast={index === logs.length - 1} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
