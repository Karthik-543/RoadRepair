const Report = require('../models/Report');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const { calculateSeverity } = require('../utils/severityCalculator');
const { calculatePriority } = require('../utils/priorityCalculator');
const { checkAndHandleDuplicates } = require('../utils/duplicateDetector');
const { detectDamageWithAI } = require('../utils/aiServiceConnector');

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
      wardName,
      roadWidth,
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

    const roadWidthNum = parseFloat(roadWidth) || 7.5;

    const { severityScore, severityLevel, estimatedDamagedArea } = calculateSeverity({
      damageType: aiResult.damageType,
      boundingBoxes: aiResult.boundingBoxes,
      confidence: aiResult.confidence,
      roadWidth: roadWidthNum,
    });

    const { priorityScore, priorityLevel } = calculatePriority({
      severityLevel,
      trafficDensity: trafficDensity || 'Medium',
      nearbySchool: nearbySchool === 'true' || nearbySchool === true,
      nearbyHospital: nearbyHospital === 'true' || nearbyHospital === true,
      roadCategory: roadCategory || 'Local Street',
      duplicateCount: 0,
      confidence: aiResult.confidence,
    });

    const report = await Report.create({
      reporter: req.user._id,
      title: title || `${aiResult.damageType} Incident Reported`,
      description: description || '',
      location: {
        type: 'Point',
        coordinates: [lonNum, latNum],
        address: address || 'Location Coordinates Recorded',
      },
      wardName: wardName || 'Ward 04 - Central Municipal Zone',
      originalImage: originalImagePath,
      aiDetectedImage: `/uploads/ai_detected/${aiResult.aiDetectedImage}`,
      damageType: aiResult.damageType,
      confidence: aiResult.confidence,
      boundingBoxes: aiResult.boundingBoxes,
      estimatedDamagedArea,
      roadWidth: roadWidthNum,
      severityLevel,
      roadCategory: roadCategory || 'Local Street',
      trafficDensity: trafficDensity || 'Medium',
      nearbySchool: nearbySchool === 'true' || nearbySchool === true,
      nearbyHospital: nearbyHospital === 'true' || nearbyHospital === true,
      priorityScore,
      priorityLevel,
      status: 'Pending',
    });

    const dupResult = await checkAndHandleDuplicates(
      lonNum,
      latNum,
      report._id,
      aiResult.damageType,
      aiResult.confidence
    );

    if (dupResult.isDuplicate) {
      report.isDuplicate = true;
      report.parentReportId = dupResult.masterReportId;
      report.masterReportId = dupResult.masterReportId;
      await report.save();
    }

    await Notification.create({
      user: req.user._id,
      report: report._id,
      title: 'Report Created Successfully',
      message: `Your report for ${report.damageType} has been analyzed. Severity: ${report.severityLevel}, Priority: ${report.priorityLevel}.`,
      notificationType: 'accepted',
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Report Submitted',
      targetReport: report._id,
      details: `Submitted report '${report.title}' classified as ${report.damageType}`,
      ipAddress: req.ip || '',
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
    const {
      damageType,
      status,
      priority,
      severity,
      search,
      wardName,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

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

    if (severity && severity !== 'All') {
      query.severityLevel = severity;
    }

    if (wardName && wardName !== 'All') {
      query.wardName = wardName;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { damageType: { $regex: search, $options: 'i' } },
        { wardName: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    if (sortBy === 'priorityScore') {
      sortOptions.priorityScore = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'confidence') {
      sortOptions.confidence = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('reporter', 'name email phone role')
      .populate('masterReportId', 'title status priorityLevel')
      .populate('assignedOfficer', 'name email department officerId')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return res.json({
      success: true,
      count: reports.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
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
      .populate('assignedOfficer', 'name email department')
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
      .populate('masterReportId')
      .populate('assignedOfficer', 'name email department officerId');

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
    const { status, adminRemarks, assignedOfficer } = req.body;
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
    if (assignedOfficer) {
      report.assignedOfficer = assignedOfficer;
    }

    await report.save();

    let notifType = 'general';
    if (status === 'Verified') notifType = 'under_inspection';
    else if (status === 'Assigned' || status === 'In Progress') notifType = 'repair_started';
    else if (status === 'Completed') notifType = 'repair_completed';
    else if (status === 'Rejected') notifType = 'rejected';

    await Notification.create({
      user: report.reporter,
      report: report._id,
      title: `Report Status Updated: ${report.status}`,
      message: `Your road damage report status is now "${report.status}". ${adminRemarks ? 'Remarks: ' + adminRemarks : ''}`,
      notificationType: notifType,
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Status Updated',
      targetReport: report._id,
      details: `Updated report status to '${report.status}'`,
      ipAddress: req.ip || '',
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

    await ActivityLog.create({
      user: req.user._id,
      action: 'Report Deleted',
      details: `Deleted report ID '${req.params.id}'`,
      ipAddress: req.ip || '',
    });

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
