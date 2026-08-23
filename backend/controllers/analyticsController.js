const Report = require('../models/Report');

const getDashboardAnalytics = async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });
    const verifiedReports = await Report.countDocuments({ status: 'Verified' });
    const assignedReports = await Report.countDocuments({ status: 'Assigned' });
    const inProgressReports = await Report.countDocuments({ status: 'In Progress' });
    const completedReports = await Report.countDocuments({ status: 'Completed' });
    const rejectedReports = await Report.countDocuments({ status: 'Rejected' });

    const criticalPriorityReports = await Report.countDocuments({ priorityLevel: 'Critical' });
    const highPriorityReports = await Report.countDocuments({ priorityLevel: 'High' });
    const mediumPriorityReports = await Report.countDocuments({ priorityLevel: 'Medium' });
    const lowPriorityReports = await Report.countDocuments({ priorityLevel: 'Low' });

    const damageTypeCounts = await Report.aggregate([
      {
        $group: {
          _id: '$damageType',
          count: { $sum: 1 },
        },
      },
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const reportsByMonthRaw = await Report.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const reportsByMonth = reportsByMonthRaw.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      reports: item.count,
    }));

    return res.json({
      success: true,
      summary: {
        totalReports,
        pendingReports,
        verifiedReports,
        assignedReports,
        inProgressReports,
        completedReports,
        rejectedReports,
        highPriorityCount: criticalPriorityReports + highPriorityReports,
        criticalPriorityReports,
        highPriorityReports,
        mediumPriorityReports,
        lowPriorityReports,
      },
      charts: {
        reportsByMonth,
        damageTypes: damageTypeCounts.map((item) => ({ name: item._id, count: item.count })),
        statusDistribution: [
          { name: 'Pending', count: pendingReports },
          { name: 'Verified', count: verifiedReports },
          { name: 'Assigned', count: assignedReports },
          { name: 'In Progress', count: inProgressReports },
          { name: 'Completed', count: completedReports },
          { name: 'Rejected', count: rejectedReports },
        ],
        severityDistribution: [
          { name: 'Critical', count: criticalPriorityReports },
          { name: 'High', count: highPriorityReports },
          { name: 'Medium', count: mediumPriorityReports },
          { name: 'Low', count: lowPriorityReports },
        ],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardAnalytics,
};
