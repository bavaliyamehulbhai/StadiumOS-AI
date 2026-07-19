import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Radio, Map, AlertTriangle, Bot } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useEmergency } from '../../context/EmergencyContext';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { Link, useNavigate } from 'react-router-dom';

const EmergencyDashboard = () => {
  const { activeBroadcasts: activeEmergencies = [], fetchActiveBroadcasts: fetchEmergencies, simulateCrisis } = useEmergency();
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (id, status, evacuationRequired) => {
    try {
      setLoading(true);
      await api.patch(`/emergency/${id}`, { status, evacuationRequired });
      toast.success(`Emergency updated to ${status}`);
      fetchEmergencies();
    } catch (error) {
      toast.error('Failed to update emergency');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <DashboardHeader 
          title="Emergency Command Center" 
          subtitle="Manage active crises, coordinate volunteers, and declare evacuations." 
        />
      <div className="flex items-center gap-3">
          <Link 
            to="/organizer/emergency-ai"
            className="bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow-sm transition-all"
          >
            <Bot className="w-4 h-4" />
            AI Command Center
          </Link>
          <button 
            onClick={simulateCrisis}
            className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"
          >
            <ShieldAlert className="w-5 h-5" />
            Simulate Crisis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Active Reports</h3>
          
          {activeEmergencies.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center text-green-700">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-bold text-lg">No active emergencies</p>
              <p className="text-sm">The stadium is operating normally.</p>
            </div>
          ) : (
            activeEmergencies.map((emergency) => (
              <div key={emergency._id} className={`bg-white rounded-xl border-l-4 p-5 shadow-sm ${emergency.severity === 'Critical' ? 'border-red-600' : 'border-orange-500'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${emergency.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {emergency.severity}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">{emergency.type}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">{emergency.title}</h4>
                    <p className="text-gray-600 text-sm mt-1 mb-3">Zone: <span className="font-semibold">{emergency.zone}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {emergency.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 mt-2">
                  <button 
                    disabled={loading || emergency.status === 'Resolved'}
                    onClick={() => handleUpdateStatus(emergency._id, 'Resolved', false)}
                    className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-bold transition-colors"
                  >
                    Mark Resolved
                  </button>
                  
                  {emergency.severity !== 'Critical' && (
                    <button 
                      disabled={loading}
                      onClick={() => handleUpdateStatus(emergency._id, 'In Progress', true)}
                      className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
                    >
                      <AlertTriangle className="w-4 h-4" /> Upgrade to CRITICAL (Evacuate)
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-400" /> Dispatch Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                <span className="text-gray-300 text-sm">Medical Teams</span>
                <span className="font-bold text-green-400">Available</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                <span className="text-gray-300 text-sm">Security Detail</span>
                <span className="font-bold text-yellow-400">Dispatched (2)</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
                <span className="text-gray-300 text-sm">Fire Rescue</span>
                <span className="font-bold text-green-400">Standby</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-2">Safe Zones</h3>
            <p className="text-sm text-gray-500 mb-4">Current primary evacuation points</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Map className="w-4 h-4 text-green-600" /> 
                <span className="font-medium">Gate A (North Exit)</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Map className="w-4 h-4 text-green-600" /> 
                <span className="font-medium">Gate D (South Exit)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
