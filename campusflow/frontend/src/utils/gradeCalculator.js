/**
 * CampusFlow Academic Grade Calculator
 * Implements standard institutional scale:
 * 90–100 -> A+
 * 80–89  -> A
 * 70–79  -> B
 * 60–69  -> C
 * 50–59  -> D
 * < 50   -> F
 */

export const getGradeInfo = (marksObtained, maximumMarks = 100) => {
  const marks = parseFloat(marksObtained);
  const max = parseFloat(maximumMarks) || 100;
  
  if (isNaN(marks)) {
    return { grade: 'N/A', badgeClass: 'badge-secondary', gpa: 0, status: 'Ungraded' };
  }

  const percentage = (marks / max) * 100;
  // Standard 10-point academic grading scale
  const gpa10 = parseFloat((percentage / 10).toFixed(2));

  if (percentage >= 90) {
    return { grade: 'A+', badgeClass: 'badge-primary', gpa: gpa10, status: 'Distinction' };
  }
  if (percentage >= 80) {
    return { grade: 'A', badgeClass: 'badge-success', gpa: gpa10, status: 'Excellent' };
  }
  if (percentage >= 70) {
    return { grade: 'B', badgeClass: 'badge-info', gpa: gpa10, status: 'Good' };
  }
  if (percentage >= 60) {
    return { grade: 'C', badgeClass: 'badge-warning', gpa: gpa10, status: 'Satisfactory' };
  }
  if (percentage >= 50) {
    return { grade: 'D', badgeClass: 'badge-warning', gpa: gpa10, status: 'Pass' };
  }
  return { grade: 'F', badgeClass: 'badge-danger', gpa: 0.0, status: 'Fail' };
};

export const calculateAcademicStats = (marksList = []) => {
  if (!marksList || marksList.length === 0) {
    return {
      totalSubjects: 0,
      averageMarks: 0,
      highestMarks: 0,
      lowestMarks: 0,
      cgpa: 0
    };
  }

  const numericMarks = marksList
    .map(m => parseFloat(m.marks_obtained))
    .filter(m => !isNaN(m));

  if (numericMarks.length === 0) {
    return {
      totalSubjects: 0,
      averageMarks: 0,
      highestMarks: 0,
      lowestMarks: 0,
      cgpa: 0
    };
  }

  const sum = numericMarks.reduce((acc, val) => acc + val, 0);
  const avg = sum / numericMarks.length;
  const highest = Math.max(...numericMarks);
  const lowest = Math.min(...numericMarks);

  // Compute average GPA across subjects
  const gpaSum = marksList.reduce((acc, m) => {
    const info = getGradeInfo(m.marks_obtained, m.maximum_marks || 100);
    return acc + info.gpa;
  }, 0);
  const cgpa = (gpaSum / marksList.length).toFixed(2);

  return {
    totalSubjects: marksList.length,
    averageMarks: parseFloat(avg.toFixed(2)),
    highestMarks: highest,
    lowestMarks: lowest,
    cgpa: parseFloat(cgpa)
  };
};

/**
 * Calculates authentic profile completion percentage based on student profile fields
 */
export const calculateProfileCompletion = (profile) => {
  if (!profile || typeof profile !== 'object') {
    return {
      percentage: 0,
      filledCount: 0,
      totalCount: 7,
      missingFields: ['Name', 'Email', 'Enrollment ID', 'Course', 'Department', 'Year', 'Phone']
    };
  }

  const fields = [
    { key: 'name', label: 'Full Name', check: (v) => typeof v === 'string' && v.trim().length > 0 },
    { key: 'email', label: 'Email Address', check: (v) => typeof v === 'string' && v.trim().length > 0 },
    { key: 'enrollment_number', label: 'Enrollment ID', check: (v) => typeof v === 'string' && v.trim().length > 0 },
    { key: 'course', label: 'Degree Course', check: (v) => typeof v === 'string' && v.trim().length > 0 },
    { key: 'department', label: 'Academic Department', check: (v) => typeof v === 'string' && v.trim().length > 0 },
    { key: 'year', label: 'Academic Year', check: (v) => v !== null && v !== undefined && parseInt(v, 10) > 0 },
    { key: 'phone', label: 'Contact Phone', check: (v) => typeof v === 'string' && v.trim().length > 0 }
  ];

  let filledCount = 0;
  const missingFields = [];

  fields.forEach(({ key, label, check }) => {
    if (check(profile[key])) {
      filledCount++;
    } else {
      missingFields.push(label);
    }
  });

  const percentage = Math.round((filledCount / fields.length) * 100);

  return {
    percentage,
    filledCount,
    totalCount: fields.length,
    missingFields
  };
};

