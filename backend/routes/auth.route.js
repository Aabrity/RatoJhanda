import express from 'express';
import { getAllReports } from '../controllers/admin.controller.js';
import {
  google,
  signin,
  signup,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  sendContactEmail
} from '../controllers/auth.controller.js';
import rateLimit from 'express-rate-limit';
import { validateEmail, validateSignup, validatePasswordReset } from '../utils/validators.js';

const router = express.Router();

// Rate limiters to prevent abuse
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later.',
});

// Routes with validation and throttling
router.post('/signup', validateSignup, authLimiter, signup);
router.post('/signin', authLimiter, signin);
router.post('/google', authLimiter, google);
router.post('/verify-email', validateEmail, verifyEmail);
router.post('/request-password-reset', validateEmail, authLimiter, requestPasswordReset);
router.post('/reset-password', validatePasswordReset, authLimiter, resetPassword);
router.post('/sendEmail', authLimiter, sendContactEmail); // validate this if handling custom email content
router.get('/admin/reports', verifyToken, getAllReports);
router.delete(
  '/admin/deleteWithPost/:reportId',
  verifyToken,
  verifyAdmin,
  deleteReportAndPost
);

export default router;
