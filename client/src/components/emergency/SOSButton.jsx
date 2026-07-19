import React, { useState } from 'react';
import { AlertCircle, Flame, ShieldAlert, X, HeartPulse, UserX } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SOSButton = () => {
  const { user } = useAuth();
  const { isCrisisMode } = useEmergency();
  const [isOpen, setIsOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  // If we are already in crisis mode, the banner is showing. SOS is still available for other localized things, but maybe hide if we want to focus. Let's keep it available.
  
  // Only Fans and Volunteers typically use the floating SOS (Organizers have their dashboard)
  if (!user || user.role === 'Organizer' || user.role === 'Admin') return null;

  const handleReport = async (type, severity, description) => {
    setIsReporting(true);
    try {
      // Mock coordinates for Fan (we'd use geolocation in reality)
      await api.post('/emergency', {
        title: `${type} Emergency Reported`,
        type,
        severity,
        stadiumId: user.stadiumId || '6618d39c5950d8112c37e6f1', // fallback to Lusail
        zone: 'Fan Current Location',
        location: { latitude: 25.4200, longitude: 51.4900 },
        description
      });
      toast.success('Emergency Services Dispatched!', { duration: 5000, icon: '🚓' });
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to report emergency. Find a volunteer immediately!');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-[999] animate-pulse-slow border-4 border-red-800"
      >
        <div className="flex flex-col items-center">
          <AlertCircle className="w-8 h-8" />
          <span className="text-[10px] font-black uppercase mt-0.5">SOS</span>
        </div>
      </button>

      {/* SOS Bottom Sheet / Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:w-96 sm:rounded-2xl rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-red-600 uppercase flex items-center gap-2">
                <AlertCircle className="w-6 h-6" /> Emergency SOS
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6 font-medium">
              Only use these buttons in a genuine emergency. Security will be dispatched to your GPS location immediately.
            </p>

            <div className="space-y-4">
              <button 
                disabled={isReporting}
                onClick={() => handleReport('Medical', 'High', 'Fan requested immediate medical assistance via SOS.')}
                className="w-full flex items-center p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl transition-colors text-left"
              >
                <div className="bg-red-600 p-3 rounded-full mr-4 text-white">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-red-900">Medical Emergency</h3>
                  <p className="text-sm text-red-700">Heart attack, injury, fainting</p>
                </div>
              </button>

              <button 
                disabled={isReporting}
                onClick={() => handleReport('Fire', 'Critical', 'Fan reported Fire/Smoke via SOS.')}
                className="w-full flex items-center p-4 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-xl transition-colors text-left"
              >
                <div className="bg-orange-600 p-3 rounded-full mr-4 text-white">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-900">Fire / Smoke</h3>
                  <p className="text-sm text-orange-700">Flames or heavy smoke detected</p>
                </div>
              </button>

              <button 
                disabled={isReporting}
                onClick={() => handleReport('Security Threat', 'High', 'Fan reported a Security Threat via SOS.')}
                className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition-colors text-left"
              >
                <div className="bg-blue-600 p-3 rounded-full mr-4 text-white">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Security Threat</h3>
                  <p className="text-sm text-blue-700">Violence, suspicious package</p>
                </div>
              </button>

              <button 
                disabled={isReporting}
                onClick={() => handleReport('Lost Child', 'Medium', 'Fan reported a Lost Child via SOS.')}
                className="w-full flex items-center p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-xl transition-colors text-left"
              >
                <div className="bg-purple-600 p-3 rounded-full mr-4 text-white">
                  <UserX className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-purple-900">Lost Child</h3>
                  <p className="text-sm text-purple-700">Missing minor or separated group</p>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 py-3 text-gray-500 font-semibold hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
