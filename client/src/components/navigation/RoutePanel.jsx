import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Navigation, Clock, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const RoutePanel = ({ destination, routes, activeRouteType, onSelectRoute, onClose }) => {
  if (!destination || !routes) return null;

  const renderRouteOption = (type, data) => {
    const isActive = activeRouteType === type;
    
    let Icon = Navigation;
    let label = 'Fastest Route';
    let subtitle = 'Normal crowd';
    let colorClass = isActive ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50 border-gray-100';
    let textClass = isActive ? 'text-blue-700' : 'text-gray-700';

    if (type === 'Accessible') {
      Icon = Activity;
      label = 'Accessible Route';
      subtitle = 'Wheelchair-friendly';
      if (isActive) {
        colorClass = 'bg-emerald-50 border-emerald-200';
        textClass = 'text-emerald-700';
      }
    } else if (type === 'Emergency') {
      Icon = AlertTriangle;
      label = 'Emergency Route';
      subtitle = 'Fastest to exit';
      if (isActive) {
        colorClass = 'bg-red-50 border-red-200';
        textClass = 'text-red-700';
      }
    }

    return (
      <button 
        key={type}
        onClick={() => onSelectRoute(type)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border mb-2 text-left transition-colors ${colorClass}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-100'}`}>
            <Icon className={`w-4 h-4 ${textClass}`} />
          </div>
          <div>
            <h4 className={`font-semibold text-sm ${textClass}`}>{label}</h4>
            <p className="text-[10px] text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-bold text-sm ${textClass}`}>{data.eta} min</div>
          <div className="text-[10px] text-gray-500">{data.distance}m</div>
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-4 w-[320px] max-w-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="text-lg">{destination.icon}</span> Navigate to {destination.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">Select your preferred route below</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-1 mt-2">
        {routes.Fastest && renderRouteOption('Fastest', routes.Fastest)}
        {routes.Accessible && renderRouteOption('Accessible', routes.Accessible)}
        {routes.Emergency && renderRouteOption('Emergency', routes.Emergency)}
      </div>

      <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md">
        <Navigation className="w-4 h-4 mr-2" />
        Start Navigation
      </Button>
    </div>
  );
};

export default RoutePanel;
