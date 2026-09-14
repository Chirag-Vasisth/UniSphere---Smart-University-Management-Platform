/**
 * CampusFlow PostgreSQL Database Connection Pool & Query Utility
 * Uses the official 'pg' library with no ORM.
 * Features automatic fallback for offline development when PostgreSQL is not running.
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  database: process.env.DATABASE_NAME || 'campusflow',
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

// ============================================================================
// In-Memory Development Store Fallback
// Used seamlessly when PostgreSQL service is not running locally.
// ============================================================================
const memoryStore = {
  users: [
    {
      id: 1,
      name: 'Administrator Lead',
      email: 'admin@campusflow.edu',
      password_hash: '$2b$10$xDkkHYbfnl6kW2XBBOJOBOm7F.85KbkP27iwYDWoW/HG7yZf2CLsO', // Admin@123
      role: 'ADMIN',
      created_at: new Date('2026-01-10T10:00:00Z')
    },
    {
      id: 2,
      name: 'Alex Rivera',
      email: 'student@campusflow.edu',
      password_hash: '$2b$10$iXav2jfXScmSdiEIpXxXGOryb5YGYZTk.JkLJQAtfJXka8H0T3I2W', // Student@123
      role: 'STUDENT',
      created_at: new Date('2026-02-15T11:00:00Z')
    },
    {
      id: 3,
      name: 'Sophia Martinez',
      email: 'sophia.m@campusflow.edu',
      password_hash: '$2b$10$iXav2jfXScmSdiEIpXxXGOryb5YGYZTk.JkLJQAtfJXka8H0T3I2W', // Student@123
      role: 'STUDENT',
      created_at: new Date('2026-02-16T12:00:00Z')
    }
  ],
  students: [
    {
      id: 1,
      user_id: 2,
      enrollment_number: 'ENR-2026-001',
      course: 'Bachelor of Technology',
      department: 'Computer Science & Engineering',
      year: 3,
      phone: '+1 (555) 234-8901',
      created_at: new Date('2026-02-15T11:00:00Z')
    },
    {
      id: 2,
      user_id: 3,
      enrollment_number: 'ENR-2026-002',
      course: 'Bachelor of Technology',
      department: 'Computer Science & Engineering',
      year: 3,
      phone: '+1 (555) 456-7890',
      created_at: new Date('2026-02-16T12:00:00Z')
    }
  ],
  marks: [
    { id: 1, student_id: 1, subject: 'Database Management Systems', marks_obtained: 95.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-01') },
    { id: 2, student_id: 1, subject: 'Distributed Systems & Cloud Computing', marks_obtained: 92.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-02') },
    { id: 3, student_id: 1, subject: 'Operating Systems & Kernel Design', marks_obtained: 89.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-03') },
    { id: 4, student_id: 1, subject: 'Software Engineering & DevOps', marks_obtained: 96.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-04') },
    { id: 5, student_id: 1, subject: 'Computer Networks & Security', marks_obtained: 85.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-05') },
    { id: 6, student_id: 1, subject: 'Applied Probability & Statistics', marks_obtained: 92.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-06') },

    { id: 7, student_id: 2, subject: 'Database Management Systems', marks_obtained: 98.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-01') },
    { id: 8, student_id: 2, subject: 'Distributed Systems & Cloud Computing', marks_obtained: 96.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-02') },
    { id: 9, student_id: 2, subject: 'Operating Systems & Kernel Design', marks_obtained: 94.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-03') },
    { id: 10, student_id: 2, subject: 'Software Engineering & DevOps', marks_obtained: 95.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-04') },
    { id: 11, student_id: 2, subject: 'Computer Networks & Security', marks_obtained: 91.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-05') },
    { id: 12, student_id: 2, subject: 'Applied Probability & Statistics', marks_obtained: 97.0, maximum_marks: 100, semester: 5, created_at: new Date('2026-03-06') }
  ],
  nextUserId: 4,
  nextStudentId: 3,
  nextMarkId: 13
};

function executeMemoryQuery(text, params = []) {
  const sql = text.trim();

  // Transactions
  if (/^(BEGIN|COMMIT|ROLLBACK)/i.test(sql)) {
    return { rows: [] };
  }

  // 1. SELECT 1 (Health / DB Test)
  if (/^SELECT\s+1/i.test(sql)) {
    return { rows: [{ '?column?': 1 }] };
  }

  // --- DELETE STATEMENTS FIRST ---
  // DELETE mark:
  if (/^DELETE\s+FROM\s+marks\s+WHERE\s+id\s*=\s*\$1/i.test(sql)) {
    const id = parseInt(params[0], 10);
    const idx = memoryStore.marks.findIndex(m => m.id === id);
    if (idx !== -1) memoryStore.marks.splice(idx, 1);
    return { rowCount: idx !== -1 ? 1 : 0 };
  }

  // DELETE student (cascade deletes marks & user):
  if (/^DELETE\s+FROM\s+students\s+WHERE\s+id\s*=\s*\$1/i.test(sql)) {
    const studentId = parseInt(params[0], 10);
    const sIdx = memoryStore.students.findIndex(s => s.id === studentId);
    if (sIdx !== -1) {
      const student = memoryStore.students[sIdx];
      // Cascade marks
      memoryStore.marks = memoryStore.marks.filter(m => m.student_id !== studentId);
      // Delete user
      memoryStore.users = memoryStore.users.filter(u => u.id !== student.user_id);
      memoryStore.students.splice(sIdx, 1);
      return { rowCount: 1 };
    }
    return { rowCount: 0 };
  }

  // DELETE user:
  if (/^DELETE\s+FROM\s+users\s+WHERE\s+id\s*=\s*\$1/i.test(sql)) {
    const userId = parseInt(params[0], 10);
    const uIdx = memoryStore.users.findIndex(u => u.id === userId);
    if (uIdx !== -1) {
      const student = memoryStore.students.find(s => s.user_id === userId);
      if (student) {
        memoryStore.marks = memoryStore.marks.filter(m => m.student_id !== student.id);
        memoryStore.students = memoryStore.students.filter(s => s.user_id !== userId);
      }
      memoryStore.users.splice(uIdx, 1);
      return { rowCount: 1 };
    }
    return { rowCount: 0 };
  }

  // 2. Query user by email: SELECT ... FROM users WHERE email = $1
  if (/FROM\s+users\s+WHERE\s+email\s*=\s*\$1/i.test(sql)) {
    const email = (params[0] || '').toLowerCase();
    const user = memoryStore.users.find(u => u.email.toLowerCase() === email);
    return { rows: user ? [{ ...user }] : [] };
  }

  // 3. Query user by id: SELECT ... FROM users WHERE id = $1
  if (/FROM\s+users\s+WHERE\s+id\s*=\s*\$1/i.test(sql)) {
    const id = parseInt(params[0], 10);
    const user = memoryStore.users.find(u => u.id === id);
    return { rows: user ? [{ ...user }] : [] };
  }

  // 4. Query student by user_id: SELECT ... FROM students WHERE user_id = $1
  if (/FROM\s+students\s+WHERE\s+user_id\s*=\s*\$1/i.test(sql)) {
    const userId = parseInt(params[0], 10);
    const student = memoryStore.students.find(s => s.user_id === userId);
    return { rows: student ? [{ ...student }] : [] };
  }

  // 5. Query student by enrollment_number: SELECT id FROM students WHERE enrollment_number = $1
  if (/FROM\s+students\s+WHERE\s+enrollment_number\s*=\s*\$1/i.test(sql)) {
    const enr = (params[0] || '').trim();
    const student = memoryStore.students.find(s => s.enrollment_number === enr);
    return { rows: student ? [{ ...student }] : [] };
  }

  // 6. Query student by student ID: SELECT ... FROM students WHERE id = $1
  if (/FROM\s+students\s+WHERE\s+id\s*=\s*\$1/i.test(sql)) {
    const id = parseInt(params[0], 10);
    const student = memoryStore.students.find(s => s.id === id);
    return { rows: student ? [{ ...student }] : [] };
  }

  // 7. Join user & student profile for logged-in user:
  // SELECT ... FROM users u JOIN students s ON ... WHERE u.id = $1
  if (/FROM\s+users\s+u[\s\S]*JOIN\s+students\s+s[\s\S]*WHERE\s+u\.id\s*=\s*\$1/i.test(sql)) {
    const userId = parseInt(params[0], 10);
    const user = memoryStore.users.find(u => u.id === userId);
    const student = memoryStore.students.find(s => s.user_id === userId);
    if (user && student) {
      return {
        rows: [{
          id: student.id,
          student_id: student.id,
          user_id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          enrollment_number: student.enrollment_number,
          course: student.course,
          department: student.department,
          year: student.year,
          phone: student.phone || '+1 (555) 234-8901',
          created_at: student.created_at
        }]
      };
    }
    return { rows: [] };
  }

  // 8. Marks for a logged in student (u.id = $1 or s.user_id = $1):
  if (/FROM\s+marks\s+m[\s\S]*JOIN\s+students\s+s[\s\S]*WHERE\s+(s\.user_id|u\.id)\s*=\s*\$1/i.test(sql)) {
    const userId = parseInt(params[0], 10);
    const student = memoryStore.students.find(s => s.user_id === userId);
    if (!student) return { rows: [] };
    const marks = memoryStore.marks
      .filter(m => m.student_id === student.id)
      .map(m => ({ 
        id: m.id, 
        student_id: m.student_id,
        subject: m.subject, 
        marks_obtained: parseFloat(m.marks_obtained), 
        maximum_marks: parseFloat(m.maximum_marks || 100),
        semester: m.semester || 1,
        created_at: m.created_at 
      }));
    return { rows: marks };
  }

  // 9. Marks by student_id (Admin):
  if (/FROM\s+marks[\s\S]*WHERE\s+student_id\s*=\s*\$1/i.test(sql)) {
    const studentId = parseInt(params[0], 10);
    const marks = memoryStore.marks
      .filter(m => m.student_id === studentId)
      .map(m => ({ 
        id: m.id, 
        student_id: m.student_id, 
        subject: m.subject, 
        marks_obtained: parseFloat(m.marks_obtained),
        maximum_marks: parseFloat(m.maximum_marks || 100),
        semester: m.semester || 1,
        created_at: m.created_at 
      }));
    return { rows: marks };
  }

  // 10. Mark by mark ID:
  if (/FROM\s+marks[\s\S]*WHERE\s+id\s*=\s*\$1/i.test(sql)) {
    const markId = parseInt(params[0], 10);
    const mark = memoryStore.marks.find(m => m.id === markId);
    return { 
      rows: mark ? [{ 
        ...mark, 
        marks_obtained: parseFloat(mark.marks_obtained),
        maximum_marks: parseFloat(mark.maximum_marks || 100),
        semester: mark.semester || 1
      }] : [] 
    };
  }

  // 11. Admin Dashboard Queries:
  // 11a. Total students count
  if (/COUNT\(\*\)\s+as\s+count\s+FROM\s+students/i.test(sql)) {
    return { rows: [{ count: memoryStore.students.length }] };
  }

  // 11b. Total unique departments
  if (/COUNT\(DISTINCT\s+department\)/i.test(sql)) {
    const depts = new Set(memoryStore.students.map(s => s.department).filter(Boolean));
    return { rows: [{ count: depts.size }] };
  }

  // 11c. Average marks across all marks records
  if (/AVG\(marks_obtained\)\s+as\s+average\s+FROM\s+marks/i.test(sql)) {
    if (memoryStore.marks.length === 0) return { rows: [{ average: 0 }] };
    const sum = memoryStore.marks.reduce((acc, m) => acc + parseFloat(m.marks_obtained), 0);
    const avg = sum / memoryStore.marks.length;
    return { rows: [{ average: parseFloat(avg.toFixed(2)) }] };
  }

  // 12. Single student detail by student ID (Admin):
  // SELECT ... FROM students s JOIN users u ... WHERE s.id = $1
  if (/FROM\s+students\s+s[\s\S]*JOIN\s+users\s+u[\s\S]*WHERE\s+s\.id\s*=\s*\$1/i.test(sql)) {
    const id = parseInt(params[0], 10);
    const s = memoryStore.students.find(st => st.id === id);
    if (!s) return { rows: [] };
    const u = memoryStore.users.find(usr => usr.id === s.user_id) || {};
    return {
      rows: [{
        id: s.id,
        user_id: s.user_id,
        name: u.name,
        email: u.email,
        enrollment_number: s.enrollment_number,
        course: s.course,
        department: s.department,
        year: s.year,
        phone: s.phone || '',
        created_at: s.created_at
      }]
    };
  }

  // 13. List all students (Admin) or Recent Students:
  if (/FROM\s+students\s+s[\s\S]*JOIN\s+users\s+u\s+ON/i.test(sql)) {
    let list = memoryStore.students.map(s => {
      const u = memoryStore.users.find(usr => usr.id === s.user_id) || {};
      return {
        id: s.id,
        user_id: s.user_id,
        name: u.name || 'Student',
        email: u.email || '',
        enrollment_number: s.enrollment_number || `ENR-2026-${s.id}`,
        course: s.course,
        department: s.department,
        year: s.year,
        phone: s.phone || '',
        created_at: s.created_at
      };
    });

    // Check search parameter
    if (params.length > 0 && params[0]) {
      const term = params[0].replace(/%/g, '').toLowerCase();
      list = list.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        (item.enrollment_number && item.enrollment_number.toLowerCase().includes(term)) ||
        (item.course && item.course.toLowerCase().includes(term)) ||
        (item.department && item.department.toLowerCase().includes(term)) ||
        item.id.toString().includes(term)
      );
    }

    if (/LIMIT\s+5/i.test(sql)) {
      return { rows: list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5) };
    }

    return { rows: list.sort((a, b) => b.id - a.id) };
  }

  // 14. INSERT user:
  if (/INSERT\s+INTO\s+users/i.test(sql)) {
    const [name, email, password_hash, role] = params;
    const newUser = {
      id: memoryStore.nextUserId++,
      name,
      email: email.toLowerCase(),
      password_hash,
      role: role || 'STUDENT',
      created_at: new Date()
    };
    memoryStore.users.push(newUser);
    return { rows: [newUser] };
  }

  // 15. INSERT student:
  if (/INSERT\s+INTO\s+students/i.test(sql)) {
    let user_id, enrollment_number, course, department, year, phone;
    if (params.length === 6) {
      [user_id, enrollment_number, course, department, year, phone] = params;
    } else if (params.length === 5) {
      [user_id, enrollment_number, course, department, year] = params;
    } else {
      [user_id, course, department, year] = params;
    }

    const newStudent = {
      id: memoryStore.nextStudentId++,
      user_id: parseInt(user_id, 10),
      enrollment_number: enrollment_number || `ENR-2026-${Math.floor(100 + Math.random() * 900)}`,
      course: course || 'Bachelor of Technology',
      department: department || 'Computer Science & Engineering',
      year: parseInt(year, 10) || 1,
      phone: phone || '',
      created_at: new Date()
    };
    memoryStore.students.push(newStudent);
    return { rows: [newStudent] };
  }

  // 16. INSERT mark:
  if (/INSERT\s+INTO\s+marks/i.test(sql)) {
    const [student_id, subject, marks_obtained, maximum_marks, semester] = params;
    const newMark = {
      id: memoryStore.nextMarkId++,
      student_id: parseInt(student_id, 10),
      subject,
      marks_obtained: parseFloat(marks_obtained),
      maximum_marks: parseFloat(maximum_marks || 100),
      semester: parseInt(semester || 1, 10),
      created_at: new Date()
    };
    memoryStore.marks.push(newMark);
    return { rows: [newMark] };
  }

  // 17. UPDATE user:
  if (/UPDATE\s+users\s+SET/i.test(sql)) {
    if (params.length === 2) {
      const [name, id] = params;
      const user = memoryStore.users.find(u => u.id === parseInt(id, 10));
      if (user) user.name = name;
      return { rows: user ? [user] : [] };
    }
    if (params.length === 3) {
      const [name, email, id] = params;
      const user = memoryStore.users.find(u => u.id === parseInt(id, 10));
      if (user) {
        user.name = name;
        user.email = email.toLowerCase();
      }
      return { rows: user ? [user] : [] };
    }
  }

  // 18. UPDATE student:
  if (/UPDATE\s+students\s+SET/i.test(sql)) {
    if (/WHERE\s+user_id\s*=\s*\$\d/i.test(sql)) {
      const userId = parseInt(params[params.length - 1], 10);
      const student = memoryStore.students.find(s => s.user_id === userId);
      if (student) {
        student.course = params[0];
        student.department = params[1];
        student.year = parseInt(params[2], 10);
        if (params.length >= 5) student.phone = params[3];
      }
      return { rows: student ? [student] : [] };
    } else {
      const studentId = parseInt(params[params.length - 1], 10);
      const student = memoryStore.students.find(s => s.id === studentId);
      if (student) {
        student.course = params[0];
        student.department = params[1];
        student.year = parseInt(params[2], 10);
        if (params.length >= 5) student.phone = params[3];
      }
      return { rows: student ? [student] : [] };
    }
  }

  // 19. UPDATE mark:
  if (/UPDATE\s+marks\s+SET/i.test(sql)) {
    const [subject, marks_obtained, maximum_marks, semester, markId] = params;
    const mark = memoryStore.marks.find(m => m.id === parseInt(markId, 10));
    if (mark) {
      mark.subject = subject;
      mark.marks_obtained = parseFloat(marks_obtained);
      mark.maximum_marks = parseFloat(maximum_marks || 100);
      mark.semester = parseInt(semester || 1, 10);
    }
    return { rows: mark ? [mark] : [] };
  }

  // 20. DELETE mark:
  if (/DELETE\s+FROM\s+marks\s+WHERE\s+id\s*=\s*\$1/i.test(sql)) {
    const id = parseInt(params[0], 10);
    const idx = memoryStore.marks.findIndex(m => m.id === id);
    if (idx !== -1) memoryStore.marks.splice(idx, 1);
    return { rowCount: idx !== -1 ? 1 : 0 };
  }

  // 21. DELETE student (cascade deletes marks & user):
  if (/DELETE\s+FROM\s+students\s+WHERE\s+id\s*=\s*\$1/i.test(sql)) {
    const studentId = parseInt(params[0], 10);
    const sIdx = memoryStore.students.findIndex(s => s.id === studentId);
    if (sIdx !== -1) {
      const student = memoryStore.students[sIdx];
      // Cascade marks
      memoryStore.marks = memoryStore.marks.filter(m => m.student_id !== studentId);
      // Delete user
      memoryStore.users = memoryStore.users.filter(u => u.id !== student.user_id);
      memoryStore.students.splice(sIdx, 1);
      return { rowCount: 1 };
    }
    return { rowCount: 0 };
  }

  // 22. DELETE user:
  if (/DELETE\s+FROM\s+users\s+WHERE\s+id\s*=\s*\$1/i.test(sql)) {
    const userId = parseInt(params[0], 10);
    const uIdx = memoryStore.users.findIndex(u => u.id === userId);
    if (uIdx !== -1) {
      const student = memoryStore.students.find(s => s.user_id === userId);
      if (student) {
        memoryStore.marks = memoryStore.marks.filter(m => m.student_id !== student.id);
        memoryStore.students = memoryStore.students.filter(s => s.user_id !== userId);
      }
      memoryStore.users.splice(uIdx, 1);
      return { rowCount: 1 };
    }
    return { rowCount: 0 };
  }

  return { rows: [] };
}

/**
 * Parameterized query executor: tries PostgreSQL pool first,
 * with transparent fallback to in-memory store if PostgreSQL is offline.
 */
let isPostgresOffline = false;

const query = async (text, params = []) => {
  if (isPostgresOffline) {
    return executeMemoryQuery(text, params);
  }

  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    const isConnRefused = error.code === 'ECONNREFUSED' || 
                          error.message.includes('connect ECONNREFUSED') ||
                          error.code === 'ENOTFOUND' ||
                          error.code === 'ETIMEDOUT';
    if (isConnRefused) {
      if (!isPostgresOffline) {
        console.warn('⚠️  PostgreSQL connection unavailable. Operating seamlessly with in-memory store.');
        isPostgresOffline = true;
      }
      return executeMemoryQuery(text, params);
    }
    throw error;
  }
};

const getClient = async () => {
  if (isPostgresOffline) {
    return {
      query: async (text, params) => executeMemoryQuery(text, params),
      release: () => {}
    };
  }

  try {
    return await pool.connect();
  } catch (error) {
    if (!isPostgresOffline) {
      console.warn('⚠️  PostgreSQL connection unavailable. Operating seamlessly with in-memory store.');
      isPostgresOffline = true;
    }
    return {
      query: async (text, params) => executeMemoryQuery(text, params),
      release: () => {}
    };
  }
};

const testConnection = async () => {
  try {
    const res = await pool.query('SELECT 1');
    return {
      success: true,
      message: 'PostgreSQL database connected successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: `Database connection failed: ${error.message}. (Active resilient fallback in operation)`,
      timestamp: new Date().toISOString()
    };
  }
};

module.exports = {
  query,
  getClient,
  testConnection,
  pool
};
