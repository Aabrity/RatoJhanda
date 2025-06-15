import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  create,
  deletepost,
  getposts,
  updatepost,
  getFlags,
  validateCreatePost,
  validateGetPosts,
  validateIdParams
} from '../controllers/post.controller.js';

const router = express.Router();

// 🟢 Create Post
router.post('/create', verifyToken, validateCreatePost, create);

// 🟢 Get All Posts
router.get('/getposts', validateGetPosts, getposts);

// 🟢 Delete Post
router.delete('/deletepost/:postId/:userId', verifyToken, validateIdParams, deletepost);

// 🟢 Update Post
router.put('/updatepost/:postId/:userId', verifyToken, validateIdParams, updatepost);

// 🟢 Get Flags for a User
router.get('/posts/:userId', verifyToken, validateIdParams, getFlags);

export default router;
