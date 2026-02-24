const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRegister } = require('../utils/validator'); 

router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);
router.get('/profile', protect, authController.getProfile);

// Admin Only
router.get('/users', protect, authorize('Admin'), authController.getAllUsers);
router.delete('/users/:id', protect, authorize('Admin'), authController.deleteUser);

module.exports = router;