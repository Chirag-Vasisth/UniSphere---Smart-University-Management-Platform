import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Download, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Printer,
  AlertCircle,
  BarChart2,
  TrendingUp,
  TrendingDown,
  BookOpen,
  PieChart,
  Search
} from 'lucide-react';
import TranscriptModal from '../../components/common/TranscriptModal';
import { SkeletonCard, SkeletonTable } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { getGradeInfo, calculateAcademicStats } from '../../utils/gradeCalculator';

const StudentResults = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchMarks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.marks.getMyMarks();
        if (isMounted) {
          if (res.ok) {
            setMarks(Array.isArray(res.data) ? res.data : []);
          } else {
            setError(res.data?.message || res.error || 'Failed to retrieve academic marks.');
          }
        }
      } catch (err) {
        if (isMounted) setError('Error connecting to marks service.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMarks();
    return () => { isMounted = false; };
  }, []);

  const stats = calculateAcademicStats(marks);

  // Filter marks
  const filteredMarks = marks.filter((m) => {
    const matchesSem = selectedSemester === 'All' || m.semester?.toString() === selectedSemester;
    const matchesSearch = !searchQuery.trim() || m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSem && matchesSearch;
  });

  // Unique semesters present in data
  const semesters = ['All', ...new Set(marks.map(m => (m.semester || 1).toString()))].sort();

  // Calculate authentic grade distribution from backend data
  const gradeDistribution = {
    'A+': 0,
    'A': 0,
    'B': 0,
    'C': 0,
    'D': 0,
    'F': 0
  };

  marks.forEach((m) => {
    const info = getGradeInfo(m.marks_obtained, m.maximum_marks || 100);
    if (gradeDistribution[info.grade] !== undefined) {
      gradeDistribution[info.grade]++;
    }
  });

  // Identify subject with highest and lowest score
  let highestSubject = 'N/A';
  let lowestSubject = 'N/A';
  if (marks.length > 0) {
    const sorted = [...marks].sort((a, b) => parseFloat(b.marks_obtained || 0) - parseFloat(a.marks_obtained || 0));
    highestSubject = sorted[0].subject;
    lowestSubject = sorted[sorted.length - 1].subject;
  }

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="heading-lg" style={{ margin: 0 }}>Academic Marks & Grade Registry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Official examination scores, automated letter grades, and dynamic aggregate statistics
          </p>
        </div>

        <button 
          onClick={() => setShowTranscriptModal(true)}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <FileText size={16} /> Official Transcript Preview
        </button>
      </div>

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
          gap: '0.5rem'
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Dynamic Summary Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <BarChart2 size={15} style={{ color: 'var(--primary)' }} /> Overall Average
          </span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
            {loading ? '...' : `${stats.averageMarks} / 100`}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Aggregate across all semester terms
          </span>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <TrendingUp size={15} style={{ color: 'var(--success)' }} /> Highest Score
          </span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
            {loading ? '...' : (marks.length > 0 ? `${stats.highestMarks} / 100` : 'N/A')}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {highestSubject}
          </span>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <TrendingDown size={15} style={{ color: 'var(--warning)' }} /> Lowest Score
          </span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
            {loading ? '...' : (marks.length > 0 ? `${stats.lowestMarks} / 100` : 'N/A')}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {lowestSubject}
          </span>
        </div>

        <div className="card">
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <BookOpen size={15} style={{ color: 'var(--secondary)' }} /> Total Subjects
          </span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
            {loading ? '...' : stats.totalSubjects}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Official registered examinations
          </span>
        </div>
      </div>

      {/* Grade Distribution Breakdown Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={18} style={{ color: 'var(--primary)' }} /> Grade Distribution Breakdown
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Distribution of letter grades achieved across evaluated subjects
            </p>
          </div>
          <span className="badge badge-primary">{marks.length} Subjects Evaluated</span>
        </div>

        {/* Grade Distribution Bars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
          {[
            { grade: 'A+', label: '90-100', color: '#8b5cf6', count: gradeDistribution['A+'] },
            { grade: 'A', label: '80-89', color: '#10b981', count: gradeDistribution['A'] },
            { grade: 'B', label: '70-79', color: '#06b6d4', count: gradeDistribution['B'] },
            { grade: 'C', label: '60-69', color: '#f59e0b', count: gradeDistribution['C'] },
            { grade: 'D', label: '50-59', color: '#f97316', count: gradeDistribution['D'] },
            { grade: 'F', label: '< 50', color: '#ef4444', count: gradeDistribution['F'] }
          ].map((item) => {
            const pct = marks.length > 0 ? ((item.count / marks.length) * 100).toFixed(0) : 0;
            return (
              <div 
                key={item.grade}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: item.color }}>
                  {item.grade}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  ({item.label})
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {item.count} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({pct}%)</span>
                </div>
                <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'var(--bg-surface)', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: item.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject-Wise Results Table with Filter & Search */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Table Top Toolbar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Subject-Wise Evaluation Records</h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Individual examinations verified by academic administration
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search subject..."
                className="input-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.2rem', height: '34px', fontSize: '0.8rem', width: '180px' }}
              />
            </div>

            {/* Semester Filter */}
            <select
              className="input-control"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{ height: '34px', fontSize: '0.8rem', width: '140px' }}
            >
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Semesters' : `Semester ${s}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Subject Name</th>
                <th>Semester</th>
                <th>Marks Obtained</th>
                <th>Maximum Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading academic records...
                  </td>
                </tr>
              ) : filteredMarks.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No results match your search or semester filter.
                  </td>
                </tr>
              ) : (
                filteredMarks.map((item, idx) => {
                  const gradeInfo = getGradeInfo(item.marks_obtained, item.maximum_marks || 100);
                  const percentage = (((item.marks_obtained || 0) / (item.maximum_marks || 100)) * 100).toFixed(1);
                  return (
                    <tr key={item.id || idx}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{idx + 1}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.subject}</td>
                      <td>
                        <span className="badge badge-neutral">Semester {item.semester || 1}</span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '1rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                          {item.marks_obtained}
                        </strong>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{item.maximum_marks || 100}</td>
                      <td style={{ fontWeight: 700 }}>{percentage}%</td>
                      <td>
                        <span className={`badge ${gradeInfo.badgeClass}`} style={{ fontWeight: 800 }}>
                          {gradeInfo.grade}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: gradeInfo.status === 'Fail' ? 'var(--danger)' : 'var(--text-secondary)' }}>
                          {gradeInfo.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transcript Preview Modal */}
      <TranscriptModal 
        isOpen={showTranscriptModal} 
        onClose={() => setShowTranscriptModal(false)} 
      />
    </div>
  );
};

export default StudentResults;
