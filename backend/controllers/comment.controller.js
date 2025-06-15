import Comment from '../models/comment.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ Create Comment
export const createComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;

    if (!content || !postId) {
      return next(errorHandler(400, 'Content and postId are required.'));
    }

    if (!isValidObjectId(postId)) {
      return next(errorHandler(400, 'Invalid post ID.'));
    }

    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const newComment = new Comment({
      content: sanitizedContent,
      postId,
      userId: req.user.id,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

// ✅ Get Comments for a Post
export const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    if (!isValidObjectId(postId)) {
      return next(errorHandler(400, 'Invalid post ID.'));
    }

    const comments = await Comment.find({ postId })
      .populate('userId', 'username profilePicture') // Optional
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// ✅ Like / Unlike a Comment
export const likeComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
      return next(errorHandler(400, 'Invalid comment ID.'));
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found'));

    const userId = req.user.id;
    const liked = comment.likes.includes(userId);

    if (liked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      liked: !liked,
      likeCount: comment.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Edit a Comment
export const editComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
      return next(errorHandler(400, 'Invalid comment ID.'));
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found'));

    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'Not authorized to edit this comment.'));
    }

    comment.content = sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
    });

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// ✅ Delete a Comment
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    if (!isValidObjectId(commentId)) {
      return next(errorHandler(400, 'Invalid comment ID.'));
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return next(errorHandler(404, 'Comment not found'));

    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, 'Not authorized to delete this comment.'));
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ✅ Admin: Get All Comments with Stats
export const getcomments = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, 'Admin access required.'));
  }

  try {
    const startIndex = Math.max(parseInt(req.query.startIndex) || 0, 0);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate('userId', 'username email'); // Optional

    const totalComments = await Comment.countDocuments();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(error);
  }
};
