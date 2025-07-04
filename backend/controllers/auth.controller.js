// // SECURED auth.controller.js
// import User from '../models/user.model.js';
// import bcryptjs from 'bcryptjs';
// import { errorHandler } from '../utils/error.js';
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// import { sendEmail } from '../utils/sendEmail.js';
// import nodemailer from 'nodemailer';

// // Helper
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Signin
// export const signin = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return next(errorHandler(400, 'All fields are required'));

//     const user = await User.findOne({ email }).select('+password');
//     if (!user) return next(errorHandler(404, 'User not found'));

//     if (!user.isVerified) return next(errorHandler(403, 'Verify your email first'));

//     const isMatch = await bcryptjs.compare(password, user.password);
//     if (!isMatch) return next(errorHandler(400, 'Invalid password'));

//     const token = jwt.sign(
//       { id: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     const { password: pass, ...rest } = user._doc;
//     res
//       .status(200)
//       .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
//       .json(rest);
//   } catch (error) {
//     next(error);
//   }
// };

// // Signup
// export const signup = async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) return next(errorHandler(400, 'All fields are required'));

//     const hashedPassword = await bcryptjs.hash(password, 12);
//     const otp = generateOTP();
//     const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

//     const newUser = new User({ username, email, password: hashedPassword, isVerified: false, otp, otpExpires });
//     await newUser.save();

//     await sendEmail(email, 'Verify your email', `<p>Your OTP is <b>${otp}</b></p>`);
//     res.json('Signup successful. Please verify your email using the OTP.');
//   } catch (error) {
//     next(error);
//   }
// };

// // Verify Email
// export const verifyEmail = async (req, res, next) => {
//   try {
//     const { email, otp } = req.body;
//     if (!email || !otp) return next(errorHandler(400, 'Email and OTP required'));

//     const user = await User.findOne({ email });
//     if (!user || user.otp !== otp || user.otpExpires < new Date()) {
//       return next(errorHandler(400, 'Invalid or expired OTP'));
//     }

//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     res.status(200).json('Email verified successfully');
//   } catch (error) {
//     next(error);
//   }
// };

// // Request Password Reset
// export const requestPasswordReset = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     if (!email) return next(errorHandler(400, 'Email is required'));

//     const user = await User.findOne({ email });
//     if (!user) return next(errorHandler(404, 'User not found'));

//     const otp = generateOTP();
//     user.resetPasswordOTP = otp;
//     user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000;
//     await user.save();

//     await sendEmail(user.email, 'Your OTP', `Your OTP is ${otp}. Valid for 10 minutes.`);
//     res.json({ success: true, message: 'OTP sent' });
//   } catch (error) {
//     next(error);
//   }
// };

// // Reset Password
// export const resetPassword = async (req, res, next) => {
//   try {
//     const { email, otp, newPassword } = req.body;
//     if (!email || !otp || !newPassword) return next(errorHandler(400, 'All fields are required'));

//     const user = await User.findOne({ email });
//     if (!user || user.resetPasswordOTP !== otp || user.resetPasswordOTPExpiry < Date.now()) {
//       return next(errorHandler(400, 'Invalid or expired OTP'));
//     }

//     user.password = await bcryptjs.hash(newPassword, 12);
//     user.resetPasswordOTP = undefined;
//     user.resetPasswordOTPExpiry = undefined;
//     await user.save();

//     res.json({ success: true, message: 'Password reset successful' });
//   } catch (error) {
//     next(error);
//   }
// };

// // Google Auth
// export const google = async (req, res, next) => {
//   try {
//     const { email, name, googlePhotoUrl } = req.body;
//     let user = await User.findOne({ email });

//     if (!user) {
//       const tempPass = crypto.randomBytes(16).toString('hex');
//       const hashedPassword = await bcryptjs.hash(tempPass, 12);
//       user = new User({
//         username: `${name.toLowerCase().replace(/\s/g, '')}_${Math.floor(Math.random() * 10000)}`,
//         email,
//         password: hashedPassword,
//         profilePicture: googlePhotoUrl,
//         isVerified: true,
//       });
//       await user.save();
//     }

//     const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '2h' });
//     const { password, ...rest } = user._doc;

//     res.cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }).status(200).json(rest);
//   } catch (error) {
//     next(error);
//   }
// };

// // Send Contact Email
// export const sendContactEmail = async (req, res, next) => {
//   try {
//     const { userEmail, subject, message } = req.body;
//     if (!userEmail || !subject || !message) return next(errorHandler(400, 'All fields required'));

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: userEmail,
//       to: process.env.EMAIL_USER,
//       subject: `Contact Form: ${subject}`,
//       text: `From: ${userEmail}\n${message}`,
//     });

//     res.status(200).json({ success: true, message: 'Email sent successfully' });
//   } catch (error) {
//     next(error);
//   }
// };

import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import nodemailer from 'nodemailer';
import validator from 'validator';
const { isEmail } = validator;

// Helpers
const generateOTP = () => crypto.randomInt(100000, 999999).toString();
const hashOTP = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

// Sign In
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(errorHandler(400, 'All fields are required'));
    if (!isEmail(email)) return next(errorHandler(400, 'Invalid email format'));

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) return next(errorHandler(400, 'Invalid credentials'));

    if (!user.isVerified) return next(errorHandler(403, 'Verify your email first'));

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return next(errorHandler(400, 'Invalid credentials'));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const { password: pass, ...rest } = user._doc;
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 120 * 60 * 1000, // 15 minutes
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Sign Up
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return next(errorHandler(400, 'All fields are required'));
    if (!isEmail(email)) return next(errorHandler(400, 'Invalid email format'));
    if (password.length < 6) return next(errorHandler(400, 'Password must be at least 6 characters'));

    const existing = await User.findOne({ email });
    if (existing) return next(errorHandler(409, 'Email already in use'));

    const hashedPassword = await bcryptjs.hash(password, 12);
    const otp = generateOTP();
    const otpHashed = hashOTP(otp);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      otp: otpHashed,
      otpExpires,
      consentGivenAt: new Date()
    });

    await newUser.save();
    await sendEmail(email, 'Verify your email', `<p>Your OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`);
    res.status(201).json('Signup successful. Please verify your email using the OTP.');
  } catch (error) {
    next(error);
  }
};

// Verify Email
export const verifyEmail = async (req, res, next) => {
  
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return next(errorHandler(400, 'Email and OTP required'));

//     const user = await User.findOne({ email });
//     console.log('otpExpires:', user.otpExpires);
// console.log('otpExpires timestamp:', user.otpExpires.getTime());
// console.log('Date.now():', Date.now());
// console.log('otpHashes match:', user.otp === hashOTP(otp));

//     if (!user || user.otp !== hashOTP(otp) || user.otpExpires.getTime() < Date.now()) {
//       return next(errorHandler(400, 'Invalid or expired OTP'));
//     }
const user = await User.findOne({ email }).select('+otp +otpExpires');
if (!user || user.otp !== hashOTP(otp) || user.otpExpires.getTime() < Date.now()) {
  return next(errorHandler(400, 'Invalid or expired OTP'));
}


    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json('Email verified successfully');
  } catch (error) {
    next(error);
  }
};

// Request Password Reset
export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !isEmail(email)) return next(errorHandler(400, 'Valid email required'));

    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(200, 'If this email exists, an OTP has been sent')); // Prevent enumeration

    const otp = generateOTP();
    user.resetPasswordOTP = hashOTP(otp);
    user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(user.email, 'Password Reset OTP', `<p>Your OTP is <b>${otp}</b>. Valid for 10 minutes.</p>`);
    res.status(200).json({ success: true, message: 'If this email exists, an OTP has been sent' });
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return next(errorHandler(400, 'All fields are required'));

    const user = await User.findOne({ email });
    if (
      !user ||
      user.resetPasswordOTP !== hashOTP(otp) ||
      user.resetPasswordOTPExpiry < Date.now()
    ) {
      return next(errorHandler(400, 'Invalid or expired OTP'));
    }

    if (newPassword.length < 6) return next(errorHandler(400, 'Password must be at least 6 characters'));

    user.password = await bcryptjs.hash(newPassword, 12);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// Google Auth
export const google = async (req, res, next) => {
  try {
    const { email, name, googlePhotoUrl } = req.body;
    if (!email || !name || !googlePhotoUrl) {
      return next(errorHandler(400, 'Google account data incomplete'));
    }

    let user = await User.findOne({ email });

    if (!user) {
      const tempPass = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcryptjs.hash(tempPass, 12);
      const username = `${name.toLowerCase().replace(/\s/g, '')}_${Math.floor(Math.random() * 10000)}`;

      user = new User({
        username,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        isVerified: true,
        consentGivenAt: new Date(),
      });

      await user.save();
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const { password, ...rest } = user._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Contact Form
export const sendContactEmail = async (req, res, next) => {
  try {
    const { userEmail, subject, message } = req.body;
    if (!userEmail || !subject || !message) return next(errorHandler(400, 'All fields required'));
    if (!isEmail(userEmail)) return next(errorHandler(400, 'Invalid email'));

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: userEmail,
      to: process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      text: `From: ${userEmail}\n\n${message}`,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    next(error);
  }
};

