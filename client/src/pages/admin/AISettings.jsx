import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Bot, Save, BrainCircuit, Settings, ShieldAlert, Activity, Zap, Cpu, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const AISettings = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const { data } = await api.get('/admin/config');
      if (data.success) setConfig(data.data);
    } catch (error) {
      console.error('Failed to fetch config', error);
      toast.error('Failed to load AI configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : 
                 e.target.type === 'number' || e.target.type === 'range' ? Number(e.target.value) : 
                 e.target.value;
    setConfig({ ...config, [e.target.name]: value });
  };

  const handleSave = async () => {
    try {
      await api.patch('/admin/config', config);
      toast.success('AI Configuration updated successfully!');
    } catch (error) {
      toast.error('Failed to update config');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <BrainCircuit className="w-12 h-12 text-purple-400 mb-4 animate-bounce" />
        <p className="text-gray-500 font-medium">Loading Neural Engine Settings...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Intelligence Core</h1>
            <p className="text-gray-500 mt-1">Configure StadiumOS AI engine models, thresholds, and behavior.</p>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-200"
        >
          <Save size={20} /> Deploy Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Engine Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4 mb-6">
            <Cpu className="text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Engine Configuration</h2>
          </div>

          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="block font-bold text-gray-900">Master AI Switch</span>
                <span className="text-sm text-gray-500">Enable or disable all AI Orchestrator functions globally.</span>
              </div>
              <div className="relative">
                <input type="checkbox" name="aiEnabled" checked={config?.aiEnabled} onChange={handleChange} className="sr-only" />
                <div className={`block w-14 h-8 rounded-full transition-colors ${config?.aiEnabled ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${config?.aiEnabled ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2">Language Model Selection</label>
            <p className="text-sm text-gray-500 mb-3">Choose the underlying LLM powering the StadiumOS AI.</p>
            <select 
              name="aiModel" 
              value={config?.aiModel || 'llama-3.3-70b-versatile'} 
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
            >
              <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Recommended)</option>
              <option value="mixtral-8x7b-32768">Mixtral 8x7B (High Throughput)</option>
              <option value="gemma-7b-it">Gemma 7B (Fast Response)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2">AI Personality & Tone</label>
            <p className="text-sm text-gray-500 mb-3">Adjust how the AI communicates with Volunteers and Fans.</p>
            <select 
              name="aiPersonality" 
              value={config?.aiPersonality || 'Standard'} 
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
            >
              <option value="Standard">Standard (Professional & Clear)</option>
              <option value="Strict (Security Focus)">Strict (Authoritative, Emergency Focus)</option>
              <option value="Empathetic (Fan Focus)">Empathetic (Friendly & Reassuring)</option>
            </select>
          </div>
        </div>

        {/* Triggers and Automation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4 mb-6">
            <Zap className="text-amber-500" />
            <h2 className="text-xl font-bold text-gray-800">Triggers & Automation</h2>
          </div>

          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="block font-bold text-gray-900">Auto-Resolve Incidents</span>
                <span className="text-sm text-gray-500">Allow AI to automatically close incidents it detects as resolved.</span>
              </div>
              <div className="relative">
                <input type="checkbox" name="autoResolveIncidents" checked={config?.autoResolveIncidents || false} onChange={handleChange} className="sr-only" />
                <div className={`block w-14 h-8 rounded-full transition-colors ${config?.autoResolveIncidents ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${config?.autoResolveIncidents ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2 flex items-center justify-between">
              <span>AI Crowd Trigger Threshold</span>
              <span className="text-purple-700 font-black text-xl">{config?.aiCrowdTriggerThreshold}%</span>
            </label>
            <p className="text-sm text-gray-500 mb-4">When crowd density reaches this percentage, the AI Orchestrator will automatically wake up and issue routing commands.</p>
            <input 
              type="range" 
              name="aiCrowdTriggerThreshold" 
              min="50" max="100" 
              value={config?.aiCrowdTriggerThreshold || 80} 
              onChange={handleChange}
              className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-900 mb-2">AI Analysis Cooldown (ms)</label>
            <p className="text-sm text-gray-500 mb-3">Minimum time between automated AI insights to prevent API rate limits (Default: 30000ms / 30s).</p>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="number" 
                name="aiAnalysisCooldownMs" 
                value={config?.aiAnalysisCooldownMs || 30000} 
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AISettings;
