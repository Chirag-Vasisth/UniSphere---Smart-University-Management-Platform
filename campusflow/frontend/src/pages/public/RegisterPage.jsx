import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  ArrowRight, 
  User, 
  Mail, 
  Lock, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT', // Strictly locked to STUDENT
    department: 'Computer Science & Engineering',
    year: '1'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorAlert, setErrorAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorAlert('');

    // 1. Client-side validations
    if (!formData.name.trim()) {
      setErrorAlert('Full Name cannot be empty.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorAlert('Please provide a valid institutional email address.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorAlert('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorAlert('Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.auth.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        course: 'Bachelor of Technology',
        department: formData.department,
        year: parseInt(formData.year, 10)
      });

      if (response.ok && response.data?.status === 'ok') {
        const { token, user } = response.data.data;
        if (token) {
          localStorage.setItem('campusflow_token', token);
        }
        if (user) {
          localStorage.setItem('campusflow_user', JSON.stringify(user));
        }

        setRegisteredSuccess(true);
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 1500);
      } else {
        // Show server-side validation or uniqueness error
        const errorMessage = response.data?.message || response.error || 'Registration failed. Please try again.';
        setErrorAlert(errorMessage);
      }
    } catch (err) {
      setErrorAlert(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-app)',
      padding: '2.5rem 1rem',
      position: 'relative'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="card" style={{
        width: '100%',
        maxWidth: '520px',
        position: 'relative',
        zIndex: 1,
        padding: '2.25rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            margin: '0 auto 0.75rem auto',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}>
            <GraduationCap size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create Student Account</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Register your profile for automated academic tracking & grades
          </p>
        </div>

        {/* Error Alert Box */}
        {errorAlert && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-subtle)',
            color: 'var(--danger)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            marginBottom: '1.25rem',
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{errorAlert}</div>
          </div>
        )}

        {registeredSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle size={56} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Account Registered Successfully!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Your profile is created. Redirecting directly to your Student Dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Full Name */}
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-control" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Alex Rivera"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              <label className="input-label">Institutional Email *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  className="input-control" 
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@campusflow.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="grid-cols-2">
              <div className="input-group">
                <label className="input-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="input-control" 
                    style={{ paddingLeft: '2.4rem', paddingRight: '2.2rem' }}
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    className="input-control" 
                    style={{ paddingLeft: '2.4rem', paddingRight: '2.2rem' }}
                    placeholder="Re-type password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Role (Locked to STUDENT per project requirements) */}
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label">Account Role</label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Locked for public registration</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.9rem',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>STUDENT</span>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                  Student Only
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                * Administrative (ADMIN) credentials are pre-provisioned and cannot be self-registered.
              </span>
            </div>

            {/* Department & Year (for student profile creation) */}
            <div className="grid-cols-2">
              <div className="input-group">
                <label className="input-label">Department</label>
                <select 
                  className="input-control"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Computer Science & Engineering">Computer Science & Eng</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Business Analytics">Business Analytics</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Academic Year</label>
                <select 
                  className="input-control"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  <option value="1">Year 1 (Freshman)</option>
                  <option value="2">Year 2 (Sophomore)</option>
                  <option value="3">Year 3 (Junior)</option>
                  <option value="4">Year 4 (Senior)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {isSubmitting ? 'Registering Account...' : 'Register as Student'} <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Already have an enrolled account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In Here
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>
            ← Back to UniSphere Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
