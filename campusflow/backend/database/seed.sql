-- ============================================================================
-- CampusFlow Seed Data
-- Step 2, 4 & 6: Initial Development & Docker Container Dataset
-- ============================================================================

-- Clean up existing data safely
TRUNCATE TABLE marks, students, users RESTART IDENTITY CASCADE;

-- ----------------------------------------------------------------------------
-- 1. Seed users (1 Admin, 3 Students)
-- Passwords:
-- Admin:   Admin@123
-- Student: Student@123
-- ----------------------------------------------------------------------------
INSERT INTO users (name, email, password_hash, role) VALUES
(
    'Administrator Lead',
    'admin@campusflow.edu',
    '$2b$10$xDkkHYbfnl6kW2XBBOJOBOm7F.85KbkP27iwYDWoW/HG7yZf2CLsO',
    'ADMIN'
),
(
    'Alex Rivera',
    'student@campusflow.edu',
    '$2b$10$iXav2jfXScmSdiEIpXxXGOryb5YGYZTk.JkLJQAtfJXka8H0T3I2W',
    'STUDENT'
),
(
    'Jordan Vance',
    'alex.rivera@campusflow.edu',
    '$2b$10$iXav2jfXScmSdiEIpXxXGOryb5YGYZTk.JkLJQAtfJXka8H0T3I2W',
    'STUDENT'
),
(
    'Sophia Martinez',
    'sophia.m@campusflow.edu',
    '$2b$10$iXav2jfXScmSdiEIpXxXGOryb5YGYZTk.JkLJQAtfJXka8H0T3I2W',
    'STUDENT'
);

-- ----------------------------------------------------------------------------
-- 2. Seed students profiles (1:1 with users)
-- ----------------------------------------------------------------------------
INSERT INTO students (user_id, enrollment_number, course, department, year, phone) VALUES
(
    (SELECT id FROM users WHERE email = 'student@campusflow.edu'),
    'ENR-2026-001',
    'Bachelor of Technology',
    'Computer Science & Engineering',
    3,
    '+1 (555) 234-8901'
),
(
    (SELECT id FROM users WHERE email = 'alex.rivera@campusflow.edu'),
    'ENR-2026-002',
    'Bachelor of Technology',
    'Computer Science & Engineering',
    3,
    '+1 (555) 987-6543'
),
(
    (SELECT id FROM users WHERE email = 'sophia.m@campusflow.edu'),
    'ENR-2026-003',
    'Bachelor of Technology',
    'Computer Science & Engineering',
    3,
    '+1 (555) 456-7890'
);

-- ----------------------------------------------------------------------------
-- 3. Seed marks records (1:many with students)
-- ----------------------------------------------------------------------------
-- Marks for Student 1 (student@campusflow.edu - Alex Rivera)
INSERT INTO marks (student_id, subject, marks_obtained, maximum_marks, semester, marks) VALUES
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'student@campusflow.edu'),
    'Database Management Systems',
    95.00,
    100.00,
    5,
    95.00
),
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'student@campusflow.edu'),
    'Distributed Systems & Cloud Computing',
    92.00,
    100.00,
    5,
    92.00
),
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'student@campusflow.edu'),
    'Operating Systems & Kernel Design',
    89.00,
    100.00,
    5,
    89.00
),
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'student@campusflow.edu'),
    'Software Engineering & DevOps',
    96.00,
    100.00,
    5,
    96.00
),
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'student@campusflow.edu'),
    'Computer Networks & Security',
    85.00,
    100.00,
    5,
    85.00
),
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'student@campusflow.edu'),
    'Applied Probability & Statistics',
    92.00,
    100.00,
    5,
    92.00
);

-- Marks for Student 3 (sophia.m@campusflow.edu - Sophia Martinez)
INSERT INTO marks (student_id, subject, marks_obtained, maximum_marks, semester, marks) VALUES
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'sophia.m@campusflow.edu'),
    'Database Management Systems',
    98.00,
    100.00,
    5,
    98.00
),
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'sophia.m@campusflow.edu'),
    'Distributed Systems & Cloud Computing',
    96.00,
    100.00,
    5,
    96.00
),
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'sophia.m@campusflow.edu'),
    'Operating Systems & Kernel Design',
    94.00,
    100.00,
    5,
    94.00
),
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'sophia.m@campusflow.edu'),
    'Software Engineering & DevOps',
    95.00,
    100.00,
    5,
    95.00
),
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'sophia.m@campusflow.edu'),
    'Computer Networks & Security',
    91.00,
    100.00,
    5,
    91.00
),
(
    (SELECT s.id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'sophia.m@campusflow.edu'),
    'Applied Probability & Statistics',
    97.00,
    100.00,
    5,
    97.00
);
