const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const User = require('../models/User');
const Report = require('../models/Report');
const Repair = require('../models/Repair');
const Notification = require('../models/Notification');
const OfficerAccessCode = require('../models/OfficerAccessCode');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('DNS server override notice:', e.message);
}

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log(`Connecting to MongoDB Atlas...`);
    
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully!');

    await User.deleteMany({});
    await Report.deleteMany({});
    await Repair.deleteMany({});
    await Notification.deleteMany({});
    await OfficerAccessCode.deleteMany({});

    console.log('Seeding predefined Municipal Officer Access Codes...');
    const officerCodes = await OfficerAccessCode.insertMany([
      { code: 'MUN-OFFICER-8842', department: 'Public Works Engineering' },
      { code: 'MUN-OFFICER-9913', department: 'Highway & Pavement Maintenance' },
      { code: 'MUN-OFFICER-1045', department: 'Infrastructure Risk Assessment' },
      { code: 'PWD-ADMIN-2026', department: 'Chief Municipal Operations' },
      { code: 'CITY-ENG-5501', department: 'Rapid Response Inspection Unit' },
    ]);
    console.log(`Created ${officerCodes.length} predefined Municipal Officer Security IDs.`);

    const citizen = await User.create({
      name: 'Eleanor Vance',
      email: 'citizen@roadsense.org',
      password: 'citizen123',
      role: 'citizen',
      phone: '+1 (555) 234-5678',
    });

    const adminCode = await OfficerAccessCode.findOne({ code: 'PWD-ADMIN-2026' });

    const admin = await User.create({
      name: 'Chief Engineer Marcus Vance',
      email: 'admin@roadsense.gov',
      password: 'admin123',
      role: 'admin',
      officerId: 'PWD-ADMIN-2026',
      phone: '+1 (555) 987-6543',
      department: 'Municipal Public Works & Infrastructure',
    });

    if (adminCode) {
      adminCode.isUsed = true;
      adminCode.usedBy = admin._id;
      await adminCode.save();
    }

    console.log('Seed users created.');

    const report1 = await Report.create({
      reporter: citizen._id,
      title: 'Critical Pothole on Grand Highway Outer Ring',
      description: 'Deep 15cm asphalt crater causing major traffic slowdown and tire puncture hazard.',
      location: {
        type: 'Point',
        coordinates: [77.2190, 28.6239],
        address: 'Sector 4, Grand Highway Interchange',
      },
      originalImage: '/uploads/original/pothole_sample1.jpg',
      aiDetectedImage: '/uploads/ai_detected/pothole_sample1.jpg',
      damageType: 'Pothole',
      confidence: 0.94,
      boundingBoxes: [{ x1: 120, y1: 180, x2: 450, y2: 380, label: 'Pothole', confidence: 0.94 }],
      roadCategory: 'Highway',
      trafficDensity: 'High',
      nearbySchool: true,
      nearbyHospital: true,
      priorityScore: 88,
      priorityLevel: 'Critical',
      status: 'In Progress',
      duplicateCount: 2,
    });

    const report2 = await Report.create({
      reporter: citizen._id,
      title: 'Severe Alligator Cracking near St. Jude Hospital',
      description: 'Interlocking network of fatigue cracking across main ambulance access lane.',
      location: {
        type: 'Point',
        coordinates: [77.2050, 28.6100],
        address: 'Hospital Boulevard, Block B',
      },
      originalImage: '/uploads/original/crack_sample1.jpg',
      aiDetectedImage: '/uploads/ai_detected/crack_sample1.jpg',
      damageType: 'Alligator Crack',
      confidence: 0.89,
      boundingBoxes: [{ x1: 100, y1: 150, x2: 480, y2: 360, label: 'Alligator Crack', confidence: 0.89 }],
      roadCategory: 'Arterial Road',
      trafficDensity: 'High',
      nearbySchool: false,
      nearbyHospital: true,
      priorityScore: 78,
      priorityLevel: 'Critical',
      status: 'Assigned',
      duplicateCount: 1,
    });

    const report3 = await Report.create({
      reporter: citizen._id,
      title: 'Repaired Longitudinal Surface Crack',
      description: 'Longitudinal seam separation along local residential avenue.',
      location: {
        type: 'Point',
        coordinates: [77.1980, 28.6300],
        address: 'Oakridge Drive, Resident Sector 12',
      },
      originalImage: '/uploads/original/crack_sample2.jpg',
      aiDetectedImage: '/uploads/ai_detected/crack_sample2.jpg',
      damageType: 'Longitudinal Crack',
      confidence: 0.85,
      boundingBoxes: [{ x1: 150, y1: 100, x2: 400, y2: 300, label: 'Longitudinal Crack', confidence: 0.85 }],
      roadCategory: 'Local Street',
      trafficDensity: 'Medium',
      nearbySchool: true,
      nearbyHospital: false,
      priorityScore: 58,
      priorityLevel: 'High',
      status: 'Completed',
    });

    await Repair.create({
      report: report3._id,
      assignedTeam: 'Rapid Repair Squad Alpha',
      repairedImage: '/uploads/repairs/repair_sample1.jpg',
      completionReportDoc: 'Surface crack sealed with bitumous binder and hot resurfacing layer.',
      remarks: 'Inspected and certified clear by Site Engineer.',
      completionDate: new Date(),
      updatedBy: admin._id,
    });

    await Notification.create({
      user: citizen._id,
      report: report3._id,
      title: 'Road Damage Repair Completed!',
      message: 'The longitudinal crack reported on Oakridge Drive has been repaired by Squad Alpha.',
    });

    console.log('Seed database execution completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
