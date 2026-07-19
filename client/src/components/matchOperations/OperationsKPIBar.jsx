import React from 'react';
import { Users, AlertTriangle, ShieldAlert, Users as Staff, Car } from 'lucide-react';

const OperationsKPIBar = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Crowd Density</div>
          <div className="text-xl font-black text-gray-900">{metrics.crowd?.peakDensity || 0}%</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Incidents</div>
          <div className="text-xl font-black text-gray-900">{metrics.incident?.total || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Critical</div>
          <div className="text-xl font-black text-red-600">{metrics.incident?.critical || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
          <Staff className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Active Staff</div>
          <div className="text-xl font-black text-gray-900">{metrics.volunteer?.activeVolunteers || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
          <Car className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Parking</div>
          <div className="text-xl font-black text-gray-900">{metrics.parking?.overallUtilization || 0}%</div>
        </div>
      </div>
    </div>
  );
};

export default OperationsKPIBar;
