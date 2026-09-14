import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Hash, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Phone, 
  Lock, 
  Building, 
  Calendar,
  Save,
  UserPlus
} from 'lucide-react';

const StudentModal = ({ isOpen, mode, student, onClose, onSave, isSaving, errorMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    enrollment_number: '',
    department: 'Computer Science',
    course: 'Bachelor of Technology',
    year: 1,
    phone: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (student && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        password: '',
        enrollment_number: student.enrollment_number || '',
        department: student.department || 'Computer Science',
        course: student.course || 'Bachelor of Technology',
        year: student.year || 1,
        phone: student.phone || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        enrollment_number: `ENR-2026-${Math.floor(100 + Math.random() * 900)}`,
        department: 'Computer Science',
        course: 'Bachelor of Technology',
        year: 1,
        phone: ''
      });
    }
    setValidationErrors({});
  }, [student, mode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name || !formData.name.trim()) {
      errs.name = 'Student full name is required.';
    }

    if (mode === 'add') {
      if (!formData.email || !emailRegex.test(formData.email.trim())) {
        errs.email = 'A valid email address is required.';
      }
      if (!formData.password || formData.password.length < 6) {
        errs.password = 'Password must be at least 6 characters.';
      }
    }

    const yr = parseInt(formData.year, 10);
    if (isNaN(yr) || yr < 1 || yr > 8) {
      errs.year = 'Academic year must be between 1 and 8.';
    }

    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'add') {
      onSave({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        enrollment_number: formData.enrollment_number.trim(),
        department: formData.department.trim(),
        course: formData.course.trim(),
        year: parseInt(formData.year, 10),
        phone: formData.phone.trim()
      });
    } else if (mode === 'edit') {
      onSave({
        name: formData.name.trim(),
        email: formData.email ? formData.email.trim().toLowerCase() : undefined,
        department: formData.department.trim(),
        course: formData.course.trim(),
        year: parseInt(formData.year, 10),
        phone: formData.phone.trim()
      });
    }
  };

  const titleMap = {
    add: 'Enroll New Student',
    edit: 'Edit Student Details',
    view: 'Student Record Profile'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ padding: '2rem', maxWidth: '640px' }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {titleMap[mode]}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
              {mode === 'view' ? 'Institutional student academic record and profile information' : 'Update verified registry data in UniSphere database'}
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-subtle)',
            color: 'var(--danger)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            marginBottom: '1.25rem',
            fontSize: '0.85rem'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Modal Body */}
        {mode === 'view' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}>
                {student?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{student?.name}</h4>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{student?.email}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <span className="badge badge-primary">Year {student?.year || 1}</span>
                  <span className="badge badge-success">Active Enrolled</span>
                </div>
              </div>
            </div>

            <div className="grid-cols-2" style={{ gap: '1rem' }}>
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>Enrollment ID</span>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', fontFamily: 'var(--font-mono)', marginTop: '0.15rem', color: 'var(--primary)' }}>
                  {student?.enrollment_number}
                </div>
              </div>
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>Department</span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.15rem' }}>{student?.department}</div>
              </div>
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>Degree Course</span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.15rem' }}>{student?.course}</div>
              </div>
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', display: 'block' }}>Contact Phone</span>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.15rem', color: student?.phone ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {student?.phone || 'Not recorded'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button onClick={onClose} className="btn btn-secondary">
                Close Record
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="grid-cols-2" style={{ gap: '1rem' }}>
              {/* Full Name */}
              <div className="input-group">
                <label className="input-label">Student Full Name *</label>
                <input
                  type="text"
                  className={`input-control ${validationErrors.name ? 'input-error' : ''}`}
                  placeholder="e.g. Jordan Hayes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                {validationErrors.name && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>{validationErrors.name}</span>
                )}
              </div>

              {/* Email */}
              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input
                  type="email"
                  className={`input-control ${validationErrors.email ? 'input-error' : ''}`}
                  placeholder="student@campusflow.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={mode === 'edit'}
                  style={mode === 'edit' ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                  required
                />
                {validationErrors.email && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>{validationErrors.email}</span>
                )}
              </div>

              {/* Password (Only on Add) */}
              {mode === 'add' && (
                <div className="input-group">
                  <label className="input-label">Initial Password *</label>
                  <input
                    type="password"
                    className={`input-control ${validationErrors.password ? 'input-error' : ''}`}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  {validationErrors.password && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>{validationErrors.password}</span>
                  )}
                </div>
              )}

              {/* Enrollment Number */}
              <div className="input-group">
                <label className="input-label">Enrollment ID *</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="ENR-2026-001"
                  value={formData.enrollment_number}
                  onChange={(e) => setFormData({ ...formData, enrollment_number: e.target.value })}
                  disabled={mode === 'edit'}
                  style={mode === 'edit' ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                  required
                />
              </div>

              {/* Department */}
              <div className="input-group">
                <label className="input-label">Academic Department</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>

              {/* Course */}
              <div className="input-group">
                <label className="input-label">Degree Course</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Bachelor of Technology"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                />
              </div>

              {/* Academic Year */}
              <div className="input-group">
                <label className="input-label">Academic Year (1-8)</label>
                <select
                  className="input-control"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
                {validationErrors.year && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>{validationErrors.year}</span>
                )}
              </div>

              {/* Phone */}
              <div className="input-group">
                <label className="input-label">Contact Phone</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spin" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                    {mode === 'add' ? 'Enrolling Student...' : 'Saving Changes...'}
                  </>
                ) : (
                  <>
                    {mode === 'add' ? <UserPlus size={16} /> : <Save size={16} />}
                    {mode === 'add' ? 'Enroll Student' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentModal;
