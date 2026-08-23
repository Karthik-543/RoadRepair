const Report = require('../models/Report');
const Notification = require('../models/Notification');
const { calculatePriority } = require('../utils/priorityCalculator');
const { checkAndHandleDuplicates } = require('../utils/duplicateDetector');
const { detectDamageWithAI } = require('../utils/aiServiceConnector');
const path = require('path');

const createReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Road damage image is required' });
    }

    const {
      title,
      description,
      latitude,
      longitude,
      address,
      roadCategory,
      trafficDensity,
      nearbySchool,
      nearbyHospital,
    } = req.body;

    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);

    if (isNaN(latNum) || isNaN(lonNum)) {
      return res.status(400).json({ message: 'Valid GPS latitude and longitude coordinates are required' });
    }

    const filename = req.file.filename;
    const originalImagePath = `/uploads/original/${filename}`;
    const absoluteImagePath = req.file.path;

    const aiResult = await detectDamageWithAI(absoluteImagePath, filename);

    const { priorityScore, priorityLevel } = calculatePriority({
      damageType: aiResult.damageType,
      confidence: aiResult.confidence,
      duplicateCount: 0,
      trafficDensity: trafficDensity || 'Medium',
      nearbySchool: nearbySchool === 'true' || nearbySchool === true,
      nearbyHospital: nearbyHospital === 'true' || nearbyHospital === true,
      roadCategory: roadCategory || 'Local Street',
    });

    const report = await Report.create({
      reporter: req.user._id,
      title: title || `${aiResult.damageType} Reported`,
      description: description || '',
      location: {
        type: 'Point',
        coordinates: [lonNum, latNum],
        address: address || 'Location Coordinates Captured',
      },
      originalImage: originalImagePath,
      aiDetectedImage: `/uploads/ai_detected/${aiResult.aiDetectedImage}`,
      damageType: aiResult.damageType,
      confidence: aiResult.confidence,
      boundingBoxes: aiResult.boundingBoxes,
      roadCategory: roadCategory || 'Local Street',
      trafficDensity: trafficDensity || 'Medium',
      nearbySchool: nearbySchool === 'true' || nearbySchool === true,
      nearbyHospital: nearbyHospital === 'true' || nearbyHospital === true,
      priorityScore: priorityScore,
      priorityLevel: priorityLevel,
      status: 'Pending',
    });

    const dupResult = await checkAndHandleDuplicates(lonNum, latNum, report._id, aiResult.damageType);
    if (dupResult.isDuplicate) {
      report.isDuplicate = true;
      report.parentReportId = dupResult.parentReportId;
      await report.save();
    }

    await Notification.create({
      user: req.user._id,
      report: report._id,
      title: 'Report Submitted Successfully',
      message: `Your report for ${report.damageType} has been analyzed with priority level: ${report.priorityLevel}.`,
    });

    return res.status(201).json({
      success: true,
      report,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const { damageType, status, priority, search, startDate, endDate } = req.query;
    let query = {};

    if (damageType && damageType !== 'All') {
      query.damageType = damageType;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priorityLevel = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { damageType: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const reports = await Report.find(query)
      .populate('reporter', 'name email phone')
      .populate('parentReportId', 'title status priorityLevel')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name email phone department')
      .populate('parentReportId');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    return res.json({
      success: true,
      report,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (status) {
      report.status = status;
    }
    if (adminRemarks !== undefined) {
      report.adminRemarks = adminRemarks;
    }

    await report.save();

    await Notification.create({
      user: report.reporter,
      report: report._id,
      title: `Report Status Updated to ${report.status}`,
      message: `Your road damage report status has been updated to "${report.status}". ${adminRemarks ? 'Remarks: ' + adminRemarks : ''}`,
    });

    return res.json({
      success: true,
      report,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.deleteOne();

    return res.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReport,
  getAllReports,
  getMyReports,
  getReportById,
  updateReportStatus,
  deleteReport,
};
