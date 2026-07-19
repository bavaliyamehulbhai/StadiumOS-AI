import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, User } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

const AssignTaskModal = ({ task, onClose, onAssign }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const { data } = await api.get('/auth/users?role=Volunteer');
        setVolunteers(data.data || []);
      } catch (err) {
        toast.error('Failed to load volunteers');
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, []);

  const handleAssign = async (volunteerId) => {
    setAssigningId(volunteerId);
    try {
      const { data } = await api.patch(`/tasks/${task._id}/assign`, { volunteerId });
      toast.success('Task Assigned Successfully');
      onAssign(data.data);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign task');
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Assign Volunteer</h2>
            <p className="text-sm text-gray-500 mt-1">Select a volunteer to deploy for this task.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">✕</button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No volunteers found.</div>
          ) : (
            <div className="space-y-3">
              {volunteers.map(volunteer => (
                <div 
                  key={volunteer._id} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    task.assignedVolunteer?._id === volunteer._id 
                      ? 'border-blue-200 bg-blue-50/50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer'
                  }`}
                  onClick={() => task.assignedVolunteer?._id !== volunteer._id && handleAssign(volunteer._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{volunteer.name}</h4>
                      <p className="text-xs text-gray-500">{volunteer.email}</p>
                    </div>
                  </div>
                  
                  {task.assignedVolunteer?._id === volunteer._id ? (
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                      Currently Assigned
                    </span>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                      disabled={assigningId === volunteer._id}
                    >
                      {assigningId === volunteer._id ? 'Assigning...' : (
                        <><UserPlus className="w-4 h-4 mr-1.5" /> Assign</>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignTaskModal;
