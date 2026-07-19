import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

const SUPPORTED_LANGUAGES = [
  { code: 'en', native: 'English' },
  { code: 'hi', native: 'हिन्दी' },
  { code: 'gu', native: 'ગુજરાતી' },
  { code: 'es', native: 'Español' },
  { code: 'fr', native: 'Français' }
];

const LanguageSwitcher = () => {
  const [pref, setPref] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchPref();
  }, []);

  const fetchPref = async () => {
    try {
      const res = await api.get('/ai/language/preferences');
      if (res.data?.data?.preferredLanguage) {
        setPref(res.data.data.preferredLanguage);
      }
    } catch (e) {
      // fail silently for header widget
    }
  };

  const updatePref = async (code) => {
    setPref(code);
    setIsOpen(false);
    toast.success(`Language changed to ${SUPPORTED_LANGUAGES.find(l => l.code === code)?.native}`);
    try {
      await api.patch('/ai/language/preferences', { preferredLanguage: code });
    } catch (e) {
      toast.error('Failed to save language preference');
    }
  };

  const activeLang = SUPPORTED_LANGUAGES.find(l => l.code === pref) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-bold text-gray-700"
      >
        <Globe className="w-4 h-4 text-blue-600" />
        <span className="hidden sm:inline">{activeLang.native}</span>
        <span className="sm:hidden">{activeLang.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden">
            <div className="px-3 pb-2 mb-2 border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Select Language
            </div>
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => updatePref(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${pref === lang.code ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
              >
                {lang.native}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
