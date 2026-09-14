import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Settings, 
  LogOut,
  ShieldCheck, 
  Users, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isAdmin = location.pathname.startsWith('/admin');
  const user = api.auth.getUser();

  const studentNavItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/student/profile', icon: User },
    { label: 'Academics', path: '/student/academics', icon: GraduationCap },
    { label: 'Subjects', path: '/student/subjects', icon: BookOpen },
    { label: 'Results', path: '/student/results', icon: Award },
    { label: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: ShieldCheck },
    { label: 'Student Directory', path: '/admin/students', icon: Users },
  ];

  const handleLogout = () => {
    if (onClose) onClose();
    api.auth.logout();
    showToast('You have been signed out successfully.', 'info');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'CF';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4, 7, 13, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 45
          }}
          className="mobile-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'var(--bg-canvas)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          transition: 'transform var(--transition-normal)'
        }}
      >
        {/* Top Logo Section */}
        <div style={{
          height: 'var(--navbar-height)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '0.75rem'
        }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px var(--primary-glow)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Uni<span style={{ color: 'var(--primary)' }}>Sphere</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Productivity Hub
            </div>
          </div>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main Navigation (Student or Admin) */}
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 0.75rem 0.6rem 0.75rem', letterSpacing: '0.08em' }}>
              {isAdmin ? 'Administrative Control' : 'Academic Hub'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {(isAdmin ? adminNavItems : studentNavItems).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              {/* Explicit Logout Option in Menu */}
              <button
                onClick={handleLogout}
                className="sidebar-link"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  color: 'var(--danger)',
                  marginTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.75rem'
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Quick Portal Switcher */}
          <div style={{ marginTop: 'auto', padding: '0 0.25rem' }}>
            <div style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Mode Switcher
              </div>
              {isAdmin ? (
                <NavLink
                  to="/student/dashboard"
                  onClick={onClose}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                >
                  Switch to Student View
                </NavLink>
              ) : (
                <NavLink
                  to="/admin/dashboard"
                  onClick={onClose}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                >
                  Switch to Admin Console
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Student / Admin Identity Card */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: isAdmin 
                  ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' 
                  : 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.825rem',
                flexShrink: 0
              }}>
                {getInitials(user?.name || (isAdmin ? 'Admin' : 'Student'))}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.name || (isAdmin ? 'Admin Superuser' : 'Enrolled Student')}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.email || (isAdmin ? 'admin@campusflow.edu' : 'student@campusflow.edu')}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn-icon"
              style={{ width: 30, height: 30, color: 'var(--text-muted)' }}
              title="Logout of UniSphere"
              aria-label="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .sidebar-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface-hover);
        }

        .sidebar-link.active {
          color: #ffffff;
          background: linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%);
          font-weight: 600;
          box-shadow: 0 4px 14px var(--primary-glow);
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.sidebar-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
