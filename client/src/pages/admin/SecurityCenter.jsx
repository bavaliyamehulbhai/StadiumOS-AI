import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SecurityCenter = () => {
  const [data, setData] = useState({
    activeIncidents: 0,
    lockedAccounts: 0,
    failedLogins: 0,
    recentThreats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        const response = await api.get('/admin/security');
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch security data', error);
        toast.error('Could not load security overview');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
    // Poll every 10 seconds for security updates
    const interval = setInterval(fetchSecurityData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <ShieldAlert className="w-12 h-12 text-blue-400 mb-4 animate-bounce" />
          <p className="text-gray-500 font-medium">Scanning Security Grid...</p>
        </div>
      </div>
    );
  }

  const isSecure = data.activeIncidents === 0 && data.recentThreats.length === 0;

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isSecure ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isSecure ? <CheckCircle size={28} /> : <AlertTriangle size={28} />}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security Center</h1>
            <p className="text-gray-500 mt-1">Platform security overview and access alerts.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900">{data.activeIncidents}</h2>
          <p className="text-gray-500 font-medium mt-1">Active Security Incidents</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900">{data.lockedAccounts}</h2>
          <p className="text-gray-500 font-medium mt-1">Locked Accounts</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <Activity size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900">{data.failedLogins}</h2>
          <p className="text-gray-500 font-medium mt-1">Failed Login Attempts</p>
        </div>
      </div>

      {data.recentThreats.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" /> Recent Security Events
          </h3>
          <div className="space-y-4">
            {data.recentThreats.map((threat, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900">{threat.action}</h4>
                    <p className="text-sm text-red-700">User: {threat.user?.email || 'Unknown User'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-red-800 bg-red-200 px-3 py-1 rounded-full">
                    {format(new Date(threat.createdAt), 'HH:mm:ss')}
                  </span>
                  <p className="text-xs text-red-600 mt-2">{format(new Date(threat.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8 text-center py-12">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={48} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">No Security Threats Detected</h3>
          <p className="text-gray-500 max-w-md mx-auto mt-3 text-lg">The StadiumOS AI platform is currently secure. No unauthorized access attempts or suspicious activities have been detected.</p>
        </div>
      )}
    </div>
  );
};

export default SecurityCenter;
