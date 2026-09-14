import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  ShieldCheck, 
  Edit3, 
  Check, 
  AlertCircle,
  Hash,
  Building,
  Calendar,
  Layers,
  Save,
  X,
  Sparkles,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { calculateProfileCompletion } from '../../utils/gradeCalculator';
import { SkeletonCard, SkeletonLine } from '../../components/common/LoadingSkeleton';

const StudentProfile = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: '',
    department: '',
    year: 1
  });

  const [formErrors, setFormErrors] = useState({});

  const fetchProfile = async () => {
    // Check if token exists
    const token = api.auth.getToken();
    if (!token) {
      setIsUnauthorized(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.profile.get();
      if (res.ok && res.data) {
        const data = res.data?.data || res.data;
        setProfile(data);
        setIsUnauthorized(false);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          course: data.course || '',
          department: data.department || '',
          year: data.year || 1
        });
      } else {
        if (res.status === 401 || (res.data?.message && res.data.message.toLowerCase().includes('token'))) {
          setIsUnauthorized(true);
        } else {
          setError(res.data?.message || res.error || 'Failed to load student profile.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred while loading profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoggingIn(true);
    try {
      const res = await api.auth.login({
        email: 'student@campusflow.edu',
        password: 'Student@123'
      });
      if (res.ok && res.data?.status === 'ok') {
        const { token, user } = res.data.data;
        if (token) localStorage.setItem('campusflow_token', token);
        if (user) localStorage.setItem('campusflow_user', JSON.stringify(user));
        showToast('Signed in successfully as Alex Rivera!', 'success');
        setIsUnauthorized(false);
        await fetchProfile();
      } else {
        showToast('Login failed: ' + (res.data?.message || 'Server error'), 'error');
      }
    } catch {
      showToast('Login error. Please use the login page.', 'error');
    } finally {
      setLoggingIn(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Full name is required.';
    }
    const yr = parseInt(formData.year, 10);
    if (isNaN(yr) || yr < 1 || yr > 8) {
      errors.year = 'Academic year must be between 1 and 8.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await api.profile.update({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        course: formData.course.trim(),
        department: formData.department.trim(),
        year: parseInt(formData.year, 10)
      });

      if (res.ok) {
        const updated = res.data?.data || res.data;
        setProfile(updated);
        setIsEditing(false);
        showToast('Profile records updated successfully!', 'success');
        setSuccessMessage('Profile records updated successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        const errMsg = res.data?.message || res.error || 'Failed to update profile.';
        setError(errMsg);
        showToast(errMsg, 'error');
      }
    } catch (err) {
      setError('Failed to save profile changes. Please try again.');
      showToast('Failed to save profile changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        course: profile.course || '',
        department: profile.department || '',
        year: profile.year || 1
      });
    }
    setFormErrors({});
    setIsEditing(false);
    setError(null);
  };

  const getInitials = (name) => {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const completion = calculateProfileCompletion(profile);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div style={{ marginBottom: '2rem' }}>
          <SkeletonLine width="30%" height="32px" style={{ marginBottom: '0.5rem' }} />
          <SkeletonLine width="50%" height="16px" />
        </div>
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div className="skeleton skeleton-circle" style={{ width: 80, height: 80 }} />
            <div style={{ flex: 1 }}>
              <SkeletonLine width="40%" height="24px" style={{ marginBottom: '0.5rem' }} />
              <SkeletonLine width="60%" height="16px" />
            </div>
          </div>
        </div>
        <div className="grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="page-wrapper" style={{ maxWidth: '640px', margin: '4rem auto' }}>
        <div 
          className="card" 
          style={{ 
            padding: '3rem 2rem', 
            textAlign: 'center', 
            border: '1px solid var(--border-strong)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(6, 182, 212, 0.03) 100%)'
          }}
        >
          <div style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <ShieldCheck size={36} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Authentication Required
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 2rem auto' }}>
            You need an active authenticated session to access your student profile and academic progression records.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '340px', margin: '0 auto' }}>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loggingIn}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1rem', justifyContent: 'center', fontWeight: 700, gap: '0.5rem' }}
            >
              {loggingIn ? (
                <>
                  <span className="spin" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                  Signing In...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Instant Sign In as Student (Demo)
                </>
              )}
            </button>

            <Link
              to="/login"
              state={{ from: '/student/profile', message: 'Please sign in to access your student profile.' }}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1rem', justifyContent: 'center', textDecoration: 'none', gap: '0.5rem' }}
            >
              <LogIn size={15} /> Go to Login Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="heading-lg" style={{ margin: 0 }}>Student Profile & Verification</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Verified institutional identity, enrolled degree program, and verified contact records
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isEditing ? (
            <>
              <button 
                type="button" 
                onClick={handleCancel} 
                className="btn btn-secondary" 
                style={{ gap: '0.4rem' }}
                disabled={saving}
              >
                <X size={16} /> Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSave} 
                className="btn btn-primary" 
                style={{ gap: '0.4rem' }}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spin" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              className="btn btn-primary"
              style={{ gap: '0.4rem' }}
            >
              <Edit3 size={16} /> Edit Profile Details
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--success-subtle)',
          color: 'var(--success)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}

      {/* Error Notification Alert */}
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
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Profile Header Hero Card */}
      <div 
        className="card" 
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)',
          border: '1px solid var(--border-strong)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Avatar */}
            <div style={{
              width: 84,
              height: 84,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '2rem',
              boxShadow: '0 8px 24px var(--primary-glow)',
              flexShrink: 0
            }}>
              {getInitials(profile?.name)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {profile?.name}
                </h2>
                <span className="badge badge-success">Active Enrolled</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {profile?.course} • {profile?.department}
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>ID: <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{profile?.enrollment_number}</strong></span>
                <span>•</span>
                <span>Year: <strong style={{ color: 'var(--text-primary)' }}>Year {profile?.year || 1}</strong></span>
              </div>
            </div>
          </div>

          {/* Profile Completion Indicator */}
          <div style={{
            minWidth: '220px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Profile Completion</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                {completion.percentage}%
              </span>
            </div>
            <div style={{ width: '100%', height: 6, borderRadius: 'var(--radius-full)', background: 'var(--bg-canvas)', overflow: 'hidden' }}>
              <div style={{ width: `${completion.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #06b6d4)', borderRadius: 'var(--radius-full)' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {completion.percentage === 100 ? 'All 7 key attributes verified' : `${completion.missingFields.length} field(s) pending`}
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Grid (or Edit Form) */}
      {isEditing ? (
        /* Edit Profile Form */
        <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={18} style={{ color: 'var(--primary)' }} /> Edit Profile Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }} className="responsive-form-grid">
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <input
                type="text"
                className={`input-control ${formErrors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
              {formErrors.name && (
                <span style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>{formErrors.name}</span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">Contact Phone Number</label>
              <input
                type="text"
                className="input-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +1 (555) 019-2834"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Degree Course Program</label>
              <input
                type="text"
                className="input-control"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g. Bachelor of Technology"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Academic Department</label>
              <input
                type="text"
                className="input-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Computer Science & Engineering"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Academic Year (1 to 8) *</label>
              <select
                className="input-control"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value, 10) })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
              {formErrors.year && (
                <span style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>{formErrors.year}</span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label">Verified Email (Read-Only)</label>
              <input
                type="text"
                className="input-control"
                value={profile?.email || ''}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* View Cards */
        <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
          {/* Card 1: Personal Information */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} style={{ color: 'var(--primary)' }} /> Personal Information
              </h3>
              <span className="badge badge-primary">Verified</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Legal Name</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {profile?.name}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                  {profile?.email}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contact Phone</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: profile?.phone ? 'var(--text-primary)' : 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                  {profile?.phone || 'No phone number on record (click Edit to add)'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Account Role & Scope</span>
                <div style={{ marginTop: '0.25rem' }}>
                  <span className="badge badge-success">
                    <ShieldCheck size={13} /> {profile?.role || 'STUDENT'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Academic Information */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={18} style={{ color: 'var(--secondary)' }} /> Academic Information
              </h3>
              <span className="badge badge-secondary">Registry</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Enrollment Number</span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                  {profile?.enrollment_number}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Enrolled Degree Program</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {profile?.course}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Academic Department</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building size={15} style={{ color: 'var(--text-muted)' }} />
                  {profile?.department}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Academic Standing & Progression</span>
                <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-primary">Year {profile?.year || 1}</span>
                  <span className="badge badge-neutral">Term Regular</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .responsive-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentProfile;
