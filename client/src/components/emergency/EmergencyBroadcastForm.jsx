import React, { useState } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { X, Send, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const templates = [
  { type: 'FIRE', title: 'Fire Alert', message: 'A fire-related incident has been reported.', severity: 'CRITICAL', fanIns: 'Evacuate immediately.', volIns: 'Assist evacuation.' },
  { type: 'MEDICAL', title: 'Medical Emergency', message: 'Medical emergency reported.', severity: 'HIGH', fanIns: 'Clear the area for medics.', volIns: 'Guide medical team.' },
  { type: 'CROWD_CRUSH', title: 'Crowd Congestion', message: 'Severe crowd congestion detected.', severity: 'CRITICAL', fanIns: 'Avoid this zone.', volIns: 'Divert crowd away.' }
];

const EmergencyBroadcastForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'GENERAL',
    severity: 'MEDIUM',
    targetRoles: ['Fan', 'Volunteer', 'Organizer'],
    targetZones: [],
    fanInstruction: '',
    volunteerInstruction: '',
    requiresAcknowledgement: false
  });

  const handleTemplateSelect = (t) => {
    setFormData({
      ...formData,
      title: t.title,
      message: t.message,
      type: t.type,
      severity: t.severity,
      fanInstruction: t.fanIns,
      volunteerInstruction: t.volIns
    });
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  const submitBroadcast = async (isDraft) => {
    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        severity: formData.severity,
        targetRoles: formData.targetRoles,
        targetZones: formData.targetZones,
        requiresAcknowledgement: formData.requiresAcknowledgement,
        instructions: {
          fan: formData.fanInstruction,
          volunteer: formData.volunteerInstruction
        }
      };

      // Create draft first
      const draftRes = await api.post('/emergency-broadcasts', payload);
      
      if (!isDraft) {
        if (formData.severity === 'CRITICAL') {
          const confirmActivate = window.confirm('WARNING: Activating a CRITICAL emergency will send global alerts and trigger evacuation protocols. Are you absolutely sure?');
          if (!confirmActivate) return;
        }
        await api.post(`/emergency-broadcasts/${draftRes.data.data._id}/activate`);
        toast.success('Emergency Broadcast Activated!');
      } else {
        toast.success('Draft Saved Successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error('Failed to process broadcast');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col my-8">
        
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            New Emergency Broadcast
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {templates.map(t => (
                <button 
                  key={t.type} 
                  onClick={() => handleTemplateSelect(t)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 shrink-0"
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Evacuation Required"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Severity</label>
              <select 
                className={`w-full p-2 border rounded-lg outline-none font-semibold ${
                  formData.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' : 
                  formData.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''
                }`}
                value={formData.severity}
                onChange={e => setFormData({...formData, severity: e.target.value})}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Main Message (Internal/Default)</label>
            <textarea 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              placeholder="Describe the emergency..."
            />
          </div>

          <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="font-semibold text-gray-800">Targeting</h4>
            <div>
              <label className="text-sm font-medium block mb-2">Target Roles</label>
              <div className="flex flex-wrap gap-2">
                {['Fan', 'Volunteer', 'Organizer', 'Admin'].map(role => (
                  <label key={role} className="flex items-center gap-2 bg-white px-3 py-1.5 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      checked={formData.targetRoles.includes(role)} 
                      onChange={() => handleRoleToggle(role)} 
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 border-b pb-1">Role-Specific Instructions</h4>
            
            {formData.targetRoles.includes('Fan') && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-blue-700">Fan Instruction</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-blue-100 rounded-lg outline-none"
                  value={formData.fanInstruction}
                  onChange={e => setFormData({...formData, fanInstruction: e.target.value})}
                  placeholder="What should fans do?"
                />
              </div>
            )}

            {formData.targetRoles.includes('Volunteer') && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-green-700">Volunteer Instruction</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-green-100 rounded-lg outline-none"
                  value={formData.volunteerInstruction}
                  onChange={e => setFormData({...formData, volunteerInstruction: e.target.value})}
                  placeholder="What should volunteers do?"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="ack" 
              checked={formData.requiresAcknowledgement}
              onChange={e => setFormData({...formData, requiresAcknowledgement: e.target.checked})}
            />
            <label htmlFor="ack" className="text-sm font-medium">Require Acknowledgement</label>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3 sticky bottom-0">
          <Button variant="outline" onClick={() => submitBroadcast(true)}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => submitBroadcast(false)}>
            <Send className="w-4 h-4 mr-2" />
            Activate Broadcast
          </Button>
        </div>

      </div>
    </div>
  );
};

export default EmergencyBroadcastForm;
