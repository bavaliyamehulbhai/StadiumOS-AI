import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Settings, Save, BellRing, Activity, ShieldAlert, Globe, Clock, Server, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';

const SystemSettings = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const { data } = await api.get('/admin/config');
      if (data.success) setConfig(data.data);
    } catch (error) {
      console.error('Failed to fetch config', error);
      toast.error('Failed to load system configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleToggle = async (field) => {
    try {
      const newConfig = { ...config, [field]: !config[field] };
      setConfig(newConfig);
      await api.patch('/admin/config', { [field]: newConfig[field] });
      toast.success(`${field} updated successfully!`);
    } catch (error) {
      console.error('Failed to update config', error);
      toast.error('Failed to update toggle setting');
      setConfig(config); // Revert on failure
    }
  };

  const handleSaveText = async (field) => {
    try {
      await api.patch('/admin/config', { [field]: config[field] });
      toast.success(`${field} saved successfully!`);
    } catch (error) {
      toast.error('Failed to save setting');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <Server className="w-12 h-12 text-blue-400 mb-4 animate-bounce" />
        <p className="text-gray-500 font-medium">Connecting to Core Servers...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Preferences</h1>
            <p className="text-gray-500 mt-1">Configure global behavior, regional settings, and platform states.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Localization & Branding */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4 mb-6">
            <Globe className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Localization & Identity</h2>
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2">Platform Name</label>
            <p className="text-sm text-gray-500 mb-3">The public facing name of the deployment (e.g., FIFA 2026 AI).</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                name="platformName" 
                value={config?.platformName || 'StadiumOS AI'} 
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              <button onClick={() => handleSaveText('platformName')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 rounded-xl transition font-medium">Save</button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2">Default Language</label>
            <div className="flex gap-2">
              <select 
                name="defaultLanguage" 
                value={config?.defaultLanguage || 'en'} 
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="en">English (US)</option>
                <option value="es">Spanish (ES)</option>
                <option value="fr">French (FR)</option>
                <option value="hi">Hindi (IN)</option>
              </select>
              <button onClick={() => handleSaveText('defaultLanguage')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 rounded-xl transition font-medium">Save</button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2">Timezone</label>
            <div className="flex gap-2">
              <select 
                name="timezone" 
                value={config?.timezone || 'UTC'} 
                onChange={handleChange}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="UTC">UTC (Universal Coordinated Time)</option>
                <option value="America/New_York">EST (New York)</option>
                <option value="Europe/London">GMT (London)</option>
                <option value="Asia/Kolkata">IST (New Delhi)</option>
              </select>
              <button onClick={() => handleSaveText('timezone')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 rounded-xl transition font-medium">Save</button>
            </div>
          </div>
        </div>

        {/* Global Features */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4 mb-6">
            <Monitor className="text-indigo-500" />
            <h2 className="text-xl font-bold text-gray-800">Core Services</h2>
          </div>

          <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition">
            <div>
              <span className="block font-bold text-gray-900 flex items-center gap-2"><BellRing size={18} className="text-blue-500"/> Push Notifications</span>
              <span className="text-sm text-gray-500">Enable or disable system-wide Socket.io real-time alerts.</span>
            </div>
            <div className="relative ml-4">
              <input type="checkbox" className="sr-only" checked={config?.notificationEnabled} onChange={() => handleToggle('notificationEnabled')} />
              <div className={`block w-14 h-8 rounded-full transition-colors ${config?.notificationEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${config?.notificationEnabled ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition">
            <div>
              <span className="block font-bold text-gray-900 flex items-center gap-2"><Activity size={18} className="text-indigo-500"/> Crowd Simulation</span>
              <span className="text-sm text-gray-500">Run the internal density simulation engine to mimic live match data.</span>
            </div>
            <div className="relative ml-4">
              <input type="checkbox" className="sr-only" checked={config?.simulationMode} onChange={() => handleToggle('simulationMode')} />
              <div className={`block w-14 h-8 rounded-full transition-colors ${config?.simulationMode ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${config?.simulationMode ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </label>

          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center justify-between cursor-pointer p-4 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition">
              <div>
                <span className="block font-bold text-red-800 flex items-center gap-2"><ShieldAlert size={18}/> Maintenance Mode</span>
                <span className="text-sm text-red-600">Instantly log out all non-admin users and disable API access.</span>
              </div>
              <div className="relative ml-4">
                <input type="checkbox" className="sr-only" checked={config?.maintenanceMode} onChange={() => handleToggle('maintenanceMode')} />
                <div className={`block w-14 h-8 rounded-full transition-colors ${config?.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${config?.maintenanceMode ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
