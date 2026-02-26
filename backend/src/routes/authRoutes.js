const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Validation rules
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

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.post('/logout', authenticate, authController.logout);

// Role-based test routes
router.get('/admin-only', 
    authenticate, 
    checkRole('Admin'), 
    (req, res) => {
        res.json({ 
            success: true, 
            message: 'Welcome Admin! You have access to admin panel.' 
        });
    }
);

router.get('/registrar-only', 
    authenticate, 
    checkRole('Admin', 'Registrar'), 
    (req, res) => {
        res.json({ 
            success: true, 
            message: 'Welcome Registrar! You have access to registrar panel.' 
        });
    }
);

router.get('/instructor-only', 
    authenticate, 
    checkRole('Admin', 'Registrar', 'Instructor'), 
    (req, res) => {
        res.json({ 
            success: true, 
            message: 'Welcome Instructor! You have access to instructor panel.' 
        });
    }
);

router.get('/student-only', 
    authenticate, 
    checkRole('Admin', 'Registrar', 'Instructor', 'Student'), 
    (req, res) => {
        res.json({ 
            success: true, 
            message: 'Welcome Student! You have access to student portal.' 
        });
    }
);

module.exports = router;