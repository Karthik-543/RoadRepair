const User = require('../models/User');
const OfficerAccessCode = require('../models/OfficerAccessCode');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'roadsense_ai_secure_production_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, department, officerId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User account with this email already exists' });
    }

    let assignedRole = 'citizen';
    let assignedDepartment = 'Public Works Department';
    let validOfficerCode = null;

    if (role === 'admin') {
      if (!officerId) {
        return res.status(400).json({
          message: 'Municipal Officers must provide a valid Predefined Officer Security ID to register.',
        });
      }

      const formattedCode = officerId.trim().toUpperCase();
      validOfficerCode = await OfficerAccessCode.findOne({ code: formattedCode });

      if (!validOfficerCode) {
        return res.status(400).json({
          message: `Invalid Officer Security ID '${formattedCode}'. Please enter a valid predefined ID.`,
        });
      }

      if (validOfficerCode.isUsed) {
        return res.status(400).json({
          message: `Officer Security ID '${formattedCode}' has already been registered to another officer account.`,
        });
      }

      assignedRole = 'admin';
      assignedDepartment = validOfficerCode.department || department || 'Municipal Public Works';
    }

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
      department: assignedDepartment,
      officerId: assignedRole === 'admin' ? officerId.trim().toUpperCase() : null,
    });

    if (validOfficerCode) {
      validOfficerCode.isUsed = true;
      validOfficerCode.usedBy = user._id;
      await validOfficerCode.save();
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department,
        officerId: user.officerId,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password credentials' });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department,
        officerId: user.officerId,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department,
        officerId: user.officerId,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAvailableOfficerCodes = async (req, res) => {
  try {
    const codes = await OfficerAccessCode.find().select('code department isUsed');
    return res.json({
      success: true,
      codes,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAvailableOfficerCodes,
};
