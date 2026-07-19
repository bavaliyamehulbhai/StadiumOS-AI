import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import TaskTable from '@/components/task/TaskTable';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/socket/hooks/useSocket';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Stats
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, critical: 0 });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/tasks?search=${searchTerm}&status=${statusFilter}&priority=${priorityFilter}`);
      setTasks(data.data || []);
      
      // Calculate Stats (In a real app, backend might provide this, but doing it here for speed)
      if (!searchTerm && !statusFilter && !priorityFilter) {
        setStats({
          total: data.data.length,
          pending: data.data.filter(t => t.status === 'Pending').length,
          inProgress: data.data.filter(t => t.status === 'In Progress').length,
          completed: data.data.filter(t => t.status === 'Completed' || t.status === 'Verified').length,
          critical: data.data.filter(t => t.priority === 'Critical').length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchTerm, statusFilter, priorityFilter]);

  // Socket.io integration
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    
    const handleTaskUpdate = (updatedTask) => {
      setTasks(prev => {
        const exists = prev.find(t => t._id === updatedTask._id);
        if (exists) return prev.map(t => t._id === updatedTask._id ? updatedTask : t);
        return [updatedTask, ...prev];
      });
      fetchTasks(); // refresh stats
    };

    const handleTaskDelete = (taskId) => {
      setTasks(prev => prev.filter(t => t._id !== taskId));
      fetchTasks();
    };

    socket.on('task:create', handleTaskUpdate);
    socket.on('task:assigned', handleTaskUpdate);
    socket.on('task:updated', handleTaskUpdate);
    socket.on('task:deleted', handleTaskDelete);
    socket.on('task:ai:generated', handleTaskUpdate);

    return () => {
      socket.off('task:create', handleTaskUpdate);
      socket.off('task:assigned', handleTaskUpdate);
      socket.off('task:updated', handleTaskUpdate);
      socket.off('task:deleted', handleTaskDelete);
      socket.off('task:ai:generated', handleTaskUpdate);
    };
  }, [socket, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Task Command Center</h1>
          <p className="text-gray-500 mt-1">Manage and track volunteer operations in real-time.</p>
        </div>
        <Link to={user?.role === 'Admin' ? "/admin/tasks/assign" : "/organizer/tasks/assign"}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> New Task
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm">
          <div className="text-orange-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </div>
          <div className="text-2xl font-bold text-orange-700">{stats.pending}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
          <div className="text-purple-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
            <Play className="w-3 h-3 mr-1" /> In Progress
          </div>
          <div className="text-2xl font-bold text-purple-700">{stats.inProgress}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </div>
          <div className="text-2xl font-bold text-emerald-700">{stats.completed}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
          <div className="text-red-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" /> Critical
          </div>
          <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tasks or locations..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <select 
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="Accepted">Accepted</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Verified">Verified</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <select 
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none bg-white"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-white rounded-lg border border-gray-100"></div>)}
        </div>
      ) : (
        <TaskTable tasks={tasks} userRole={user?.role} />
      )}

    </div>
  );
};

// Local component since Play wasn't imported at top
const Play = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default Tasks;
