-- 1. Roles Table
CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'Admin', 'Teacher', 'Student'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Stores Bcrypt Hash
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. UserRoles Join Table (Normalization)
CREATE TABLE UserRoles (
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES Roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON Users(email);