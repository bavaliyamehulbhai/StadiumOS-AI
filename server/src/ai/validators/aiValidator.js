import { z } from 'zod';

export const chatSchema = z.object({
  query: z.string().min(1, 'Message cannot be empty').max(1000, 'Message is too long'),
  customContext: z.record(z.any()).optional(),
});

export const navigationSchema = z.object({
  query: z.string().min(1, 'Message cannot be empty'),
  currentLocation: z.string().optional(),
  destination: z.string().optional(),
  accessibilityNeeded: z.boolean().optional(),
});

export const incidentSchema = z.object({
  reports: z.array(z.record(z.any())).min(1, 'At least one report is required'),
});

export const crowdSchema = z.object({
  metrics: z.record(z.any()).refine(data => Object.keys(data).length > 0, 'Metrics data required'),
});

export const emergencySchema = z.object({
  emergencyDetails: z.record(z.any()).refine(data => Object.keys(data).length > 0, 'Emergency details required'),
});

export const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: error.errors.map(e => e.message).join(', ') });
  }
};
