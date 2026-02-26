    const express = require('express');
    const cors = require('cors');
    const helmet = require('helmet');
    const rateLimit = require('express-rate-limit');
    const dotenv = require('dotenv');
    const sequelize = require('./config/database');
    const authRoutes = require('./routes/authRoutes');
    const errorHandler = require('./utils/errorHandler');

    const User = require('./models/user');
    const Role = require('./models/role');

    User.belongsTo(Role, { foreignKey: 'role_id' });
    Role.hasMany(User, { foreignKey: 'role_id' });

    dotenv.config();

    const app = express();

    app.use(helmet());
    app.use(cors());

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    });
    app.use('/api', limiter);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/auth', authRoutes);

    app.get('/health', (req, res) => {
        res.json({ 
            status: 'OK', 
            timestamp: new Date(),
            environment: process.env.NODE_ENV,
            database: sequelize.config.database
        });
    });

    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;

    async function startServer() {
        try {
            await sequelize.authenticate();
            console.log('✅ Database connected successfully');
            console.log(`📊 Connected to database: ${sequelize.config.database}`);
            
            await sequelize.sync();
            console.log('✅ Database synced');
            
            app.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT}`);
                console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
                console.log(`🔗 Health check: http://localhost:${PORT}/health`);
                console.log(`🔗 API URL: http://localhost:${PORT}/api`);
            });
        } catch (err) {
            console.error('❌ Failed to start server:', err);
        }
    }

    startServer();