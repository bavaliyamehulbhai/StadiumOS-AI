import React, { useState, useEffect } from 'react';
import { ClipboardList, Play, CheckCircle, Clock } from 'lucide-react';
import api from '@/services/api';
import TaskCard from '@/components/task/TaskCard';
import PageLoader from '@/components/common/PageLoader';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/socket/hooks/useSocket';

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Socket connection
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    
    const handleTaskUpdate = (updatedTask) => {
      // Only care about tasks assigned to this volunteer
      if (updatedTask.assignedVolunteer?._id === user._id || updatedTask.assignedVolunteer === user._id) {
        setTasks(prev => {
          const exists = prev.find(t => t._id === updatedTask._id);
          if (exists) return prev.map(t => t._id === updatedTask._id ? updatedTask : t);
          return [updatedTask, ...prev];
        });
      }
    };

    socket.on('task:assigned', handleTaskUpdate);
    socket.on('task:updated', handleTaskUpdate);
    socket.on('task:ai:generated', handleTaskUpdate);

    return () => {
      socket.off('task:assigned', handleTaskUpdate);
      socket.off('task:updated', handleTaskUpdate);
      socket.off('task:ai:generated', handleTaskUpdate);
    };
  }, [socket, user]);

  const pendingCount = tasks.filter(t => t.status === 'Assigned' || t.status === 'Accepted').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed' || t.status === 'Verified').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Tasks</h1>
        <p className="text-gray-500 mt-1">Manage and update your assigned operational tasks.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
            <ClipboardList className="w-3 h-3 mr-1" /> Today's Tasks
          </div>
          <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm">
          <div className="text-orange-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </div>
          <div className="text-2xl font-bold text-orange-700">{pendingCount}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
          <div className="text-purple-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
            <Play className="w-3 h-3 mr-1" /> In Progress
          </div>
          <div className="text-2xl font-bold text-purple-700">{inProgressCount}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" /> Completed
          </div>
          <div className="text-2xl font-bold text-emerald-700">{completedCount}</div>
        </div>
      </div>

      {/* Task Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" /> Active Assignments
        </h2>
        
        {loading ? (
          <PageLoader text="Loading your tasks..." />
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-5xl mb-4 grayscale opacity-40">✅</span>
            <h3 className="text-xl font-bold text-gray-800">No assigned tasks</h3>
            <p className="text-gray-500 mt-2">You're all caught up. Stand by for new assignments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <TaskCard key={task._id} task={task} userRole="Volunteer" />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default MyTasks;
