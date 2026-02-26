const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    let error = { ...err };
    error.message = err.message;

    if (err.code === 'ER_DUP_ENTRY') {
        const message = 'Duplicate entry - record already exists';
        error = { message, statusCode: 400 };
    }

    if (err.code === 'ER_TRUNCATED_WRONG_VALUE') {
        const message = 'Invalid date/time value';
        error = { message, statusCode: 400 };
    }

    if (err.name === 'SequelizeValidationError') {
        const message = err.errors.map(e => e.message).join(', ');
        error = { message, statusCode: 400 };
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = 'Email already exists';
        error = { message, statusCode: 400 };
    }

    if (err.name === 'SequelizeDatabaseError') {
        const message = 'Database error: ' + err.message;
        error = { message, statusCode: 500 };
    }

    if (err.name === 'JsonWebTokenError') {
        error = { message: 'Invalid token', statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        error = { message: 'Token expired', statusCode: 401 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;