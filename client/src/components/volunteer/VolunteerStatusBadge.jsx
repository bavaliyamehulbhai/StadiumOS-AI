import React, { useState } from 'react';
import { Power, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import toast from 'react-hot-toast';

const VolunteerStatusBadge = () => {
  const { user } = useAuth();
  // Ensure we are checking if user exists
  const [status, setStatus] = useState(user?.availability || 'Offline');
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'Volunteer') return null;

  const statuses = [
    { value: 'Available', color: 'bg-green-500', icon: CheckCircle, border: 'border-green-200' },
    { value: 'Busy', color: 'bg-orange-500', icon: Clock, border: 'border-orange-200' },
    { value: 'Emergency', color: 'bg-red-500', icon: AlertTriangle, border: 'border-red-200' },
    { value: 'Offline', color: 'bg-gray-400', icon: Power, border: 'border-gray-200' }
  ];

  const currentStatusObj = statuses.find(s => s.value === status) || statuses[3];
  const Icon = currentStatusObj.icon;

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const { data } = await api.patch('/volunteers/status', { availability: newStatus });
      setStatus(data.data.availability);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group inline-block z-10">
      <button 
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white shadow-sm transition-all hover:bg-gray-50 ${currentStatusObj.border}`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${currentStatusObj.color} ${status === 'Available' ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-medium text-gray-700">{loading ? 'Updating...' : status}</span>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
        <div className="p-1">
          {statuses.map(s => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-gray-50
                ${status === s.value ? 'bg-gray-50 font-medium' : 'text-gray-600'}
              `}
            >
              <s.icon className={`w-4 h-4 ${s.color.replace('bg-', 'text-')}`} />
              {s.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerStatusBadge;
