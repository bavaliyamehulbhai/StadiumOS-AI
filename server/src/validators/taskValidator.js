import { body, validationResult } from 'express-validator';

export const validateTask = [
  body('title')
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description')
    .notEmpty().withMessage('Task description is required'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Medical', 'Crowd', 'Parking', 'Security', 'Maintenance', 'Navigation', 'Transport', 'Cleaning', 'Emergency', 'VIP', 'Other'])
    .withMessage('Invalid category'),
  body('priority')
    .notEmpty().withMessage('Priority is required')
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid priority'),
  body('location')
    .notEmpty().withMessage('Location is required'),
  body('stadium')
    .notEmpty().withMessage('Stadium is required')
    .isMongoId().withMessage('Invalid stadium ID'),
  body('dueTime')
    .notEmpty().withMessage('Due time is required')
    .isISO8601().toDate().withMessage('Invalid due time format')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due time cannot be in the past');
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];
