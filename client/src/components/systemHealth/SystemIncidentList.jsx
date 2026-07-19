import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SystemIncidentList = ({ incidents, onIncidentUpdate }) => {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Incidents</h3>
        <p className="text-gray-500">All systems are operating normally.</p>
      </div>
    );
  }

  const handleAcknowledge = async (id) => {
    try {
      await api.patch(`/system-health/incidents/${id}/acknowledge`);
      toast.success('Incident acknowledged');
      if (onIncidentUpdate) onIncidentUpdate();
    } catch (error) {
      toast.error('Failed to acknowledge incident');
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.patch(`/system-health/incidents/${id}/resolve`);
      toast.success('Incident manually resolved');
      if (onIncidentUpdate) onIncidentUpdate();
    } catch (error) {
      toast.error('Failed to resolve incident');
    }
  };

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div 
          key={incident._id} 
          className={`border rounded-lg p-4 ${
            incident.severity === 'CRITICAL' ? 'border-red-200 bg-red-50/30' : 'border-yellow-200 bg-yellow-50/30'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${incident.severity === 'CRITICAL' ? 'text-red-500' : 'text-yellow-500'}`}>
                {incident.severity === 'CRITICAL' ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{incident.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    Detected: {new Date(incident.detectedAt).toLocaleTimeString()}
                  </span>
                  <span className="font-medium px-2 py-0.5 rounded-full bg-white border shadow-sm">
                    {incident.service}
                  </span>
                  <span className={`font-medium px-2 py-0.5 rounded-full shadow-sm ${
                    incident.status === 'OPEN' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {incident.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {incident.status === 'OPEN' && (
                <button 
                  onClick={() => handleAcknowledge(incident._id)}
                  className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Acknowledge
                </button>
              )}
              <button 
                onClick={() => handleResolve(incident._id)}
                className="px-3 py-1.5 text-sm font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemIncidentList;
