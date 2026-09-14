/**
 * CampusFlow Mock Data Store
 * Structured cleanly so frontend components can seamlessly transition
 * to real PostgreSQL/Express API endpoints in subsequent phases.
 */

export const currentStudent = {
  id: "CF-2023-8842",
  rollNumber: "21CS042",
  firstName: "Alex",
  lastName: "Rivera",
  fullName: "Alex Rivera",
  email: "alex.rivera@campusflow.edu",
  phone: "+1 (555) 234-8901",
  department: "Computer Science & Engineering",
  degree: "Bachelor of Technology (B.Tech)",
  semester: 5,
  academicYear: "2023 - 2027",
  enrollmentDate: "August 15, 2023",
  advisor: "Dr. Evelyn Vance",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  dateOfBirth: "2003-05-14",
  bloodGroup: "O+",
  address: "442 Innovation Way, Tech District, Metroville",
  emergencyContact: {
    name: "Sarah Rivera",
    relation: "Mother",
    phone: "+1 (555) 908-1122"
  },
  stats: {
    cgpa: 3.84,
    sgpa: 3.91,
    attendancePercentage: 92.4,
    totalCreditsEarned: 84,
    totalDegreeCredits: 120,
    totalActiveSubjects: 6,
    completedSubjects: 24,
    profileCompletion: 85
  }
};

export const gpaHistory = [
  { semester: "Sem 1", gpa: 3.65, credits: 18, attendance: 90 },
  { semester: "Sem 2", gpa: 3.72, credits: 18, attendance: 93 },
  { semester: "Sem 3", gpa: 3.80, credits: 16, attendance: 91 },
  { semester: "Sem 4", gpa: 3.78, credits: 16, attendance: 94 },
  { semester: "Sem 5", gpa: 3.91, credits: 16, attendance: 92.4 }
];

export const enrolledSubjects = [
  {
    id: "CS301",
    code: "CS-301",
    title: "Database Management Systems",
    faculty: "Dr. Evelyn Vance",
    credits: 4,
    room: "Turing Hall 302",
    schedule: "Mon, Wed 09:30 AM",
    attendance: 94.2,
    attendedClasses: 33,
    totalClasses: 35,
    syllabusCovered: 85,
    category: "Core Computer Science",
    status: "Active"
  },
  {
    id: "CS302",
    code: "CS-302",
    title: "Distributed Systems & Cloud Architecture",
    faculty: "Prof. Marcus Brody",
    credits: 4,
    room: "Lovelace Lab 104",
    schedule: "Mon, Thu 11:15 AM",
    attendance: 91.4,
    attendedClasses: 32,
    totalClasses: 35,
    syllabusCovered: 78,
    category: "Core Computer Science",
    status: "Active"
  },
  {
    id: "CS303",
    code: "CS-303",
    title: "Operating Systems & Kernel Design",
    faculty: "Dr. Anita Sharma",
    credits: 4,
    room: "Hopper Hall 201",
    schedule: "Tue, Fri 10:00 AM",
    attendance: 90.0,
    attendedClasses: 27,
    totalClasses: 30,
    syllabusCovered: 82,
    category: "Core Computer Science",
    status: "Active"
  },
  {
    id: "CS304",
    code: "CS-304",
    title: "Software Engineering & Modern DevOps",
    faculty: "Prof. James Kelly",
    credits: 3,
    room: "Hamilton Lab 12",
    schedule: "Wed 02:00 PM",
    attendance: 96.0,
    attendedClasses: 24,
    totalClasses: 25,
    syllabusCovered: 90,
    category: "Specialization Elective",
    status: "Active"
  },
  {
    id: "CS305",
    code: "CS-305",
    title: "Computer Networks & Cyber Defense",
    faculty: "Prof. Sarah Chen",
    credits: 4,
    room: "Cerf Amphitheater",
    schedule: "Thu 09:00 AM",
    attendance: 88.5,
    attendedClasses: 23,
    totalClasses: 26,
    syllabusCovered: 70,
    category: "Core Computer Science",
    status: "Active"
  },
  {
    id: "MA301",
    code: "MA-301",
    title: "Applied Probability & Statistical Inference",
    faculty: "Dr. David Miller",
    credits: 3,
    room: "Gauss Hall 108",
    schedule: "Fri 01:30 PM",
    attendance: 95.0,
    attendedClasses: 19,
    totalClasses: 20,
    syllabusCovered: 88,
    category: "Foundational Math",
    status: "Active"
  }
];

export const recentResults = [
  {
    subjectCode: "CS-301",
    title: "Database Management Systems",
    examType: "Mid-Term Assessment",
    marks: "48/50",
    grade: "A+",
    gradePoint: 4.0,
    status: "Passed",
    date: "Sep 04, 2026"
  },
  {
    subjectCode: "CS-302",
    title: "Distributed Systems & Cloud",
    examType: "Lab Evaluation 1",
    marks: "29/30",
    grade: "A",
    gradePoint: 3.9,
    status: "Passed",
    date: "Aug 28, 2026"
  },
  {
    subjectCode: "CS-303",
    title: "Operating Systems",
    examType: "Quiz 2 - Concurrency",
    marks: "19/20",
    grade: "A+",
    gradePoint: 4.0,
    status: "Passed",
    date: "Aug 20, 2026"
  },
  {
    subjectCode: "MA-301",
    title: "Applied Probability",
    examType: "Analytical Case Study",
    marks: "45/50",
    grade: "A",
    gradePoint: 3.8,
    status: "Passed",
    date: "Aug 15, 2026"
  }
];

export const semesterResults = {
  5: [
    { code: "CS-301", name: "Database Management Systems", credits: 4, internal: 29, midterm: 19, endterm: 47, total: 95, grade: "A+", points: 4.0 },
    { code: "CS-302", name: "Distributed Systems & Cloud", credits: 4, internal: 28, midterm: 18, endterm: 46, total: 92, grade: "A+", points: 4.0 },
    { code: "CS-303", name: "Operating Systems & Kernel Design", credits: 4, internal: 27, midterm: 18, endterm: 44, total: 89, grade: "A", points: 3.8 },
    { code: "CS-304", name: "Software Engineering & DevOps", credits: 3, internal: 29, midterm: 19, endterm: 48, total: 96, grade: "A+", points: 4.0 },
    { code: "CS-305", name: "Computer Networks & Security", credits: 4, internal: 26, midterm: 17, endterm: 42, total: 85, grade: "A-", points: 3.7 },
    { code: "MA-301", name: "Applied Probability & Stats", credits: 3, internal: 28, midterm: 19, endterm: 45, total: 92, grade: "A+", points: 4.0 }
  ],
  4: [
    { code: "CS-201", name: "Data Structures & Algorithms", credits: 4, internal: 28, midterm: 18, endterm: 45, total: 91, grade: "A+", points: 4.0 },
    { code: "CS-202", name: "Object Oriented Design in Java", credits: 4, internal: 27, midterm: 17, endterm: 43, total: 87, grade: "A", points: 3.8 },
    { code: "CS-203", name: "Computer Architecture", credits: 4, internal: 26, midterm: 16, endterm: 41, total: 83, grade: "B+", points: 3.4 },
    { code: "MA-201", name: "Linear Algebra & Matrices", credits: 4, internal: 28, midterm: 19, endterm: 44, total: 91, grade: "A+", points: 4.0 }
  ]
};

export const upcomingActivities = [
  {
    id: "act-1",
    title: "Cloud Infrastructure Lab Deliverable",
    course: "CS-302 Cloud Architecture",
    dueDate: "Due in 3 days",
    priority: "High",
    badge: "Assignment"
  },
  {
    id: "act-2",
    title: "SQL Query Optimization Review",
    course: "CS-301 Database Systems",
    dueDate: "Oct 18, 10:00 AM",
    priority: "Medium",
    badge: "Lab Exam"
  },
  {
    id: "act-3",
    title: "Annual University Tech Hackathon 2026",
    course: "Campus Activity",
    dueDate: "Nov 02, 09:00 AM",
    priority: "Normal",
    badge: "Event"
  },
  {
    id: "act-4",
    title: "Academic Advisory Check-in with Dr. Vance",
    course: "Mentorship",
    dueDate: "Nov 10, 03:00 PM",
    priority: "Normal",
    badge: "Meeting"
  }
];

export const initialStudentsList = [
  {
    id: "STU-001",
    rollNumber: "21CS042",
    name: "Alex Rivera",
    email: "alex.rivera@campusflow.edu",
    department: "Computer Science",
    semester: 5,
    cgpa: 3.84,
    attendance: 92.4,
    status: "Active"
  },
  {
    id: "STU-002",
    rollNumber: "21CS018",
    name: "Sophia Martinez",
    email: "sophia.m@campusflow.edu",
    department: "Computer Science",
    semester: 5,
    cgpa: 3.92,
    attendance: 96.0,
    status: "Active"
  },
  {
    id: "STU-003",
    rollNumber: "22EE009",
    name: "Liam Chen",
    email: "liam.chen@campusflow.edu",
    department: "Electrical Engineering",
    semester: 3,
    cgpa: 3.65,
    attendance: 88.0,
    status: "Active"
  },
  {
    id: "STU-004",
    rollNumber: "21ME074",
    name: "Emma Watson",
    email: "emma.w@campusflow.edu",
    department: "Mechanical Engineering",
    semester: 5,
    cgpa: 3.48,
    attendance: 84.5,
    status: "On Leave"
  },
  {
    id: "STU-005",
    rollNumber: "23DS015",
    name: "Aiden Patel",
    email: "aiden.p@campusflow.edu",
    department: "Data Science",
    semester: 1,
    cgpa: 3.78,
    attendance: 94.2,
    status: "Active"
  },
  {
    id: "STU-006",
    rollNumber: "22CS088",
    name: "Chloe Dubois",
    email: "chloe.d@campusflow.edu",
    department: "Computer Science",
    semester: 3,
    cgpa: 3.89,
    attendance: 91.0,
    status: "Active"
  },
  {
    id: "STU-007",
    rollNumber: "20BA031",
    name: "Noah Kim",
    email: "noah.kim@campusflow.edu",
    department: "Business Analytics",
    semester: 7,
    cgpa: 3.52,
    attendance: 81.3,
    status: "Active"
  },
  {
    id: "STU-008",
    rollNumber: "22EE044",
    name: "Olivia Hansen",
    email: "olivia.h@campusflow.edu",
    department: "Electrical Engineering",
    semester: 3,
    cgpa: 3.71,
    attendance: 89.5,
    status: "Active"
  },
  {
    id: "STU-009",
    rollNumber: "21ME012",
    name: "Ethan Wright",
    email: "ethan.w@campusflow.edu",
    department: "Mechanical Engineering",
    semester: 5,
    cgpa: 3.35,
    attendance: 76.0,
    status: "Active"
  },
  {
    id: "STU-010",
    rollNumber: "23DS048",
    name: "Zoe Nakamura",
    email: "zoe.n@campusflow.edu",
    department: "Data Science",
    semester: 1,
    cgpa: 3.95,
    attendance: 98.2,
    status: "Active"
  }
];

export const adminOverview = {
  totalStudents: 1420,
  activeStudents: 1385,
  onLeaveStudents: 35,
  averageCgpa: 3.42,
  facultyCount: 84,
  departments: [
    { name: "Computer Science & Eng", count: 480, percentage: 33.8 },
    { name: "Electrical Engineering", count: 320, percentage: 22.5 },
    { name: "Mechanical Engineering", count: 260, percentage: 18.3 },
    { name: "Data Science & AI", count: 210, percentage: 14.8 },
    { name: "Business Analytics", count: 150, percentage: 10.6 }
  ],
  recentRegistrations: [
    { name: "Zoe Nakamura", roll: "23DS048", dept: "Data Science", date: "Just now", status: "Approved" },
    { name: "Aiden Patel", roll: "23DS015", dept: "Data Science", date: "2 hours ago", status: "Approved" },
    { name: "Rohan Verma", roll: "23CS102", dept: "Computer Science", date: "Yesterday", status: "Pending Verification" },
    { name: "Maya Lin", roll: "23EE067", dept: "Electrical Eng", date: "2 days ago", status: "Approved" }
  ]
};
