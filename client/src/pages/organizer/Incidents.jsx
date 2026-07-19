import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import IncidentTable from '@/components/incident/IncidentTable';
import IncidentCard from '@/components/incident/IncidentCard';
import PageLoader from '@/components/common/PageLoader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/socket/hooks/useSocket';
import { SOCKET_EVENTS } from '@/socket/utils/socketEvents';

const Incidents = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/incidents', {
        params: { search, status: statusFilter, priority: priorityFilter }
      });
      setIncidents(data.data || []);
    } catch (error) {
      console.error('Failed to fetch incidents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [search, statusFilter, priorityFilter]);

  // Socket.io Real-time integration
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleCreate = (newIncident) => {
      setIncidents(prev => {
        if (prev.some(inc => inc._id === newIncident._id)) return prev;
        return [newIncident, ...prev];
      });
    };

    const handleUpdate = (updatedIncident) => {
      setIncidents(prev => prev.map(inc => 
        inc._id === updatedIncident._id ? updatedIncident : inc
      ));
    };

    const handleDelete = (deletedId) => {
      setIncidents(prev => prev.filter(inc => inc._id !== deletedId));
    };

    socket.on(SOCKET_EVENTS.INCIDENT_CREATED, handleCreate);
    socket.on(SOCKET_EVENTS.INCIDENT_UPDATED, handleUpdate);
    socket.on(SOCKET_EVENTS.INCIDENT_RESOLVED, handleUpdate);
    socket.on(SOCKET_EVENTS.INCIDENT_CLOSED, handleUpdate);
    // Legacy delete event compatibility
    socket.on('incident:deleted', handleDelete);

    return () => {
      socket.off(SOCKET_EVENTS.INCIDENT_CREATED, handleCreate);
      socket.off(SOCKET_EVENTS.INCIDENT_UPDATED, handleUpdate);
      socket.off(SOCKET_EVENTS.INCIDENT_RESOLVED, handleUpdate);
      socket.off(SOCKET_EVENTS.INCIDENT_CLOSED, handleUpdate);
      socket.off('incident:deleted', handleDelete);
    };
  }, [socket]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Incident Command</h1>
          <p className="text-gray-500 mt-1">Monitor and assign real-time stadium incidents.</p>
        </div>
        <Link to={user?.role === 'Admin' ? "/admin/incidents/report" : "/organizer/incidents/report"}>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-4 h-4 mr-2" /> Report Incident
          </Button>
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between">
        
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg appearance-none outline-none font-medium text-gray-700"
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-lg appearance-none outline-none font-medium text-gray-700"
            >
              <option value="">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Table
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <PageLoader text="Loading incidents..." />
      ) : incidents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
           <span className="text-5xl mb-4 grayscale opacity-40">📝</span>
           <h3 className="text-xl font-bold text-gray-800">No Incidents Found</h3>
           <p className="text-gray-500 mt-2">There are currently no incidents matching your criteria.</p>
        </div>
      ) : viewMode === 'table' ? (
        <IncidentTable incidents={incidents} role={user?.role} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {incidents.map((incident) => (
            <IncidentCard key={incident._id} incident={incident} role={user?.role} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Incidents;
