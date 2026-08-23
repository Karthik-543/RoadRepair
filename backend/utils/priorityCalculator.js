const calculatePriority = ({
  severityLevel = 'Medium',
  trafficDensity = 'Medium',
  nearbyHospital = false,
  nearbySchool = false,
  duplicateCount = 0,
  roadCategory = 'Local Street',
  createdAt = new Date(),
  confidence = 0.8,
}) => {
  let score = 0;

  const severityWeights = {
    'Critical': 45,
    'High': 35,
    'Medium': 25,
    'Low': 15,
  };
  score += severityWeights[severityLevel] || 25;

  const trafficWeights = {
    'High': 20,
    'Medium': 10,
    'Low': 5,
  };
  score += trafficWeights[trafficDensity] || 10;

  if (nearbyHospital) score += 15;
  if (nearbySchool) score += 15;

  score += Math.min(duplicateCount * 10, 30);

  const roadWeights = {
    'Highway': 20,
    'Arterial Road': 15,
    'Local Street': 5,
  };
  score += roadWeights[roadCategory] || 5;

  const reportAgeInDays = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  score += Math.min(reportAgeInDays * 2, 20);

  score += Math.round(confidence * 10);

  let priorityLevel = 'Very Low';
  if (score >= 80) {
    priorityLevel = 'Critical';
  } else if (score >= 60) {
    priorityLevel = 'High';
  } else if (score >= 40) {
    priorityLevel = 'Medium';
  } else if (score >= 25) {
    priorityLevel = 'Low';
  }

  return {
    priorityScore: score,
    priorityLevel,
  };
};

module.exports = { calculatePriority };
