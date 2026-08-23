const calculateSeverity = ({
  damageType = 'Pothole',
  boundingBoxes = [],
  confidence = 0.8,
  roadWidth = 7.5,
}) => {
  const classWeights = {
    'Pothole': 50,
    'Alligator Crack': 40,
    'Longitudinal Crack': 30,
    'Transverse Crack': 20,
    'Road Patch': 10,
    'Undetected': 10,
  };

  const baseWeight = classWeights[damageType] || 20;

  let totalBoxRatio = 0;
  if (Array.isArray(boundingBoxes) && boundingBoxes.length > 0) {
    boundingBoxes.forEach((box) => {
      if (box.x1 !== undefined && box.x2 !== undefined && box.y1 !== undefined && box.y2 !== undefined) {
        const boxWidth = Math.abs(box.x2 - box.x1);
        const boxHeight = Math.abs(box.y2 - box.y1);
        const areaRatio = (boxWidth * boxHeight) / (640 * 640);
        totalBoxRatio += areaRatio;
      }
    });
  } else {
    totalBoxRatio = 0.08;
  }

  const estimatedDamagedArea = parseFloat(
    Math.max(0.1, totalBoxRatio * roadWidth * 4 * (confidence + 0.1)).toFixed(2)
  );

  let severityScore = Math.round(
    baseWeight * 0.45 + Math.min(35, estimatedDamagedArea * 12) + (confidence * 20)
  );

  let severityLevel = 'Low';
  if (severityScore >= 70) {
    severityLevel = 'Critical';
  } else if (severityScore >= 50) {
    severityLevel = 'High';
  } else if (severityScore >= 30) {
    severityLevel = 'Medium';
  }

  return {
    severityScore,
    severityLevel,
    estimatedDamagedArea,
  };
};

module.exports = { calculateSeverity };
