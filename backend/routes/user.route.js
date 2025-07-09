// import express from 'express';
// import {
//   deleteUser,
//   getUser,
//   getUsers,
//   signout,
//   test,
//   updateUser,
// } from '../controllers/user.controller.js';
// import { verifyToken } from '../utils/verifyUser.js';
// import { isAdminOrSelf, isAdmin } from '../utils/verifyRoles.js'; // You can define these

// const router = express.Router();

// // Public test route
// router.get('/test', test);

// // Authenticated + ownership checks
// router.put('/update/:userId', verifyToken, isAdminOrSelf, updateUser);
// router.delete('/delete/:userId', verifyToken, isAdminOrSelf, deleteUser);

// // Authenticated only
// // router.post('/signout', verifyToken, signout);
// router.post('/signout', signout);

// // Admin-only
// router.get('/getusers', verifyToken, isAdmin, getUsers);

// // Protected route to view profile (self or admin)
// router.get('/:userId', verifyToken, isAdminOrSelf, getUser);

// export default router;
// import express from 'express';
// import {
//   deleteUser,
//   getUser,
//   getUsers,
//   signout,
//   updateUser
// } from '../controllers/user.controller.js';
// import { upload } from '../utils/fileUpload.js';

// import { updateUserProfilePicture } from '../controllers/user.controller.js';
// import { isAdmin, isAdminOrSelf } from '../utils/verifyRoles.js';
// import { verifyToken } from '../utils/verifyUser.js';

// import rateLimit from 'express-rate-limit';

// const router = express.Router();

// // Rate limiter for update/delete operations
// const modifyLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 mins
//   max: 10,
//   message: 'Too many requests from this IP, please try again later.',
// });

// // Public test route - no auth needed
// // router.get('/test', test);

// // Protected update route - verify user and authorization
// router.put('/update/:userId', verifyToken, isAdminOrSelf, modifyLimiter, updateUser);

// // Protected delete route - verify user and authorization
// router.delete('/delete/:userId', verifyToken, isAdminOrSelf, modifyLimiter, deleteUser);

// // Protect signout with auth middleware to confirm user identity
// router.post('/signout', verifyToken, signout);


// // Route for profile picture upload
// router.post(
//   '/upload-profile-picture/:userId',
//   verifyToken,
//   isAdminOrSelf,
//   upload.single('profilePicture'), // multer middleware, expects form-data 'profilePicture'
//   updateUserProfilePicture
// );

// // Admin-only route to get all users
// router.get('/getusers', verifyToken, isAdmin, getUsers);

// // Protected get user by ID (self or admin)
// router.get('/:userId', verifyToken, isAdminOrSelf, getUser);

// export default router;
import express from 'express';
import rateLimit from 'express-rate-limit';

import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  updateUser,
  updateUserProfilePicture,
  getUserPublicInfo
} from '../controllers/user.controller.js';

import { checkPasswordExpiry } from '../utils/checkPasswordExpiry.js'; // ✅ NEW
import { upload } from '../utils/fileUpload.js';
import { isAdmin, isAdminOrSelf } from '../utils/verifyRoles.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Rate limiter for update/delete operations
const modifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 10,
  message: 'Too many requests from this IP, please try again later.',
});

// 🔒 UPDATE USER — requires token, expiry check, ownership/admin, and rate limit
router.put(
  '/update/:userId',
  verifyToken,
  checkPasswordExpiry, 
  isAdminOrSelf,
  modifyLimiter,
  updateUser
);

// 🔒 DELETE USER — same checks as update
router.delete(
  '/delete/:userId',
  verifyToken,
  checkPasswordExpiry,
  isAdminOrSelf,
  modifyLimiter,
  deleteUser
);

// 🔐 SIGNOUT — token required but expiry check NOT needed
router.post('/signout',  signout);

// 📸 UPLOAD PROFILE PICTURE — secure + expiry protected
router.put(
  '/profile-picture/:userId',
  verifyToken,
  checkPasswordExpiry,
  isAdminOrSelf,
  upload.single('profilePicture'),
  updateUserProfilePicture
);

// 👑 GET ALL USERS — admin only, must not be expired
router.get('/getusers', verifyToken, checkPasswordExpiry, isAdmin, getUsers);

// 👤 GET SINGLE USER BY ID — self or admin, must not be expired
router.get('/:userId', verifyToken, checkPasswordExpiry, isAdminOrSelf, getUser);

// Get public info of user by ID — any authenticated user can fetch commenter info
router.get('/public/:userId', verifyToken, checkPasswordExpiry, getUserPublicInfo);


export default router;
