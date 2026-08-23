const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roleAssigned: {
      type: String,
      enum: ['Field Engineer', 'Repair Squad Lead', 'Supervisor', 'Maintenance Crew'],
      default: 'Field Engineer',
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Assigned', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Assigned',
    },
    instructions: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assignment', assignmentSchema);
