const db = require('../config/database');

/**
 * Get aggregated statistics for the Admin Dashboard
 * - Total students count
 * - Total unique departments
 * - Average marks across all students
 * - Recent students enrolled
 */
const getAdminStats = async () => {
  // Total Students
  const totalStudentsRes = await db.query('SELECT COUNT(*) as count FROM students');
  const totalStudents = parseInt(totalStudentsRes.rows[0]?.count || 0, 10);

  // Total Unique Departments
  const totalDeptRes = await db.query(
    "SELECT COUNT(DISTINCT department) as count FROM students WHERE department IS NOT NULL AND department != ''"
  );
  const totalDepartments = parseInt(totalDeptRes.rows[0]?.count || 0, 10);

  // Average Marks across all marks records
  const avgMarksRes = await db.query('SELECT AVG(marks_obtained) as average FROM marks');
  const rawAvg = avgMarksRes.rows[0]?.average;
  const averageMarks = rawAvg !== null && rawAvg !== undefined ? parseFloat(parseFloat(rawAvg).toFixed(2)) : 0;

  // Recent Students (last 5)
  const recentStudentsRes = await db.query(`
    SELECT 
      s.id,
      s.enrollment_number,
      s.department,
      s.course,
      s.year,
      s.created_at,
      u.name,
      u.email
    FROM students s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.created_at DESC
    LIMIT 5
  `);

  return {
    totalStudents,
    totalDepartments,
    averageMarks,
    recentStudents: recentStudentsRes.rows
  };
};

module.exports = {
  getAdminStats
};
