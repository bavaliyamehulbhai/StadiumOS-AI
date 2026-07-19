import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Button } from '@/components/ui/button';

import { Accessibility, Eye, Ear, User, Type, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

const SimpleSwitch = ({ checked, onCheckedChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
);

const AccessibilitySettings = () => {
  const { profile, updateProfile, loading } = useAccessibility();
  const [saving, setSaving] = useState(false);

  const [localProfile, setLocalProfile] = useState(profile);

  // Sync local state if context updates
  React.useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading settings...</div>;

  const handleChange = (key, value) => {
    setLocalProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateProfile(localProfile);
    if (success) {
      toast.success('Accessibility preferences updated');
    } else {
      toast.error('Failed to save preferences');
    }
    setSaving(false);
  };

  const options = [
    {
      id: 'wheelchair',
      title: 'Wheelchair Navigation',
      description: 'Prioritize ramps and elevators. Avoid stairs.',
      icon: <Accessibility className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'visualSupport',
      title: 'Visual Assistance',
      description: 'Enable audio cues and larger touch targets.',
      icon: <Eye className="w-5 h-5 text-indigo-500" />
    },
    {
      id: 'hearingSupport',
      title: 'Hearing Assistance',
      description: 'Convert audio announcements into visual alerts.',
      icon: <Ear className="w-5 h-5 text-pink-500" />
    },
    {
      id: 'seniorCitizen',
      title: 'Senior Citizen Mode',
      description: 'Simplify the interface and increase element sizes.',
      icon: <User className="w-5 h-5 text-green-500" />
    }
  ];

  const displayOptions = [
    {
      id: 'highContrast',
      title: 'High Contrast Mode',
      description: 'Increase color contrast for better readability.',
      icon: <Palette className="w-5 h-5 text-orange-500" />
    },
    {
      id: 'largeText',
      title: 'Large Text',
      description: 'Increase overall font size across the app.',
      icon: <Type className="w-5 h-5 text-purple-500" />
    }
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Accessibility Settings</h1>
        <p className="text-gray-500 mt-1">Customize StadiumOS to match your specific needs.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b bg-gray-50/50">
          <h2 className="font-semibold text-gray-900">Mobility & Support</h2>
        </div>
        <div className="divide-y">
          {options.map((opt) => (
            <div key={opt.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                  {opt.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{opt.title}</h3>
                  <p className="text-sm text-gray-500">{opt.description}</p>
                </div>
              </div>
              <SimpleSwitch 
                checked={localProfile[opt.id]} 
                onCheckedChange={(checked) => handleChange(opt.id, checked)} 
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b bg-gray-50/50">
          <h2 className="font-semibold text-gray-900">Display & Interface</h2>
        </div>
        <div className="divide-y">
          {displayOptions.map((opt) => (
            <div key={opt.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                  {opt.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{opt.title}</h3>
                  <p className="text-sm text-gray-500">{opt.description}</p>
                </div>
              </div>
              <SimpleSwitch 
                checked={localProfile[opt.id]} 
                onCheckedChange={(checked) => handleChange(opt.id, checked)} 
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button 
          variant="outline" 
          onClick={() => setLocalProfile(profile)}
          disabled={saving}
        >
          Reset
        </Button>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
