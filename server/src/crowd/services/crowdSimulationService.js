import Crowd from '../../models/Crowd.js';
import { Parking } from '../../models/Parking.js';
import { CrowdSocketService } from './crowdSocketService.js';
import { aiEventBus, AI_EVENTS } from '../../ai/events/aiEvents.js';

let simulationInterval = null;

export const CrowdSimulationService = {
  startSimulation: () => {
    if (simulationInterval) return;
    console.log('Started Live Crowd Simulation Engine...');
    
    // Run simulation every 15 seconds
    simulationInterval = setInterval(async () => {
      try {
        const zones = await Crowd.find();
        if (!zones || zones.length === 0) return;

        let hasUpdates = false;
        const updatedZones = [];

        for (const zone of zones) {
          // 30% chance to update this specific zone in this cycle to make it look organic
          if (Math.random() > 0.3) {
            // Random fluctuation between -5% and +8% of max capacity
            const fluctuation = Math.floor(zone.maxCapacity * (Math.random() * 0.13 - 0.05));
            let newCount = zone.currentPeople + fluctuation;
            
            // Constrain
            if (newCount < 0) newCount = 0;
            if (newCount > zone.maxCapacity * 1.1) newCount = Math.floor(zone.maxCapacity * 1.1); // max 110% overload

            if (newCount !== zone.currentPeople) {
              zone.currentPeople = newCount;
              await zone.save(); // pre-save hook handles density/risk/wait time
              updatedZones.push(zone);
              hasUpdates = true;

              // Check if we need AI intervention (e.g. Critical risk)
              if (zone.riskLevel === 'Critical') {
                // Phase 8: Emit event to AI Orchestrator (it has its own debounce/cooldown)
                aiEventBus.emit(AI_EVENTS.CROWD_UPDATED, {
                  gateId: zone._id,
                  density: zone.densityPercentage,
                  riskLevel: zone.riskLevel
                });
                // NOTE: Removed direct generateCrowdPrediction() call - let the Orchestrator manage AI calls
              }
            }
          }
        }

        // --- Mutate Parking Records ---
        const parkingZones = await Parking.find();
        let hasParkingUpdates = false;
        const updatedParking = [];

        if (parkingZones && parkingZones.length > 0) {
          for (const pZone of parkingZones) {
            if (Math.random() > 0.4) {
              const fluctuation = Math.floor(pZone.capacity * (Math.random() * 0.1 - 0.04)); // -4% to +6%
              let newOccupied = pZone.occupied + fluctuation;
              if (newOccupied < 0) newOccupied = 0;
              if (newOccupied > pZone.capacity) newOccupied = pZone.capacity;

              if (newOccupied !== pZone.occupied) {
                pZone.occupied = newOccupied;
                
                // Update status
                if (pZone.occupied >= pZone.capacity) {
                  pZone.status = 'Full';
                } else if (pZone.occupied >= pZone.capacity * 0.9) {
                  pZone.status = 'Almost Full';
                } else {
                  pZone.status = 'Open';
                }

                await pZone.save();
                updatedParking.push(pZone);
                hasParkingUpdates = true;
              }
            }
          }
        }

        if (hasUpdates) {
          // Emit socket events for crowd
          CrowdSocketService.emitCrowdUpdated(updatedZones);
          CrowdSocketService.emitHeatmapUpdated(updatedZones);
          
          const gates = updatedZones.filter(z => z.category === 'Gate');
          if (gates.length > 0) {
            CrowdSocketService.emitGateOccupancyUpdated(gates);
          }
        }

        if (hasParkingUpdates) {
          CrowdSocketService.emitParkingUpdated(updatedParking);
        }

      } catch (error) {
        console.error('Crowd Simulation Error:', error.message);
      }
    }, 15000);
  },

  stopSimulation: () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      simulationInterval = null;
      console.log('Stopped Live Crowd Simulation Engine.');
    }
  }
};
