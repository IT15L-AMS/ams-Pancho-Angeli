Phase 1: Authentication & Authorization
Project: ams-Pancho-Angeli
Version: 1.0.0
Date: February 26, 2026

1. Entity-Relationship Diagram (ERD)

┌────────────────┐          ┌────────────────┐
│     ROLES      │          │     USERS      │
├────────────────┤          ├────────────────┤
│ id (PK)        │◄─────────│ id (PK)        │
│ name (UNIQUE)  │      N   │ full_name      │
│ description    │     1    │ email (UNIQUE) │
│ created_at     │          │ password_hash  │  
│ updated_at     │          │ role_id (FK)   │
└────────────────┘          │ is_active      │
                            │ last_login     │
                            │ created_at     │
                            │ updated_at     │
                            └────────────────┘

Relationship: One Role → Many Users (1:M)

2. Database Schema

-- =====================================================
-- Academic Management System - Phase 1 Database Schema
-- Project: ams-Pancho-Angeli
-- =====================================================

-- Drop database if exists
DROP DATABASE IF EXISTS ams_db;

-- Create database
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
-- Table: refresh_tokens (Bonus Feature)
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
('Admin', 'System administrator with full access'),
('Registrar', 'Manages student enrollment and records'),
('Instructor', 'Manages courses and grades'),
('Student', 'Views courses and grades');

-- Insert test users (password: password123)
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

 3. API ENDPOINTS DOCUMENTATION
Base URL: http://localhost:3000/api

POST /auth/register
Description: Create a new user account.

Authentication Required	No
Request Headers	Content-Type: application/json
Request Body:

json
{
    "full_name": "Fresh Test User",
    "email": "fresh@test.com",
    "password": "Password123",
    "role_name": "Student"
}
Success Response (201 Created):

json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 6,
            "full_name": "Fresh Test User",
            "email": "fresh@test.com",
            "role_id": 4,
            "is_active": true,
            "created_at": "2026-02-26 14:15:03",
            "Role": {
                "name": "Student"
            }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
Error Response - Email Already Exists (400):

json
{
    "success": false,
    "message": "Email already exists"
}
Error Response - Validation Error (400):

json
{
    "success": false,
    "errors": [
        {
            "msg": "Valid email is required",
            "param": "email",
            "location": "body"
        }
    ]
}
POST /auth/login
Description: Authenticate user and receive JWT token.

Authentication Required	No
Request Headers	Content-Type: application/json
Request Body:

json
{
    "email": "fresh@test.com",
    "password": "Password123"
}
Success Response (200 OK):

json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 6,
            "full_name": "Fresh Test User",
            "email": "fresh@test.com",
            "role_id": 4,
            "is_active": true,
            "last_login": "2026-02-26T14:18:28.984Z",
            "Role": {
                "name": "Student"
            }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmcmVzaEB0ZXN0LmNvbSIsInJvbGUiOiJTdHVkZW50IiwiaWF0IjoxNzcyMTE1NTA5LCJleHAiOjE3NzIyMDE5MDl9.8na_Uhop5XzORlhGKygDZzq_A5VZ_rQ44VTHvzaJhB4",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzcyMTE1NTA5LCJleHAiOjE3NzI3MjAzMDl9.AhLLHoBhnpqo1Vh0WHX-Ef_8oEQ5DdnC8auJWha1x58"
    }
}
Error Response - Invalid Credentials (401):

json
{
    "success": false,
    "message": "Invalid credentials"
}
Test Accounts
Role	Email	Password
Admin	admin@ams.com	password123
Registrar	registrar@ams.com	password123
Instructor	instructor@ams.com	password123
Student	student@ams.com	password123
Test Student	fresh@test.com	Password123
Test Student	a.pancho@example.com	password123
GET /auth/profile
Description: Get authenticated user's profile information.

Authentication Required	Yes
Request Headers	Authorization: Bearer <jwt_token>
Content-Type: application/json
Success Response (200 OK):

json
{
    "success": true,
    "data": {
        "user": {
            "id": 6,
            "full_name": "Fresh Test User",
            "email": "fresh@test.com",
            "role_id": 4,
            "is_active": true,
            "last_login": "2026-02-26 14:18:28",
            "created_at": "2026-02-26 14:15:03",
            "Role": {
                "name": "Student"
            }
        }
    }
}
Error Response - No Token (401):

json
{
    "success": false,
    "message": "Authentication required. No token provided."
}
POST /auth/refresh-token (Bonus Feature)
Description: Get a new access token using a refresh token.

Authentication Required	No
Request Headers	Content-Type: application/json
Request Body:

json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzcyMTE1NTA5LCJleHAiOjE3NzI3MjAzMDl9.AhLLHoBhnpqo1Vh0WHX-Ef_8oEQ5DdnC8auJWha1x58"
}
Success Response (200 OK):

json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmcmVzaEB0ZXN0LmNvbSIsInJvbGUiOiJTdHVkZW50IiwiaWF0IjoxNzcyMTE2MDkxLCJleHAiOjE3NzIyMDI0OTF9.Vyk4TbAB6GepxICFwUAb64X8MkkDp5xAVodm5boNqY4",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzcyMTE2MDkxLCJleHAiOjE3NzI3MjA4OTF9.l645WwHfxJIpcnQVJucMxb5H59Sv43XbCZO-AlrjUL0"
    }
}
POST /auth/logout
Description: Logout the current user.

Authentication Required	Yes
Request Headers	Authorization: Bearer <jwt_token>
Content-Type: application/json
Success Response (200 OK):

json
{
    "success": true,
    "message": "Logged out successfully"
}
GET /auth/admin-only (RBAC Test)
Description: Test endpoint for role-based access control.

Authentication Required	Yes (Admin only)
Request Headers	Authorization: Bearer <jwt_token>
Success Response (200 OK) - Admin Access:

json
{
    "success": true,
    "message": "Welcome Admin! You have access to admin panel."
}
Error Response - Insufficient Role (403):

json
{
    "success": false,
    "message": "Access denied. Required roles: Admin"
}
GET /health
Description: Check server health and status.

Authentication Required	No
Success Response (200 OK):

json
{
    "status": "OK",
    "timestamp": "2026-02-26T14:16:44.563Z",
    "environment": "development",
    "database": "ams_db"
}

4. POSTMAN COLLECTION
Collection: Academic Management System
Folder: Health Check
Request	Method	URL	Headers
Get Health Status	GET	{{baseUrl}}/health	None
Response:

json
{
    "status": "OK",
    "timestamp": "2026-02-26T14:16:44.563Z",
    "environment": "development",
    "database": "ams_db"
}
Folder: Authentication
Request: Register - Student
Method	POST
URL	{{baseUrl}}/auth/register
Headers	Content-Type: application/json
Body:

json
{
    "full_name": "Fresh Test User",
    "email": "fresh@test.com",
    "password": "Password123",
    "role_name": "Student"
}
Success Response (201):

json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 6,
            "full_name": "Fresh Test User",
            "email": "fresh@test.com",
            "role_id": 4,
            "is_active": true,
            "created_at": "2026-02-26 14:15:03",
            "Role": {
                "name": "Student"
            }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
Error Response (400):

json
{
    "success": false,
    "message": "Email already exists"
}
Request: Login
Method	POST
URL	{{baseUrl}}/auth/login
Headers	Content-Type: application/json
Body:

json
{
    "email": "fresh@test.com",
    "password": "Password123"
}
Success Response (200):

json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 6,
            "full_name": "Fresh Test User",
            "email": "fresh@test.com",
            "role_id": 4,
            "is_active": true,
            "last_login": "2026-02-26T14:18:28.984Z",
            "Role": {
                "name": "Student"
            }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmcmVzaEB0ZXN0LmNvbSIsInJvbGUiOiJTdHVkZW50IiwiaWF0IjoxNzcyMTE1NTA5LCJleHAiOjE3NzIyMDE5MDl9.8na_Uhop5XzORlhGKygDZzq_A5VZ_rQ44VTHvzaJhB4",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzcyMTE1NTA5LCJleHAiOjE3NzI3MjAzMDl9.AhLLHoBhnpqo1Vh0WHX-Ef_8oEQ5DdnC8auJWha1x58"
    }
}
Test Script (Post-response):

javascript
const jsonData = pm.response.json();
if (pm.response.code === 200 && jsonData.success && jsonData.data) {
    pm.environment.set("token", jsonData.data.token);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
    console.log("✅ Token saved successfully!");
}
Request: Refresh Token
Method	POST
URL	{{baseUrl}}/auth/refresh-token
Headers	Content-Type: application/json
Body:

json
{
    "refreshToken": "{{refreshToken}}"
}
Success Response (200):

json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmcmVzaEB0ZXN0LmNvbSIsInJvbGUiOiJTdHVkZW50IiwiaWF0IjoxNzcyMTE2MDkxLCJleHAiOjE3NzIyMDI0OTF9.Vyk4TbAB6GepxICFwUAb64X8MkkDp5xAVodm5boNqY4",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzcyMTE2MDkxLCJleHAiOjE3NzI3MjA4OTF9.l645WwHfxJIpcnQVJucMxb5H59Sv43XbCZO-AlrjUL0"
    }
}
Request: Logout
Method	POST
URL	{{baseUrl}}/auth/logout
Headers	Authorization: Bearer {{token}}
Success Response (200):

json
{
    "success": true,
    "message": "Logged out successfully"
}
Folder: Protected Routes
Request: Get My Profile
Method	GET
URL	{{baseUrl}}/auth/profile
Headers	Authorization: Bearer {{token}}
Success Response (200):

json
{
    "success": true,
    "data": {
        "user": {
            "id": 6,
            "full_name": "Fresh Test User",
            "email": "fresh@test.com",
            "role_id": 4,
            "is_active": true,
            "last_login": "2026-02-26 14:18:28",
            "created_at": "2026-02-26 14:15:03",
            "Role": {
                "name": "Student"
            }
        }
    }
}
Request: Admin Only Route
Method	GET
URL	{{baseUrl}}/auth/admin-only
Headers	Authorization: Bearer {{token}}
Success Response (Admin Role):

json
{
    "success": true,
    "message": "Welcome Admin! You have access to admin panel."
}
Error Response (Student Role - 403):

json
{
    "success": false,
    "message": "Access denied. Required roles: Admin"
}
Folder: Error Tests
Request: Invalid Login
Method	POST
URL	{{baseUrl}}/auth/login
Headers	Content-Type: application/json
Body:

json
{
    "email": "wrong",
    "password": "wrong"
}
Error Response (400):

json
{
    "success": false,
    "errors": [
        {
            "type": "field",
            "value": "wrong",
            "msg": "Valid email is required",
            "path": "email",
            "location": "body"
        }
    ]
}
Request: No Token Profile
Method	GET
URL	{{baseUrl}}/auth/profile
Headers	None
Error Response (401):

json
{
    "success": false,
    "message": "Authentication required. No token provided."
}

5. ENVIRONMENT VARIABLES
AMS Local Environment
Variable	Initial Value	Current Value
baseUrl	http://localhost:3000/api	http://localhost:3000/api
token		eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
refreshToken		eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

6. TESTING RESULTS
✅ All Tests Passed
Test	Description	Result
1	Health Check → 200 OK	✅ Pass
2	Register new user → 201 Created	✅ Pass
3	Register duplicate email → 400 Bad Request	✅ Pass
4	Valid login → 200 OK with token	✅ Pass
5	Invalid login → 400 Validation Error	✅ Pass
6	Get profile with valid token → 200 OK	✅ Pass
7	Get profile with no token → 401 Unauthorized	✅ Pass
8	Refresh token → 200 OK with new tokens	✅ Pass
9	Logout with valid token → 200 OK	✅ Pass
10	Admin route with student token → 403 Forbidden	✅ Pass
11	All 4 roles login successful	✅ Pass

7. HOW IT WORKS
Authentication Flow
Registration

User provides full_name, email, password, and role

Password hashed using bcryptjs (10 salt rounds)

User stored in database with hashed password

JWT token and refresh token generated and returned

Login

User provides email and password

System retrieves user record

Compares provided password with stored hash

If match: JWT token (24h) and refresh token (7d) generated

Last login timestamp updated

Protected Routes

Client sends token in Authorization header

Middleware verifies token signature and expiration

If valid: user data attached to request

If invalid/missing: 401 Unauthorized returned

Role-Based Access Control

After authentication, middleware checks user role

If role in allowed list: request proceeds

If role not allowed: 403 Forbidden returned

8. HTTP STATUS CODES
Code	Meaning	Usage
200	OK	Successful login, profile, refresh, logout
201	Created	Successful registration
400	Bad Request	Validation errors, duplicate email
401	Unauthorized	Missing/invalid token, invalid credentials
403	Forbidden	Insufficient role permissions
500	Internal Server Error	Server/database errors

9. SECURITY FEATURES

✅ Passwords hashed with bcryptjs (10 rounds)

✅ JWT tokens with 24-hour expiration

✅ Refresh tokens with 7-day expiration

✅ Email unique constraint in database

✅ Input validation on all endpoints

✅ No passwords returned in responses

✅ Token verification middleware

✅ Role-based access control

✅ Proper error messages (no sensitive info)

✅ CORS configured for security