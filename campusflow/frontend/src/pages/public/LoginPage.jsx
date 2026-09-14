import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserCheck,
  AlertCircle,
  Info
} from 'lucide-react';
import { api } from '../../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = location.state?.message;
  const redirectTarget = location.state?.from;

  const [email, setEmail] = useState('student@campusflow.edu');
  const [password, setPassword] = useState('Student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [errorAlert, setErrorAlert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickFill = (selectedRole) => {
    setRole(selectedRole);
    setErrorAlert('');
    if (selectedRole === 'student') {
      setEmail('student@campusflow.edu');
      setPassword('Student@123');
    } else {
      setEmail('admin@campusflow.edu');
      setPassword('Admin@123');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorAlert('');
    setIsSubmitting(true);

    try {
      const response = await api.auth.login({
        email: email.trim().toLowerCase(),
        password
      });

      if (response.ok && response.data?.status === 'ok') {
        const { token, user } = response.data.data;
        if (token) {
          localStorage.setItem('campusflow_token', token);
        }
        if (user) {
          localStorage.setItem('campusflow_user', JSON.stringify(user));
        }

        // Navigate based on redirect target or user role
        const defaultTarget = user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
        const destination = redirectTarget || defaultTarget;
        navigate(destination, { replace: true });
      } else {
        const message = response.data?.message || response.error || 'Invalid email or password.';
        
        // If PostgreSQL is not running yet (status 503), inform the user and provide fallback
        if (response.status === 503) {
          setErrorAlert(`${message} (To proceed without PostgreSQL, you can still explore with demo data).`);
          // Allow demo bypass if DB is unavailable
          setTimeout(() => {
            const defaultTarget = role === 'admin' || email.includes('admin') ? '/admin/dashboard' : '/student/dashboard';
            navigate(redirectTarget || defaultTarget, { replace: true });
          }, 2000);
        } else {
          setErrorAlert(message);
        }
      }
    } catch (err) {
      setErrorAlert(err.message || 'Login connection failed.');
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
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
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
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
        padding: '2.25rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Logo */}
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome to UniSphere</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Enter your credentials to access the Smart University Management Platform
          </p>
        </div>

        {/* Redirect Notice */}
        {redirectMessage && !errorAlert && (
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-subtle)',
            color: 'var(--primary)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '1.25rem',
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <Info size={18} style={{ flexShrink: 0 }} />
            <div>{redirectMessage}</div>
          </div>
        )}

        {/* Error Alert */}
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

        {/* Quick Demo Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          padding: '0.3rem',
          backgroundColor: 'var(--bg-canvas)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          <button
            type="button"
            onClick={() => handleQuickFill('student')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: role === 'student' ? 'var(--bg-surface)' : 'transparent',
              color: role === 'student' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: role === 'student' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <UserCheck size={14} /> Student Demo
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('admin')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              backgroundColor: role === 'admin' ? 'var(--bg-surface)' : 'transparent',
              color: role === 'admin' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: role === 'admin' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <ShieldCheck size={14} /> Admin Demo
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="input-group">
            <label className="input-label">University Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="input-control" 
                style={{ paddingLeft: '2.5rem' }} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="input-label">Password</label>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }}>
                Forgot?
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="input-control" 
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {isSubmitting ? 'Signing In...' : `Sign In as ${role === 'admin' ? 'Administrator' : 'Student'}`} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Don't have an enrolled account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Register Student
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>
            ← Back to UniSphere Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
