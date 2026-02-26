# API Documentation - Authentication Module

## Base Information
- **Base URL**: `http://localhost:3000/api`
- **API Version**: v1
- **Format**: JSON
- **Authentication**: JWT Bearer Token

## Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register a new user | No |
| POST | /auth/login | Login and get access token | No |
| GET | /auth/profile | Get current user profile | Yes |
| POST | /auth/refresh-token | Refresh access token | No |
| POST | /auth/logout | Logout user | Yes |
| GET | /auth/admin-only | Test admin access | Yes (Admin only) |


## Error Codes Summary

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 500 | Server Error |

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ams.com | password123 |
| Registrar | registrar@ams.com | password123 |
| Instructor | instructor@ams.com | password123 |
| Student | student@ams.com | password123 |
| Test Student | fresh@test.com | Password123 |