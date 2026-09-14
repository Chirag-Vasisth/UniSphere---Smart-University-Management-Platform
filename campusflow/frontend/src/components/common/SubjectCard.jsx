import React from 'react';
import { BookOpen, Award, CheckCircle2, TrendingUp } from 'lucide-react';
import { getGradeInfo } from '../../utils/gradeCalculator';

const SubjectCard = ({ subject, marksObtained, maximumMarks = 100, semester = 1 }) => {
  const marks = parseFloat(marksObtained || 0);
  const max = parseFloat(maximumMarks || 100);
  const percentage = Math.min(100, Math.max(0, ((marks / max) * 100))).toFixed(1);
  const gradeInfo = getGradeInfo(marks, max);

  const getProgressColor = (pct) => {
    if (pct >= 90) return 'linear-gradient(90deg, #8b5cf6, #6366f1)';
    if (pct >= 80) return 'linear-gradient(90deg, #10b981, #059669)';
    if (pct >= 70) return 'linear-gradient(90deg, #06b6d4, #0284c7)';
    if (pct >= 60) return 'linear-gradient(90deg, #f59e0b, #d97706)';
    return 'linear-gradient(90deg, #ef4444, #dc2626)';
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Semester {semester}
            </span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.15rem 0 0 0', color: 'var(--text-primary)' }}>
              {subject}
            </h4>
          </div>
          <span className={`badge ${gradeInfo.badgeClass}`} style={{ fontWeight: 800, fontSize: '0.8rem' }}>
            Grade {gradeInfo.grade}
          </span>
        </div>

        {/* Score Display */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.75rem 0 0.5rem 0' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            {marks}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            / {max}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {percentage}%
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div style={{
          width: '100%',
          height: 8,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-canvas)',
          overflow: 'hidden',
          marginBottom: '0.75rem',
          border: '1px solid var(--border-subtle)'
        }}>
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              borderRadius: 'var(--radius-full)',
              background: getProgressColor(percentage),
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </div>

      {/* Footer Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Award size={14} style={{ color: 'var(--primary)' }} />
          <span>Status: <strong style={{ color: 'var(--text-secondary)' }}>{gradeInfo.status}</strong></span>
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          GPA {gradeInfo.gpa.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

export default SubjectCard;
