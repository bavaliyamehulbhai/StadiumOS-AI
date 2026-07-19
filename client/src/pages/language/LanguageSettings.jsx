import React, { useState, useEffect } from 'react';
import { Globe, Languages, Save, Sparkles, RefreshCw } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LanguageSelector from '@/components/language/LanguageSelector';
import api from '@/services/api';
import toast from 'react-hot-toast';

const LanguageSettings = () => {
  const [preferences, setPreferences] = useState({
    preferredLanguage: 'en',
    fallbackLanguage: 'en',
    autoDetect: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await api.get('/ai/language/preferences');
      if (res.data.data) {
        setPreferences(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to load language preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/ai/language/preferences', preferences);
      toast.success('Language preferences updated!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 flex justify-center"><RefreshCw className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <DashboardHeader 
        title="AI Multilingual Settings" 
        subtitle="Configure your language preferences for StadiumOS AI translations."
      />

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
        <div className="flex items-start gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
          <div className="p-2.5 bg-indigo-500 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900">Context-Aware AI Translation</h3>
            <p className="text-sm text-indigo-700 mt-1">
              StadiumOS AI will automatically reply in your preferred language. Critical stadium context (like Gate names and Ticket IDs) will remain untranslated to prevent confusion during emergencies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">Preferred Language</label>
            <LanguageSelector 
              value={preferences.preferredLanguage} 
              onChange={(val) => setPreferences({ ...preferences, preferredLanguage: val })} 
            />
            <p className="text-xs text-gray-500">The AI assistant will attempt to communicate entirely in this language.</p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">Fallback Language</label>
            <LanguageSelector 
              value={preferences.fallbackLanguage} 
              onChange={(val) => setPreferences({ ...preferences, fallbackLanguage: val })} 
            />
            <p className="text-xs text-gray-500">Used if translation fails or preferred language is ambiguous.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={preferences.autoDetect}
                onChange={(e) => setPreferences({ ...preferences, autoDetect: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
            <div>
              <span className="font-bold text-gray-900 text-sm block">Auto-detect input language</span>
              <span className="text-xs text-gray-500">AI will detect the language you type in.</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;
