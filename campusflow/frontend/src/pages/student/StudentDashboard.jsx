import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  UserCheck, 
  ChevronRight, 
  FileText, 
  AlertCircle,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import PerformanceChart from '../../components/common/PerformanceChart';
import SubjectCard from '../../components/common/SubjectCard';
import TranscriptModal from '../../components/common/TranscriptModal';
import { SkeletonCard, SkeletonChart } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { calculateAcademicStats, calculateProfileCompletion, getGradeInfo } from '../../utils/gradeCalculator';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, marksRes] = await Promise.all([
          api.profile.get(),
          api.marks.getMyMarks()
        ]);

        if (isMounted) {
          if (profileRes.ok && profileRes.data) {
            setProfile(profileRes.data?.data || profileRes.data);
          }
          if (marksRes.ok && Array.isArray(marksRes.data)) {
            setMarks(marksRes.data);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching dashboard data:', err);
          setError('Unable to load dynamic dashboard records.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Compute live dynamic statistics
  const dynamicStats = calculateAcademicStats(marks);
  const completion = calculateProfileCompletion(profile);
  const studentName = profile?.name || api.auth.getUser()?.name || 'Student';

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent Term';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recent Term';
    }
  };

  return (
    <div className="page-wrapper">
      {/* Welcome Section */}
      <div 
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.06) 100%)',
          border: '1px solid var(--border-strong)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 className="heading-lg" style={{ margin: 0 }}>
              {getGreeting()}, {studentName} 👋
            </h1>
            <span className="badge badge-success">Enrolled</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Here's your academic overview.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            <span>Course: <strong style={{ color: 'var(--text-primary)' }}>{profile?.course || 'Undergraduate Degree'}</strong></span>
            <span>•</span>
            <span>Department: <strong style={{ color: 'var(--text-primary)' }}>{profile?.department || 'Academic Division'}</strong></span>
            <span>•</span>
            <span>Year: <strong style={{ color: 'var(--text-primary)' }}>{profile?.year ? `Year ${profile.year}` : 'Active'}</strong></span>
          </div>
        </div>

        {/* Profile Completion Widget Card */}
        <div 
          style={{
            zIndex: 1,
            minWidth: '240px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Profile Completion
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              {loading ? '...' : `${completion.percentage}%`}
            </span>
          </div>
          <div style={{ width: '100%', height: 7, borderRadius: 'var(--radius-full)', background: 'var(--bg-canvas)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div 
              style={{ 
                width: `${completion.percentage}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)', 
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.8s ease'
              }} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              {completion.filledCount} of {completion.totalCount} fields filled
            </span>
            <Link to="/student/profile" style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              Edit Profile <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--danger-subtle)',
          color: 'var(--danger)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          marginBottom: '1.75rem',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Top 4 Dynamic Statistic Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <StatCard
          loading={loading}
          title="Average Marks"
          value={marks.length > 0 ? `${dynamicStats.averageMarks} / 100` : '0 / 100'}
          subtitle={`Across ${marks.length} evaluated subjects`}
          trend={marks.length > 0 ? `CGPA: ${dynamicStats.cgpa} / 10` : 'No marks yet'}
          trendPositive={dynamicStats.averageMarks >= 70}
          icon={Award}
          color="primary"
        />

        <StatCard
          loading={loading}
          title="Total Subjects"
          value={loading ? '...' : `${dynamicStats.totalSubjects} Evaluated`}
          subtitle="Registered Course Registry"
          trend="Semester Exams"
          trendPositive={true}
          icon={BookOpen}
          color="secondary"
        />

        <StatCard
          loading={loading}
          title="Highest Marks"
          value={marks.length > 0 ? `${dynamicStats.highestMarks} / 100` : 'N/A'}
          subtitle={marks.length > 0 ? 'Peak evaluation score' : 'Awaiting evaluations'}
          trend={marks.length > 0 ? 'Peak Performance' : undefined}
          trendPositive={true}
          icon={TrendingUp}
          color="success"
        />

        <StatCard
          loading={loading}
          title="Profile Completion"
          value={loading ? '...' : `${completion.percentage}%`}
          subtitle={`${completion.filledCount} of ${completion.totalCount} attributes verified`}
          trend={completion.percentage === 100 ? 'Verified Profile' : 'Pending Details'}
          trendPositive={completion.percentage >= 80}
          icon={UserCheck}
          color="purple"
          progress={completion.percentage}
        />
      </div>

      {/* Main Grid: Academic Performance Chart & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem', marginBottom: '2rem' }} className="responsive-chart-grid">
        {/* Left: Interactive Performance Chart */}
        <div>
          {loading ? (
            <SkeletonChart />
          ) : (
            <PerformanceChart marks={marks} />
          )}
        </div>

        {/* Right: Quick Actions & Academic Standing Note */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>Quick Actions</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0' }}>
              Common student workflows and self-service tools
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => setShowTranscript(true)}
                className="btn btn-secondary" 
                style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem', width: '100%' }}
              >
                <FileText size={17} style={{ color: 'var(--primary)' }} />
                <span>View & Export Transcript</span>
              </button>

              <Link 
                to="/student/results" 
                className="btn btn-secondary" 
                style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
              >
                <Award size={17} style={{ color: 'var(--secondary)' }} />
                <span>Complete Grade Registry</span>
              </Link>

              <Link 
                to="/student/profile" 
                className="btn btn-secondary" 
                style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
              >
                <UserCheck size={17} style={{ color: 'var(--success)' }} />
                <span>Edit Profile & Phone Details</span>
              </Link>

              <Link 
                to="/student/subjects" 
                className="btn btn-secondary" 
                style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
              >
                <BookOpen size={17} style={{ color: 'var(--purple)' }} />
                <span>Browse All Subjects</span>
              </Link>
            </div>
          </div>

          {/* Institutional Standing Card */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-canvas)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.25rem' }}>
              <CheckCircle2 size={16} /> Verified Institutional Record
            </div>
            <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
              All scores and profile attributes are synchronized in real-time with the PostgreSQL 3-tier backend database.
            </p>
          </div>
        </div>
      </div>

      {/* Subject Performance Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Subject Performance</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Official evaluation metrics, score benchmarks, and letter grades
            </p>
          </div>
          <Link to="/student/subjects" className="btn btn-secondary btn-sm">
            View All Subjects <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : marks.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Subject Performance Records"
            description="No academic marks have been recorded for your profile yet. Once faculty members publish exam scores, they will appear here."
          />
        ) : (
          <div className="grid-cols-3" style={{ gap: '1.25rem' }}>
            {marks.map((m) => (
              <SubjectCard
                key={m.id}
                subject={m.subject}
                marksObtained={m.marks_obtained}
                maximumMarks={m.maximum_marks || 100}
                semester={m.semester || 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Results Section */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Recent Results</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Latest evaluated examination scores and automated letter grades
            </p>
          </div>
          <Link to="/student/results" className="btn btn-secondary btn-sm">
            Full Results <ChevronRight size={14} />
          </Link>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Semester</th>
                <th>Marks Obtained</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Evaluated Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Loading recent examination records...
                  </td>
                </tr>
              ) : marks.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No results available yet.
                  </td>
                </tr>
              ) : (
                marks.slice(0, 5).map((mark) => {
                  const gradeInfo = getGradeInfo(mark.marks_obtained, mark.maximum_marks || 100);
                  const percentage = (((mark.marks_obtained || 0) / (mark.maximum_marks || 100)) * 100).toFixed(1);
                  return (
                    <tr key={mark.id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {mark.subject}
                      </td>
                      <td>
                        <span className="badge badge-neutral">Sem {mark.semester || 1}</span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                        {mark.marks_obtained} / {mark.maximum_marks || 100}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {percentage}%
                      </td>
                      <td>
                        <span className={`badge ${gradeInfo.badgeClass}`}>
                          {gradeInfo.grade}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: gradeInfo.status === 'Fail' ? 'var(--danger)' : 'var(--text-secondary)' }}>
                          {gradeInfo.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatDate(mark.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Transcript Modal */}
      <TranscriptModal 
        isOpen={showTranscript} 
        onClose={() => setShowTranscript(false)} 
      />

      <style>{`
        @media (max-width: 1024px) {
          .responsive-chart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
