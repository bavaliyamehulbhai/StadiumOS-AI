import React, { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import api from '@/services/api';
import IncidentCard from '@/components/incident/IncidentCard';
import { useAuth } from '@/context/AuthContext';
import io from 'socket.io-client';

const MyIncidents = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyIncidents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/incidents');
      // The backend filters this automatically for volunteers based on assignedVolunteer or reportedBy
      setIncidents(data.data || []);
    } catch (error) {
      console.error('Failed to fetch incidents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIncidents();
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    if (user?.role) {
      socket.emit('join-room', user.role);
    }

    // A volunteer might be assigned a new incident live
    socket.on('incident:assigned', (newIncident) => {
      if (newIncident.assignedVolunteer?._id === user._id) {
        setIncidents(prev => {
          if (prev.some(inc => inc._id === newIncident._id)) {
            return prev.map(inc => inc._id === newIncident._id ? newIncident : inc);
          }
          return [newIncident, ...prev];
        });
      }
    });

    socket.on('incident:update', (updatedIncident) => {
      setIncidents(prev => prev.map(inc => 
        inc._id === updatedIncident._id ? updatedIncident : inc
      ));
    });

    return () => socket.disconnect();
  }, [user]);

  const assigned = incidents.filter(i => i.assignedVolunteer?._id === user?._id);
  const reported = incidents.filter(i => i.reportedBy?._id === user?._id && i.assignedVolunteer?._id !== user?._id);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-blue-600" /> My Tasks & Reports
        </h1>
        <p className="text-gray-500 mt-1">Manage your assigned incidents and track your reports.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Assigned to Me */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Assigned To Me ({assigned.length})</h2>
            {assigned.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assigned.map((incident) => (
                  <IncidentCard key={incident._id} incident={incident} role="Volunteer" />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500">You have no assigned tasks at the moment.</p>
              </div>
            )}
          </div>

          {/* Reported by Me */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Reported By Me ({reported.length})</h2>
            {reported.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reported.map((incident) => (
                  <IncidentCard key={incident._id} incident={incident} role="Volunteer" />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500">You haven't reported any incidents.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default MyIncidents;
