import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPIWidget = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
            trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 
            trend === 'down' ? 'text-rose-700 bg-rose-50' : 
            'text-gray-600 bg-gray-100'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
             trend === 'down' ? <TrendingDown className="w-3 h-3" /> : 
             <Minus className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-gray-500 font-semibold text-xs tracking-wider uppercase mb-1">{title}</h4>
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
      </div>
    </div>
  );
};

export default KPIWidget;
