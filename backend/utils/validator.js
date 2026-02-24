const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('fullName').trim().notEmpty().withMessage('Full Name is required'),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('role').isIn(['Admin', 'Teacher', 'Student']).withMessage('Invalid role assigned'),
  
  // Middleware to catch the results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateRegister };