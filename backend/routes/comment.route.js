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
router.get('/post/:postId', getPostComments);

// ✅ Authenticated users
router.post('/', verifyToken, createComment);
router.put('/like/:commentId', verifyToken, likeComment);
router.put('/:commentId', verifyToken, editComment);
router.delete('/:commentId', verifyToken, deleteComment);

// ✅ Admin only: full access with stats
router.get('/', verifyToken, isAdmin, getcomments);

export default router;
