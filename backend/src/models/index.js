const User = require('./user');
const Role = require('./role');

// Define associations
User.belongsTo(Role, { 
    foreignKey: 'role_id',
    as: 'Role'
});

Role.hasMany(User, { 
    foreignKey: 'role_id',
    as: 'Users'
});

module.exports = {
    User,
    Role
};