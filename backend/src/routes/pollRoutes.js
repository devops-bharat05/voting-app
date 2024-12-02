import express from 'express';
import { body } from 'express-validator';
import { 
  createPoll, 
  getPolls, 
  getPollById, 
  votePoll, 
  getUserPolls 
} from '../controllers/pollController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('options').isArray({ min: 2 }),
  body('endDate').isISO8601(),
], createPoll);

router.get('/', getPolls);
router.get('/user', protect, getUserPolls);
router.get('/:id', getPollById);
router.post('/:id/vote', protect, votePoll);

export default router;