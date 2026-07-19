import React from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'English', label: 'English' },
  { code: 'Hindi', label: 'Hindi' },
  { code: 'Gujarati', label: 'Gujarati' },
  { code: 'Spanish', label: 'Spanish' },
  { code: 'French', label: 'French' },
  { code: 'Arabic', label: 'Arabic' }
];

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-transparent border border-border rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
