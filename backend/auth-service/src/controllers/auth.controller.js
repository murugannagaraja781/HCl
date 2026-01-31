const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Demo users for hackathon
    const demoUsers = {
      'admin': { id: 1, name: 'Admin User', role: 'ADMIN' },
      'm1': { id: 2, name: 'Manager One', role: 'MANAGER1' },
      'm2': { id: 3, name: 'Manager Two', role: 'MANAGER2' }
    };

    const demoUser = demoUsers[username?.toLowerCase()];
    if (demoUser && password === 'Admin@2026') {
      const token = jwt.sign({ userId: demoUser.id, role: demoUser.role }, process.env.JWT_SECRET || 'secret');
      return res.json({ success: true, user: demoUser, token });
    }

    // Regular DB login
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
      status: "active"
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.username,
        role: user.role
      },
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * REGISTER (optional – for testing/admin use)
 */
exports.register = async (req, res) => {
  const { username, email, password, role, employeeInfo } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      passwordHash,
      role,
      employeeInfo
    });

    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
