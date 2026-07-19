import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import toast from 'react-hot-toast';
import TaskForm from '@/components/task/TaskForm';
import { useAuth } from '@/context/AuthContext';

const AssignTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await api.post('/tasks', formData);
      toast.success('Task created successfully');
      navigate(user?.role === 'Admin' ? '/admin/tasks' : '/organizer/tasks');
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.errors 
        ? errorData.errors[0].msg 
        : errorData?.message || 'Failed to create task';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
          className="border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create New Task</h1>
          <p className="text-sm text-gray-500 mt-0.5">Define a task and optionally dispatch a volunteer immediately.</p>
        </div>
      </div>

      <TaskForm onSubmit={handleSubmit} loading={loading} />
      
    </div>
  );
};

export default AssignTask;
