const { User, Role } = require('../models');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.Role?.name 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
};

const register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { full_name, email, password, role_name } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already exists' 
            });
        }

        const role = await Role.findOne({ where: { name: role_name } });
        if (!role) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid role' 
            });
        }

        const user = await User.create({
            full_name,
            email,
            password_hash: password,
            role_id: role.id
        });

        const newUser = await User.findByPk(user.id, {
            include: [{ model: Role, attributes: ['name'] }]
        });

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

const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

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

        if (!user.is_active) {
            return res.status(401).json({ 
                success: false, 
                message: 'Account is deactivated' 
            });
        }

        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        await user.update({ last_login: new Date() });

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

const logout = async (req, res, next) => {
    try {
        // In a real app, you might blacklist the token
        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    register, 
    login, 
    getProfile, 
    refreshToken, 
    logout 
};