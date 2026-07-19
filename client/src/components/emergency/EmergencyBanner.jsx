import React from 'react';
import { AlertTriangle, Map, ShieldAlert } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { Link } from 'react-router-dom';

const EmergencyBanner = () => {
  const { isCrisisMode, crisisData } = useEmergency();

  if (!isCrisisMode || !crisisData) return null;

  return (
    <div className="bg-red-600 text-white w-full sticky top-0 z-[100] shadow-2xl animate-pulse-slow border-b-4 border-red-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full animate-bounce">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-black text-lg tracking-wider uppercase">CRITICAL EMERGENCY: {crisisData.type}</h3>
            <p className="text-red-100 text-sm font-medium">
              Location: {crisisData.zone}. {crisisData.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link 
            to="/map?emergency=true"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-red-700 px-6 py-2 rounded-lg font-bold hover:bg-red-50 transition-colors shadow-lg"
          >
            <Map className="w-4 h-4" />
            View Safe Route
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
