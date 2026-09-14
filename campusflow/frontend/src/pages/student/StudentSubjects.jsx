import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  ArrowUpDown, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  AlertCircle,
  Filter
} from 'lucide-react';
import SubjectCard from '../../components/common/SubjectCard';
import { SkeletonCard } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { getGradeInfo } from '../../utils/gradeCalculator';

const StudentSubjects = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('performance-desc'); // 'performance-desc' | 'performance-asc' | 'name'

  useEffect(() => {
    let isMounted = true;
    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.marks.getMyMarks();
        if (isMounted) {
          if (res.ok) {
            setMarks(Array.isArray(res.data) ? res.data : []);
          } else {
            setError(res.data?.message || res.error || 'Failed to load subject records.');
          }
        }
      } catch (err) {
        if (isMounted) setError('Error connecting to academic subject records.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubjects();
    return () => { isMounted = false; };
  }, []);

  // Filter by search query
  const filtered = marks.filter((m) =>
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort subjects (default: highest to lowest performance)
  const sortedSubjects = [...filtered].sort((a, b) => {
    const scoreA = parseFloat(a.marks_obtained || 0) / parseFloat(a.maximum_marks || 100);
    const scoreB = parseFloat(b.marks_obtained || 0) / parseFloat(b.maximum_marks || 100);

    if (sortOrder === 'performance-desc') {
      return scoreB - scoreA; // Highest to lowest
    }
    if (sortOrder === 'performance-asc') {
      return scoreA - scoreB; // Lowest to highest
    }
    if (sortOrder === 'name') {
      return a.subject.localeCompare(b.subject);
    }
    return 0;
  });

  return (
    <div className="page-wrapper">
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="heading-lg" style={{ margin: 0 }}>Subject Performance Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Comprehensive examination records ranked by academic achievement
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Filter subjects..." 
              className="input-control" 
              style={{ paddingLeft: '2.4rem', height: '38px', fontSize: '0.8125rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              className="input-control"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ height: '38px', fontSize: '0.8125rem', width: '180px' }}
            >
              <option value="performance-desc">Highest to Lowest</option>
              <option value="performance-asc">Lowest to Highest</option>
              <option value="name">Subject Name (A-Z)</option>
            </select>
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

      {/* Subjects Grid */}
      {loading ? (
        <div className="grid-cols-3" style={{ gap: '1.25rem' }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : sortedSubjects.length === 0 ? (
        searchQuery ? (
          <EmptyState
            icon={Search}
            title="No Subjects Match Search"
            description={`No subject records match "${searchQuery}". Try a different keyword.`}
            actionLabel="Clear Filter"
            onAction={() => setSearchQuery('')}
          />
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No Academic Subjects Found"
            description="There are currently no recorded subjects or examination marks associated with your student account."
          />
        )
      ) : (
        <div className="grid-cols-3" style={{ gap: '1.25rem' }}>
          {sortedSubjects.map((item) => (
            <SubjectCard
              key={item.id}
              subject={item.subject}
              marksObtained={item.marks_obtained}
              maximumMarks={item.maximum_marks || 100}
              semester={item.semester || 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSubjects;
