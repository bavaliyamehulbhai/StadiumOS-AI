import React from 'react';
import CrowdIndicator from './CrowdIndicator';
import ETAWidget from './ETAWidget';
import AccessibilityRouteBadge from './AccessibilityRouteBadge';

const SmartRouteCard = ({ route, onSelect }) => {
  if (!route) return null;
  
  return (
    <div 
      className={`bg-white rounded-xl border-2 p-4 shadow-sm mb-4 cursor-pointer transition-all hover:shadow-md ${route.isPrimary ? 'border-blue-500' : 'border-gray-200'}`}
      onClick={() => onSelect(route)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-900">{route.routeName}</h3>
        <ETAWidget time={route.eta} />
      </div>
      <p className="text-sm text-gray-600 mb-3">{route.reason}</p>
      
      <div className="flex flex-wrap gap-2 items-center">
        <CrowdIndicator level={route.crowdLevel} />
        {/* If reason implies accessibility or name implies it, show badge. This would ideally be in the AI response JSON as a boolean. */}
        {(route.routeName.toLowerCase().includes('access') || route.reason.toLowerCase().includes('wheelchair') || route.reason.toLowerCase().includes('ramp')) && (
          <AccessibilityRouteBadge active={true} />
        )}
      </div>
      
      {route.warnings && route.warnings.length > 0 && (
        <div className="mt-3 space-y-1">
          {route.warnings.map((w, idx) => (
             <div key={idx} className="text-xs text-red-600 flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {w}
             </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SmartRouteCard;
