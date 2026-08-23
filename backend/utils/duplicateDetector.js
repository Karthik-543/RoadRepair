const Report = require('../models/Report');
const { calculatePriority } = require('./priorityCalculator');

const getHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const checkAndHandleDuplicates = async (newLongitude, newLatitude, newReportId, damageType) => {
  const thresholdMeters = 50;

  const existingReports = await Report.find({
    _id: { $ne: newReportId },
    isDuplicate: false,
    status: { $nin: ['Completed', 'Rejected'] },
  });

  for (const report of existingReports) {
    if (report.location && report.location.coordinates && report.location.coordinates.length === 2) {
      const [existingLon, existingLat] = report.location.coordinates;
      const distance = getHaversineDistance(newLatitude, newLongitude, existingLat, existingLon);

      if (distance <= thresholdMeters) {
        await Report.findByIdAndUpdate(newReportId, {
          isDuplicate: true,
          parentReportId: report._id,
        });

        const updatedDuplicateCount = (report.duplicateCount || 0) + 1;
        
        const { priorityScore, priorityLevel } = calculatePriority({
          damageType: report.damageType,
          confidence: report.confidence,
          duplicateCount: updatedDuplicateCount,
          trafficDensity: report.trafficDensity,
          nearbySchool: report.nearbySchool,
          nearbyHospital: report.nearbyHospital,
          roadCategory: report.roadCategory,
          createdAt: report.createdAt,
        });

        await Report.findByIdAndUpdate(report._id, {
          duplicateCount: updatedDuplicateCount,
          priorityScore: priorityScore,
          priorityLevel: priorityLevel,
        });

        return {
          isDuplicate: true,
          parentReportId: report._id,
        };
      }
    }
  }

  return {
    isDuplicate: false,
    parentReportId: null,
  };
};

module.exports = { checkAndHandleDuplicates, getHaversineDistance };
