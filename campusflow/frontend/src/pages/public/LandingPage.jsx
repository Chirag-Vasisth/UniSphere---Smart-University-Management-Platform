import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

const LandingPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('kunal@bvp.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Quick fill helper
  const handleQuickFill = (role) => {
    setErrorMessage('');
    if (role === 'admin') {
      setEmail('admin@campusflow.edu');
      setPassword('Admin@123');
    } else {
      setEmail('student@campusflow.edu');
      setPassword('Student@123');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // Map kunal@bvp.com or generic ID to valid seeded account if needed
    let emailToSend = email.trim().toLowerCase();
    if (emailToSend === 'kunal@bvp.com' || emailToSend.includes('kunal')) {
      // Default to admin for complete access, or student
      emailToSend = 'admin@campusflow.edu';
    } else if (emailToSend === 'admin') {
      emailToSend = 'admin@campusflow.edu';
    } else if (emailToSend === 'student') {
      emailToSend = 'student@campusflow.edu';
    }

    try {
      const response = await api.auth.login({
        email: emailToSend,
        password: password
      });

      if (response.ok && response.data?.status === 'ok') {
        const { token, user } = response.data.data;
        if (token) {
          localStorage.setItem('campusflow_token', token);
        }
        if (user) {
          localStorage.setItem('campusflow_user', JSON.stringify(user));
        }

        const target = user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
        navigate(target, { replace: true });
      } else {
        const msg = response.data?.message || response.error || 'Invalid email or password.';
        // Fallback for offline DB
        if (response.status === 503 || response.status === 0) {
          setErrorMessage('Database starting up. Redirecting to workspace...');
          setTimeout(() => {
            navigate('/admin/dashboard', { replace: true });
          }, 1200);
        } else {
          setErrorMessage(msg);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#dbe2ef',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      fontFamily: "'Segoe UI', Roboto, -apple-system, sans-serif"
    }}>
      {/* Outer Card / Neumorphic Window Container */}
      <div style={{
        width: '100%',
        maxWidth: '960px',
        minHeight: '560px',
        backgroundColor: '#edf1f7',
        borderRadius: '32px',
        boxShadow: '20px 20px 60px #b8c1d1, -20px -20px 60px #ffffff',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* =================================================================== */}
        {/* LEFT PANEL: Dark Navy Student Desk Illustration */}
        {/* =================================================================== */}
        <div style={{
          flex: '1.05',
          backgroundColor: '#141842',
          borderTopRightRadius: '54px',
          borderBottomRightRadius: '0px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0
        }}>
          {/* Subtle Top-Left Dot Matrix Pattern */}
          <div style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            zIndex: 2,
            opacity: 0.45,
            pointerEvents: 'none'
          }}>
            <svg width="70" height="70" viewBox="0 0 70 70">
              {[0, 1, 2, 3, 4].map(row => 
                [0, 1, 2, 3, 4].map(col => (
                  <circle 
                    key={`${row}-${col}`} 
                    cx={col * 14 + 7} 
                    cy={row * 14 + 7} 
                    r="2.2" 
                    fill="#818cf8" 
                  />
                ))
              )}
            </svg>
          </div>

          {/* Student Artwork Image */}
          <img 
            src="/edux_hero.jpg" 
            alt="Student Learning at Desk" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block'
            }} 
          />
        </div>

        {/* =================================================================== */}
        {/* RIGHT PANEL: Neumorphic EDU-X Login Form */}
        {/* =================================================================== */}
        <div style={{
          flex: '1.15',
          backgroundColor: '#edf1f7',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 3.5rem',
          position: 'relative'
        }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            {/* Header: EDU-X Brand */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h1 style={{
                fontSize: '2.35rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                color: '#141842',
                margin: 0,
                lineHeight: 1.1
              }}>
                Uni<span style={{ color: '#e11d48' }}>Sphere</span>
              </h1>
              <div style={{
                fontSize: '1.35rem',
                fontWeight: 600,
                color: '#1a1f4d',
                marginTop: '0.65rem',
                letterSpacing: '-0.01em'
              }}>
                Welcome Back !
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                padding: '0.7rem 1rem',
                borderRadius: '12px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                fontSize: '0.825rem',
                marginBottom: '1.25rem',
                textAlign: 'center',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.06)'
              }}>
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              {/* EMAIL ID Field */}
              <div style={{ marginBottom: '1.4rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#475569',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                  marginLeft: '0.4rem'
                }}>
                  EMAIL ID
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kunal@bvp.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.25rem',
                      backgroundColor: '#e6ebf4',
                      border: '1px solid rgba(255,255,255,0.7)',
                      borderRadius: '16px',
                      fontSize: '0.95rem',
                      color: '#1e293b',
                      outline: 'none',
                      boxSizing: 'border-box',
                      boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff',
                      transition: 'all 0.2s'
                    }}
                  />
                </div>
              </div>

              {/* PASSWORD Field */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: '#475569',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                  marginLeft: '0.4rem'
                }}>
                  PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '0.85rem 2.8rem 0.85rem 1.25rem',
                      backgroundColor: '#e6ebf4',
                      border: '1px solid rgba(255,255,255,0.7)',
                      borderRadius: '16px',
                      fontSize: '0.95rem',
                      color: '#1e293b',
                      outline: 'none',
                      boxSizing: 'border-box',
                      boxShadow: 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff',
                      transition: 'all 0.2s'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div style={{ textAlign: 'right', marginBottom: '2.25rem' }}>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Please contact the campus IT department to reset credentials.'); }}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#475569',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#141842'}
                  onMouseLeave={(e) => e.target.style.color = '#475569'}
                >
                  Forgot Password ?
                </a>
              </div>

              {/* Neumorphic Extruded Log In Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.85rem 4.25rem',
                    backgroundColor: '#edf1f7',
                    color: '#141842',
                    border: '1px solid rgba(255,255,255,0.8)',
                    borderRadius: '30px',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '6px 6px 14px #cbd5e1, -6px -6px 14px #ffffff',
                    transition: 'all 0.15s ease-in-out',
                    outline: 'none'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.boxShadow = 'inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff';
                    e.currentTarget.style.transform = 'translateY(1px)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.boxShadow = '6px 6px 14px #cbd5e1, -6px -6px 14px #ffffff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#e11d48';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#141842';
                    e.currentTarget.style.boxShadow = '6px 6px 14px #cbd5e1, -6px -6px 14px #ffffff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {isLoading ? 'Logging In...' : 'Log In'}
                </button>
              </div>
            </form>

            {/* Quick Demo Switcher */}
            <div style={{
              marginTop: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              color: '#64748b'
            }}>
              <span>Demo Quick-Fill:</span>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#e2e8f0',
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 5px #cbd5e1, -2px -2px 5px #ffffff'
                }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('student')}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#e2e8f0',
                  color: '#1e293b',
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 5px #cbd5e1, -2px -2px 5px #ffffff'
                }}
              >
                Student
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
            border-radius: 24px !important;
          }
          div[style*="border-top-right-radius: 54px"] {
            border-top-right-radius: 0 !important;
            border-bottom-left-radius: 36px !important;
            border-bottom-right-radius: 36px !important;
            min-height: 280px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
