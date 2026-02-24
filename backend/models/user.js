const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  // Primary Key: UID for every user
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Prevents duplicate accounts
    validate: { isEmail: true } // Ensures valid email format
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  //  RBAC system
  role: {
    type: DataTypes.ENUM('Admin', 'Teacher', 'Student'),
    allowNull: false,
    defaultValue: 'Student'
  }
}, {
  // Security Hook: Hash password automatically before saving to DB
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  // Security
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: { attributes: {}, }
  }
});

module.exports = User;