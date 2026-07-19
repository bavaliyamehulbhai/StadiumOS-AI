import React from 'react';
import { Accessibility } from 'lucide-react';

const AccessibilityRouteBadge = ({ active }) => {
  if (!active) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-semibold">
      <Accessibility size={12} /> Accessible
    </span>
  );
};
export default AccessibilityRouteBadge;
