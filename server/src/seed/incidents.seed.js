import Incident from '../models/Incident.js';
import { getRandomItem, getRandomInt } from './utils/seedHelper.js';

export const seedIncidents = async (stadiums, matches, users) => {
  try {
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const statuses = ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
    const types = ['Medical', 'Security', 'Maintenance', 'Crowd', 'Lost Child', 'Technical'];
    
    const locations = ['Gate A', 'Gate B', 'Gate C', 'Food Court', 'Parking Zone P1', 'VIP Lounge', 'Section 102', 'Main Concourse', 'Restroom Block 4'];
    
    const fans = users.filter(u => u.role === 'Fan');
    const volunteers = users.filter(u => u.role === 'Volunteer');

    const incidentTemplates = [
      { title: 'Medical Emergency', desc: 'Fan collapsed. Requires immediate medical attention.' },
      { title: 'Crowd Congestion', desc: 'Severe bottleneck forming at the entrance.' },
      { title: 'Lost Child', desc: 'Child found wandering alone, seeking parents.' },
      { title: 'Power Failure', desc: 'Lights went out in this sector.' },
      { title: 'Broken Seat', desc: 'Seat is broken and sharp edges are exposed.' },
      { title: 'Suspicious Package', desc: 'Unattended bag left near the food stalls.' },
      { title: 'Spill on Concourse', desc: 'Large liquid spill causing slipping hazard.' },
      { title: 'Argument between fans', desc: 'Verbal altercation escalating, requires security.' }
    ];

    const incidents = [];

    for (let i = 0; i < 30; i++) {
      const stadium = getRandomItem(stadiums);
      const match = getRandomItem(matches.filter(m => m.stadium.toString() === stadium._id.toString()));
      const template = getRandomItem(incidentTemplates);
      
      const status = getRandomItem(statuses);
      let assignedVolunteer = null;
      let resolvedAt = null;

      if (status !== 'Reported') {
        assignedVolunteer = getRandomItem(volunteers)._id;
      }
      
      if (status === 'Resolved' || status === 'Closed') {
        resolvedAt = new Date();
      }

      incidents.push({
        title: template.title,
        description: template.desc,
        incidentType: getRandomItem(types),
        priority: getRandomItem(priorities),
        status,
        location: getRandomItem(locations),
        stadium: stadium._id,
        match: match ? match._id : null,
        reportedBy: getRandomItem([...fans, ...volunteers])._id,
        assignedVolunteer,
        resolvedAt
      });
    }

    await Incident.insertMany(incidents);
    console.log(`✅ Seeded ${incidents.length} Incidents.`);
    
    return await Incident.find();
  } catch (error) {
    console.error('❌ Error seeding incidents:', error);
    throw error;
  }
};
