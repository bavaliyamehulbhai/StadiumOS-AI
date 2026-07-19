import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AnalyticsKPICard = ({ title, value, subValue, trend, icon: Icon, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-500">{title}</div>
          {Icon && (
            <div className={`p-2 rounded-full ${colorMap[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {subValue && <div className="text-sm text-gray-500">{subValue}</div>}
        </div>

        {trend && (
          <div className="mt-2 text-sm">
            <span className={trend.isPositive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-gray-500 ml-1">vs last match</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsKPICard;
