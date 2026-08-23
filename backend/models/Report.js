const mongoose = require('mongoose');

const boundingBoxSchema = new mongoose.Schema({
  x1: Number,
  y1: Number,
  x2: Number,
  y2: Number,
  label: String,
  confidence: Number,
  area: Number,
});

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        default: 'Unknown Address',
      },
    },
    wardName: {
      type: String,
      default: 'Ward 04 - Central Municipal Zone',
    },
    originalImage: {
      type: String,
      required: true,
    },
    aiDetectedImage: {
      type: String,
      default: '',
    },
    damageType: {
      type: String,
      enum: ['Pothole', 'Longitudinal Crack', 'Transverse Crack', 'Alligator Crack', 'Road Patch', 'Undetected'],
      default: 'Pothole',
    },
    confidence: {
      type: Number,
      default: 0,
    },
    boundingBoxes: [boundingBoxSchema],
    estimatedDamagedArea: {
      type: Number,
      default: 0.5,
    },
    roadWidth: {
      type: Number,
      default: 7.5,
    },
    severityLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    roadCategory: {
      type: String,
      enum: ['Highway', 'Arterial Road', 'Local Street'],
      default: 'Local Street',
    },
    trafficDensity: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    nearbySchool: {
      type: Boolean,
      default: false,
    },
    nearbyHospital: {
      type: Boolean,
      default: false,
    },
    priorityScore: {
      type: Number,
      default: 0,
    },
    priorityLevel: {
      type: String,
      enum: ['Very Low', 'Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Assigned', 'In Progress', 'Completed', 'Rejected'],
      default: 'Pending',
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },
    parentReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      default: null,
    },
    masterReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      default: null,
    },
    duplicateCount: {
      type: Number,
      default: 0,
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    adminRemarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Report', reportSchema);
