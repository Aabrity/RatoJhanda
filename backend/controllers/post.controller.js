/********************************************************************
 *  posts.controller.js
 *  Hardened CRUD handlers for the Post resource
 *******************************************************************/
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import sanitizeHtml from 'sanitize-html';
import { body, query, param, validationResult } from 'express-validator';

/* ------------------------------------------------------------------
   🔐  VALIDATION MIDDLEWARE
-------------------------------------------------------------------*/
export const validateCreatePost = [
  body('title')
    .isString()
    .trim()
    .isLength({ min: 5, max: 140 })
    .withMessage('Title must be 5‑140 characters.'),
  body('content')
    .isString()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters.'),
  body('category')
    .optional()
    .isIn(['Suspicious & Criminal Activity', 'Lost & Found','Accidents & Public Hazards', 'uncategorized']),
  body('images')
    .optional(),

    // .isArray()
    // .withMessage('Images must be an array of URLs.'),
//  
// ),
];

export const validateGetPosts = [
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('startIndex').optional().isInt({ min: 0 }),
  query('order').optional().isIn(['asc', 'desc']),
  query('searchTerm').optional().isString().trim(),
];

export const validateIdParams = [
  param('userId').optional().isMongoId(),
  param('postId').optional().isMongoId(),
];

/* ------------------------------------------------------------------
   🛠  HELPER FUNCTIONS
-------------------------------------------------------------------*/
const buildSlug = (title) =>
  title
    .trim()
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[^a-z0-9-]/g, '');

const handleValidation = (req, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errorHandler(400, errors.array()[0].msg));
  }
};

/* ------------------------------------------------------------------
   📌  CONTROLLERS
-------------------------------------------------------------------*/
export const createPost = async (req, res, next) => {
  handleValidation(req, next);

  const { title, content, category, images,location, geolocation } = req.body;
  const slug = buildSlug(title);

  try {
    const exists = await Post.findOne({ slug });
    if (exists) return next(errorHandler(409, 'Slug already in use.'));

    const safeContent = sanitizeHtml(content);

    const post = new Post({
      title: title.trim(),
      content: safeContent,
      category,
      images,
      location,
      geolocation,
      slug,
      userId: req.user.id,
    });

    const saved = await post.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------------------- */

// export const getPosts = async (req, res, next) => {
//   handleValidation(req, next);

//   const startIndex = parseInt(req.query.startIndex) || 0;
//   const limit = parseInt(req.query.limit) || 9;
//   const sortDir = req.query.order === 'asc' ? 1 : -1;

//   /* Build dynamic filter ---------------------------------------- */
//   const filter = {};
//   if (req.query.userId) filter.userId = req.query.userId;
//   if (req.query.postId) filter._id = req.query.postId;
//   if (req.query.slug) filter.slug = req.query.slug;
//   if (req.query.category && req.query.category !== 'uncategorized') {
//     filter.category = req.query.category;
//   }
//   if (req.query.searchTerm) {
//     const rx = { $regex: req.query.searchTerm, $options: 'i' };
//     filter.$or = [{ title: rx }, { content: rx }, { location: rx }];
//   }

//   try {
//     const posts = await Post.find(filter)
//       .populate('userId', 'username') // N+1 fix
//       .sort({ updatedAt: sortDir })
//       .skip(startIndex)
//       .limit(limit)
//       .lean(); // faster read‑only docs

//     /* Add computed userName field ------------------------------ */
//     const enriched = posts.map((p) => ({
//       ...p,
//       userName: p.userId?.username ?? 'Anonymous',
//     }));

//     /* Meta counts ---------------------------------------------- */
//     const totalPosts = await Post.countDocuments();
//     const lastMonthPosts = await Post.countDocuments({
//       createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
//     });

//     res.status(200).json({ posts: enriched, totalPosts, lastMonthPosts });
//   } catch (err) {
//     next(err);
//   }
// };
export const getPosts = async (req, res, next) => {
  handleValidation(req, next);

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDir = req.query.order === 'asc' ? 1 : -1;

  // Build dynamic filter
  const filter = {};
  if (req.query.userId) filter.userId = req.query.userId;
  if (req.query.postId) filter._id = req.query.postId;
  if (req.query.slug) filter.slug = req.query.slug;
  if (req.query.category && req.query.category !== 'uncategorized') {
    filter.category = req.query.category;
  }
  if (req.query.searchTerm) {
    const rx = { $regex: req.query.searchTerm, $options: 'i' };
    filter.$or = [{ title: rx }, { content: rx }, { location: rx }];
  }

  try {
    const posts = await Post.find(filter)
      .populate('userId', 'username') // N+1 fix: only fetch username
      .sort({ updatedAt: sortDir })
      .skip(startIndex)
      .limit(limit)
      .lean(); // lean improves read performance

    // Modify response based on anonymity
    const enriched = posts.map((p) => {
      const post = { ...p };

      // Remove username if post is anonymous
      if (post.isAnonymous) {
        if (post.userId && post.userId.username) {
          delete post.userId.username;
        }
        return post; // No userName field
      }

      // Add userName field for non-anonymous posts
      return {
        ...post,
        userName: post.userId?.username || 'Unknown',
      };
    });

    // Meta counts
    const totalPosts = await Post.countDocuments();
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({ posts: enriched, totalPosts, lastMonthPosts });
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------------------- */

export const getFlags = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    if (!posts.length)
      return next(errorHandler(404, 'No flags found for this user.'));
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------------------- */

export const deletePost = async (req, res, next) => {
  handleValidation(req, next);
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(errorHandler(404, 'Post not found.'));

    /* Object‑level auth --------------------------------------- */
    if (
      post.userId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return next(errorHandler(403, 'Not authorized.'));
    }

    // await post.remove();
    await post.deleteOne({ _id: post._id });
    res.status(200).json('Post deleted.');
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------------------- */

export const updatePost = async (req, res, next) => {
  handleValidation(req, next);

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(errorHandler(404, 'Post not found.'));

    if (
      post.userId.toString() !== req.user.id &&
      !req.user.isAdmin
    ) {
      return next(errorHandler(403, 'Not authorized.'));
    }

    /* Whitelist fields --------------------------------------- */
    const allowed = ['title', 'content','isAnonymous', 'flag', 'category', 'images', 'geolocation', 'location',];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        post[field] =
          field === 'content'
            ? sanitizeHtml(req.body[field])
            : req.body[field];
      }
    });

    /* Handle slug update if title changed -------------------- */
    if (req.body.title && req.body.title !== post.title) {
      const newSlug = buildSlug(req.body.title);
      const exists = await Post.findOne({ slug: newSlug });
      if (exists)
        return next(errorHandler(409, 'Another post already uses that title.'));
      post.slug = newSlug;
    }

    const updated = await post.save();
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

/* --------------------------------------------------------------- */

export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
