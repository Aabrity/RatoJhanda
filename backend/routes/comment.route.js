import express from 'express';
import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  getcomments,
  likeComment,
} from '../controllers/comment.controller.js';

import {  isAdmin } from '../utils/verifyRoles.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

// ✅ Public: Get all comments for a post
router.get('/getPostComments/:postId', getPostComments);

// ✅ Authenticated users
router.post('/create', verifyToken, createComment);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);

// ✅ Admin only: full access with stats
router.get('/getcomments', verifyToken, isAdmin, getcomments);

export default router;
