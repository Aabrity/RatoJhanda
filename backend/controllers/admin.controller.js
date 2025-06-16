import Report from '../models/report.model.js';
import { errorHandler } from '../utils/error.js';

export const getAllReports = async (req, res, next) => {
  // Must only allow admins
  if (!req.user.isAdmin) return next(errorHandler(403, 'Forbidden'));

  try {
    const reports = await Report.find()
      .populate('postId', 'title slug content')
      .populate('reporterId', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
};