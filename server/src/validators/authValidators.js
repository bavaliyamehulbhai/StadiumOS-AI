import { check } from 'express-validator';

export const registerValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 8 or more characters and contain at least one uppercase, lowercase, and number')
    .isLength({ min: 8 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
  check('role', 'Role must be valid').optional().isIn(['Admin', 'Organizer', 'Volunteer', 'Fan'])
];

export const loginValidator = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];
