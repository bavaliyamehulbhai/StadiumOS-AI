import { getIO } from '../../socket/socketServer.js';

export const CrowdSocketService = {
  emitCrowdUpdated: (crowdData) => {
    try {
      const io = getIO();
      if (!io) return;
      io.to('Organizer').to('Admin').to('Fan').emit('crowd:updated', crowdData);
    } catch (error) {
      console.error('Socket emit error (crowd:updated):', error.message);
    }
  },

  emitGateOccupancyUpdated: (gateData) => {
    try {
      const io = getIO();
      if (!io) return;
      io.to('Organizer').to('Admin').to('Fan').emit('gate:occupancy:updated', gateData);
    } catch (error) {
      console.error('Socket emit error (gate:occupancy:updated):', error.message);
    }
  },

  emitParkingUpdated: (parkingData) => {
    try {
      const io = getIO();
      if (!io) return;
      io.to('Organizer').to('Admin').to('Fan').emit('parking:updated', parkingData);
    } catch (error) {
      console.error('Socket emit error (parking:updated):', error.message);
    }
  },

  emitHeatmapUpdated: (heatmapData) => {
    try {
      const io = getIO();
      if (!io) return;
      io.to('Organizer').to('Admin').emit('heatmap:updated', heatmapData);
    } catch (error) {
      console.error('Socket emit error (heatmap:updated):', error.message);
    }
  },
  
  emitCrowdPredictionReady: (predictionData) => {
    try {
      const io = getIO();
      if (!io) return;
      io.to('Organizer').to('Admin').emit('crowd:prediction:ready', predictionData);
    } catch (error) {
      console.error('Socket emit error (crowd:prediction:ready):', error.message);
    }
  }
};
