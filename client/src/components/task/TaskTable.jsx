import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import PriorityBadge from '../incident/PriorityBadge';
import StatusBadge from '../incident/StatusBadge';

const TaskTable = ({ tasks, userRole }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">Task</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Volunteer</th>
              <th className="px-6 py-4 font-semibold">Due Time</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No tasks found matching your criteria.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">{task.title}</span>
                      <span className="text-xs text-gray-500 mt-1">{task.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-6 py-4">
                    {task.assignedVolunteer ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{task.assignedVolunteer.name}</span>
                        <Badge variant="outline" className="w-fit text-[10px] mt-1 bg-blue-50/50 text-blue-700 border-blue-200">
                          Volunteer
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {format(new Date(task.dueTime), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={userRole === 'Admin' ? `/admin/tasks/${task._id}` : userRole === 'Organizer' ? `/organizer/tasks/${task._id}` : `/volunteer/tasks/${task._id}`}
                      >
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
