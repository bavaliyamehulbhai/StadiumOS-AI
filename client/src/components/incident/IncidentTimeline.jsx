import React from 'react';
import { Clock, User, CheckCircle, Play, Inbox, AlertTriangle, Activity } from 'lucide-react';
import { format } from 'date-fns';

const IncidentTimeline = ({ incident }) => {
  // If we have the dynamic timeline array from Phase 3, map it!
  if (incident?.timeline && incident.timeline.length > 0) {
    return (
      <div className="relative border-l-2 border-gray-100 ml-4 pl-6 space-y-8 pb-4 mt-6">
        {incident.timeline.map((entry, idx) => {
          // Determine icon and color based on action or status
          let icon = <Activity className="w-4 h-4 text-blue-500" />;
          let colorClass = "bg-blue-50 border-blue-200 text-blue-700";

          if (entry.action.includes('Created') || entry.newStatus === 'Reported') {
            icon = <AlertTriangle className="w-4 h-4 text-red-500" />;
            colorClass = "bg-red-50 border-red-200 text-red-700";
          } else if (entry.action.includes('Assigned')) {
            icon = <User className="w-4 h-4 text-orange-500" />;
            colorClass = "bg-orange-50 border-orange-200 text-orange-700";
          } else if (entry.newStatus === 'In Progress') {
            icon = <Play className="w-4 h-4 text-purple-500" />;
            colorClass = "bg-purple-50 border-purple-200 text-purple-700";
          } else if (entry.newStatus === 'Resolved') {
            icon = <CheckCircle className="w-4 h-4 text-emerald-500" />;
            colorClass = "bg-emerald-50 border-emerald-200 text-emerald-700";
          } else if (entry.newStatus === 'Closed') {
            icon = <Inbox className="w-4 h-4 text-gray-600" />;
            colorClass = "bg-gray-100 border-gray-300 text-gray-800";
          }

          return (
            <TimelineNode 
              key={idx}
              title={entry.action}
              description={entry.user ? `By ${entry.user.name || 'User'} (${entry.role || 'System'})` : 'System Generated'}
              time={format(new Date(entry.timestamp), 'h:mm a, MMM d')}
              icon={icon}
              active={true}
              colorClass={colorClass}
            />
          );
        })}
      </div>
    );
  }

  // Fallback for older incidents before the timeline array existed
  const isAssigned = !!incident.assignedVolunteer;
  const isInProgress = ['In Progress', 'Resolved', 'Closed'].includes(incident.status);
  const isResolved = ['Resolved', 'Closed'].includes(incident.status);
  const isClosed = incident.status === 'Closed';

  return (
    <div className="relative border-l-2 border-gray-100 ml-4 pl-6 space-y-8 pb-4 mt-6">
      <TimelineNode 
        title="Incident Reported"
        description={`Reported by ${incident.reportedBy?.name} (${incident.reportedBy?.role})`}
        time={new Date(incident.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
        active={true}
        colorClass="bg-red-50 border-red-200 text-red-700"
      />
      <TimelineNode 
        title="Assigned to Volunteer"
        description={isAssigned ? `Assigned to ${incident.assignedVolunteer?.name}` : "Waiting for Organizer assignment"}
        time={isAssigned ? "System Logged" : "--"}
        icon={<User className={`w-4 h-4 ${isAssigned ? 'text-blue-500' : 'text-gray-400'}`} />}
        active={isAssigned}
        colorClass={isAssigned ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-500"}
      />
      <TimelineNode 
        title="In Progress"
        description={isInProgress ? "Volunteer is actively resolving" : "Pending action"}
        time={isInProgress ? "System Logged" : "--"}
        icon={<Play className={`w-4 h-4 ${isInProgress ? 'text-purple-500' : 'text-gray-400'}`} />}
        active={isInProgress}
        colorClass={isInProgress ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-500"}
      />
      <TimelineNode 
        title="Resolved"
        description={isResolved ? "Incident handled successfully" : "Pending resolution"}
        time={incident.resolvedAt ? new Date(incident.resolvedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "--"}
        icon={<CheckCircle className={`w-4 h-4 ${isResolved ? 'text-emerald-500' : 'text-gray-400'}`} />}
        active={isResolved}
        colorClass={isResolved ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-500"}
      />
      {isClosed && (
        <TimelineNode 
          title="Incident Closed"
          description="Organizer verified and closed"
          time="System Logged"
          icon={<Inbox className="w-4 h-4 text-gray-600" />}
          active={true}
          colorClass="bg-gray-100 border-gray-300 text-gray-800"
        />
      )}
    </div>
  );
};

const TimelineNode = ({ title, description, time, icon, active, colorClass }) => (
  <div className={`relative transition-all duration-300 ${active ? 'opacity-100' : 'opacity-60'}`}>
    <div className={`absolute -left-10 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white z-10 ${active ? 'border-gray-200 shadow-sm' : 'border-gray-100'}`}>
      {icon}
    </div>
    <div className={`p-4 rounded-lg border ${colorClass}`}>
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-sm">{title}</h4>
        <div className="flex items-center text-xs opacity-70">
          <Clock className="w-3 h-3 mr-1" />
          {time}
        </div>
      </div>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  </div>
);

export default IncidentTimeline;
