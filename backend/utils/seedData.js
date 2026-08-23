const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const dns = require('dns');
const connectDB = require('../config/db');
const User = require('../models/User');
const Report = require('../models/Report');
const Repair = require('../models/Repair');
const Notification = require('../models/Notification');
const OfficerAccessCode = require('../models/OfficerAccessCode');
const Assignment = require('../models/Assignment');
const ActivityLog = require('../models/ActivityLog');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Report.deleteMany();
    await Repair.deleteMany();
    await Notification.deleteMany();
    await OfficerAccessCode.deleteMany();
    await Assignment.deleteMany();
    await ActivityLog.deleteMany();

    console.log('Database collections cleared.');

    const predefinedCodes = [
      { code: 'MUN-OFFICER-8842', department: 'Public Works Engineering' },
      { code: 'MUN-OFFICER-9913', department: 'Highway & Pavement Maintenance' },
      { code: 'MUN-OFFICER-1045', department: 'Infrastructure Risk Assessment' },
      { code: 'CITY-ENG-5501', department: 'Rapid Response Inspection Unit' },
      { code: 'PWD-ADMIN-2026', department: 'Chief Municipal Operations' },
    ];
    await OfficerAccessCode.insertMany(predefinedCodes);
    console.log('Predefined Officer Security IDs seeded.');

    const adminUser = await User.create({
      name: 'Chief Officer Admin',
      email: 'admin@roadsense.gov',
      password: 'admin123',
      role: 'admin',
      officerId: 'PWD-ADMIN-2026',
      department: 'Chief Municipal Operations',
      phone: '+1-555-0199',
    });

    const engineerUser = await User.create({
      name: 'Eng. Rajesh Sharma',
      email: 'engineer@roadsense.gov',
      password: 'engineer123',
      role: 'engineer',
      officerId: 'MUN-OFFICER-8842',
      department: 'Public Works Engineering',
      phone: '+1-555-0188',
    });

    const supervisorUser = await User.create({
      name: 'Supervisor Vikram Patel',
      email: 'supervisor@roadsense.gov',
      password: 'supervisor123',
      role: 'supervisor',
      officerId: 'CITY-ENG-5501',
      department: 'Rapid Response Inspection Unit',
      phone: '+1-555-0177',
    });

    const citizenUser = await User.create({
      name: 'Karthik Citizen',
      email: 'citizen@roadsense.org',
      password: 'citizen123',
      role: 'citizen',
      department: 'Public Works Department',
      phone: '+1-555-0122',
    });

    await OfficerAccessCode.updateOne({ code: 'PWD-ADMIN-2026' }, { isUsed: true, usedBy: adminUser._id });
    await OfficerAccessCode.updateOne({ code: 'MUN-OFFICER-8842' }, { isUsed: true, usedBy: engineerUser._id });
    await OfficerAccessCode.updateOne({ code: 'CITY-ENG-5501' }, { isUsed: true, usedBy: supervisorUser._id });

    console.log('Sample users seeded (Admin, Engineer, Supervisor, Citizen).');

    const sampleReports = [
      {
        reporter: citizenUser._id,
        title: 'Severe Axle-Breaking Pothole on Main Arterial',
        description: 'Large deep pothole causing vehicle alignment loss and tire punctures near traffic intersection.',
        location: {
          type: 'Point',
          coordinates: [78.4744, 17.385],
          address: 'Main Street & 4th Cross Avenue Intersection',
        },
        wardName: 'Ward 04 - Central Zone',
        originalImage: '/uploads/original/sample_pothole_1.jpg',
        aiDetectedImage: '/uploads/ai_detected/sample_pothole_1_detected.jpg',
        damageType: 'Pothole',
        confidence: 0.94,
        boundingBoxes: [{ x1: 120, y1: 140, x2: 450, y2: 380, label: 'Pothole', confidence: 0.94, area: 0.15 }],
        estimatedDamagedArea: 1.8,
        roadWidth: 9.0,
        severityLevel: 'Critical',
        roadCategory: 'Highway',
        trafficDensity: 'High',
        nearbySchool: true,
        nearbyHospital: true,
        priorityScore: 92,
        priorityLevel: 'Critical',
        status: 'Pending',
      },
      {
        reporter: citizenUser._id,
        title: 'Extensive Alligator Fatigue Cracking',
        description: 'Sub-base asphalt structural breakdown extending across northbound lane.',
        location: {
          type: 'Point',
          coordinates: [78.489, 17.398],
          address: 'North Ring Road, Corridor 12',
        },
        wardName: 'Ward 07 - Industrial Belt',
        originalImage: '/uploads/original/sample_alligator_1.jpg',
        aiDetectedImage: '/uploads/ai_detected/sample_alligator_1_detected.jpg',
        damageType: 'Alligator Crack',
        confidence: 0.88,
        boundingBoxes: [{ x1: 90, y1: 100, x2: 520, y2: 420, label: 'Alligator Crack', confidence: 0.88, area: 0.22 }],
        estimatedDamagedArea: 3.2,
        roadWidth: 10.5,
        severityLevel: 'High',
        roadCategory: 'Arterial Road',
        trafficDensity: 'High',
        nearbySchool: false,
        nearbyHospital: true,
        priorityScore: 78,
        priorityLevel: 'High',
        status: 'In Progress',
        assignedOfficer: engineerUser._id,
      },
      {
        reporter: citizenUser._id,
        title: 'Longitudinal Seam Crack near School Zone',
        description: 'Linear joint separation parallel to curb line in pedestrian school walkway.',
        location: {
          type: 'Point',
          coordinates: [78.462, 17.371],
          address: 'St. Jude School Zone, Ward 02',
        },
        wardName: 'Ward 02 - Academic District',
        originalImage: '/uploads/original/sample_longitudinal_1.jpg',
        aiDetectedImage: '/uploads/ai_detected/sample_longitudinal_1_detected.jpg',
        damageType: 'Longitudinal Crack',
        confidence: 0.85,
        boundingBoxes: [{ x1: 200, y1: 50, x2: 280, y2: 580, label: 'Longitudinal Crack', confidence: 0.85, area: 0.11 }],
        estimatedDamagedArea: 0.9,
        roadWidth: 6.0,
        severityLevel: 'Medium',
        roadCategory: 'Local Street',
        trafficDensity: 'Medium',
        nearbySchool: true,
        nearbyHospital: false,
        priorityScore: 58,
        priorityLevel: 'Medium',
        status: 'Completed',
        assignedOfficer: supervisorUser._id,
      },
    ];

    const createdReports = await Report.insertMany(sampleReports);
    console.log('Sample reports seeded.');

    await Assignment.create({
      report: createdReports[1]._id,
      assignedBy: adminUser._id,
      assignedTo: engineerUser._id,
      roleAssigned: 'Field Engineer',
      instructions: 'Inspect alligator crack area and initiate hot-mix asphalt patching.',
      status: 'In Progress',
    });

    await Repair.create({
      report: createdReports[2]._id,
      repairedImage: '/uploads/repairs/sample_repaired_1.jpg',
      assignedTeam: 'Municipal Rapid Maintenance Unit',
      remarks: 'Hot-pour crack sealant applied and compacted successfully.',
      startDate: new Date(Date.now() - 2 * 86400000),
      completionDate: new Date(),
      status: 'Completed',
      updatedBy: adminUser._id,
      inspectorOfficer: supervisorUser._id,
    });

    await ActivityLog.create({
      user: adminUser._id,
      action: 'System Initialized',
      details: 'Seeded initial production data and user accounts.',
    });

    console.log('Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
