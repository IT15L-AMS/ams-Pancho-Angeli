const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ fullName, email, password, role });
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user and include password for comparison
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, fullName: user.fullName, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};