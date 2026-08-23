const express = require('express');
const router = express.Router();
const {
  createOrUpdateRepair,
  assignWorkerToReport,
  getRepairByReportId,
  getAllRepairs,
} = require('../controllers/repairController');
const { protect, isAuthority } = require('../middleware/authMiddleware');
const { uploadRepairs } = require('../middleware/uploadMiddleware');

router.post('/', protect, isAuthority, uploadRepairs.single('repairedImage'), createOrUpdateRepair);
router.post('/assign', protect, isAuthority, assignWorkerToReport);
router.get('/report/:reportId', protect, getRepairByReportId);
router.get('/', protect, isAuthority, getAllRepairs);

module.exports = router;
