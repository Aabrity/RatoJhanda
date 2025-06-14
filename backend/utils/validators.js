import { body } from 'express-validator';

export const validateSignup = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

export const validateEmail = [
  body('email').isEmail().withMessage('Invalid email address'),
];

export const validatePasswordReset = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];
