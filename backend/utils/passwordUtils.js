const bcrypt = require('bcryptjs');

/**
 * Hash a plain text password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare plain text password with hashed version
 */
const comparePassword = async (password, hashedPathword) => {
  return await bcrypt.compare(password, hashedPathword);
};

module.exports = { hashPassword, comparePassword };