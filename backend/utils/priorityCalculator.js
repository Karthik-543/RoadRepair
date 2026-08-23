const calculatePriority = ({
  damageType,
  confidence = 0.8,
  duplicateCount = 0,
  trafficDensity = 'Medium',
  nearbySchool = false,
  nearbyHospital = false,
  roadCategory = 'Local Street',
  createdAt = new Date(),
}) => {
  let score = 0;

  const severityMap = {
    'Pothole': 50,
    'Alligator Crack': 40,
    'Longitudinal Crack': 30,
    'Transverse Crack': 20,
    'Road Patch': 10,
    'Undetected': 10,
  };
  score += severityMap[damageType] || 20;

  score += Math.round(confidence * 15);

  score += Math.min(duplicateCount * 10, 30);

  const trafficMap = {
    'High': 20,
    'Medium': 10,
    'Low': 5,
  };
  score += trafficMap[trafficDensity] || 10;

  if (nearbyHospital) score += 15;
  if (nearbySchool) score += 15;

  const roadMap = {
    'Highway': 20,
    'Arterial Road': 15,
    'Local Street': 5,
  };
  score += roadMap[roadCategory] || 5;

  const reportAgeInDays = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  score += Math.min(reportAgeInDays * 2, 20);

  let priorityLevel = 'Low';
  if (score >= 75) {
    priorityLevel = 'Critical';
  } else if (score >= 55) {
    priorityLevel = 'High';
  } else if (score >= 35) {
    priorityLevel = 'Medium';
  }

  return {
    priorityScore: score,
    priorityLevel: priorityLevel,
  };
};

module.exports = { calculatePriority };
