import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().trim(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], registerUser);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists(),
], loginUser);

router.get('/profile', protect, getUserProfile);

export default router;