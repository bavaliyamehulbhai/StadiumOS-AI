import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

const IncidentCard = ({ incident, role }) => {
  const isVolunteer = role === 'Volunteer';
  
  return (
    <Link to={role === 'Volunteer' ? `/volunteer/incidents/${incident._id}` : role === 'Organizer' ? `/organizer/incidents/${incident._id}` : `/admin/incidents/${incident._id}`}>
      <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-gray-100 group h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-50 flex justify-between items-start bg-gray-50/50 group-hover:bg-blue-50/30 transition-colors">
          <div className="flex flex-col gap-2 items-start">
            <PriorityBadge priority={incident.priority} />
            <StatusBadge status={incident.status} />
          </div>
          <span className="text-xs font-medium bg-white px-2 py-1 rounded shadow-sm border border-gray-100 text-gray-600">
            {incident.incidentType}
          </span>
        </div>
        
        <CardContent className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {incident.title}
          </h3>
          
          <div className="space-y-2 mt-auto pt-4 text-sm text-gray-600">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{incident.location} ({incident.stadium?.name})</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>{new Date(incident.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>

            {!isVolunteer && (
              <div className="flex items-center pt-2 mt-2 border-t border-gray-50">
                <User className="w-4 h-4 mr-2 text-blue-400" />
                {incident.assignedVolunteer ? (
                  <span className="text-blue-600 font-medium">{incident.assignedVolunteer.name}</span>
                ) : (
                  <span className="text-gray-400 italic">Unassigned</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default IncidentCard;
