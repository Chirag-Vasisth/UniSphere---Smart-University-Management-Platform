const db = require('../config/database');

/**
 * Retrieve academic marks belonging ONLY to the authenticated student
 */
const getStudentMarks = async (userId) => {
  const result = await db.query(
    `SELECT 
       m.id, 
       m.subject, 
       m.marks_obtained,
       m.maximum_marks,
       m.semester,
       m.created_at
     FROM marks m
     JOIN students s ON m.student_id = s.id
     WHERE s.user_id = $1
     ORDER BY m.semester ASC, m.id ASC`,
    [userId]
  );

  return (result.rows || []).map(row => ({
    id: row.id,
    subject: row.subject,
    marks_obtained: parseFloat(row.marks_obtained),
    maximum_marks: parseFloat(row.maximum_marks || 100),
    semester: parseInt(row.semester || 1, 10),
    created_at: row.created_at
  }));
};

/**
 * Admin: Retrieve all marks for a specific student by student ID
 */
const getMarksByStudentId = async (studentId) => {
  const studentCheck = await db.query(
    'SELECT id FROM students WHERE id = $1',
    [studentId]
  );

  if (!studentCheck.rows || studentCheck.rows.length === 0) {
    const error = new Error(`Student with ID ${studentId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const result = await db.query(
    `SELECT id, student_id, subject, marks_obtained, maximum_marks, semester, created_at
     FROM marks
     WHERE student_id = $1
     ORDER BY semester ASC, id ASC`,
    [studentId]
  );

  return (result.rows || []).map(row => ({
    id: row.id,
    student_id: row.student_id,
    subject: row.subject,
    marks_obtained: parseFloat(row.marks_obtained),
    maximum_marks: parseFloat(row.maximum_marks || 100),
    semester: parseInt(row.semester || 1, 10),
    created_at: row.created_at
  }));
};

/**
 * Admin: Add a new mark record for a student
 * Fields: subject, marks_obtained, maximum_marks, semester
 */
const addMark = async (studentId, { subject, marks_obtained, marks, maximum_marks, semester }) => {
  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    const error = new Error('Subject name is required.');
    error.statusCode = 400;
    throw error;
  }

  const rawMarks = marks_obtained !== undefined ? marks_obtained : marks;
  const numMarks = parseFloat(rawMarks);
  const numMax = parseFloat(maximum_marks) || 100.00;
  const sem = parseInt(semester, 10) || 1;

  if (isNaN(numMarks) || numMarks < 0 || numMarks > numMax) {
    const error = new Error(`Marks obtained must be a valid number between 0 and ${numMax}.`);
    error.statusCode = 400;
    throw error;
  }

  // Ensure student exists
  const studentCheck = await db.query(
    'SELECT id FROM students WHERE id = $1',
    [studentId]
  );

  if (!studentCheck.rows || studentCheck.rows.length === 0) {
    const error = new Error(`Student with ID ${studentId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const insertResult = await db.query(
    `INSERT INTO marks (student_id, subject, marks_obtained, maximum_marks, semester)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, student_id, subject, marks_obtained, maximum_marks, semester, created_at`,
    [studentId, subject.trim(), numMarks, numMax, sem]
  );

  const row = insertResult.rows[0];
  return {
    id: row.id,
    student_id: row.student_id,
    subject: row.subject,
    marks_obtained: parseFloat(row.marks_obtained),
    maximum_marks: parseFloat(row.maximum_marks || 100),
    semester: parseInt(row.semester || 1, 10),
    created_at: row.created_at
  };
};

/**
 * Admin: Update an existing mark record
 */
const updateMark = async (markId, { subject, marks_obtained, marks, maximum_marks, semester }) => {
  const check = await db.query('SELECT id, marks_obtained, maximum_marks, semester, subject FROM marks WHERE id = $1', [markId]);
  if (!check.rows || check.rows.length === 0) {
    const error = new Error(`Marks record with ID ${markId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  const existing = check.rows[0];
  const updatedSubject = (subject !== undefined && typeof subject === 'string') ? subject.trim() : existing.subject;
  const rawMarks = marks_obtained !== undefined ? marks_obtained : (marks !== undefined ? marks : existing.marks_obtained);
  const numMarks = parseFloat(rawMarks);
  const numMax = maximum_marks !== undefined ? parseFloat(maximum_marks) : parseFloat(existing.maximum_marks || 100);
  const sem = semester !== undefined ? parseInt(semester, 10) : parseInt(existing.semester || 1, 10);

  if (isNaN(numMarks) || numMarks < 0 || numMarks > numMax) {
    const error = new Error(`Marks obtained must be a valid number between 0 and ${numMax}.`);
    error.statusCode = 400;
    throw error;
  }

  const result = await db.query(
    `UPDATE marks
     SET subject = $1, marks_obtained = $2, maximum_marks = $3, semester = $4
     WHERE id = $5
     RETURNING id, student_id, subject, marks_obtained, maximum_marks, semester, created_at`,
    [updatedSubject, numMarks, numMax, sem, markId]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    student_id: row.student_id,
    subject: row.subject,
    marks_obtained: parseFloat(row.marks_obtained),
    maximum_marks: parseFloat(row.maximum_marks || 100),
    semester: parseInt(row.semester || 1, 10),
    created_at: row.created_at
  };
};

/**
 * Admin: Delete a mark record
 */
const deleteMark = async (markId) => {
  const check = await db.query('SELECT id FROM marks WHERE id = $1', [markId]);
  if (!check.rows || check.rows.length === 0) {
    const error = new Error(`Marks record with ID ${markId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  await db.query('DELETE FROM marks WHERE id = $1', [markId]);
  return { message: `Marks record ${markId} deleted successfully.` };
};

module.exports = {
  getStudentMarks,
  getMarksByStudentId,
  addMark,
  updateMark,
  deleteMark
};
