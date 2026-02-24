const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: true,     
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database Connected Successfully.');
    
    // Creates the tables if not exists
    await sequelize.sync({ alter: true }); 
    console.log('Database Tables Synced.');
  } catch (error) {
    console.error('Database Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };