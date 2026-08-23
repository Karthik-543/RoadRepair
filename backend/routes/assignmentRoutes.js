const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const { protect, isAuthority } = require('../middleware/authMiddleware');

router.get('/', protect, isAuthority, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('report')
      .populate('assignedBy', 'name email officerId')
      .populate('assignedTo', 'name email officerId department')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/my-assignments', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ assignedTo: req.user._id })
      .populate('report')
      .populate('assignedBy', 'name email officerId')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
