import React from 'react';
import { Eye, MapPin, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const IncidentTable = ({ incidents, role }) => {
  if (!incidents || incidents.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500">No incidents found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Incident Details</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Assignment</th>
              <th className="px-6 py-4 font-medium">Status & Priority</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident._id} className="border-b hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{incident.title}</div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">{incident.incidentType}</span>
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(incident.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    <span className="font-medium">{incident.location}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 ml-5">
                    {incident.stadium?.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-gray-700">
                    <User className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                    {incident.assignedVolunteer ? (
                      <span className="font-medium text-blue-600">{incident.assignedVolunteer.name}</span>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 space-y-2">
                  <div className="flex flex-col gap-2 items-start">
                    <PriorityBadge priority={incident.priority} />
                    <StatusBadge status={incident.status} />
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={role === 'Volunteer' ? `/volunteer/incidents/${incident._id}` : role === 'Organizer' ? `/organizer/incidents/${incident._id}` : `/admin/incidents/${incident._id}`}>
                      <Button variant="outline" size="sm" className="h-8">
                        <Eye className="w-4 h-4 mr-1.5" /> View
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentTable;
