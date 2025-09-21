const express = require('express');
const { body, validationResult, param } = require('express-validator');
const Memory = require('../models/Memory');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all memory routes
router.use(authenticateToken);

// Validation middleware
const validateMemory = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('placeName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Place name is required and must be less than 100 characters'),
  body('locationLink')
    .optional()
    .isURL()
    .withMessage('Location link must be a valid URL'),
  body('fromDate')
    .isISO8601()
    .withMessage('From date must be a valid ISO date'),
  body('toDate')
    .isISO8601()
    .withMessage('To date must be a valid ISO date'),
  body('photo')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Photo is required')
];

// @route   POST /memories
// @desc    Create a new memory
// @access  Private
router.post('/', validateMemory, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, placeName, locationLink, fromDate, toDate, photo } = req.body;

    // Create new memory
    const memory = new Memory({
      title,
      description,
      placeName,
      locationLink,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      photo,
      user: req.user._id
    });

    await memory.save();

    res.status(201).json({
      message: 'Memory created successfully',
      memory
    });
  } catch (error) {
    console.error('Create memory error:', error);
    res.status(500).json({ message: 'Server error while creating memory' });
  }
});

// @route   GET /memories
// @desc    Get all memories for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { search, year, month } = req.query;

    let filter = { user: req.user._id };

    // Add search filter
    if (search) {
      filter = {
        ...filter,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { placeName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Add date filter
    if (year) {
      const yearInt = parseInt(year);
      const nextYear = yearInt + 1;
      filter.fromDate = {
        ...filter.fromDate,
        $gte: new Date(yearInt, 0, 1),
        $lt: new Date(nextYear, 0, 1)
      };
    }

    if (month !== undefined && month !== '') {
      const monthInt = parseInt(month);
      if (filter.fromDate && filter.fromDate.$gte) {
        // If year is also set, filter by specific month within that year
        const year = filter.fromDate.$gte.getFullYear();
        filter.fromDate = {
          $gte: new Date(year, monthInt, 1),
          $lt: new Date(year, monthInt + 1, 1)
        };
      } else {
        // If no year filter, just filter by month regardless of year
        filter.fromDate = {
          $gte: new Date(2020, monthInt, 1),
          $lt: new Date(2020, monthInt + 1, 1)
        };
      }
    }

    const memories = await Memory.find(filter)
      .sort({ fromDate: -1, createdAt: -1 });

    // Group memories by year and month for front-end use
    const groupedMemories = memories.reduce((acc, memory) => {
      const year = memory.year;
      const month = memory.month;
      const monthName = memory.monthName;

      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][monthName]) {
        acc[year][monthName] = {
          month: month,
          monthName: monthName,
          memories: []
        };
      }
      acc[year][monthName].memories.push(memory);
      return acc;
    }, {});

    res.json({
      memories: memories,
      groupedMemories: groupedMemories
    });
  } catch (error) {
    console.error('Get memories error:', error);
    res.status(500).json({ message: 'Server error while fetching memories' });
  }
});

// @route   PUT /memories/:id
// @desc    Update a memory
// @access  Private
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid memory ID'),
  ...validateMemory
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updates = req.body;

    // Find and update memory
    const memory = await Memory.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        ...updates,
        fromDate: updates.fromDate ? new Date(updates.fromDate) : undefined,
        toDate: updates.toDate ? new Date(updates.toDate) : undefined
      },
      { new: true, runValidators: true }
    );

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json({
      message: 'Memory updated successfully',
      memory
    });
  } catch (error) {
    console.error('Update memory error:', error);
    res.status(500).json({ message: 'Server error while updating memory' });
  }
});

// @route   DELETE /memories/:id
// @desc    Delete a memory
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete memory
    const memory = await Memory.findOneAndDelete({
      _id: id,
      user: req.user._id
    });

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }

    res.json({
      message: 'Memory deleted successfully'
    });
  } catch (error) {
    console.error('Delete memory error:', error);
    res.status(500).json({ message: 'Server error while deleting memory' });
  }
});

// @route   DELETE /memories
// @desc    Delete all memories for the authenticated user
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const result = await Memory.deleteMany({ user: req.user._id });

    res.json({
      message: 'All memories deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete all memories error:', error);
    res.status(500).json({ message: 'Server error while deleting all memories' });
  }
});

module.exports = router;
