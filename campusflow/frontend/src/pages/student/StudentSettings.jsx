import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Bell, 
  Lock, 
  ShieldCheck, 
  Check, 
  Key,
  Smartphone
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const StudentSettings = () => {
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState({
    gradeAlerts: true,
    attendanceReminders: true,
    examSchedules: true,
    smsAlerts: false
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setFeedbackMessage('New passwords do not match.');
      return;
    }
    setFeedbackMessage('Password updated successfully!');
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  return (
    <div className="page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-lg">Account Preferences & Theme Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Customize interface appearance, notifications, and credential security
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
        {/* Appearance & Theme Selector */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Interface Theme
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Choose how UniSphere looks to you. Your preference is automatically stored in localStorage.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => { if (theme !== 'dark') toggleTheme(); }}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#090d16',
                border: `2px solid ${theme === 'dark' ? 'var(--primary)' : 'var(--border-subtle)'}`,
                color: '#ffffff',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: theme === 'dark' ? '0 0 16px var(--primary-glow)' : 'none'
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Moon size={20} style={{ color: '#818cf8' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Obsidian Dark</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>High-contrast SaaS dark theme</div>
              </div>
              {theme === 'dark' && (
                <Check size={18} style={{ marginLeft: 'auto', color: 'var(--primary)' }} />
              )}
            </button>

            <button
              type="button"
              onClick={() => { if (theme !== 'light') toggleTheme(); }}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: '#f8fafc',
                border: `2px solid ${theme === 'light' ? 'var(--primary)' : 'var(--border-strong)'}`,
                color: '#0f172a',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: theme === 'light' ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none'
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sun size={20} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Daylight Light</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Clean modern light palette</div>
              </div>
              {theme === 'light' && (
                <Check size={18} style={{ marginLeft: 'auto', color: 'var(--primary)' }} />
              )}
            </button>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={18} style={{ color: 'var(--primary)' }} /> Notification Settings
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Manage communication alerts for your academic status
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { id: 'gradeAlerts', label: 'Grade & Marks Publishing', desc: 'Instant email alert when a professor submits semester assessment results' },
              { id: 'attendanceReminders', label: 'Attendance Threshold Alarms', desc: 'Notice when attendance in any subject drops close to 75%' },
              { id: 'examSchedules', label: 'Official Examination Schedules', desc: 'Timetables and hall ticket availability notices' },
              { id: 'smsAlerts', label: 'SMS High-Priority Broadcasts', desc: 'Urgent university notices and emergency campus status' }
            ].map((item) => (
              <label 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications[item.id]} 
                  onChange={(e) => setNotifications({ ...notifications, [item.id]: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Change Password Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} style={{ color: 'var(--primary)' }} /> Update Security Credentials
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Change your account password. Will be persisted to PostgreSQL in Step 2.
          </p>

          {feedbackMessage && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: feedbackMessage.includes('match') ? 'var(--danger-subtle)' : 'var(--success-subtle)',
              color: feedbackMessage.includes('match') ? 'var(--danger)' : 'var(--success)',
              marginBottom: '1rem',
              fontSize: '0.85rem'
            }}>
              {feedbackMessage}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Current Password</label>
              <input 
                type="password" 
                className="input-control" 
                value={passwordState.currentPassword}
                onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                required 
              />
            </div>

            <div className="grid-cols-2">
              <div className="input-group">
                <label className="input-label">New Password</label>
                <input 
                  type="password" 
                  className="input-control" 
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  required 
                  minLength={8}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Confirm New Password</label>
                <input 
                  type="password" 
                  className="input-control" 
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentSettings;
