import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Award, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  X,
  GraduationCap
} from 'lucide-react';
import StudentModal from '../../components/admin/StudentModal';
import AdminMarksModal from '../../components/admin/AdminMarksModal';
import { SkeletonTable } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminStudents = () => {
  const { showToast } = useToast();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  
  // Student modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' | 'add' | 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Marks modal state
  const [marksModalOpen, setMarksModalOpen] = useState(false);
  const [studentForMarks, setStudentForMarks] = useState(null);

  // Real backend search query execution
  const fetchStudents = useCallback(async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.students.getAll(query);
      if (res.ok) {
        setStudents(Array.isArray(res.data) ? res.data : []);
      } else {
        setError(res.data?.message || res.error || 'Failed to fetch students registry.');
      }
    } catch {
      setError('Network error while connecting to student registry.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search input to avoid flood while maintaining instant feeling
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchStudents]);

  // Client-side quick filter for department and year over retrieved records
  const filteredStudents = students.filter((s) => {
    const matchesDept = departmentFilter === 'All' || (s.department && s.department.toLowerCase().includes(departmentFilter.toLowerCase()));
    const matchesYear = yearFilter === 'All' || (s.year && s.year.toString() === yearFilter);
    return matchesDept && matchesYear;
  });

  // Unique departments for filter dropdown
  const departments = ['All', ...new Set(students.map(s => s.department).filter(Boolean))];

  // Open modals
  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setModalMode('add');
    setModalError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setModalMode('edit');
    setModalError(null);
    setModalOpen(true);
  };

  const handleOpenView = (student) => {
    setSelectedStudent(student);
    setModalMode('view');
    setModalError(null);
    setModalOpen(true);
  };

  const handleOpenMarks = (student) => {
    setStudentForMarks(student);
    setMarksModalOpen(true);
  };

  // Delete student
  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student "${studentName}"?\n\nThis will remove the student profile, associated login user, and all academic marks records.`)) {
      return;
    }

    try {
      const res = await api.students.delete(studentId);
      if (res.ok) {
        showToast(`Student "${studentName}" deleted successfully.`, 'info');
        fetchStudents(searchQuery);
      } else {
        const msg = res.data?.message || res.error || 'Failed to delete student.';
        showToast(msg, 'error');
      }
    } catch {
      showToast('Error connecting to backend server during student deletion.', 'error');
    }
  };

  // Save student handler (Add or Edit)
  const handleSaveStudent = async (data) => {
    setIsSaving(true);
    setModalError(null);

    try {
      if (modalMode === 'add') {
        const res = await api.students.create(data);
        if (res.ok) {
          showToast(`Student "${data.name}" enrolled successfully!`, 'success');
          setModalOpen(false);
          fetchStudents(searchQuery);
        } else {
          setModalError(res.data?.message || res.error || 'Failed to enroll student.');
        }
      } else if (modalMode === 'edit') {
        const res = await api.students.update(selectedStudent.id, data);
        if (res.ok) {
          showToast(`Student record for "${data.name}" updated successfully!`, 'success');
          setModalOpen(false);
          fetchStudents(searchQuery);
        } else {
          setModalError(res.data?.message || res.error || 'Failed to update student.');
        }
      }
    } catch {
      setModalError('Server error while saving student details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="heading-lg" style={{ margin: 0 }}>Student Registry & Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Institutional student database, enrollment profiles, and academic evaluation lifecycle
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            id="refresh-students-btn"
            onClick={() => fetchStudents(searchQuery)} 
            className="btn btn-secondary" 
            title="Refresh Directory"
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
          </button>

          <button 
            id="add-new-student-btn"
            onClick={handleOpenAdd}
            className="btn btn-primary"
            style={{ gap: '0.4rem' }}
          >
            <UserPlus size={16} /> Add New Student
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

      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 2fr) minmax(180px, 1fr) minmax(140px, 1fr)', gap: '1rem' }} className="responsive-filter-grid">
          {/* Backend Search Box with Clear Button & Loading State */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              id="student-search-input"
              type="text" 
              placeholder="Search by student name, ID, or course..."
              className="input-control"
              style={{ paddingLeft: '2.4rem', paddingRight: searchQuery ? '2.4rem' : '1rem', height: '38px', fontSize: '0.8125rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Department Filter */}
          <div>
            <select 
              id="department-filter-select"
              className="input-control"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={{ height: '38px', fontSize: '0.8125rem' }}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select 
              id="year-filter-select"
              className="input-control"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              style={{ height: '38px', fontSize: '0.8125rem' }}
            >
              <option value="All">All Years</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(y => (
                <option key={y} value={y.toString()}>Year {y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>
            Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> registered students
            {loading && <span style={{ marginLeft: '0.5rem', color: 'var(--primary)' }}>• Searching...</span>}
          </span>
          {(searchQuery || departmentFilter !== 'All' || yearFilter !== 'All') && (
            <button 
              onClick={() => { setSearchQuery(''); setDepartmentFilter('All'); setYearFilter('All'); }}
              style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Student Table */}
      <div className="table-container">
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
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <div className="spin" style={{ width: 28, height: 28, border: '3px solid var(--border-subtle)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1rem auto' }} />
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>Searching student directory in PostgreSQL...</p>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                  <EmptyState
                    icon={Search}
                    title={searchQuery ? 'No Matching Students' : 'No Students Found'}
                    description={searchQuery ? `No student records match "${searchQuery}". Please check the spelling or clear filters.` : 'The student registry is currently empty.'}
                    actionLabel={searchQuery ? 'Clear Filters' : 'Add First Student'}
                    onAction={searchQuery ? () => { setSearchQuery(''); setDepartmentFilter('All'); setYearFilter('All'); } : handleOpenAdd}
                    style={{ border: 'none', background: 'transparent', padding: '1rem' }}
                  />
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
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
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID #{s.id}</div>
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
                      {/* View Marks Action */}
                      <button 
                        onClick={() => handleOpenMarks(s)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', gap: '0.35rem' }}
                        title="View and Manage Marks"
                      >
                        <Award size={13} style={{ color: 'var(--primary)' }} /> Marks
                      </button>

                      {/* View Details Action */}
                      <button 
                        onClick={() => handleOpenView(s)}
                        className="btn-icon" 
                        style={{ width: 32, height: 32 }} 
                        title="View Record"
                        aria-label="View Student"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Edit Action */}
                      <button 
                        onClick={() => handleOpenEdit(s)}
                        className="btn-icon" 
                        style={{ width: 32, height: 32 }} 
                        title="Edit Record"
                        aria-label="Edit Student"
                      >
                        <Edit size={14} />
                      </button>

                      {/* Delete Action */}
                      <button 
                        onClick={() => handleDelete(s.id, s.name)}
                        className="btn-icon" 
                        style={{ width: 32, height: 32, color: 'var(--danger)' }} 
                        title="Delete Record"
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

      {/* Student Modal (Add, Edit, View) */}
      <StudentModal
        isOpen={modalOpen}
        mode={modalMode}
        student={selectedStudent}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveStudent}
        isSaving={isSaving}
        errorMessage={modalError}
      />

      {/* Admin Marks Modal */}
      <AdminMarksModal
        isOpen={marksModalOpen}
        student={studentForMarks}
        onClose={() => {
          setMarksModalOpen(false);
          setStudentForMarks(null);
        }}
      />

      <style>{`
        @media (max-width: 768px) {
          .responsive-filter-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminStudents;
