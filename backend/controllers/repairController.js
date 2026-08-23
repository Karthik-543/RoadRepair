const Repair = require('../models/Repair');
const Report = require('../models/Report');
const Notification = require('../models/Notification');
const Assignment = require('../models/Assignment');
const ActivityLog = require('../models/ActivityLog');

const createOrUpdateRepair = async (req, res) => {
  try {
    const { reportId, remarks, assignedTeam } = req.body;

    if (!reportId) {
      return res.status(400).json({ message: 'Report ID is required' });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    let repairedImagePath = '';
    if (req.file) {
      repairedImagePath = `/uploads/repairs/${req.file.filename}`;
    }

    let repair = await Repair.findOne({ report: reportId });

    if (repair) {
      if (repairedImagePath) repair.repairedImage = repairedImagePath;
      if (remarks) repair.remarks = remarks;
      if (assignedTeam) repair.assignedTeam = assignedTeam;
      repair.updatedBy = req.user._id;
      repair.inspectorOfficer = req.user._id;
      if (repairedImagePath) {
        repair.completionDate = new Date();
        repair.status = 'Completed';
      }
      await repair.save();
    } else {
      repair = await Repair.create({
        report: reportId,
        repairedImage: repairedImagePath,
        assignedTeam: assignedTeam || 'Municipal Maintenance Division',
        remarks: remarks || 'Initial work order issued',
        startDate: new Date(),
        completionDate: repairedImagePath ? new Date() : null,
        status: repairedImagePath ? 'Completed' : 'In Progress',
        updatedBy: req.user._id,
        inspectorOfficer: req.user._id,
      });
    }

    if (repairedImagePath) {
      report.status = 'Completed';
      await report.save();

      await Notification.create({
        user: report.reporter,
        report: report._id,
        title: 'Road Damage Repair Completed',
        message: 'The municipal team has completed the repair work. Thank you for reporting!',
        notificationType: 'repair_completed',
      });
    } else {
      report.status = 'In Progress';
      await report.save();

      await Notification.create({
        user: report.reporter,
        report: report._id,
        title: 'Repair Work Commenced',
        message: 'Municipal maintenance team has started repair operations for your report.',
        notificationType: 'repair_started',
      });
    }

    await ActivityLog.create({
      user: req.user._id,
      action: repairedImagePath ? 'Repair Completed' : 'Repair Commenced',
      targetReport: report._id,
      details: remarks || 'Updated repair work order status',
      ipAddress: req.ip || '',
    });

    return res.status(201).json({
      success: true,
      repair,
      report,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const assignWorkerToReport = async (req, res) => {
  try {
    const { reportId, assignedToId, roleAssigned, instructions } = req.body;

    if (!reportId || !assignedToId) {
      return res.status(400).json({ message: 'Report ID and Assigned Officer ID are required' });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const assignment = await Assignment.create({
      report: reportId,
      assignedBy: req.user._id,
      assignedTo: assignedToId,
      roleAssigned: roleAssigned || 'Field Engineer',
      instructions: instructions || 'Inspect and execute repair work order.',
      status: 'Assigned',
    });

    report.status = 'Assigned';
    report.assignedOfficer = assignedToId;
    await report.save();

    await Notification.create({
      user: assignedToId,
      report: report._id,
      title: 'New Repair Assignment',
      message: `You have been assigned to repair work order for report '${report.title}'.`,
      notificationType: 'repair_started',
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Worker Assigned',
      targetReport: report._id,
      details: `Assigned officer ID '${assignedToId}' as ${roleAssigned || 'Field Engineer'}`,
      ipAddress: req.ip || '',
    });

    return res.status(201).json({
      success: true,
      assignment,
      report,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRepairByReportId = async (req, res) => {
  try {
    const repair = await Repair.findOne({ report: req.params.reportId })
      .populate('updatedBy', 'name email department officerId')
      .populate('inspectorOfficer', 'name email department officerId');

    return res.json({
      success: true,
      repair: repair || null,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllRepairs = async (req, res) => {
  try {
    const repairs = await Repair.find()
      .populate('report')
      .populate('updatedBy', 'name email department')
      .populate('inspectorOfficer', 'name email department')
      .sort({ updatedAt: -1 });

    return res.json({
      success: true,
      count: repairs.length,
      repairs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrUpdateRepair,
  assignWorkerToReport,
  getRepairByReportId,
  getAllRepairs,
};
