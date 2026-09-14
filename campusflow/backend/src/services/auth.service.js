const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const config = require('../config');

// Email regex validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Register a new student user and create their student profile
 */
const register = async ({ name, email, password, confirmPassword, course, department, year }) => {
  // 1. Validate Name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    const error = new Error('Full Name is required.');
    error.statusCode = 400;
    throw error;
  }

  // 2. Validate Email format
  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    const error = new Error('A valid email address is required.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 3. Validate Password length
  if (!password || typeof password !== 'string' || password.length < 6) {
    const error = new Error('Password must be at least 6 characters long.');
    error.statusCode = 400;
    throw error;
  }

  // 4. Validate Password confirmation
  if (password !== confirmPassword) {
    const error = new Error('Password and Confirm Password do not match.');
    error.statusCode = 400;
    throw error;
  }

  // Role is strictly locked to STUDENT for public registration
  const assignedRole = 'STUDENT';

  // 5. Check if email already exists in PostgreSQL
  const existingUserCheck = await db.query(
    'SELECT id FROM users WHERE email = $1',
    [normalizedEmail]
  );

  if (existingUserCheck.rows && existingUserCheck.rows.length > 0) {
    const error = new Error('An account with this email address is already registered.');
    error.statusCode = 400;
    throw error;
  }

  // 6. Hash password using bcryptjs (salt rounds = 10)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 7. Insert user record into PostgreSQL users table
  const userInsertResult = await db.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name.trim(), normalizedEmail, passwordHash, assignedRole]
  );

  const newUser = userInsertResult.rows[0];

  // 8. Create corresponding student profile record
  const studentCourse = course || 'Bachelor of Technology';
  const studentDepartment = department || 'Computer Science & Engineering';
  const studentYear = parseInt(year, 10) || 1;

  const studentInsertResult = await db.query(
    `INSERT INTO students (user_id, course, department, year)
     VALUES ($1, $2, $3, $4)
     RETURNING id, course, department, year`,
    [newUser.id, studentCourse, studentDepartment, studentYear]
  );

  const newStudent = studentInsertResult.rows[0];

  // 9. Generate signed JWT token
  const token = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.created_at
    },
    student: newStudent
  };
};

/**
 * Authenticate user with email and password, returning JWT token
 */
const login = async ({ email, password }) => {
  // 1. Basic validation
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 2. Query user by email from PostgreSQL
  const userResult = await db.query(
    'SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1',
    [normalizedEmail]
  );

  if (!userResult.rows || userResult.rows.length === 0) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const user = userResult.rows[0];

  // 3. Verify password hash using bcryptjs
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // 4. If student, fetch their student profile info
  let studentProfile = null;
  if (user.role === 'STUDENT') {
    const studentResult = await db.query(
      'SELECT id, course, department, year FROM students WHERE user_id = $1',
      [user.id]
    );
    if (studentResult.rows && studentResult.rows.length > 0) {
      studentProfile = studentResult.rows[0];
    }
  }

  // 5. Generate signed JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    },
    student: studentProfile
  };
};

/**
 * Retrieve current user profile by decoded JWT user ID
 */
const getMe = async (userId) => {
  const userResult = await db.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (!userResult.rows || userResult.rows.length === 0) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const user = userResult.rows[0];
  let studentProfile = null;

  if (user.role === 'STUDENT') {
    const studentResult = await db.query(
      'SELECT id, course, department, year FROM students WHERE user_id = $1',
      [user.id]
    );
    if (studentResult.rows && studentResult.rows.length > 0) {
      studentProfile = studentResult.rows[0];
    }
  }

  return {
    user,
    student: studentProfile
  };
};

module.exports = {
  register,
  login,
  getMe
};
