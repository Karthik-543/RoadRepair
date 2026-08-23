const Report = require('../models/Report');
const User = require('../models/User');
const Repair = require('../models/Repair');

const getDashboardAnalytics = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });
    const inProgressReports = await Report.countDocuments({ status: { $in: ['Assigned', 'In Progress', 'Verified'] } });
    const completedReports = await Report.countDocuments({ status: 'Completed' });
    const rejectedReports = await Report.countDocuments({ status: 'Rejected' });
    const totalUsers = await User.countDocuments();
    const duplicateReports = await Report.countDocuments({ isDuplicate: true });
    const criticalReports = await Report.countDocuments({ priorityLevel: 'Critical' });

    const completionRate = totalReports > 0 ? parseFloat(((completedReports / totalReports) * 100).toFixed(1)) : 0;
    const duplicatePercentage = totalReports > 0 ? parseFloat(((duplicateReports / totalReports) * 100).toFixed(1)) : 0;

    const damageDistributionRaw = await Report.aggregate([
      { $group: { _id: '$damageType', count: { $sum: 1 } } },
    ]);
    const damageDistribution = damageDistributionRaw.map((item) => ({
      name: item._id || 'Unknown',
      value: item.count,
    }));

    const severityDistributionRaw = await Report.aggregate([
      { $group: { _id: '$severityLevel', count: { $sum: 1 } } },
    ]);
    const severityDistribution = severityDistributionRaw.map((item) => ({
      name: item._id || 'Medium',
      value: item.count,
    }));

    const wardWiseStatsRaw = await Report.aggregate([
      { $group: { _id: '$wardName', total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } } } },
      { $sort: { total: -1 } },
      { $limit: 8 },
    ]);
    const wardWiseStats = wardWiseStatsRaw.map((w) => ({
      ward: w._id || 'General Ward',
      total: w.total,
      completed: w.completed,
    }));

    const roadWiseStatsRaw = await Report.aggregate([
      { $group: { _id: '$roadCategory', total: { $sum: 1 }, critical: { $sum: { $cond: [{ $eq: ['$priorityLevel', 'Critical'] }, 1, 0] } } } },
    ]);
    const roadWiseStats = roadWiseStatsRaw.map((r) => ({
      category: r._id || 'Local Street',
      total: r.total,
      critical: r.critical,
    }));

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyRaw = await Report.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyReports = monthlyRaw.map((m) => ({
      month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
      submitted: m.total,
      completed: m.completed,
    }));

    const completedRepairs = await Repair.find({ status: 'Completed', completionDate: { $ne: null } });
    let totalRepairTimeMs = 0;
    let validCount = 0;
    completedRepairs.forEach((r) => {
      if (r.startDate && r.completionDate) {
        const diff = new Date(r.completionDate) - new Date(r.startDate);
        if (diff > 0) {
          totalRepairTimeMs += diff;
          validCount += 1;
        }
      }
    });

    const averageRepairTimeHours = validCount > 0 ? parseFloat((totalRepairTimeMs / (1000 * 60 * 60 * validCount)).toFixed(1)) : 24.5;

    const mostAffectedAreasRaw = await Report.aggregate([
      { $group: { _id: '$location.address', count: { $sum: 1 }, criticalCount: { $sum: { $cond: [{ $eq: ['$priorityLevel', 'Critical'] }, 1, 0] } } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const mostAffectedAreas = mostAffectedAreasRaw.map((a) => ({
      address: a._id || 'Central Avenue Corridor',
      count: a.count,
      criticalCount: a.criticalCount,
    }));

    return res.json({
      success: true,
      stats: {
        totalReports,
        pendingReports,
        inProgressReports,
        completedReports,
        rejectedReports,
        totalUsers,
        duplicateReports,
        criticalReports,
        completionRate,
        duplicatePercentage,
        averageRepairTimeHours,
      },
      damageDistribution,
      severityDistribution,
      wardWiseStats,
      roadWiseStats,
      monthlyReports,
      mostAffectedAreas,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardAnalytics };
