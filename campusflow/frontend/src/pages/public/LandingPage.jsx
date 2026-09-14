import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Layers, 
  Lock, 
  Users, 
  Globe,
  BookOpen,
  Award,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Top Navigation */}
      <nav style={{
        height: '74px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
              Uni<span style={{ color: 'var(--primary)' }}>Sphere</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '0.5rem 1rem' }}>
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1rem' }}>
            Register Student
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{
        position: 'relative',
        padding: '5.5rem 2rem 4rem 2rem',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        {/* Glow background orb */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-subtle)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: 'var(--primary)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '1.75rem'
          }}>
            <Sparkles size={16} />
            <span>UniSphere — Smart University Management Platform</span>
          </div>

          <h1 className="heading-xl" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', maxWidth: '950px', margin: '0 auto 1.5rem auto' }}>
            Student Management, <span className="gradient-text">Simplified.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            An enterprise-grade academic lifecycle platform. Track real-time GPA trends, monitor semester attendance, streamline grading, and empower administration with effortless student registry operations.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/student/dashboard" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              Launch Student Command Center <ArrowRight size={18} />
            </Link>
            <Link to="/admin/dashboard" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--primary)' }} /> Explore Admin Console
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Graphic */}
        <div style={{
          marginTop: '4rem',
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-strong)',
          background: 'var(--bg-surface)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></span>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }}></span>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}></span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)' }}>
              https://unisphere.internal/student/dashboard
            </span>
          </div>

          <div className="grid-cols-4" style={{ textAlign: 'left' }}>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cumulative CGPA</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>3.84 / 4.0</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>↑ +0.06 this term</span>
            </div>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class Attendance</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>92.4%</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Minimum threshold 75%</span>
            </div>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Courses</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.25rem' }}>6 Courses</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Semester 5 B.Tech</span>
            </div>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Degree Progress</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple)', marginTop: '0.25rem' }}>84 / 120 Cr</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>70% completed</span>
            </div>
          </div>
        </div>
      </header>

      {/* Core Features Grid */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Next-Gen Capabilities</span>
          <h2 className="heading-lg" style={{ fontSize: '2.2rem' }}>Engineered for Academic Excellence</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Built specifically to eliminate administrative friction and provide students with a crystal-clear roadmap of their academic journey.
          </p>
        </div>

        <div className="grid-cols-3">
          <div className="card card-hover">
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <BarChart3 size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Interactive Performance Tracking</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Visual trajectory charts that map semester GPA milestones, credit completion curves, and honors standing criteria.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--secondary-glow)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Institutional Registry Management</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Robust admin controls for searching, filtering, enrolling, modifying, and managing students across every department.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--success-subtle)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Cloud-Ready 3-Tier Foundation</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Structured following modern cloud design principles, ready for AWS VPC, EC2, RDS PostgreSQL, and S3 scaling.
            </p>
          </div>
        </div>
      </section>

      {/* Academic Tracking Section */}
      <section style={{ padding: '4rem 2rem', background: 'var(--bg-canvas)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Academic Tracking</span>
            <h2 className="heading-lg" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Every Grade, Subject, & Requirement in Real-Time
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Never miss an attendance cutoff or grade release. UniSphere keeps continuous tabs on faculty lectures, mid-term evaluations, and official transcripts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Detailed breakdown of Internal, Midterm & End-term marks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Per-subject attendance health alarms before 75% thresholds</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Digitally verifiable official transcripts ready for export</span>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/student/academics" className="btn btn-secondary">
                View Academic Syllabus & Credits <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: '2rem', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 700 }}>CS-301 Database Systems</span>
              <span className="badge badge-success">94.2% Attendance</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--bg-canvas)', borderRadius: 4, overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ width: '94.2%', height: '100%', background: 'var(--success)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 700 }}>CS-302 Cloud & Distributed Systems</span>
              <span className="badge badge-primary">91.4% Attendance</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--bg-canvas)', borderRadius: 4, overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ width: '91.4%', height: '100%', background: 'var(--primary)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontWeight: 700 }}>CS-304 Software Engineering</span>
              <span className="badge badge-success">96.0% Attendance</span>
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--bg-canvas)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '96%', height: '100%', background: 'var(--success)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Admin Management Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div className="card" style={{ padding: '2rem', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h4 style={{ fontWeight: 800 }}>Student Registry Activity</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1,420 Active Academic Records</span>
              </div>
              <span className="badge badge-primary">Admin Access</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-canvas)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Sophia Martinez (21CS018)</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Computer Science • Sem 5</div>
                </div>
                <span className="badge badge-success">3.92 CGPA</span>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-canvas)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Liam Chen (22EE009)</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Electrical Eng • Sem 3</div>
                </div>
                <span className="badge badge-primary">3.65 CGPA</span>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-canvas)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Zoe Nakamura (23DS048)</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Data Science • Sem 1</div>
                </div>
                <span className="badge badge-success">3.95 CGPA</span>
              </div>
            </div>
          </div>

          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Administrative Controls</span>
            <h2 className="heading-lg" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Powerful Management for Department Heads & Registrars
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Instantly filter students by department, view full academic records, register incoming candidates, update enrollment status, and maintain compliant records.
            </p>
            <Link to="/admin/students" className="btn btn-primary">
              Launch Student Directory <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        padding: '5rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, var(--bg-app) 0%, var(--bg-canvas) 100%)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 className="heading-lg" style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
            Ready to Take Command of Your Academic Lifecycle?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Explore the live prototype now. Tested with sample data and ready for full cloud deployment in upcoming phases.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/student/dashboard" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
              Get Started with Student Portal
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 2rem' }}>
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2.5rem 2rem',
        backgroundColor: 'var(--bg-surface)',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <GraduationCap size={18} />
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>UniSphere</span>
            <span>— Smart University Management Platform</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/student/dashboard" style={{ color: 'var(--text-muted)' }}>Student Hub</Link>
            <Link to="/admin/dashboard" style={{ color: 'var(--text-muted)' }}>Admin Hub</Link>
            <Link to="/login" style={{ color: 'var(--text-muted)' }}>Sign In</Link>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--primary)' }}>
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
