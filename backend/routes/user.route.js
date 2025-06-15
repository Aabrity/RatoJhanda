import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  test,
  updateUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { isAdminOrSelf, isAdmin } from '../utils/verifyRoles.js'; // You can define these

const router = express.Router();

// Public test route
router.get('/test', test);

// Authenticated + ownership checks
router.put('/update/:userId', verifyToken, isAdminOrSelf, updateUser);
router.delete('/delete/:userId', verifyToken, isAdminOrSelf, deleteUser);

// Authenticated only
router.post('/signout', verifyToken, signout);

// Admin-only
router.get('/getusers', verifyToken, isAdmin, getUsers);

// Protected route to view profile (self or admin)
router.get('/:userId', verifyToken, isAdminOrSelf, getUser);

export default router;
