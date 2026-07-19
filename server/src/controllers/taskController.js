import VolunteerTask from '../models/VolunteerTask.js';
import User from '../models/User.js';
import NotificationService from '../services/notificationService.js';
import { TaskTimelineService } from '../services/taskTimelineService.js';
import { VolunteerSocketService } from '../services/volunteerSocketService.js';
import { generateTaskGuidance } from '../ai/services/volunteerAIService.js';
import volunteerPerformanceService from '../volunteerPerformance/services/volunteerPerformanceService.js';

// Helper to fully populate task
const populateTask = async (id) => {
  return await VolunteerTask.findById(id)
    .populate('stadium', 'name')
    .populate('assignedVolunteer', 'name email')
    .populate('assignedBy', 'name role')
    .populate('incident', 'title priority status')
    .populate('timeline.userId', 'name');
};

// @desc    Create new task
export const createTask = async (req, res) => {
  try {
    const { assignedVolunteer } = req.body;
    
    if (assignedVolunteer) {
      const activeTasksCount = await VolunteerTask.countDocuments({
        assignedVolunteer,
        status: { $in: ['Assigned', 'Accepted', 'In Progress'] }
      });
      if (activeTasksCount >= 5) {
        return res.status(400).json({ success: false, message: 'Volunteer has reached max 5 active tasks.' });
      }
    }

    const task = await VolunteerTask.create({
      ...req.body,
      assignedBy: req.user._id,
      status: assignedVolunteer ? 'Assigned' : 'Pending'
    });

    await TaskTimelineService.addTimelineEntry(task._id, {
      action: 'Task Created',
      userId: req.user._id,
      role: req.user.role,
      newStatus: task.status
    });

    const populatedTask = await populateTask(task._id);

    if (assignedVolunteer) {
      VolunteerSocketService.emitTaskAssigned(populatedTask);
      await NotificationService.sendTaskNotification(
        assignedVolunteer,
        'New Task Assigned',
        `You have been assigned: ${task.title}`,
        `/volunteer/tasks/${task._id}`,
        task.priority,
        req.user._id,
        task._id
      );
      // Trigger background AI
      generateTaskGuidance(task._id);
    } else {
      VolunteerSocketService.emitTaskUpdated(populatedTask);
    }

    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tasks
export const getTasks = async (req, res) => {
  try {
    const { priority, status, category, search, assignedVolunteer, page = 1, limit = 50 } = req.query;
    
    let query = {};
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (category) query.category = category;
    
    if (req.user.role === 'Volunteer') {
      query.assignedVolunteer = req.user._id;
    } else if (assignedVolunteer) {
      query.assignedVolunteer = assignedVolunteer;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await VolunteerTask.find(query)
      .populate('stadium', 'name')
      .populate('assignedVolunteer', 'name')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await VolunteerTask.countDocuments(query);
    res.status(200).json({ success: true, count: tasks.length, total, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await populateTask(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    
    if (req.user.role === 'Volunteer' && task.assignedVolunteer?._id.toString() !== req.user._id.toString()) {
       return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign a task
export const assignTask = async (req, res) => {
  try {
    const { volunteerId } = req.body;
    let task = await VolunteerTask.findById(req.params.id);
    
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (['Completed', 'Verified', 'Cancelled'].includes(task.status)) {
      return res.status(400).json({ success: false, message: `Cannot assign a ${task.status} task` });
    }

    const activeCount = await VolunteerTask.countDocuments({
      assignedVolunteer: volunteerId,
      status: { $in: ['Assigned', 'Accepted', 'In Progress'] }
    });
    if (activeCount >= 5) {
      return res.status(400).json({ success: false, message: 'Volunteer reached max 5 active tasks' });
    }

    const previousStatus = task.status;
    task.assignedVolunteer = volunteerId;
    task.status = 'Assigned';
    await task.save();

    await TaskTimelineService.addTimelineEntry(task._id, {
      action: 'Task Assigned',
      userId: req.user._id,
      role: req.user.role,
      previousStatus,
      newStatus: 'Assigned'
    });

    const populatedTask = await populateTask(task._id);

    VolunteerSocketService.emitTaskAssigned(populatedTask);
    await NotificationService.sendTaskNotification(
      volunteerId,
      'New Task Assigned',
      `You have been assigned: ${task.title}`,
      `/volunteer/tasks/${task._id}`,
      task.priority,
      req.user._id,
      task._id
    );

    // Trigger AI background generation
    generateTaskGuidance(task._id);

    res.status(200).json({ success: true, data: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let task = await VolunteerTask.findById(req.params.id);
    
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    if (req.user.role === 'Volunteer' && task.assignedVolunteer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const previousStatus = task.status;
    task.status = status;

    // Timeline updates based on status
    if (status === 'Accepted') task.acceptedAt = new Date();
    if (status === 'In Progress') task.startedAt = new Date();
    if (status === 'Completed') task.completedAt = new Date();
    if (status === 'Verified') task.verifiedAt = new Date();

    await task.save();

    await TaskTimelineService.addTimelineEntry(task._id, {
      action: `Status updated to ${status}`,
      userId: req.user._id,
      role: req.user.role,
      previousStatus,
      newStatus: status
    });

    const populatedTask = await populateTask(task._id);

    VolunteerSocketService.emitTaskUpdated(populatedTask);

    // If status affects performance, calculate score and emit performance update
    if (['Accepted', 'Completed', 'Verified', 'Cancelled'].includes(status) && task.assignedVolunteer) {
      await volunteerPerformanceService.calculateAndUpdateVolunteerScore(task.assignedVolunteer.toString());
      VolunteerSocketService.io.emit('volunteer.performance.updated', {
        volunteerId: task.assignedVolunteer.toString(),
        taskId: task._id
      });
    }

    // Send notifications if Organizer updates volunteer's task
    if (req.user.role !== 'Volunteer' && task.assignedVolunteer) {
      await NotificationService.sendTaskNotification(
        task.assignedVolunteer,
        'Task Updated',
        `Task status updated to ${status}`,
        `/volunteer/tasks/${task._id}`,
        task.priority,
        req.user._id,
        task._id
      );
    }
    
    // Notify organizers when volunteer finishes task
    if (status === 'Completed' && task.assignedVolunteer && req.user.role === 'Volunteer') {
      const creatorRole = populatedTask.assignedBy?.role === 'Admin' ? 'admin' : 'organizer';
      await NotificationService.sendNotification({
        recipient: task.assignedBy,
        title: 'Task Completed',
        message: `Volunteer finished: ${task.title}. Ready for verification.`,
        type: 'INFO',
        category: 'VOLUNTEER',
        priority: 'NORMAL',
        actionUrl: `/${creatorRole}/tasks/${task._id}`
      });
    }

    res.status(200).json({ success: true, data: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await VolunteerTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    
    if (req.user.role !== 'Admin' && req.user._id.toString() !== task.assignedBy.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }
    
    await task.deleteOne();
    
    import('../socket/socketServer.js').then(({ getIO }) => {
      getIO().to('Organizer').to('Admin').emit('task:deleted', task._id);
    });

    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Wrappers for existing routes
export const acceptTask = async (req, res) => {
  req.body.status = 'Accepted';
  return updateTaskStatus(req, res);
};

export const startTask = async (req, res) => {
  req.body.status = 'In Progress';
  return updateTaskStatus(req, res);
};

export const completeTask = async (req, res) => {
  req.body.status = 'Completed';
  return updateTaskStatus(req, res);
};

export const verifyTask = async (req, res) => {
  req.body.status = 'Verified';
  return updateTaskStatus(req, res);
};

export const cancelTask = async (req, res) => {
  req.body.status = 'Cancelled';
  return updateTaskStatus(req, res);
};
