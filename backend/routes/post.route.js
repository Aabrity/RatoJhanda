import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
  getFlags,
  validateCreatePost,
  validateGetPosts,
  validateIdParams
} from '../controllers/post.controller.js';

const router = express.Router();

// 🟢 Create Post
router.post('/create', verifyToken, validateCreatePost, createPost);

// 🟢 Get All Posts
router.get('/getposts', validateGetPosts, getPosts);

// 🟢 Delete Post
router.delete('/deletepost/:postId/:userId', verifyToken, validateIdParams, deletePost);

// 🟢 Update Post
router.put('/updatepost/:postId/:userId', verifyToken, validateIdParams, updatePost);

// 🟢 Get Flags for a User
router.get('/posts/:userId', verifyToken, validateIdParams, getFlags);

export default router;
