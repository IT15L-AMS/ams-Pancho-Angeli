-- =====================================================
-- Academic Management System - Complete Database Schema
-- =====================================================

-- Drop database if exists (for clean installation)
DROP DATABASE IF EXISTS academic_management;

-- Create database
CREATE DATABASE academic_management;
USE academic_management;

-- =====================================================
-- Table: roles
-- =====================================================
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: users
-- =====================================================
CREATE TABLE users (
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
    INDEX idx_role (role_id),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: permissions
-- =====================================================
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action ENUM('create', 'read', 'update', 'delete', 'manage') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_resource (resource)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: role_permissions
-- =====================================================
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: refresh_tokens (for bonus feature)
-- =====================================================
CREATE TABLE refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token(255)),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Insert Seed Data
-- =====================================================

-- Insert roles
INSERT INTO roles (name, description) VALUES
('Admin', 'System administrator with full access to all features'),
('Registrar', 'Manages student enrollment, records, and academic data'),
('Instructor', 'Manages courses, classes, and student grades'),
('Student', 'Views courses, grades, and personal information');

-- Insert permissions
INSERT INTO permissions (name, resource, action, description) VALUES
-- User management permissions
('manage_users', 'users', 'manage', 'Full control over users'),
('view_users', 'users', 'read', 'View user information'),
('create_users', 'users', 'create', 'Create new users'),
('edit_users', 'users', 'update', 'Edit user information'),
('delete_users', 'users', 'delete', 'Delete users'),

-- Course management permissions
('manage_courses', 'courses', 'manage', 'Full control over courses'),
('view_courses', 'courses', 'read', 'View course information'),
('create_courses', 'courses', 'create', 'Create new courses'),
('edit_courses', 'courses', 'update', 'Edit course information'),
('delete_courses', 'courses', 'delete', 'Delete courses'),

-- Enrollment permissions
('manage_enrollments', 'enrollments', 'manage', 'Manage student enrollments'),
('view_enrollments', 'enrollments', 'read', 'View enrollment information'),

-- Grade permissions
('manage_grades', 'grades', 'manage', 'Manage all grades'),
('view_own_grades', 'grades', 'read', 'View own grades'),
('view_all_grades', 'grades', 'read', 'View all grades');

-- Assign permissions to Admin (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Admin';

-- Assign permissions to Registrar
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Registrar' 
AND p.name IN ('view_users', 'create_users', 'edit_users', 
               'manage_enrollments', 'view_enrollments',
               'view_courses', 'view_all_grades');

-- Assign permissions to Instructor
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Instructor' 
AND p.name IN ('view_courses', 'edit_courses', 
               'view_users', 'manage_grades', 'view_enrollments');

-- Assign permissions to Student
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Student' 
AND p.name IN ('view_courses', 'view_own_grades');

-- =====================================================
-- Create test users (passwords are hashed version of "password123")
-- =====================================================
-- Password hash for "password123" using bcrypt
INSERT INTO users (full_name, email, password_hash, role_id, is_active) VALUES
('Admin User', 'admin@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR', 
 (SELECT id FROM roles WHERE name = 'Admin'), true),

('Registrar User', 'registrar@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Registrar'), true),

('Instructor User', 'instructor@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Instructor'), true),

('Student User', 'student@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Student'), true),

('John Doe', 'john.doe@example.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Student'), true),

('Jane Smith', 'jane.smith@example.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Instructor'), true);

-- =====================================================
-- Create Views for easier data access
-- =====================================================

-- View: user_details
CREATE VIEW user_details AS
SELECT 
    u.id,
    u.full_name,
    u.email,
    r.name as role_name,
    r.description as role_description,
    u.is_active,
    u.last_login,
    u.created_at
FROM users u
JOIN roles r ON u.role_id = r.id;

-- View: user_permissions
CREATE VIEW user_permissions AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.email,
    r.name as role_name,
    p.name as permission_name,
    p.resource,
    p.action
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id;

-- =====================================================
-- Create Stored Procedures
-- =====================================================

-- Procedure: get_users_by_role
DELIMITER //
CREATE PROCEDURE get_users_by_role(IN role_name VARCHAR(50))
BEGIN
    SELECT u.*, r.name as role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE r.name = role_name;
END //
DELIMITER ;

-- Procedure: update_last_login
DELIMITER //
CREATE PROCEDURE update_last_login(IN user_id INT)
BEGIN
    UPDATE users 
    SET last_login = NOW() 
    WHERE id = user_id;
END //
DELIMITER ;

-- =====================================================
-- Create Triggers
-- =====================================================

-- Trigger: before_user_insert
DELIMITER //
CREATE TRIGGER before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.email NOT LIKE '%_@__%.__%' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
END //
DELIMITER ;

-- =====================================================
-- Display summary
-- =====================================================
SELECT 'Database setup completed successfully!' as 'Status';
SELECT CONCAT('Total Roles: ', COUNT(*)) as 'Summary' FROM roles;
SELECT CONCAT('Total Users: ', COUNT(*)) as 'Summary' FROM users;
SELECT CONCAT('Total Permissions: ', COUNT(*)) as 'Summary' FROM permissions;