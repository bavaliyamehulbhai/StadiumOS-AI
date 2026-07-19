import React from 'react';
import { Clock, CheckCircle, Play, Inbox, ClipboardList, Activity } from 'lucide-react';
import { format } from 'date-fns';

const TaskTimeline = ({ task }) => {
  if (task?.timeline && task.timeline.length > 0) {
    return (
      <div className="relative border-l-2 border-gray-100 ml-4 pl-6 space-y-8 pb-4 mt-6">
        {task.timeline.map((entry, idx) => {
          let icon = <Activity className="w-4 h-4 text-blue-500" />;
          let colorClass = "bg-blue-50 border-blue-200 text-blue-700";

          if (entry.newStatus === 'Pending' || entry.action.includes('Created')) {
            icon = <ClipboardList className="w-4 h-4 text-gray-500" />;
            colorClass = "bg-gray-50 border-gray-200 text-gray-700";
          } else if (entry.newStatus === 'Assigned') {
            icon = <ClipboardList className="w-4 h-4 text-orange-500" />;
            colorClass = "bg-orange-50 border-orange-200 text-orange-700";
          } else if (entry.newStatus === 'Accepted') {
            icon = <CheckCircle className="w-4 h-4 text-blue-500" />;
            colorClass = "bg-blue-50 border-blue-200 text-blue-700";
          } else if (entry.newStatus === 'In Progress') {
            icon = <Play className="w-4 h-4 text-purple-500" />;
            colorClass = "bg-purple-50 border-purple-200 text-purple-700";
          } else if (entry.newStatus === 'Completed') {
            icon = <CheckCircle className="w-4 h-4 text-emerald-500" />;
            colorClass = "bg-emerald-50 border-emerald-200 text-emerald-700";
          } else if (entry.newStatus === 'Verified') {
            icon = <Inbox className="w-4 h-4 text-indigo-600" />;
            colorClass = "bg-indigo-50 border-indigo-200 text-indigo-700";
          }

          return (
            <TimelineNode 
              key={idx}
              title={entry.action}
              description={entry.userId ? `By ${entry.userId.name || 'User'} (${entry.role || 'System'})` : 'System Generated'}
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

  // Fallback for older tasks without a timeline
  return (
    <div className="p-8 text-center text-gray-400">
      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p>No dynamic timeline activity recorded yet.</p>
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

export default TaskTimeline;
