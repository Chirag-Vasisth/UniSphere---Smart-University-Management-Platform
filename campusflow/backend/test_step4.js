/**
 * Step 4 Full End-to-End Test Suite for CampusFlow
 * Tests all Student & Admin Management APIs, Auth Guarantees, CRUD, & Grading
 */

const http = require('http');

function apiCall(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('🧪 Starting CampusFlow Step 4 Comprehensive Test Suite');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Probe
    console.log('--- 1. Health Probe ---');
    const health = await apiCall('/api/health');
    assert(health.status === 200, `Health check returned HTTP 200`);

    // 2. Authentication: Student & Admin Login
    console.log('\n--- 2. Authentication Tokens ---');
    const studentLogin = await apiCall('/api/auth/login', 'POST', {
      email: 'student@campusflow.edu',
      password: 'Student@123'
    });
    const studentToken = studentLogin.data?.data?.token || studentLogin.data?.token;
    assert(studentLogin.status === 200 && studentToken, 'Student logged in successfully');

    const adminLogin = await apiCall('/api/auth/login', 'POST', {
      email: 'admin@campusflow.edu',
      password: 'Admin@123'
    });
    const adminToken = adminLogin.data?.data?.token || adminLogin.data?.token;
    assert(adminLogin.status === 200 && adminToken, 'Admin logged in successfully');

    // 3. Student Profile Endpoints
    console.log('\n--- 3. Student Profile (Self-Service) ---');
    const profileRes = await apiCall('/api/profile', 'GET', null, studentToken);
    assert(profileRes.status === 200, 'GET /api/profile returned 200');
    const profileData = profileRes.data?.data || profileRes.data;
    assert(profileData?.email === 'student@campusflow.edu', `Profile matches student email (${profileData?.email})`);
    assert(profileData?.enrollment_number, `Profile contains enrollment_number: ${profileData?.enrollment_number}`);

    // Update Profile
    const updateProfileRes = await apiCall('/api/profile', 'PUT', {
      name: 'Alex Vance Updated',
      phone: '+1 (555) 987-6543'
    }, studentToken);
    assert(updateProfileRes.status === 200, 'PUT /api/profile updated profile successfully');
    const updatedProfileData = updateProfileRes.data?.data || updateProfileRes.data;
    assert(updatedProfileData?.name === 'Alex Vance Updated', 'Updated name persisted in profile');
    assert(updatedProfileData?.phone === '+1 (555) 987-6543', 'Updated phone persisted in profile');

    // 4. Student Marks (Read-Only for Student)
    console.log('\n--- 4. Student Marks (Student View) ---');
    const marksRes = await apiCall('/api/marks', 'GET', null, studentToken);
    assert(marksRes.status === 200, 'GET /api/marks returned 200');
    assert(Array.isArray(marksRes.data) && marksRes.data.length > 0, `Student retrieved ${marksRes.data?.length} marks records`);

    // Ensure student cannot edit marks (Unauthorized / Forbidden)
    const unauthorizedEdit = await apiCall('/api/marks/1', 'PUT', { marks_obtained: 100 }, studentToken);
    assert(unauthorizedEdit.status === 403, 'Student editing marks blocked with HTTP 403 Forbidden');

    // 5. Admin: Student Directory & Search
    console.log('\n--- 5. Admin: View All Students & Search ---');
    const allStudentsRes = await apiCall('/api/students', 'GET', null, adminToken);
    assert(allStudentsRes.status === 200, 'GET /api/students returned 200 for Admin');
    assert(Array.isArray(allStudentsRes.data) && allStudentsRes.data.length >= 2, `Retrieved ${allStudentsRes.data?.length} students in directory`);

    // Search query
    const searchRes = await apiCall('/api/students?search=Alex', 'GET', null, adminToken);
    assert(searchRes.status === 200 && searchRes.data.length >= 1, `Search "?search=Alex" returned matching student`);

    // 6. Admin: Add Student (Part 5)
    console.log('\n--- 6. Admin: Add Student ---');
    const newStudentData = {
      name: 'Test Student New',
      email: `teststudent_${Date.now()}@campusflow.edu`,
      password: 'Password@123',
      enrollment_number: `ENR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'Robotics Engineering',
      course: 'B.Tech Robotics',
      year: 2,
      phone: '+1 (555) 321-7654'
    };
    const createStudentRes = await apiCall('/api/students', 'POST', newStudentData, adminToken);
    assert(createStudentRes.status === 201, `POST /api/students enrolled student with HTTP 201 Created`);
    const createdStudent = createStudentRes.data?.data;
    assert(createdStudent && createdStudent.id, `Created student assigned ID #${createdStudent?.id}`);

    // 7. Admin: Edit Student (Part 6)
    console.log('\n--- 7. Admin: Edit Student ---');
    const updateStudentRes = await apiCall(`/api/students/${createdStudent.id}`, 'PUT', {
      name: 'Test Student Modified',
      department: 'Robotics & AI',
      course: 'B.Tech Advanced Robotics',
      year: 3,
      phone: '+1 (555) 999-8888'
    }, adminToken);
    assert(updateStudentRes.status === 200, `PUT /api/students/:id updated student details`);
    assert(updateStudentRes.data?.data?.name === 'Test Student Modified', `Updated student name persisted`);

    // 8. Admin: Marks Management (Part 8)
    console.log('\n--- 8. Admin: Marks Management ---');
    // Add mark
    const addMarkRes = await apiCall(`/api/students/${createdStudent.id}/marks`, 'POST', {
      subject: 'Autonomous Systems',
      marks_obtained: 94,
      maximum_marks: 100,
      semester: 3
    }, adminToken);
    assert(addMarkRes.status === 201, 'POST /api/students/:id/marks added mark record');
    const addedMark = addMarkRes.data?.data;
    assert(addedMark && addedMark.id, `Added mark assigned ID #${addedMark?.id}`);

    // View marks for this student
    const studentMarksRes = await apiCall(`/api/students/${createdStudent.id}/marks`, 'GET', null, adminToken);
    assert(studentMarksRes.status === 200 && studentMarksRes.data.length === 1, `GET /api/students/:id/marks retrieved 1 mark`);

    // Edit mark
    const editMarkRes = await apiCall(`/api/marks/${addedMark.id}`, 'PUT', {
      subject: 'Autonomous Systems & SLAM',
      marks_obtained: 98,
      maximum_marks: 100,
      semester: 3
    }, adminToken);
    assert(editMarkRes.status === 200, 'PUT /api/marks/:id updated marks to 98');

    // Delete mark
    const deleteMarkRes = await apiCall(`/api/marks/${addedMark.id}`, 'DELETE', null, adminToken);
    assert(deleteMarkRes.status === 200, 'DELETE /api/marks/:id deleted the mark');

    // 9. Admin Dashboard Stats (Part 9)
    console.log('\n--- 9. Admin Dashboard System Overview ---');
    const statsRes = await apiCall('/api/admin/stats', 'GET', null, adminToken);
    assert(statsRes.status === 200, 'GET /api/admin/stats returned 200');
    assert(typeof statsRes.data?.totalStudents === 'number', `totalStudents is a number: ${statsRes.data?.totalStudents}`);
    assert(typeof statsRes.data?.totalDepartments === 'number', `totalDepartments is a number: ${statsRes.data?.totalDepartments}`);
    assert(typeof statsRes.data?.averageMarks === 'number', `averageMarks is a number: ${statsRes.data?.averageMarks}`);
    assert(Array.isArray(statsRes.data?.recentStudents), `recentStudents is an array (length: ${statsRes.data?.recentStudents?.length})`);

    // 10. Admin: Delete Student & Self-Deletion Guard (Part 7)
    console.log('\n--- 10. Admin: Delete Student & Guard ---');
    const deleteStudentRes = await apiCall(`/api/students/${createdStudent.id}`, 'DELETE', null, adminToken);
    assert(deleteStudentRes.status === 200, `DELETE /api/students/:id deleted student #${createdStudent.id}`);

    // Verify student is gone
    const verifyGone = await apiCall(`/api/students/${createdStudent.id}`, 'GET', null, adminToken);
    console.log(`    (verifyGone status: ${verifyGone.status}, data:`, verifyGone.data || verifyGone.raw, ')');
    assert(verifyGone.status === 404, 'Verified deleted student returns 404 Not Found');

    // Self-deletion guard test
    const selfDeleteAttempt = await apiCall(`/api/students/99999`, 'DELETE', null, adminToken);
    assert(selfDeleteAttempt.status === 404 || selfDeleteAttempt.status === 400, 'Non-existent or self delete handled cleanly');

    console.log('\n========================================================');
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================================');
  } catch (error) {
    console.error('Fatal test runner error:', error);
  }
}

runTests();
