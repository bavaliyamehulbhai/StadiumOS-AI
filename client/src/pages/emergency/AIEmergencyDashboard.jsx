import React, { useState, useEffect } from 'react';
import { ShieldAlert, Bot, RefreshCw, AlertTriangle } from 'lucide-react';
import { useEmergency } from '@/context/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import toast from 'react-hot-toast';
import CommandBriefPanel from '@/components/emergency-ai/CommandBriefPanel';
import EmergencyTimeline from '@/components/emergency-ai/EmergencyTimeline';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const SEVERITY_STYLES = {
  Critical: 'border-l-red-600 bg-red-50/40',
  High: 'border-l-orange-500 bg-orange-50/40',
  Medium: 'border-l-yellow-400 bg-yellow-50/40',
  Low: 'border-l-blue-400 bg-blue-50/40',
};

const AIEmergencyDashboard = () => {
  const { activeBroadcasts: activeEmergencies = [], fetchActiveBroadcasts: fetchEmergencies, simulateCrisis } = useEmergency();
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-select first active emergency if nothing is selected
  useEffect(() => {
    if (activeEmergencies.length > 0 && !selectedEmergency) {
      setSelectedEmergency(activeEmergencies[0]);
    }
  }, [activeEmergencies]);

  const handleAnalyze = async (emergency, force = false) => {
    if (!emergency?._id) return;
    setSelectedEmergency(emergency);
    setAnalysis(null);
    setLoading(true);
    try {
      const res = await api.post('/ai/emergency/analyze', {
        emergencyId: emergency._id,
        force
      });
      setAnalysis(res.data.data);
    } catch (error) {
      toast.error('AI analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedEmergency) handleAnalyze(selectedEmergency, true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DashboardHeader
          title="AI Emergency Command Center"
          subtitle="AI-powered situation analysis, resource planning, and evacuation guidance."
        />
        <div className="flex items-center gap-3">
          <button
            onClick={() => { simulateCrisis(); fetchEmergencies(); toast.success('Simulated crisis triggered'); }}
            className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-bold flex items-center gap-2 text-sm transition-colors"
          >
            <ShieldAlert className="w-4 h-4" /> Simulate Crisis
          </button>
          <button
            onClick={fetchEmergencies}
            className="p-2 bg-white border border-gray-200 text-gray-500 hover:text-blue-600 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Emergency List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${activeEmergencies.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
            Active Emergencies ({activeEmergencies.length})
          </h3>

          {activeEmergencies.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center text-emerald-700">
              <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-bold">No active emergencies</p>
              <p className="text-sm mt-1">Stadium is operating normally.</p>
            </div>
          ) : (
            activeEmergencies.map(emergency => (
              <div
                key={emergency._id}
                className={`bg-white rounded-xl border-l-4 p-4 shadow-sm border border-gray-100 cursor-pointer transition-all hover:shadow-md ${SEVERITY_STYLES[emergency.severity]} ${selectedEmergency?._id === emergency._id ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                onClick={() => setSelectedEmergency(emergency)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        emergency.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        emergency.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {emergency.severity}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">{emergency.type}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">{emergency.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Zone: <strong>{emergency.zone}</strong></p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">{emergency.status}</span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleAnalyze(emergency); }}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-sm"
                >
                  <Bot className="w-3.5 h-3.5" /> Analyze with AI
                </button>
              </div>
            ))
          )}

          {/* Timeline for selected emergency */}
          {selectedEmergency && (
            <EmergencyTimeline emergency={selectedEmergency} hasAIAnalysis={!!analysis} />
          )}
        </div>

        {/* RIGHT: Command Brief */}
        <div className="lg:col-span-2">
          <CommandBriefPanel
            analysis={analysis}
            loading={loading}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default AIEmergencyDashboard;
