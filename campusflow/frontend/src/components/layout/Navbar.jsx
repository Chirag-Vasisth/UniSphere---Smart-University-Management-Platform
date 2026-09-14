import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Search, 
  Bell, 
  Menu, 
  X, 
  GraduationCap, 
  ShieldCheck, 
  Activity,
  ArrowRightLeft,
  ChevronDown,
  User, 
  LogOut, 
  LogIn,
  Settings, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

const Navbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [apiOnline, setApiOnline] = useState(false);
  const [checkingApi, setCheckingApi] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Academic Results Published', desc: 'Semester examination evaluations recorded.', time: '10m ago', unread: true },
    { id: 2, title: 'Institutional Standing Verified', desc: 'Active enrollment standing confirmed in PostgreSQL.', time: '1h ago', unread: false }
  ]);

  const isAdmin = location.pathname.startsWith('/admin');
  const user = api.auth.getUser();

  // Test health of backend
  useEffect(() => {
    let isMounted = true;
    const testHealth = async () => {
      try {
        const res = await api.checkHealth();
        if (isMounted) {
          setApiOnline(res.ok && res.data?.status === 'ok');
          setCheckingApi(false);
        }
      } catch {
        if (isMounted) {
          setApiOnline(false);
          setCheckingApi(false);
        }
      }
    };

    testHealth();
    const interval = setInterval(testHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    setShowUserMenu(false);
    api.auth.logout();
    showToast('Signed out of UniSphere.', 'info');
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    if (isAdmin) {
      navigate(`/admin/students?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate(`/student/subjects?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'CF';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header style={{
      height: 'var(--navbar-height)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      width: '100%'
    }}>
      {/* Left: Mobile Drawer Trigger + Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <button 
          onClick={onToggleSidebar}
          className="btn-icon"
          aria-label="Toggle navigation menu"
          style={{ display: 'flex' }}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px var(--primary-glow)'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Uni<span style={{ color: 'var(--primary)' }}>Sphere</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isAdmin ? 'Admin Console' : 'Student Portal'}
            </div>
          </div>
        </Link>
      </div>

      {/* Center: Search & Live Backend Health Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Backend Status Indicator */}
        <div 
          title={apiOnline ? 'PostgreSQL backend is connected & healthy' : 'Backend is connecting...'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.72rem',
            fontWeight: 700
          }}
        >
          <span className={`pulse-dot ${apiOnline ? 'online' : 'offline'}`} />
          <span style={{ color: apiOnline ? 'var(--success)' : 'var(--danger)' }}>
            {checkingApi ? 'Connecting...' : apiOnline ? 'Backend: Online' : 'Backend: Offline'}
          </span>
        </div>

        {/* Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="desktop-search" style={{ display: 'none', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder={isAdmin ? "Search students or enrollment..." : "Search subjects, marks, records..."}
            className="input-control"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            style={{
              paddingLeft: '2.4rem',
              paddingRight: '3.2rem',
              width: '280px',
              height: '36px',
              fontSize: '0.8125rem'
            }}
          />
          <span style={{
            position: 'absolute',
            right: '0.65rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '0.1rem 0.35rem',
            borderRadius: '4px',
            backgroundColor: 'var(--bg-surface-active)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            ↵
          </span>
        </form>
      </div>

      {/* Right: Theme Toggle, Notifications, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme}
          className="btn-icon"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun size={18} style={{ color: '#fbbf24' }} />
          ) : (
            <Moon size={18} style={{ color: '#6366f1' }} />
          )}
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="btn-icon" 
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--primary)'
              }} />
            )}
          </button>

          {showNotifications && (
            <div 
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '320px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '1rem',
                zIndex: 60,
                animation: 'modalSlideUp 0.2s ease-out'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Notifications</span>
                {unreadCount > 0 && (
                  <span className="badge badge-primary">{unreadCount} New</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {notifications.map((n) => (
                  <div 
                    key={n.id}
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      background: n.unread ? 'var(--primary-subtle)' : 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {n.desc}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                  setShowNotifications(false);
                }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.75rem' }}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>

        {/* User Profile Dropdown or Sign In */}
        {user && api.auth.getToken() ? (
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
              aria-label="User account menu"
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isAdmin 
                  ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' 
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.8rem'
              }}>
                {getInitials(user?.name || (isAdmin ? 'Admin' : 'Student'))}
              </div>
              <div style={{ textAlign: 'left', display: 'none' }} className="desktop-username">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.2 }}>
                  {user?.name || (isAdmin ? 'Administrator' : 'Student')}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {user?.role === 'ADMIN' ? 'System Superuser' : 'Enrolled Student'}
                </div>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {showUserMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '220px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                zIndex: 60,
                animation: 'modalSlideUp 0.2s ease-out'
              }}>
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{user?.name || 'UniSphere User'}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.email || 'user@campusflow.edu'}
                  </div>
                </div>

                {!isAdmin && (
                  <Link 
                    to="/student/profile" 
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.825rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    className="card-hover"
                  >
                    <User size={15} /> My Profile
                  </Link>
                )}

                <Link 
                  to="/student/settings" 
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.825rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  className="card-hover"
                >
                  <Settings size={15} /> Preferences
                </Link>

                <div style={{ height: 1, backgroundColor: 'var(--border-subtle)', margin: '0.35rem 0' }} />

                <button 
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.825rem',
                    color: 'var(--danger)',
                    borderRadius: 'var(--radius-sm)',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  className="card-hover"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-primary"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.8125rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              fontWeight: 700
            }}
          >
            <LogIn size={15} /> Sign In
          </Link>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-search { display: flex !important; }
          .desktop-username { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
