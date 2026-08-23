const Repair = require('../models/Repair');
const Report = require('../models/Report');
const Notification = require('../models/Notification');

const assignRepair = async (req, res) => {
  try {
    const { reportId, assignedTeam, remarks } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Associated report not found' });
    }

    let repair = await Repair.findOne({ report: reportId });
    if (!repair) {
      repair = await Repair.create({
        report: reportId,
        assignedTeam: assignedTeam || 'Rapid Repair Squad Alpha',
        remarks: remarks || 'Repair team assigned by municipal authority.',
        updatedBy: req.user._id,
      });
    } else {
      repair.assignedTeam = assignedTeam || repair.assignedTeam;
      repair.remarks = remarks || repair.remarks;
      repair.updatedBy = req.user._id;
      await repair.save();
    }

    report.status = 'Assigned';
    await report.save();

    await Notification.create({
      user: report.reporter,
      report: report._id,
      title: 'Repair Team Assigned',
      message: `A municipal repair squad (${repair.assignedTeam}) has been assigned to fix your reported road damage.`,
    });

    return res.status(200).json({
      success: true,
      repair,
      report,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const completeRepair = async (req, res) => {
  try {
    const { reportId, remarks, completionReportDoc } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    let repairedImagePath = '';
    if (req.file) {
      repairedImagePath = `/uploads/repairs/${req.file.filename}`;
    }

    let repair = await Repair.findOne({ report: reportId });
    if (!repair) {
      repair = await Repair.create({
        report: reportId,
        assignedTeam: 'Municipal Public Works Squad',
        repairedImage: repairedImagePath,
        completionReportDoc: completionReportDoc || 'Work order completed and verified.',
        remarks: remarks || 'Repair verified and completed by site engineer.',
        completionDate: new Date(),
        updatedBy: req.user._id,
      });
    } else {
      if (repairedImagePath) repair.repairedImage = repairedImagePath;
      if (completionReportDoc) repair.completionReportDoc = completionReportDoc;
      if (remarks) repair.remarks = remarks;
      repair.completionDate = new Date();
      repair.updatedBy = req.user._id;
      await repair.save();
    }

    report.status = 'Completed';
    await report.save();

    await Notification.create({
      user: report.reporter,
      report: report._id,
      title: 'Road Damage Repair Completed!',
      message: `Great news! The road damage you reported (${report.damageType}) has been fully repaired. View the completion photo and details on your dashboard.`,
    });

    return res.json({
      success: true,
      repair,
      report,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRepairByReportId = async (req, res) => {
  try {
    const repair = await Repair.findOne({ report: req.params.reportId }).populate('updatedBy', 'name email department');

    if (!repair) {
      return res.status(404).json({ message: 'No repair record found for this report' });
    }

    return res.json({
      success: true,
      repair,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  assignRepair,
  completeRepair,
  getRepairByReportId,
};
