import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Award, 
  BookOpen, 
  UserPlus, 
  Building2,
  TrendingUp, 
  AlertCircle,
  RefreshCw,
  Search,
  X,
  Eye,
  Edit,
  Trash2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { SkeletonCard, SkeletonTable } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import StudentModal from '../../components/admin/StudentModal';
import AdminMarksModal from '../../components/admin/AdminMarksModal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDepartments: 0,
    averageMarks: 0,
    recentStudents: []
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Student directory table state
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Modals state
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentModalMode, setStudentModalMode] = useState('add');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [studentModalError, setStudentModalError] = useState(null);

  // Marks modal state
  const [marksModalOpen, setMarksModalOpen] = useState(false);
  const [studentForMarks, setStudentForMarks] = useState(null);

  // Fetch dashboard aggregated statistics
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await api.admin.getStats();
      if (res.ok) {
        setStats(res.data);
      } else {
        setError(res.data?.message || res.error || 'Failed to fetch admin stats.');
      }
    } catch {
      setError('Network error while connecting to admin statistics.');
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch students list (supports real backend search query)
  const fetchStudents = useCallback(async (query = '') => {
    setStudentsLoading(true);
    try {
      const res = await api.students.getAll(query);
      if (res.ok) {
        setStudents(Array.isArray(res.data) ? res.data : []);
      } else {
        setError(res.data?.message || res.error || 'Failed to fetch student directory.');
      }
    } catch {
      setError('Network error while fetching student directory.');
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchStudents]);

  // Modal Handlers
  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setStudentModalMode('add');
    setStudentModalError(null);
    setStudentModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setStudentModalMode('edit');
    setStudentModalError(null);
    setStudentModalOpen(true);
  };

  const handleOpenView = (student) => {
    setSelectedStudent(student);
    setStudentModalMode('view');
    setStudentModalError(null);
    setStudentModalOpen(true);
  };

  const handleOpenMarks = (student) => {
    setStudentForMarks(student);
    setMarksModalOpen(true);
  };

  // Delete student
  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student "${studentName}"?\n\nThis will permanently remove the student profile, login account, and all academic marks records.`)) {
      return;
    }

    try {
      const res = await api.students.delete(studentId);
      if (res.ok) {
        showToast(`Student "${studentName}" deleted successfully.`, 'info');
        fetchStudents(searchQuery);
        fetchStats();
      } else {
        const msg = res.data?.message || res.error || 'Failed to delete student.';
        showToast(msg, 'error');
      }
    } catch {
      showToast('Error connecting to backend server during deletion.', 'error');
    }
  };

  // Save student (Add or Edit)
  const handleSaveStudent = async (data) => {
    setIsSavingStudent(true);
    setStudentModalError(null);

    try {
      if (studentModalMode === 'add') {
        const res = await api.students.create(data);
        if (res.ok) {
          showToast(`Student "${data.name}" enrolled successfully!`, 'success');
          setStudentModalOpen(false);
          fetchStudents(searchQuery);
          fetchStats();
        } else {
          setStudentModalError(res.data?.message || res.error || 'Failed to enroll student.');
        }
      } else if (studentModalMode === 'edit') {
        const res = await api.students.update(selectedStudent.id, data);
        if (res.ok) {
          showToast(`Student record for "${data.name}" updated successfully!`, 'success');
          setStudentModalOpen(false);
          fetchStudents(searchQuery);
          fetchStats();
        } else {
          setStudentModalError(res.data?.message || res.error || 'Failed to update student.');
        }
      }
    } catch {
      setStudentModalError('Server error while saving student details.');
    } finally {
      setIsSavingStudent(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 className="heading-lg" style={{ margin: 0 }}>University Administrative Console</h1>
            <span className="badge badge-primary">Institutional Control</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Centralized management overview, student directory, and evaluation governance
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            id="refresh-stats-btn"
            onClick={() => { fetchStats(); fetchStudents(searchQuery); }} 
            className="btn btn-secondary" 
            title="Refresh System Stats"
            disabled={statsLoading}
          >
            <RefreshCw size={15} className={statsLoading ? 'spin' : ''} /> Refresh
          </button>

          <button 
            onClick={handleOpenAdd}
            className="btn btn-primary" 
            style={{ gap: '0.4rem' }}
          >
            <UserPlus size={16} /> Enroll New Student
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--danger-subtle)',
          color: 'var(--danger)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* 4 Stat Overview Cards with Real Backend Data */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          loading={statsLoading}
          title="Total Students"
          value={stats.totalStudents.toString()}
          subtitle="Enrolled in UniSphere"
          trend="Live Database Count"
          trendPositive={true}
          icon={Users}
          color="primary"
        />

        <StatCard
          loading={statsLoading}
          title="Total Departments"
          value={stats.totalDepartments.toString()}
          subtitle="Unique Academic Faculties"
          trend="Active Divisions"
          trendPositive={true}
          icon={Building2}
          color="success"
        />

        <StatCard
          loading={statsLoading}
          title="Average Performance"
          value={`${stats.averageMarks} / 100`}
          subtitle="All Students Evaluation Mean"
          trend="Institutional Benchmark"
          trendPositive={stats.averageMarks >= 70}
          icon={Award}
          color="secondary"
        />

        <StatCard
          loading={statsLoading}
          title="Recent Registrations"
          value={stats.recentStudents ? stats.recentStudents.length.toString() : '0'}
          subtitle="Newly onboarded profiles"
          trend="Latest Cohort"
          trendPositive={true}
          icon={UserCheck}
          color="purple"
        />
      </div>

      {/* Professional Student Table & Search Section */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Top Controls & Search Bar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Student Management Directory</h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Comprehensive student registry with active enrollment credentials and evaluation controls
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Search Input with Clear Button */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="admin-student-search-input"
                type="text"
                placeholder="Search by name, ID, or course..."
                className="input-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem', paddingRight: searchQuery ? '2.4rem' : '1rem', height: '38px', fontSize: '0.8125rem' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Clear Search"
                  aria-label="Clear Search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              onClick={handleOpenAdd}
              className="btn btn-primary btn-sm"
              style={{ gap: '0.35rem', height: '38px' }}
            >
              <UserPlus size={15} /> Add Student
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Student ID</th>
                <th>Email</th>
                <th>Course</th>
                <th>Department</th>
                <th>Year</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentsLoading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    Loading student directory...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                    <EmptyState
                      icon={Search}
                      title={searchQuery ? 'No Students Found' : 'Directory Empty'}
                      description={searchQuery ? `No student records match "${searchQuery}".` : 'No registered students in the database yet.'}
                      actionLabel={searchQuery ? 'Clear Search Filter' : 'Enroll First Student'}
                      onAction={searchQuery ? () => setSearchQuery('') : handleOpenAdd}
                      style={{ border: 'none', background: 'transparent', padding: '1rem' }}
                    />
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id}>
                    {/* Student Name + Avatar */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          flexShrink: 0
                        }}>
                          {s.name ? s.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Database ID #{s.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>
                      {s.enrollment_number}
                    </td>

                    {/* Email */}
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {s.email}
                    </td>

                    {/* Course */}
                    <td style={{ fontSize: '0.85rem' }}>
                      {s.course || 'Undergraduate'}
                    </td>

                    {/* Department */}
                    <td>
                      <span className="badge badge-neutral">
                        {s.department || 'General'}
                      </span>
                    </td>

                    {/* Year */}
                    <td>
                      <span className="badge badge-primary">
                        Year {s.year || 1}
                      </span>
                    </td>

                    {/* Actions: View, Edit, Delete, Manage Marks */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                        {/* Manage Marks Button */}
                        <button
                          onClick={() => handleOpenMarks(s)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', gap: '0.35rem' }}
                          title="Manage Academic Marks"
                        >
                          <Award size={13} style={{ color: 'var(--primary)' }} /> Marks
                        </button>

                        {/* View Button */}
                        <button
                          onClick={() => handleOpenView(s)}
                          className="btn-icon"
                          style={{ width: 32, height: 32 }}
                          title="View Student Record"
                          aria-label="View Student"
                        >
                          <Eye size={14} />
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="btn-icon"
                          style={{ width: 32, height: 32 }}
                          title="Edit Student Details"
                          aria-label="Edit Student"
                        >
                          <Edit size={14} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="btn-icon"
                          style={{ width: 32, height: 32, color: 'var(--danger)' }}
                          title="Delete Student Profile"
                          aria-label="Delete Student"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Stats */}
        <div style={{ padding: '0.85rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Displaying <strong>{students.length}</strong> of <strong>{stats.totalStudents}</strong> enrolled students</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
            >
              Reset Search
            </button>
          )}
        </div>
      </div>

      {/* Student Modal (Add, Edit, View) */}
      <StudentModal
        isOpen={studentModalOpen}
        mode={studentModalMode}
        student={selectedStudent}
        onClose={() => setStudentModalOpen(false)}
        onSave={handleSaveStudent}
        isSaving={isSavingStudent}
        errorMessage={studentModalError}
      />

      {/* Marks Management Modal */}
      <AdminMarksModal
        isOpen={marksModalOpen}
        student={studentForMarks}
        onClose={() => {
          setMarksModalOpen(false);
          setStudentForMarks(null);
          fetchStats();
        }}
      />
    </div>
  );
};

export default AdminDashboard;
