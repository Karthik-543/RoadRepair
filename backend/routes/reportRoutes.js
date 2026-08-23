const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  deleteReport,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadOriginal } = require('../middleware/uploadMiddleware');

router.get('/', getAllReports);
router.post('/', protect, uploadOriginal.single('image'), createReport);
router.get('/my-reports', protect, getMyReports);
router.get('/:id', getReportById);
router.patch('/:id/status', protect, authorize('admin'), updateReportStatus);
router.delete('/:id', protect, authorize('admin'), deleteReport);

module.exports = router;
