import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

/**
 * Verifies JWT in cookies and attaches user data to req object.
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(errorHandler(401, 'Access denied. No token provided.'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // restrict to known algorithm
      maxAge: '2h',          // enforce token expiration
    });

    // Attach verified user to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return next(errorHandler(401, 'Invalid or expired token.'));
  }
};
