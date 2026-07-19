import Notification from '../models/Notification.js';
import { getRandomItem, getRandomInt } from './utils/seedHelper.js';

export const seedNotifications = async (users, matches, incidents, tasks) => {
  try {
    const priorities = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];

    const templates = [
      { title: 'Match Starts Soon', message: 'The match will start in 30 minutes.', type: 'INFO', category: 'MATCH' },
      { title: 'Parking Update', message: 'Zone P2 is nearly full.', type: 'WARNING', category: 'PARKING' },
      { title: 'New Incident Reported', message: 'A new incident requires attention.', type: 'WARNING', category: 'INCIDENT' },
      { title: 'Task Assigned', message: 'You have been assigned a new task.', type: 'INFO', category: 'VOLUNTEER' },
      { title: 'AI Suggestion', message: 'Reallocating 2 volunteers could improve flow.', type: 'SUCCESS', category: 'AI' },
      { title: 'Emergency Alert', message: 'Evacuate the area immediately.', type: 'EMERGENCY', category: 'EMERGENCY' },
      { title: 'Task Completed', message: 'A volunteer has finished their assigned task.', type: 'SUCCESS', category: 'VOLUNTEER' },
      { title: 'Gate Congestion', message: 'Gate A is experiencing heavy traffic.', type: 'WARNING', category: 'CROWD' }
    ];

    const notifications = [];

    for (let i = 0; i < 100; i++) {
      const recipient = getRandomItem(users)._id;
      const template = getRandomItem(templates);
      
      let entityId = null;
      let entityType = null;

      if (template.category === 'MATCH' && matches.length > 0) {
        entityId = getRandomItem(matches)._id;
        entityType = 'Match';
      }
      if (template.category === 'INCIDENT' && incidents.length > 0) {
        entityId = getRandomItem(incidents)._id;
        entityType = 'Incident';
      }
      if (template.category === 'VOLUNTEER' && tasks.length > 0) {
        entityId = getRandomItem(tasks)._id;
        entityType = 'Task';
      }

      notifications.push({
        recipient,
        title: template.title,
        message: template.message,
        type: template.type,
        category: template.category,
        priority: getRandomItem(priorities),
        isRead: Math.random() > 0.5,
        isArchived: Math.random() > 0.8,
        entityId,
        entityType,
        createdAt: new Date(new Date().getTime() - getRandomInt(0, 86400000 * 3)) // Last 3 days
      });
    }

    await Notification.insertMany(notifications);
    console.log(`✅ Seeded ${notifications.length} Notifications.`);
    
  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
    throw error;
  }
};
