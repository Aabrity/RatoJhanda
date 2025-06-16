import Report from '../models/report.model.js';
import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

// OWASP: Validate input, sanitize string, avoid DB pollution
export const reportPost = async (req, res, next) => {
  const { postId } = req.params;
  const { reason, comment } = req.body;

  try {
    // Check if post exists (prevents orphan reports)
    const post = await Post.findById(postId);
    if (!post) return next(errorHandler(404, 'Post not found'));

    // Prevent self-reporting
    if (post.userId.toString() === req.user.id)
      return next(errorHandler(403, 'You cannot report your own post'));

    const report = await Report.create({
      postId,
      reporterId: req.user.id,
      reason,
      comment,
    });

    res.status(201).json({ message: 'Report submitted for review.' });
  } catch (err) {
    if (err.code === 11000) {
      return next(errorHandler(409, 'You have already reported this post.'));
    }
    next(err);
  }
};
import Report from '../models/Report.js';
import Post from '../models/Post.js';

// Middleware ensures req.user.isAdmin is true before running this

export const deleteReportAndPost = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Delete the associated post
    await Post.findByIdAndDelete(report.postId);

    // Delete the report itself
    await Report.findByIdAndDelete(reportId);

    return res.status(200).json({ message: 'Report and related post deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
