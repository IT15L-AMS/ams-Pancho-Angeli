const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// For Phase 1, anyone can register
router.post('/register', register); 
router.post('/login', login);

// Route for Admin
router.get('/admin-data', protect, authorize('Admin'), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

module.exports = router;