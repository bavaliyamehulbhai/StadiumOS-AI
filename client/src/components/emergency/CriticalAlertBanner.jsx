import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, Map, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const CriticalAlertBanner = () => {
  const { isCrisisMode, crisisData, acknowledgeBroadcast } = useEmergency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isCrisisMode || !crisisData) return null;

  // Don't show the banner if user is on the broadcast center itself to avoid clutter
  if (location.pathname === '/organizer/broadcast') return null;

  const roleStr = user?.role?.toLowerCase() || 'fan';
  const message = crisisData.instructions?.[roleStr] || crisisData.message;

  const handleAcknowledge = async () => {
    await acknowledgeBroadcast(crisisData._id);
    setAcknowledged(true);
  };

  const isCritical = crisisData.severity === 'CRITICAL';
  
  return (
    <div className={`w-full ${isCritical ? 'bg-red-600' : 'bg-orange-500'} text-white px-4 py-3 shadow-lg z-[100] relative`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3 w-full">
          <div className="bg-white/20 p-2 rounded-full shrink-0">
            <AlertTriangle className="w-6 h-6 animate-pulse text-white" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-lg uppercase tracking-wider">
              {isCritical ? 'CRITICAL EMERGENCY' : 'HIGH PRIORITY ALERT'}: {crisisData.title}
            </h3>
            <p className="text-white/90 text-sm mt-1">{message}</p>
            {crisisData.avoidZoneIds && crisisData.avoidZoneIds.length > 0 && (
              <p className="text-white/90 font-medium text-sm mt-1">
                Avoid Zones: {crisisData.avoidZoneIds.join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-white text-white hover:bg-white hover:text-red-600"
            onClick={() => navigate(user?.role === 'Organizer' || user?.role === 'Admin' ? '/organizer/map' : '/map')}
          >
            <Map className="w-4 h-4 mr-2" />
            View Map
          </Button>

          {crisisData.requiresAcknowledgement && !acknowledged && (
            <Button 
              variant="default" 
              size="sm" 
              className="bg-white text-red-600 hover:bg-gray-100"
              onClick={handleAcknowledge}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              I Understand
            </Button>
          )}

          {acknowledged && (
            <span className="text-sm font-medium flex items-center gap-1 opacity-80">
              <CheckCircle className="w-4 h-4" /> Acknowledged
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertBanner;
