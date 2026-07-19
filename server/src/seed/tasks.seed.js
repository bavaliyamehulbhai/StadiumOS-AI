import VolunteerTask from '../models/VolunteerTask.js';
import { getRandomItem, getRandomInt } from './utils/seedHelper.js';

export const seedTasks = async (stadiums, matches, incidents, users) => {
  try {
    const categories = ['Medical', 'Security', 'Crowd', 'Parking', 'VIP', 'Other'];
    const priorities = ['Low', 'Medium', 'High'];
    const statuses = ['Pending', 'Assigned', 'In Progress', 'Completed', 'Verified'];
    
    const volunteers = users.filter(u => u.role === 'Volunteer');
    const organizers = users.filter(u => u.role === 'Organizer');

    const taskTemplates = [
      { title: 'Medical Assistance', category: 'Medical' },
      { title: 'Parking Control', category: 'Parking' },
      { title: 'VIP Escort', category: 'VIP' },
      { title: 'Emergency Exit Check', category: 'Security' },
      { title: 'Lost Child Support', category: 'Other' },
      { title: 'Wheelchair Assistance', category: 'Medical' },
      { title: 'Crowd Monitoring', category: 'Crowd' },
      { title: 'Security Patrol', category: 'Security' }
    ];

    const tasks = [];

    for (let i = 0; i < 40; i++) {
      const stadium = getRandomItem(stadiums);
      const match = getRandomItem(matches.filter(m => m.stadium.toString() === stadium._id.toString()));
      const template = getRandomItem(taskTemplates);
      
      const status = getRandomItem(statuses);
      let assignedVolunteer = null;
      let acceptedAt = null;
      let startedAt = null;
      let completedAt = null;

      if (status !== 'Pending') {
        assignedVolunteer = getRandomItem(volunteers)._id;
        if (status === 'In Progress' || status === 'Completed' || status === 'Verified') {
          acceptedAt = new Date();
          startedAt = new Date();
        }
        if (status === 'Completed' || status === 'Verified') {
          completedAt = new Date();
        }
      }

      // Link to incident randomly (30% chance)
      let relatedIncident = null;
      if (Math.random() > 0.7 && incidents.length > 0) {
        relatedIncident = getRandomItem(incidents)._id;
      }
      
      const dueTime = new Date();
      dueTime.setHours(dueTime.getHours() + getRandomInt(1, 24));

      tasks.push({
        title: `${template.title} - ${stadium.name}`,
        description: `Please handle the following task efficiently: ${template.title}`,
        category: template.category,
        priority: getRandomItem(priorities),
        status,
        location: `Zone ${getRandomInt(1, 10)}`,
        stadium: stadium._id,
        match: match ? match._id : null,
        incident: relatedIncident,
        assignedVolunteer,
        assignedBy: getRandomItem(organizers)._id,
        dueTime,
        acceptedAt,
        startedAt,
        completedAt
      });
    }

    await VolunteerTask.insertMany(tasks);
    console.log(`✅ Seeded ${tasks.length} Volunteer Tasks.`);
    
    return await VolunteerTask.find();
  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
    throw error;
  }
};
