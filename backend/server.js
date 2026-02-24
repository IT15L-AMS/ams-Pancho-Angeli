const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 1. Global Middleware
app.use(cors());
app.use(express.json()); 

// 2. Routes
app.use('/api/auth', authRoutes);

// 3. Centralized Error Handler 
app.use(errorHandler);

// 4. DB Sync & Server Start
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Database connected & synchronized');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });