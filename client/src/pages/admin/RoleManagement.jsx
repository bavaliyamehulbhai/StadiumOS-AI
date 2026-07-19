import React from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';

const RoleManagement = () => {
  const roles = ['Admin', 'Organizer', 'Volunteer', 'Fan'];
  
  const permissions = [
    { name: 'Manage Users', values: [true, false, false, false] },
    { name: 'Manage Stadiums & Matches', values: [true, true, false, false] },
    { name: 'Configure AI Thresholds', values: [true, false, false, false] },
    { name: 'Create Incidents', values: [true, true, true, true] },
    { name: 'Assign Volunteers', values: [true, true, false, false] },
    { name: 'Resolve Tasks', values: [true, false, true, false] },
    { name: 'View Audit Logs', values: [true, true, false, false] },
    { name: 'System Settings', values: [true, false, false, false] }
  ];

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="text-gray-500 mt-1">Enterprise permission matrix and access control.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-medium text-gray-600 w-1/3">Permission</th>
              {roles.map(role => (
                <th key={role} className="p-4 font-bold text-gray-900 text-center">{role}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {permissions.map((perm, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-700">{perm.name}</td>
                {perm.values.map((hasAccess, i) => (
                  <td key={i} className="p-4 text-center">
                    {hasAccess ? (
                      <Check className="inline-block text-green-500" size={20} />
                    ) : (
                      <X className="inline-block text-red-300" size={20} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 flex items-start gap-3">
        <ShieldCheck className="mt-0.5 flex-shrink-0" size={18} />
        <p><strong>Note:</strong> StadiumOS AI uses a hardcoded RBAC engine for the Hackathon MVP. To change permissions dynamically, please upgrade to the Enterprise version.</p>
      </div>
    </div>
  );
};

export default RoleManagement;
