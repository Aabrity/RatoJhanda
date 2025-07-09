// import express from 'express';
// import { verifyToken } from '../utils/verifyUser.js';
// import {
//   createPost,
//   deletePost,
//   getPosts,
//   updatePost,
//   getFlags,
//   validateCreatePost,
//   validateGetPosts,
//   validateIdParams
// } from '../controllers/post.controller.js';

// const router = express.Router();

// // 🟢 Create Post
// router.post('/create', verifyToken, validateCreatePost, createPost);

// // 🟢 Get All Posts
// router.get('/getposts', validateGetPosts, getPosts);

// // 🟢 Delete Post
// router.delete('/deletepost/:postId/:userId', verifyToken, validateIdParams, deletePost);

// // 🟢 Update Post
// router.put('/updatepost/:postId/:userId', verifyToken, validateIdParams, updatePost);

// // 🟢 Get Flags for a User
// router.get('/posts/:userId', verifyToken, validateIdParams, getFlags);

// export default router;
import express from 'express';

import {
  createPost,
  deletePost,
  getFlags,
  getPosts,
  updatePost,
} from '../controllers/post.controller.js';

import { postRateLimiter } from '../utils/rateLimiter.js';
import { validateRequest } from '../utils/validateRequest.js';
import { validateCreatePost, validateGetPosts, validateIdParams, validatePostIdAndUserIdParams } from '../utils/validators.js';
import { checkOwnershipOrAdmin, verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.post(
  '/create',
  verifyToken,
  postRateLimiter,
  validateCreatePost,
  validateRequest,
  createPost
);

router.get(
  '/getposts',
  validateGetPosts,
  validateRequest,
  getPosts
);

router.delete(
  '/deletepost/:postId/:userId',
  verifyToken,
  postRateLimiter,
  validatePostIdAndUserIdParams,
  validateRequest,
  checkOwnershipOrAdmin,
  deletePost
);

router.put(
  '/updatepost/:postId/:userId',
  verifyToken,
  postRateLimiter,
  validatePostIdAndUserIdParams,
  validateRequest,
  checkOwnershipOrAdmin,
  updatePost
);

router.get(
  '/posts/:userId',
  verifyToken,
  validateIdParams,
  validateRequest,
  getFlags
);

export default router;
