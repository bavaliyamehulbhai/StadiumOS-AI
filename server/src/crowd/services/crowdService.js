import Crowd from '../../models/Crowd.js';

export const CrowdService = {
  getLiveCrowd: async (stadiumId) => {
    let query = {};
    if (stadiumId) query.stadium = stadiumId;
    return await Crowd.find(query).sort({ densityPercentage: -1 });
  },
  
  getGates: async (stadiumId) => {
    let query = { category: 'Gate' };
    if (stadiumId) query.stadium = stadiumId;
    return await Crowd.find(query).sort({ densityPercentage: -1 });
  },

  getParking: async (stadiumId) => {
    let query = { category: 'Parking' };
    if (stadiumId) query.stadium = stadiumId;
    return await Crowd.find(query).sort({ densityPercentage: -1 });
  }
};
