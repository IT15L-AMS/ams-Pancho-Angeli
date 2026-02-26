const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. No token provided.'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findByPk(decoded.id, {
            include: [{
                model: Role,
                attributes: ['name']
            }]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found.'
            });
        }

        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated.'
            });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        }
        next(error);
    }
};

module.exports = authenticate;