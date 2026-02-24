const jwt = require('jsonwebtoken');

/**
 * Generate a Token for a user
 * Includes ID and Role in the payload
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' } 
  );
};

module.exports = { generateToken };