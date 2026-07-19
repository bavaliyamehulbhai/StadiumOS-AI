import React from 'react';
import { Navigation2, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const MarkerPopup = ({ poi, isMain, onNavigate }) => {
  const { user } = useAuth();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-red-100 text-red-700';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="w-64 p-1">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-gray-900 text-sm m-0">
          {poi.icon} {poi.name}
        </h3>
      </div>
      
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
        {poi.description || `Standard ${poi.type} facility.`}
      </p>

      <div className="flex gap-2 mb-4">
        {poi.status && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(poi.status)}`}>
            {poi.status}
          </span>
        )}
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
          {poi.type}
        </span>
      </div>

      {user?.role === 'Organizer' && !isMain && (
        <div className="mb-3 p-2 bg-slate-50 rounded border border-slate-100 flex items-start gap-2">
          <Info className="w-3 h-3 text-blue-500 mt-0.5" />
          <div className="text-[10px] text-slate-600">
            <span className="font-semibold block text-slate-700">Crowd Level: Low</span>
            No active incidents.
          </div>
        </div>
      )}

      {user?.role === 'Organizer' && isMain && (
        <div className="mb-3 p-2 bg-red-50 rounded border border-red-100 flex items-start gap-2">
          <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5" />
          <div className="text-[10px] text-red-700">
            <span className="font-semibold block">1 Active Incident</span>
            Medical emergency at Gate B.
          </div>
        </div>
      )}

      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"
        onClick={() => {
          if (onNavigate) {
            onNavigate(poi);
          } else {
            // For now, redirect to navigation with URL parameter
            window.location.href = `/map?destination=${poi._id}`;
          }
        }}
      >
        <Navigation2 className="w-3 h-3 mr-2" />
        Navigate Here
      </Button>
    </div>
  );
};

export default MarkerPopup;
