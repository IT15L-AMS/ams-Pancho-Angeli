-- Create database
CREATE DATABASE IF NOT EXISTS academic_management;
USE academic_management;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_email (email),
    INDEX idx_role (role_id)
);

-- Insert default roles
INSERT IGNORE INTO roles (name, description) VALUES
('Admin', 'System administrator with full access'),
('Registrar', 'Manages student enrollment and records'),
('Instructor', 'Manages courses and grades'),
('Student', 'Views courses and grades');

-- Create permissions table (optional)
CREATE TABLE IF NOT EXISTS permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action ENUM('create', 'read', 'update', 'delete', 'manage') NOT NULL,
    description TEXT
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Insert sample permissions
INSERT IGNORE INTO permissions (name, resource, action) VALUES
('manage_users', 'users', 'manage'),
('view_users', 'users', 'read'),
('create_users', 'users', 'create'),
('edit_users', 'users', 'update'),
('delete_users', 'users', 'delete'),
('manage_courses', 'courses', 'manage'),
('view_courses', 'courses', 'read'),
('create_courses', 'courses', 'create'),
('edit_courses', 'courses', 'update'),
('delete_courses', 'courses', 'delete'),
('manage_enrollments', 'enrollments', 'manage'),
('view_own_grades', 'grades', 'read'),
('manage_grades', 'grades', 'manage');

-- Assign permissions to roles
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Admin';

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Registrar' 
AND p.name IN ('view_users', 'create_users', 'edit_users', 'manage_enrollments', 'view_courses');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Instructor' 
AND p.name IN ('view_courses', 'edit_courses', 'view_users', 'manage_grades');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Student' 
AND p.name IN ('view_courses', 'view_own_grades');

SHOW TABLES;
SELECT 'Database setup completed successfully!' as Status;
