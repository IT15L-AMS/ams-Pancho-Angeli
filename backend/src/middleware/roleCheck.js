const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        const userRole = req.user.Role?.name;
        
        if (!userRole) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. No role assigned.'
            });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
            });
        }

        next();
    };
};

module.exports = { checkRole };