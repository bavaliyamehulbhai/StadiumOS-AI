import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Accessibility, Navigation, Car, AlertTriangle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AccessibilityAssistantCard = () => {
  const { profile } = useAccessibility();
  const navigate = useNavigate();

  // If no major mobility feature is enabled, don't show the active assistant card
  if (!profile?.wheelchair && !profile?.seniorCitizen) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Accessibility className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Accessibility Mode</h3>
              <p className="text-sm text-gray-500">Configure visual and mobility support</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/fan/accessibility')}>
            Settings
          </Button>
        </div>
      </div>
    );
  }

  // Active assistant view
  return (
    <div className="bg-blue-600 rounded-xl shadow-md overflow-hidden mb-6 text-white">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Accessibility className="w-5 h-5 opacity-90" />
            <h3 className="font-bold text-lg">Accessibility Assistant</h3>
          </div>
          <button onClick={() => navigate('/fan/accessibility')} className="text-blue-100 hover:text-white text-sm flex items-center">
            Settings <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <p className="text-blue-100 text-sm mb-5">
          Based on your profile, here are the closest accessible facilities to your seat:
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
               onClick={() => navigate('/fan/navigation')}>
            <Navigation className="w-5 h-5 mb-2 text-blue-200" />
            <p className="text-xs text-blue-200">Nearest Gate</p>
            <p className="font-semibold">Gate C (Accessible)</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
               onClick={() => navigate('/fan/transport')}>
            <Car className="w-5 h-5 mb-2 text-blue-200" />
            <p className="text-xs text-blue-200">Wheelchair Parking</p>
            <p className="font-semibold">Zone P5 (3 Spots)</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm flex items-center justify-between cursor-pointer hover:bg-white/20 transition-colors">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-300" />
            <div>
              <p className="font-semibold text-sm">Emergency Support</p>
              <p className="text-xs text-blue-200">View accessible evacuation route</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-200" />
        </div>
      </div>
    </div>
  );
};

export default AccessibilityAssistantCard;
