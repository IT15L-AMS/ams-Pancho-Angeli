# Academic Management System (AMS) - Phase 1 API Documentation

## Authentication & Authorization Module

**Project:** ams-Pancho-Angeli  
**Version:** 1.0.0  
**Date:** February 26, 2026  
**Author:** Angeli Pancho

---

## Table of Contents

1. [Base Information](#base-information)
2. [Authentication Endpoints](#authentication-endpoints)
   - [Register User](#1-register-user-post-authregister)
   - [Login](#2-login-post-authlogin)
   - [Get Profile](#3-get-profile-get-authprofile)
   - [Refresh Token](#4-refresh-token-post-authrefresh-token-bonus-feature)
   - [Logout](#5-logout-post-authlogout)
   - [Admin Only Test](#6-admin-only-test-get-authadmin-only)
   - [Health Check](#7-health-check-get-health)
3. [Error Codes](#error-codes)
4. [Test Accounts](#test-accounts)
5. [Environment Variables](#environment-variables)
6. [Postman Collection Structure](#postman-collection-structure)
7. [Testing Results](#testing-results)
8. [Authentication Flow](#authentication-flow)
9. [Security Features](#security-features)

---

## Base Information

| Property | Value |
|----------|-------|
| **Base URL** | `http://localhost:3000/api` |
| **API Version** | v1 |
| **Format** | JSON |
| **Authentication** | JWT Bearer Token |
| **Token Expiration** | 24 hours |
| **Refresh Token Expiration** | 7 days |

---

## Authentication Endpoints

---

### 1. Register User | `POST /auth/register`

**Description:** Create a new user account with role assignment.

#### Request Information

| | |
|---|---|
| **Authentication Required** | No |
| **Content-Type** | `application/json` |

#### Request Body

```json
{
    "full_name": "Fresh Test User",
    "email": "fresh@test.com",
    "password": "Password123",
    "role_name": "Student"
}

Success Response (201 Created)
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
            "updated_at": "2026-02-26T14:15:03.000Z",
            "Role": {
                "name": "Student"
            }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmcmVzaEB0ZXN0LmNvbSIsInJvbGUiOiJTdHVkZW50IiwiaWF0IjoxNzcyMTE1NTA5LCJleHAiOjE3NzIyMDE5MDl9.8na_Uhop5XzORlhGKygDZzq_A5VZ_rQ44VTHvzaJhB4",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzcyMTE1NTA5LCJleHAiOjE3NzI3MjAzMDl9.AhLLHoBhnpqo1Vh0WHX-Ef_8oEQ5DdnC8auJWha1x58"
    }
}
Error Responses
400 Bad Request - Email Already Exists

json
{
    "success": false,
    "message": "Email already exists"
}
400 Bad Request - Validation Error

json
{
    "success": false,
    "errors": [
        {
            "type": "field",
            "value": "",
            "msg": "Valid email is required",
            "path": "email",
            "location": "body"
        },
        {
            "type": "field",
            "value": "",
            "msg": "Password must be at least 6 characters",
            "path": "password",
            "location": "body"
        }
    ]
}
400 Bad Request - Invalid Role

json
{
    "success": false,
    "message": "Invalid role"
}
2. Login | POST /auth/login
Description: Authenticate user and receive JWT access token.

Request Information
Authentication Required	No
Content-Type	application/json
Request Body
json
{
    "email": "fresh@test.com",
    "password": "Password123"
}
Success Response (200 OK)
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
            "created_at": "2026-02-26 14:15:03",
            "updated_at": "2026-02-26T14:18:28.984Z",
            "Role": {
                "name": "Student"
            }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmcmVzaEB0ZXN0LmNvbSIsInJvbGUiOiJTdHVkZW50IiwiaWF0IjoxNzcyMTE1NTA5LCJleHAiOjE3NzIyMDE5MDl9.8na_Uhop5XzORlhGKygDZzq_A5VZ_rQ44VTHvzaJhB4",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzcyMTE1NTA5LCJleHAiOjE3NzI3MjAzMDl9.AhLLHoBhnpqo1Vh0WHX-Ef_8oEQ5DdnC8auJWha1x58"
    }
}
Error Responses
401 Unauthorized - Invalid Credentials

json
{
    "success": false,
    "message": "Invalid credentials"
}
400 Bad Request - Validation Error

json
{
    "success": false,
    "errors": [
        {
            "type": "field",
            "value": "",
            "msg": "Valid email is required",
            "path": "email",
            "location": "body"
        }
    ]
}
3. Get Profile | GET /auth/profile
Description: Get the currently authenticated user's profile information.

Request Information
Authentication Required	YES
Headers	Authorization: Bearer <your_jwt_token>
Content-Type: application/json
Success Response (200 OK)
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
            "updated_at": "2026-02-26 14:18:28",
            "Role": {
                "name": "Student"
            }
        }
    }
}
Error Responses
401 Unauthorized - No Token

json
{
    "success": false,
    "message": "Authentication required. No token provided."
}
401 Unauthorized - Invalid Token

json
{
    "success": false,
    "message": "Invalid token."
}
401 Unauthorized - Token Expired

json
{
    "success": false,
    "message": "Token expired."
}
4. Refresh Token | POST /auth/refresh-token (BONUS FEATURE)
Description: Get a new access token using a refresh token.

Request Information
Authentication Required	No
Content-Type	application/json
Request Body
json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzcyMTE1NTA5LCJleHAiOjE3NzI3MjAzMDl9.AhLLHoBhnpqo1Vh0WHX-Ef_8oEQ5DdnC8auJWha1x58"
}
Success Response (200 OK)
json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJmcmVzaEB0ZXN0LmNvbSIsInJvbGUiOiJTdHVkZW50IiwiaWF0IjoxNzcyMTE2MDkxLCJleHAiOjE3NzIyMDI0OTF9.Vyk4TbAB6GepxICFwUAb64X8MkkDp5xAVodm5boNqY4",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzcyMTE2MDkxLCJleHAiOjE3NzI3MjA4OTF9.l645WwHfxJIpcnQVJucMxb5H59Sv43XbCZO-AlrjUL0"
    }
}
Error Responses
400 Bad Request - Missing Token

json
{
    "success": false,
    "message": "Refresh token required"
}
401 Unauthorized - Invalid Token

json
{
    "success": false,
    "message": "Invalid or expired refresh token"
}
5. Logout | POST /auth/logout
Description: Logout the current user (client should discard tokens).

Request Information
Authentication Required	YES
Headers	Authorization: Bearer <your_jwt_token>
Content-Type: application/json
Success Response (200 OK)
json
{
    "success": true,
    "message": "Logged out successfully"
}
Error Response
401 Unauthorized - No Token

json
{
    "success": false,
    "message": "Authentication required. No token provided."
}
6. Admin Only Test | GET /auth/admin-only
Description: Test endpoint for role-based access control (RBAC).

Request Information
Authentication Required	YES (Admin only)
Headers	Authorization: Bearer <your_jwt_token>
Success Response (200 OK) - Admin Access
json
{
    "success": true,
    "message": "Welcome Admin! You have access to admin panel."
}
Error Response - Insufficient Role (403 Forbidden)
json
{
    "success": false,
    "message": "Access denied. Required roles: Admin"
}
7. Health Check | GET /health
Description: Check server health and status.

Request Information
Authentication Required	No
Success Response (200 OK)
json
{
    "status": "OK",
    "timestamp": "2026-02-26T14:16:44.563Z",
    "environment": "development",
    "database": "ams_db"
}

Error Codes
Status Code	Meaning	Description
200	OK	Request successful
201	Created	Resource created successfully
400	Bad Request	Validation error or duplicate entry
401	Unauthorized	Missing or invalid token, invalid credentials
403	Forbidden	Insufficient role permissions
404	Not Found	Resource not found
500	Internal Server Error	Server or database error
Test Accounts
Use these pre-created accounts for testing:

Role	Email	Password
Admin	admin@ams.com	password123
Registrar	registrar@ams.com	password123
Instructor	instructor@ams.com	password123
Student	student@ams.com	password123
Test Student	fresh@test.com	Password123
Test Student	a.pancho@example.com	password123
