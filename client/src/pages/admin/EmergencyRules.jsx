import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { AlertTriangle, Power } from 'lucide-react';

const EmergencyRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRules = async () => {
    try {
      const { data } = await api.get('/admin/emergency-rules');
      if (data.success) setRules(data.data);
    } catch (error) {
      console.error('Failed to fetch emergency rules', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const toggleRule = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/emergency-rules/${id}`, { enabled: !currentStatus });
      fetchRules();
    } catch (error) {
      alert('Failed to update rule');
    }
  };

  if (loading) return <div className="p-8">Loading rules...</div>;

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Emergency Rules</h1>
        <p className="text-gray-500 mt-1">Configure automated responses for critical stadium events.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((rule) => (
          <div key={rule._id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between ${!rule.enabled ? 'opacity-60 grayscale' : 'border-red-100'}`}>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${rule.enabled ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                  <AlertTriangle size={24} />
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${rule.severity === 'Critical' ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-800'}`}>
                  {rule.severity}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{rule.type} Emergency</h3>
              
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {rule.actions.notifyOrganizer && <li>• Notify all Organizers</li>}
                {rule.actions.dispatchVolunteer && <li>• Auto-dispatch Volunteers</li>}
                {rule.actions.triggerAI && <li>• Trigger AI Analysis</li>}
                {rule.actions.showMapAlert && <li>• Display Map Alert</li>}
              </ul>
            </div>
            
            <button 
              onClick={() => toggleRule(rule._id, rule.enabled)}
              className={`mt-6 w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition ${
                rule.enabled ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Power size={16} /> {rule.enabled ? 'Disable Rule' : 'Enable Rule'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyRules;
