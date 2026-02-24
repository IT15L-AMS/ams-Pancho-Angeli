const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  // Primary Key: Uses UUID for security
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Full Name: Mapped to 'full_name' in MySQL 
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name', 
    validate: {
      notEmpty: { msg: "Full name is required" }
    }
  },
  // Email: Must follow a valid email format
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "Must be a valid email address" }
    }
  },
  // Password: Stored as a hashed 
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Role: Enforced via ENUM for strict (RBAC)
  role: {
    type: DataTypes.ENUM('Admin', 'Registrar', 'Instructor', 'Student'),
    allowNull: false,
    defaultValue: 'Student'
  }
}, {

  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: { attributes: {} }
  },
  tableName: 'users', 
  timestamps: true   
});

module.exports = User;