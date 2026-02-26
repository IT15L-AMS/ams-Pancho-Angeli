-- =====================================================
-- Additional Seed Data for Testing
-- =====================================================
USE academic_management;

-- Insert more test users with different roles
INSERT INTO users (full_name, email, password_hash, role_id, is_active) VALUES
-- Additional Admins
('System Admin', 'sysadmin@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR', 
 (SELECT id FROM roles WHERE name = 'Admin'), true),

-- Additional Registrars
('Enrollment Officer', 'enrollment@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Registrar'), true),
('Records Specialist', 'records@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Registrar'), true),

-- Additional Instructors
('Dr. Robert Wilson', 'r.wilson@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Instructor'), true),
('Prof. Emily Brown', 'e.brown@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Instructor'), true),
('Dr. Michael Chen', 'm.chen@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Instructor'), true),

-- Additional Students
('Alice Johnson', 'alice.j@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Student'), true),
('Bob Williams', 'bob.w@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Student'), true),
('Carol Davis', 'carol.d@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Student'), true),
('David Miller', 'david.m@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Student'), true),
('Eva Garcia', 'eva.g@ams.com', '$2a$10$XOP55slKQ9KJQqHQUXxRLO6ZQqHQXxRLO6ZQqHQXxRLO6ZQqHQXxR',
 (SELECT id FROM roles WHERE name = 'Student'), true);

-- Update some users with last_login dates
UPDATE users SET last_login = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 30) DAY) 
WHERE id > 0;

-- Display test data summary
SELECT 'Test data inserted successfully!' as 'Status';
SELECT 
    r.name as 'Role',
    COUNT(u.id) as 'User Count'
FROM roles r
LEFT JOIN users u ON r.id = u.role_id
GROUP BY r.id, r.name;