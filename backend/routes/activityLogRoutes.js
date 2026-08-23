const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const { protect, isAuthority } = require('../middleware/authMiddleware');

router.get('/', protect, isAuthority, async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'name email role department')
      .populate('targetReport', 'title status damageType')
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
