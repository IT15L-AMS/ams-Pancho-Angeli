const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors()); // Frontend and backend communicates
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);

// Connect to DB and Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});