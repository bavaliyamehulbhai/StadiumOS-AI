import { EventEmitter } from 'events';

// Create a singleton EventBus for AI Orchestration
class AIEventBus extends EventEmitter {}

export const aiEventBus = new AIEventBus();

// Define Event Types
export const AI_EVENTS = {
  INCIDENT_CREATED: 'incident:created',
  INCIDENT_UPDATED: 'incident:updated',
  CROWD_UPDATED: 'crowd:updated',
  PARKING_UPDATED: 'parking:updated',
  VOLUNTEER_ASSIGNED: 'volunteer:assigned',
  VOLUNTEER_COMPLETED: 'volunteer:completed',
  MATCH_STARTED: 'match:started',
  MATCH_FINISHED: 'match:finished',
  EMERGENCY_STARTED: 'emergency:started',
  EMERGENCY_RESOLVED: 'emergency:resolved',
};
