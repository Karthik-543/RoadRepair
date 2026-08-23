const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
      unique: true,
    },
    assignedTeam: {
      type: String,
      default: 'Rapid Repair Squad Alpha',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
    },
    repairedImage: {
      type: String,
      default: '',
    },
    completionReportDoc: {
      type: String,
      default: '',
    },
    remarks: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Repair', repairSchema);
