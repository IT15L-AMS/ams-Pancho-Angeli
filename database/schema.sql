-- 1. Create Roles Table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB;

-- 2. Create Users Table
-- Note: MySQL uses VARCHAR(36) or BINARY(16) for UUIDs. 
-- Using VARCHAR(36) is easier for manual debugging.
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY, 
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Junction Table (Normalized RBAC)
CREATE TABLE user_roles (
    user_id VARCHAR(36),
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Initial Seed Data
INSERT INTO roles (name) VALUES 
('Admin'), 
('Registrar'), 
('Instructor'), 
('Student');

-- 5. Indexes for Performance
CREATE INDEX idx_users_email ON users(email);