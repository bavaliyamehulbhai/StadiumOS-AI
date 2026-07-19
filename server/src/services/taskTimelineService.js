import VolunteerTask from '../models/VolunteerTask.js';

export const TaskTimelineService = {
  addTimelineEntry: async (taskId, { action, userId, role, previousStatus, newStatus }) => {
    try {
      const task = await VolunteerTask.findById(taskId);
      if (!task) return null;

      const entry = {
        action,
        userId,
        role,
        previousStatus: previousStatus || task.status,
        newStatus: newStatus || task.status,
        timestamp: new Date()
      };

      task.timeline.push(entry);
      await task.save();
      return task;
    } catch (error) {
      console.error('Failed to add task timeline entry:', error.message);
      return null;
    }
  }
};
