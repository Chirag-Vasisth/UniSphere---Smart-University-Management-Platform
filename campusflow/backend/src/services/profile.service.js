const db = require('../config/database');

/**
 * Retrieve authenticated student's profile by their user ID
 */
const getProfile = async (userId) => {
  const result = await db.query(
    `SELECT 
       s.id AS student_id,
       u.id AS user_id,
       u.name,
       u.email,
       u.role,
       s.enrollment_number,
       s.course,
       s.department,
       s.year,
       s.phone,
       s.created_at
     FROM users u
     JOIN students s ON u.id = s.user_id
     WHERE u.id = $1`,
    [userId]
  );

  if (!result.rows || result.rows.length === 0) {
    const error = new Error('Student profile not found.');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

/**
 * Update authenticated student's profile.
 * Only allows modifying: name, phone, course, department, year.
 * Disallows altering user_id or role.
 */
const updateProfile = async (userId, { name, phone, course, department, year }) => {
  // 1. Validation
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      const error = new Error('Name cannot be empty.');
      error.statusCode = 400;
      throw error;
    }
  }

  let yearNum;
  if (year !== undefined) {
    yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1 || yearNum > 8) {
      const error = new Error('Year must be a valid number between 1 and 8.');
      error.statusCode = 400;
      throw error;
    }
  }

  // 2. Fetch existing profile to preserve unmodified fields
  const current = await getProfile(userId);

  const updatedName = name !== undefined ? name.trim() : current.name;
  const updatedCourse = course !== undefined ? course.trim() : current.course;
  const updatedDepartment = department !== undefined ? department.trim() : current.department;
  const updatedYear = yearNum !== undefined ? yearNum : current.year;
  const updatedPhone = phone !== undefined ? phone.trim() : current.phone;

  // 3. Update users table (name only)
  await db.query(
    `UPDATE users SET name = $1 WHERE id = $2`,
    [updatedName, userId]
  );

  // 4. Update students table (course, department, year, phone)
  await db.query(
    `UPDATE students SET course = $1, department = $2, year = $3, phone = $4 WHERE user_id = $5`,
    [updatedCourse, updatedDepartment, updatedYear, updatedPhone, userId]
  );

  // 5. Return fresh profile
  return await getProfile(userId);
};

module.exports = {
  getProfile,
  updateProfile
};
