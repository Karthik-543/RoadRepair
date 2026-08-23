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

const calculateImageSimilarity = (damageType1, confidence1, damageType2, confidence2) => {
  if (damageType1 !== damageType2) {
    return 0.3;
  }
  const confDiff = Math.abs(confidence1 - confidence2);
  const similarityScore = Math.max(0.4, 1.0 - confDiff * 1.5);
  return similarityScore;
};

const checkAndHandleDuplicates = async (newLongitude, newLatitude, newReportId, damageType, confidence) => {
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
      const similarity = calculateImageSimilarity(damageType, confidence, report.damageType, report.confidence);

      if (distance <= thresholdMeters && similarity >= 0.7) {
        const masterId = report.masterReportId || report._id;

        await Report.findByIdAndUpdate(newReportId, {
          isDuplicate: true,
          parentReportId: masterId,
          masterReportId: masterId,
        });

        const updatedDuplicateCount = (report.duplicateCount || 0) + 1;
        
        const { priorityScore, priorityLevel } = calculatePriority({
          severityLevel: report.severityLevel || 'Medium',
          trafficDensity: report.trafficDensity,
          nearbySchool: report.nearbySchool,
          nearbyHospital: report.nearbyHospital,
          roadCategory: report.roadCategory,
          duplicateCount: updatedDuplicateCount,
          createdAt: report.createdAt,
          confidence: report.confidence,
        });

        await Report.findByIdAndUpdate(report._id, {
          duplicateCount: updatedDuplicateCount,
          priorityScore,
          priorityLevel,
          masterReportId: masterId,
        });

        return {
          isDuplicate: true,
          masterReportId: masterId,
          duplicateCount: updatedDuplicateCount,
        };
      }
    }
  }

  return {
    isDuplicate: false,
    masterReportId: null,
    duplicateCount: 0,
  };
};

module.exports = { checkAndHandleDuplicates, getHaversineDistance, calculateImageSimilarity };
