import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ShieldAlert, Plus, CheckCircle, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmergencyBroadcastForm from '../../components/emergency/EmergencyBroadcastForm';
import toast from 'react-hot-toast';

const EmergencyBroadcastCenter = () => {
  const { activeBroadcasts, isCrisisMode, fetchActiveBroadcasts } = useEmergency();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/emergency-broadcasts');
      setHistory(res.data.data.filter(b => b.status !== 'ACTIVE')); // only non-active in history
    } catch (error) {
      console.error('Failed to fetch broadcast history', error);
    }
  };

  const handleResolve = async (id) => {
    if (!window.confirm('Are you sure you want to resolve this emergency broadcast? This will remove the critical alerts across the platform.')) return;
    try {
      await api.post(`/emergency-broadcasts/${id}/resolve`);
      toast.success('Emergency resolved successfully');
      fetchActiveBroadcasts();
      fetchHistory();
    } catch (error) {
      toast.error('Failed to resolve emergency');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldAlert className={isCrisisMode ? "text-red-500 animate-pulse" : "text-gray-400"} />
            Emergency Command Center
          </h2>
          <p className="text-gray-500 mt-1">
            {isCrisisMode 
              ? '🚨 CRITICAL EMERGENCY MODE ACTIVE' 
              : 'System Status: Normal Operations'}
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create Broadcast
        </Button>
      </div>

      {isFormOpen && (
        <EmergencyBroadcastForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchActiveBroadcasts();
          }} 
        />
      )}

      {/* Active Broadcasts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Active Emergencies</h3>
        
        {activeBroadcasts.length === 0 ? (
          <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 text-center flex flex-col items-center">
            <CheckCircle className="w-10 h-10 mb-2 opacity-50" />
            <p className="font-medium">No active emergencies at this time.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeBroadcasts.map(broadcast => (
              <Card key={broadcast._id} className="border-red-200 bg-red-50/30 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${broadcast.severity === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-500'}`} />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-red-900">{broadcast.title}</CardTitle>
                    <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-800 rounded-md">
                      {broadcast.severity}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm font-medium">{broadcast.message}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 bg-white/50 p-3 rounded-lg border border-red-100/50">
                    <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Zones: {broadcast.targetZones?.length ? broadcast.targetZones.join(', ') : 'All'}</div>
                    <div className="flex items-center gap-1"><Users className="w-4 h-4" /> Roles: {broadcast.targetRoles?.length ? broadcast.targetRoles.join(', ') : 'All'}</div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-red-100">
                    <Button variant="outline" size="sm" onClick={() => handleResolve(broadcast._id)} className="border-green-200 text-green-700 hover:bg-green-50">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve Emergency
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div className="space-y-4 pt-8">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Broadcast History</h3>
        
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No historical broadcasts found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map(b => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" /> {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{b.type}</td>
                    <td className="px-4 py-3 text-gray-600">{b.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        b.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {b.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        b.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyBroadcastCenter;
