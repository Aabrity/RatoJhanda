import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import validator from 'validator';
const { isEmail } = validator;


// Utility: Validate ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/** Accepts http / https URLs */
const isHttpUrl = (str = '') => /^https?:\/\/.+/i.test(str);

/** Accepts a “data:image/…;base64,AAAA” string */
const isBase64Image = (str = '') =>
  /^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/]+=*$/i.test(str);

export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

export const updateUser = async (req, res, next) => {
  if (!validateObjectId(req.params.userId)) {
    return next(errorHandler(400, 'Invalid user ID'));
  }

  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  try {
    const updates = {};

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      updates.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
      const username = req.body.username;
      if (username.length < 7 || username.length > 20) {
        return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
      }
      if (username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces'));
      }
      if (username !== username.toLowerCase()) {
        return next(errorHandler(400, 'Username must be lowercase'));
      }
      if (!username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400, 'Username can only contain letters and numbers'));
      }
      updates.username = username;
    }

    if (req.body.email) {
      if (!isEmail(req.body.email)) {
        return next(errorHandler(400, 'Invalid email format'));
      }
      updates.email = req.body.email.toLowerCase();
    }
    // console.log(req.body.profilePicture)

    if (req.body.profilePicture) {
    //   if (!req.body.profilePicture.startsWith('http')) {
    //     return next(errorHandler(400, 'Invalid profile picture URL'));
    //   }
    //   updates.profilePicture = req.body.profilePicture;
    // }
if ( !isBase64Image(req.body.profilePicture)) {
    return next(
      errorHandler(400, 'Profile picture must be a valid URL or base64 image')
    );
  }

  // optional: size check for base64 (max 1 MB)
  if (!isHttpUrl(req.body.profilePicture) && !isBase64Image(req.body.profilePicture)) {
    const sizeInBytes = (req.body.profilePicture.length * 3) / 4; // rough calc
    const MAX = 1 * 1024 * 1024; // 1 MB
    if (sizeInBytes > MAX) {
      return next(errorHandler(400, 'Base64 image too large (max 1 MB)'));
    }
  }
    updates.profilePicture = req.body.profilePicture;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found'));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!validateObjectId(req.params.userId)) {
    return next(errorHandler(400, 'Invalid user ID'));
  }

  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      })
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  if (!validateObjectId(req.params.userId)) {
    return next(errorHandler(400, 'Invalid user ID'));
  }

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
