import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import PriorityBadge from '../incident/PriorityBadge';
import StatusBadge from '../incident/StatusBadge';
import { Button } from '@/components/ui/button';

const TaskCard = ({ task, userRole }) => {
  const linkPath = userRole === 'Admin' ? `/admin/tasks/${task._id}` : userRole === 'Organizer' ? `/organizer/tasks/${task._id}` : `/volunteer/tasks/${task._id}`;

  return (
    <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden border-gray-200 bg-white">
      <CardContent className="p-5 flex flex-col h-full relative">
        {/* Top Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1.5">
            <h3 className="font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-2.5 mt-auto mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
            <span className="truncate">{task.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
            <span>Due: {format(new Date(task.dueTime), 'MMM d, h:mm a')}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400 shrink-0" />
            <span className="truncate">
              {task.assignedVolunteer ? task.assignedVolunteer.name : <span className="italic text-gray-400">Unassigned</span>}
            </span>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-2">
          <span className="text-xs font-medium text-gray-400 px-2 py-1 bg-gray-50 rounded-md">
            {task.category}
          </span>
          <Link to={linkPath}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 -mr-2">
              <Eye className="w-4 h-4 mr-1.5" /> View Task
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
