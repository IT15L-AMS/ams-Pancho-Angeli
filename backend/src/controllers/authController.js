const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.Role?.name || user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
};

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { full_name, email, password, role_name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already exists' 
            });
        }

        // Find role
        const role = await Role.findOne({ where: { name: role_name } });
        if (!role) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid role' 
            });
        }

        // Create user
        const user = await User.create({
            full_name,
            email,
            password_hash: password,
            role_id: role.id
        });

        // Fetch user with role
        const newUser = await User.findByPk(user.id, {
            include: [{ model: Role, attributes: ['name'] }]
        });

        // Generate tokens
        const token = generateToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { 
                user: newUser, 
                token, 
                refreshToken 
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Find user with role
        const user = await User.findOne({
            where: { email },
            include: [{ model: Role, attributes: ['name'] }]
        });

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Check if account is active
        if (!user.is_active) {
            return res.status(401).json({ 
                success: false, 
                message: 'Account is deactivated' 
            });
        }

        // Validate password
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Update last login
        await user.update({ last_login: new Date() });

        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            success: true,
            message: 'Login successful',
            data: { 
                user, 
                token, 
                refreshToken 
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res, next) => {
    try {
        res.json({ 
            success: true, 
            data: { user: req.user } 
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ 
                success: false, 
                message: 'Refresh token required' 
            });
        }

        const decoded = jwt.verify(
            refreshToken, 
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );
        
        const user = await User.findByPk(decoded.id, {
            include: [{ model: Role, attributes: ['name'] }]
        });

        if (!user || !user.is_active) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid refresh token' 
            });
        }

        const newToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);

        res.json({ 
            success: true, 
            data: { 
                token: newToken, 
                refreshToken: newRefreshToken 
            } 
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired refresh token' 
            });
        }
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res, next) => {
    try {
        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    } catch (error) {
        next(error);
    }
};

// Export all functions
module.exports = { 
    register, 
    login, 
    getProfile, 
    refreshToken, 
    logout 
};