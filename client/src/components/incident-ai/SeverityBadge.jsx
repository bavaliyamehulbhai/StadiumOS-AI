import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

const SeverityBadge = ({ severity, confidence }) => {
  const getSeverityStyles = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: <ShieldAlert className="w-4 h-4 mr-1.5" />
        };
      case 'high':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          border: 'border-orange-200',
          icon: <AlertTriangle className="w-4 h-4 mr-1.5" />
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          border: 'border-yellow-200',
          icon: <AlertCircle className="w-4 h-4 mr-1.5" />
        };
      case 'low':
      default:
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: <CheckCircle2 className="w-4 h-4 mr-1.5" />
        };
    }
  };

  const styles = getSeverityStyles(severity);

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full border ${styles.bg} ${styles.border} ${styles.text}`}>
      {styles.icon}
      <span className="text-sm font-bold uppercase tracking-wider">{severity}</span>
      {confidence && (
        <span className="ml-2 pl-2 border-l border-current opacity-80 text-xs font-semibold">
          {confidence}% CONF
        </span>
      )}
    </div>
  );
};

export default SeverityBadge;
