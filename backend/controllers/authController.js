const User = require('../models/user.js');
const { generateToken } = require('../utils/jwtUtils.js');
const { comparePassword } = require('../utils/passwordUtils.js');

// 1. User Registration
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ fullName, email, password, role });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// 2. User Login 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
  
    // 1. Find user in DB
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // 2. Check password using utility
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // 3. Generate token using utility
    const token = generateToken(user);

    // 4. Send response 
    res.json({ 
      token, 
      user: { fullName: user.fullName, role: user.role } 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};