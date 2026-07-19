import Incident from '../models/Incident.js';

export class IncidentTimelineService {
  /**
   * Adds a timeline entry to an incident
   * @param {string} incidentId 
   * @param {Object} details 
   * @param {string} details.action - Description of the action (e.g. 'Incident Created')
   * @param {string} [details.userId] - User who performed the action
   * @param {string} [details.role] - Role of the user
   * @param {string} [details.previousStatus] 
   * @param {string} [details.newStatus] 
   * @param {string} [details.notes] 
   */
  static async addTimelineEntry(incidentId, details) {
    try {
      const entry = {
        action: details.action,
        user: details.userId,
        role: details.role,
        previousStatus: details.previousStatus,
        newStatus: details.newStatus,
        notes: details.notes,
        timestamp: new Date()
      };

      const updatedIncident = await Incident.findByIdAndUpdate(
        incidentId,
        { $push: { timeline: entry } },
        { new: true }
      );

      return updatedIncident;
    } catch (error) {
      console.error('Failed to add incident timeline entry:', error);
      // We don't want a timeline failure to crash the whole request, so we just log it.
    }
  }
}
