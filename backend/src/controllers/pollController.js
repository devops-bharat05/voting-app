import { validationResult } from 'express-validator';
import Poll from '../models/Poll.js';

export const createPoll = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, options, endDate } = req.body;
    const poll = await Poll.create({
      title,
      description,
      options: options.map(option => ({ text: option })),
      endDate,
      createdBy: req.user._id,
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort('-createdAt');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (poll) {
      res.json(poll);
    } else {
      res.status(404).json({ message: 'Poll not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { optionId } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (!poll.isActive) {
      return res.status(400).json({ message: 'Poll is no longer active' });
    }

    const option = poll.options.id(optionId);
    if (!option) {
      return res.status(400).json({ message: 'Option not found' });
    }

    option.votes += 1;
    await poll.save();

    // Emit socket event for real-time updates
    req.app.get('io').emit('pollUpdate', poll);

    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ createdBy: req.user._id })
      .sort('-createdAt');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};