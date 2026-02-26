-- =====================================================
-- Academic Management System - Phase 1 Database Schema
-- Authentication & Authorization
-- =====================================================

DROP DATABASE IF EXISTS ams_db;

CREATE DATABASE ams_db;
USE ams_db;

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
-- Table: refresh_tokens 
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

INSERT INTO roles (name, description) VALUES
('Admin', 'System administrator with full access'),
('Registrar', 'Manages student enrollment and records'),
('Instructor', 'Manages courses and grades'),
('Student', 'Views courses and grades');

-- Test users (password: password123)
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
 (SELECT id FROM roles WHERE name = 'Instructor'), true),

('Fresh Test User', 'fresh@test.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Student'), true),

('Angeli Pancho', 'a.pancho@example.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Student'), true);