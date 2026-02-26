const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

const registerValidation = [
    body('full_name')
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Password must contain at least one letter and one number'),
    body('role_name')
        .notEmpty().withMessage('Role is required')
        .isIn(['Admin', 'Registrar', 'Instructor', 'Student']).withMessage('Invalid role')
];

const loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

router.get('/admin-only', authenticate, checkRole('Admin'), (req, res) => {
    res.json({ success: true, message: 'Welcome Admin!' });
});

router.get('/registrar-only', authenticate, checkRole('Admin', 'Registrar'), (req, res) => {
    res.json({ success: true, message: 'Welcome Registrar!' });
});

router.get('/instructor-only', authenticate, checkRole('Admin', 'Registrar', 'Instructor'), (req, res) => {
    res.json({ success: true, message: 'Welcome Instructor!' });
});

module.exports = router;