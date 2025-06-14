// SECURED auth.controller.js
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import nodemailer from 'nodemailer';

// Helper
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Signin
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(errorHandler(400, 'All fields are required'));

    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(errorHandler(404, 'User not found'));

    if (!user.isVerified) return next(errorHandler(403, 'Verify your email first'));

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return next(errorHandler(400, 'Invalid password'));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const { password: pass, ...rest } = user._doc;
    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Signup
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return next(errorHandler(400, 'All fields are required'));

    const hashedPassword = await bcryptjs.hash(password, 12);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({ username, email, password: hashedPassword, isVerified: false, otp, otpExpires });
    await newUser.save();

    await sendEmail(email, 'Verify your email', `<p>Your OTP is <b>${otp}</b></p>`);
    res.json('Signup successful. Please verify your email using the OTP.');
  } catch (error) {
    next(error);
  }
};

// Verify Email
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return next(errorHandler(400, 'Email and OTP required'));

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
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
    if (!email) return next(errorHandler(400, 'Email is required'));

    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, 'User not found'));

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(user.email, 'Your OTP', `Your OTP is ${otp}. Valid for 10 minutes.`);
    res.json({ success: true, message: 'OTP sent' });
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
    if (!user || user.resetPasswordOTP !== otp || user.resetPasswordOTPExpiry < Date.now()) {
      return next(errorHandler(400, 'Invalid or expired OTP'));
    }

    user.password = await bcryptjs.hash(newPassword, 12);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// Google Auth
export const google = async (req, res, next) => {
  try {
    const { email, name, googlePhotoUrl } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      const tempPass = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcryptjs.hash(tempPass, 12);
      user = new User({
        username: `${name.toLowerCase().replace(/\s/g, '')}_${Math.floor(Math.random() * 10000)}`,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        isVerified: true,
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '2h' });
    const { password, ...rest } = user._doc;

    res.cookie('access_token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Send Contact Email
export const sendContactEmail = async (req, res, next) => {
  try {
    const { userEmail, subject, message } = req.body;
    if (!userEmail || !subject || !message) return next(errorHandler(400, 'All fields required'));

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
      text: `From: ${userEmail}\n${message}`,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    next(error);
  }
};
