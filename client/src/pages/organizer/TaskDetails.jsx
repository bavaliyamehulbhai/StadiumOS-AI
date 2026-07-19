import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, CheckCircle, AlertTriangle, ShieldCheck, Trash2, Clock, Play } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PriorityBadge from '@/components/incident/PriorityBadge';
import StatusBadge from '@/components/incident/StatusBadge';
import TaskTimeline from '@/components/task/TaskTimeline';
import AssignTaskModal from '@/components/task/AssignTaskModal';
import { useSocket } from '@/socket/hooks/useSocket';
import { format } from 'date-fns';
import { Sparkles, Shield, PenTool } from 'lucide-react';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchTask = async () => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      setTask(data.data);
    } catch (error) {
      toast.error('Failed to load task details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
    // eslint-disable-next-line
  }, [id]);

  // Real-time socket updates
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    
    const handleUpdate = (updatedTask) => {
      if (updatedTask._id === id) {
        setTask(updatedTask);
      }
    };
    
    socket.on('task:updated', handleUpdate);
    socket.on('task:assigned', handleUpdate);
    socket.on('task:ai:generated', handleUpdate);

    return () => {
      socket.off('task:updated', handleUpdate);
      socket.off('task:assigned', handleUpdate);
      socket.off('task:ai:generated', handleUpdate);
    };
  }, [socket, id]);

  const handleAction = async (endpoint, successMessage) => {
    setUpdating(true);
    try {
      const { data } = await api.patch(`/tasks/${id}/${endpoint}`);
      setTask(data.data);
      toast.success(successMessage);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${endpoint} task`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) return;
    setUpdating(true);
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted successfully');
      navigate(user?.role === 'Admin' ? '/admin/tasks' : '/organizer/tasks');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-[400px] bg-gray-200 rounded-xl"></div>
        <div className="h-[400px] bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );

  if (!task) return null;

  const isOrganizerOrAdmin = user?.role === 'Organizer' || user?.role === 'Admin';
  const isAssignedToMe = task.assignedVolunteer?._id === user?._id;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
          className="border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{task.title}</h1>
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{task.category}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Created on {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')} by {task.assignedBy?.name || 'System'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg flex items-center">
                Task Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{task.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Stadium</h3>
                  <p className="font-medium text-gray-900">{task.stadium?.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</h3>
                  <p className="font-medium text-gray-900">{task.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Assigned Volunteer</h3>
                  {task.assignedVolunteer ? (
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{task.assignedVolunteer.name}</p>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Volunteer</span>
                    </div>
                  ) : (
                    <p className="font-medium text-gray-500 italic">Unassigned</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Due Time</h3>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {format(new Date(task.dueTime), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>

              {/* Action Buttons based on Role & Status */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                
                {/* ORGANIZER ACTIONS */}
                {isOrganizerOrAdmin && (task.status === 'Pending' || task.status === 'Assigned') && (
                  <Button 
                    onClick={() => setAssignModalOpen(true)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-2" /> 
                    {task.status === 'Pending' ? 'Assign Volunteer' : 'Reassign Task'}
                  </Button>
                )}
                
                {isOrganizerOrAdmin && task.status === 'Completed' && (
                  <Button 
                    onClick={() => handleAction('verify', 'Task verified and closed')} 
                    disabled={updating}
                    className="bg-gray-800 hover:bg-gray-900 text-white"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" /> Verify Task Completion
                  </Button>
                )}

                {isOrganizerOrAdmin && task.status !== 'Completed' && task.status !== 'Verified' && task.status !== 'Cancelled' && (
                  <Button 
                    onClick={() => handleAction('cancel', 'Task cancelled')} 
                    disabled={updating}
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                  >
                    Cancel Task
                  </Button>
                )}

                {user?.role === 'Admin' && (
                  <Button 
                    onClick={handleDelete} 
                    disabled={updating}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 ml-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                )}

                {/* VOLUNTEER ACTIONS (Only if assigned to them) */}
                {isAssignedToMe && task.status === 'Assigned' && (
                  <Button 
                    onClick={() => handleAction('accept', 'Task accepted')} 
                    disabled={updating}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Accept Task
                  </Button>
                )}
                
                {isAssignedToMe && task.status === 'Accepted' && (
                  <Button 
                    onClick={() => handleAction('start', 'Task started')} 
                    disabled={updating}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" /> Start Work (In Progress)
                  </Button>
                )}
                
                {isAssignedToMe && task.status === 'In Progress' && (
                  <Button 
                    onClick={() => handleAction('complete', 'Task marked completed')} 
                    disabled={updating}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Mark as Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Task Support Panel */}
          {task.aiSummary && (
            <Card className="shadow-sm border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-blue-500" />
              </div>
              <CardHeader className="pb-3 border-b border-blue-100/50">
                <CardTitle className="text-lg flex items-center text-blue-900">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                  AI Task Support
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5 relative z-10">
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">Operational Brief</h4>
                  <p className="text-sm text-blue-900/80 leading-relaxed">{task.aiSummary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {task.aiSafetyTips?.length > 0 && (
                    <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
                      <h4 className="text-xs font-bold text-blue-800 uppercase flex items-center mb-2">
                        <Shield className="w-3.5 h-3.5 mr-1" /> Safety First
                      </h4>
                      <ul className="text-sm text-blue-900/80 space-y-1 list-disc pl-4">
                        {task.aiSafetyTips.map((tip, i) => <li key={i}>{tip}</li>)}
                      </ul>
                    </div>
                  )}
                  {task.aiEquipment?.length > 0 && (
                    <div className="bg-white/60 p-3 rounded-lg border border-blue-100">
                      <h4 className="text-xs font-bold text-blue-800 uppercase flex items-center mb-2">
                        <PenTool className="w-3.5 h-3.5 mr-1" /> Equipment Needed
                      </h4>
                      <ul className="text-sm text-blue-900/80 space-y-1 list-disc pl-4">
                        {task.aiEquipment.map((eq, i) => <li key={i}>{eq}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Timeline */}
        <div className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg">Task Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TaskTimeline task={task} />
            </CardContent>
          </Card>
        </div>
      </div>

      {assignModalOpen && (
        <AssignTaskModal 
          task={task} 
          onClose={() => setAssignModalOpen(false)} 
          onAssign={(updatedTask) => setTask(updatedTask)}
        />
      )}
    </div>
  );
};

export default TaskDetails;
