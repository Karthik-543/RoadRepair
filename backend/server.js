const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const dns = require('dns');
const connectDB = require('./config/db');

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');
const repairRoutes = require('./routes/repairRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', system: 'RoadSense AI Production Server' });
});

const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  }
});

app.use((err, req, res, next) => {
  console.error('Server error stack:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`RoadSense AI Production Application running on port ${PORT}`);
});
