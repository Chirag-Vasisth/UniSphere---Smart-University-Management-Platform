-- ============================================================================
-- CampusFlow Database Schema
-- Step 2, 4 & 6: PostgreSQL Relational Tables (Docker & Production)
-- ============================================================================

-- Clean up existing tables if recreating (in reverse dependency order)
DROP TABLE IF EXISTS marks CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------------------------
-- 1. Table: users
-- Represents core user authentication and identity accounts
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. Table: students
-- Academic student profile; 1:1 relationship with users table
-- (ADMIN users do not require a student profile)
-- ----------------------------------------------------------------------------
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrollment_number VARCHAR(50) UNIQUE NOT NULL,
    course VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year INT NOT NULL CHECK (year >= 1 AND year <= 8),
    phone VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. Table: marks
-- Course evaluation records; 1:many relationship with students table
-- Supports both marks_obtained and legacy marks column
-- ----------------------------------------------------------------------------
CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    marks_obtained NUMERIC(5, 2) NOT NULL CHECK (marks_obtained >= 0 AND marks_obtained <= 100),
    maximum_marks NUMERIC(5, 2) DEFAULT 100.00,
    semester INT DEFAULT 1 CHECK (semester >= 1 AND semester <= 8),
    marks NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for optimized query lookups
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_enrollment ON students(enrollment_number);
CREATE INDEX idx_marks_student_id ON marks(student_id);
