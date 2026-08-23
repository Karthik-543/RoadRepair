const express = require('express');
const router = express.Router();
const {
  assignRepair,
  completeRepair,
  getRepairByReportId,
} = require('../controllers/repairController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadRepairs } = require('../middleware/uploadMiddleware');

router.post('/assign', protect, authorize('admin'), assignRepair);
router.post('/complete', protect, authorize('admin'), uploadRepairs.single('repairedImage'), completeRepair);
router.get('/report/:reportId', protect, getRepairByReportId);

module.exports = router;
