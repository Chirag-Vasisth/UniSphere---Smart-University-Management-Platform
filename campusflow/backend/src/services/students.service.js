const bcrypt = require('bcryptjs');
const db = require('../config/database');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Retrieve list of all students with optional search filter
 */
const getAllStudents = async (searchQuery) => {
  let queryText = `
    SELECT 
      s.id,
      s.user_id,
      u.name,
      u.email,
      s.course,
      s.department,
      s.year,
      s.phone,
      s.created_at
    FROM students s
    JOIN users u ON s.user_id = u.id
  `;

  const queryParams = [];

  if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim().length > 0) {
    const pattern = `%${searchQuery.trim()}%`;
    queryText += `
      WHERE u.name ILIKE $1
         OR u.email ILIKE $1
         OR s.course ILIKE $1
         OR s.department ILIKE $1
         OR CAST(s.id AS TEXT) ILIKE $1
    `;
    queryParams.push(pattern);
  }

  queryText += ` ORDER BY s.id DESC`;

  const result = await db.query(queryText, queryParams);
  return result.rows || [];
};

/**
 * Retrieve single student by student ID along with their marks
 */
const getStudentById = async (studentId) => {
  const studentResult = await db.query(
    `SELECT 
       s.id,
       s.user_id,
       u.name,
       u.email,
       s.course,
       s.department,
       s.year,
       s.phone,
       s.created_at
     FROM students s
     JOIN users u ON s.user_id = u.id
     WHERE s.id = $1`,
    [studentId]
  );

  if (!studentResult.rows || studentResult.rows.length === 0) {
    const error = new Error(`Student with ID ${studentId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const student = studentResult.rows[0];

  // Fetch student's marks
  const marksResult = await db.query(
    `SELECT id, subject, marks, created_at
     FROM marks
     WHERE student_id = $1
     ORDER BY id ASC`,
    [studentId]
  );

  student.marks = (marksResult.rows || []).map(m => ({
    id: m.id,
    subject: m.subject,
    marks: parseFloat(m.marks)
  }));

  return student;
};

/**
 * Admin: Create student with user authentication and student profile inside a transaction
 */
const createStudent = async ({ name, email, password, enrollment_number, course, department, year, phone }) => {
  // 1. Validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    const error = new Error('Student name is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    const error = new Error('A valid email address is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    const error = new Error('Password must be at least 6 characters.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 2. Check if user with email already exists
  const existingUser = await db.query(
    'SELECT id FROM users WHERE email = $1',
    [normalizedEmail]
  );
  if (existingUser.rows && existingUser.rows.length > 0) {
    const error = new Error('A user account with this email address already exists.');
    error.statusCode = 409;
    throw error;
  }

  // 3. Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const studentCourse = course ? course.trim() : 'Bachelor of Technology';
  const studentDepartment = department ? department.trim() : 'Computer Science & Engineering';
  const studentYear = parseInt(year, 10) || 1;
  const studentPhone = phone ? phone.trim() : '';
  const studentEnrollment = enrollment_number ? enrollment_number.trim() : `ENR-2026-${Math.floor(100 + Math.random() * 900)}`;

  // 4. Execute transaction
  await db.query('BEGIN');

  try {
    const userInsertResult = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'STUDENT')
       RETURNING id, name, email, role, created_at`,
      [name.trim(), normalizedEmail, passwordHash]
    );
    const newUser = userInsertResult.rows[0];

    const studentInsertResult = await db.query(
      `INSERT INTO students (user_id, enrollment_number, course, department, year, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, enrollment_number, course, department, year, phone, created_at`,
      [newUser.id, studentEnrollment, studentCourse, studentDepartment, studentYear, studentPhone]
    );
    const newStudent = studentInsertResult.rows[0];

    await db.query('COMMIT');

    return {
      id: newStudent.id,
      user_id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      enrollment_number: newStudent.enrollment_number,
      course: newStudent.course,
      department: newStudent.department,
      year: newStudent.year,
      phone: newStudent.phone,
      created_at: newStudent.created_at
    };
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
};

/**
 * Admin: Update student details
 */
const updateStudent = async (studentId, { name, email, course, department, year, phone }) => {
  const current = await getStudentById(studentId);

  // Validate email if changed
  let updatedEmail = current.email;
  if (email && email.trim().toLowerCase() !== current.email.toLowerCase()) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      const error = new Error('A valid email address is required.');
      error.statusCode = 400;
      throw error;
    }
    const checkEmail = await db.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [normalizedEmail, current.user_id]
    );
    if (checkEmail.rows && checkEmail.rows.length > 0) {
      const error = new Error('This email address is already in use by another account.');
      error.statusCode = 409;
      throw error;
    }
    updatedEmail = normalizedEmail;
  }

  const updatedName = name ? name.trim() : current.name;
  const updatedCourse = course ? course.trim() : current.course;
  const updatedDepartment = department ? department.trim() : current.department;
  const updatedYear = year !== undefined ? parseInt(year, 10) : current.year;
  const updatedPhone = phone !== undefined ? phone.trim() : current.phone;

  // Update users table
  await db.query(
    `UPDATE users SET name = $1, email = $2 WHERE id = $3`,
    [updatedName, updatedEmail, current.user_id]
  );

  // Update students table
  await db.query(
    `UPDATE students SET course = $1, department = $2, year = $3, phone = $4 WHERE id = $5`,
    [updatedCourse, updatedDepartment, updatedYear, updatedPhone, studentId]
  );

  return await getStudentById(studentId);
};

/**
 * Admin: Delete student (safely cascade deletes user and marks)
 */
const deleteStudent = async (studentId, currentAdminUserId) => {
  const student = await getStudentById(studentId);

  // Prevent admin self-deletion
  if (student.user_id === currentAdminUserId) {
    const error = new Error('You cannot delete your own administrative account.');
    error.statusCode = 400;
    throw error;
  }

  // Deleting the student will cascade delete marks, and we delete user record as well
  await db.query('BEGIN');
  try {
    await db.query('DELETE FROM students WHERE id = $1', [studentId]);
    await db.query('DELETE FROM users WHERE id = $1', [student.user_id]);
    await db.query('COMMIT');
    return { message: `Student ${student.name} (ID: ${studentId}) deleted successfully.` };
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
