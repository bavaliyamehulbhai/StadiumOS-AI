import React from 'react';
import { Activity, Server, Database, Globe, Cpu, AlertTriangle, CheckCircle, WifiOff } from 'lucide-react';

const StatusIcon = ({ status, size = 20 }) => {
  if (status === 'HEALTHY') return <CheckCircle size={size} className="text-emerald-500" />;
  if (status === 'DEGRADED') return <AlertTriangle size={size} className="text-yellow-500" />;
  if (status === 'CRITICAL') return <AlertTriangle size={size} className="text-red-500" />;
  return <WifiOff size={size} className="text-gray-400" />;
};

const ServiceStatusGrid = ({ services = {} }) => {
  const { api, database, socket, ai } = services;

  const renderCard = (title, icon, data) => {
    if (!data) return null;
    
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
              {icon}
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <StatusIcon status={data.status} />
        </div>
        
        <div className="space-y-3">
          {data.avgLatency !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Avg Latency</span>
              <span className="font-medium text-gray-900">{data.avgLatency}ms</span>
            </div>
          )}
          {data.errorRate !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Error Rate</span>
              <span className="font-medium text-gray-900">{data.errorRate}%</span>
            </div>
          )}
          {data.latency !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ping</span>
              <span className="font-medium text-gray-900">{data.latency}ms</span>
            </div>
          )}
          {data.activeClients !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Connected Clients</span>
              <span className="font-medium text-gray-900">{data.activeClients}</span>
            </div>
          )}
          {data.failureRate !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Failure Rate</span>
              <span className="font-medium text-gray-900">{data.failureRate}%</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {renderCard('REST API', <Server size={20} />, api)}
      {renderCard('MongoDB', <Database size={20} />, database)}
      {renderCard('Socket.io', <Globe size={20} />, socket)}
      {renderCard('Groq AI Provider', <Cpu size={20} />, ai)}
    </div>
  );
};

export default ServiceStatusGrid;
