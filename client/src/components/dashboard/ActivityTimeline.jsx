import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, Clock } from 'lucide-react';

const ActivityTimeline = ({ activities = [] }) => {

  const getIcon = (type) => {
    switch(type) {
      case 'Emergency': return <ShieldAlert className="w-4 h-4 text-white" />;
      case 'Warning': return <AlertTriangle className="w-4 h-4 text-white" />;
      case 'Success': return <CheckCircle2 className="w-4 h-4 text-white" />;
      default: return <Info className="w-4 h-4 text-white" />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'Emergency': return 'bg-red-500';
      case 'Warning': return 'bg-yellow-500';
      case 'Success': return 'bg-emerald-500';
      default: return 'bg-blue-500';
    }
  };

  if (activities.length === 0) {
    return <div className="text-center text-sm text-gray-500 py-8">No recent activities</div>;
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getBgColor(activity.type)}`}>
                    {getIcon(activity.type)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900 font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityTimeline;
