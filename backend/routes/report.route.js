import express from 'express';
import { body } from 'express-validator';
import { reportPost } from '../controllers/report.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { assertValid } from '../utils/validate.js'; // your existing validation middleware

const router = express.Router();

router.post(
  '/report/:postId',
  verifyToken,
  body('reason')
    .isIn(['Spam', 'Abusive Content', 'False Information', 'Other'])
    .withMessage('Invalid reason'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment too long'),
  assertValid,
  reportPost
);

export default router;
