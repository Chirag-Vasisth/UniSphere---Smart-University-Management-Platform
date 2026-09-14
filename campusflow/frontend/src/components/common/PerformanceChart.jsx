import React, { useState } from 'react';
import { Award, BarChart3, TrendingUp, Info, CheckCircle2 } from 'lucide-react';
import { getGradeInfo } from '../../utils/gradeCalculator';

const PerformanceChart = ({ marks = [] }) => {
  const [hoveredMark, setHoveredMark] = useState(null);

  if (!marks || marks.length === 0) {
    return (
      <div className="card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--primary-subtle)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto'
        }}>
          <BarChart3 size={26} />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          No Academic Marks Published Yet
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
          Official marks will automatically appear on this interactive performance chart once released by faculty.
        </p>
      </div>
    );
  }

  // Calculate dynamic stats from actual marks
  const totalScore = marks.reduce((acc, m) => acc + parseFloat(m.marks_obtained || 0), 0);
  const avgScore = marks.length > 0 ? (totalScore / marks.length).toFixed(1) : 0;
  const highestMark = Math.max(...marks.map(m => parseFloat(m.marks_obtained || 0)));

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 270;
  const paddingLeft = 55;
  const paddingRight = 35;
  const paddingTop = 35;
  const paddingBottom = 55;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const barCount = marks.length;
  const barWidth = Math.min(54, Math.max(28, (chartWidth / barCount) * 0.55));
  const stepX = chartWidth / (barCount > 1 ? barCount : 2);

  // Y scale: 0 to 100
  const getY = (val) => paddingTop + chartHeight - (val / 100) * chartHeight;
  const avgY = getY(parseFloat(avgScore));
  const distinctionY = getY(75);

  const getGradientId = (score) => {
    if (score >= 90) return 'gradAplus';
    if (score >= 80) return 'gradA';
    if (score >= 70) return 'gradB';
    if (score >= 60) return 'gradC';
    return 'gradD';
  };

  return (
    <div className="card" style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Academic Subject Performance</h3>
            <span className="badge badge-primary">Dynamic Live Data</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            Subject-wise examination scores evaluated out of 100 marks
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'linear-gradient(135deg, #6366f1, #06b6d4)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Subject Marks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 14, height: 2, borderTop: '2px dashed #06b6d4' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Average ({avgScore})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 14, height: 2, borderTop: '2px dashed var(--warning)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Distinction (75)</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', minWidth: '580px', height: 'auto', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="gradAplus" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="gradA" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="gradB" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="gradC" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="gradD" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y axis ticks (0, 20, 40, 60, 80, 100) */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? 'none' : '3 3'}
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="var(--text-muted)"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Distinction Benchmark Line */}
          <line
            x1={paddingLeft}
            y1={distinctionY}
            x2={svgWidth - paddingRight}
            y2={distinctionY}
            stroke="var(--warning)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Average Benchmark Line */}
          <line
            x1={paddingLeft}
            y1={avgY}
            x2={svgWidth - paddingRight}
            y2={avgY}
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.85"
          />

          {/* Bars */}
          {marks.map((item, idx) => {
            const val = parseFloat(item.marks_obtained || 0);
            const max = parseFloat(item.maximum_marks || 100);
            const percentage = (val / max) * 100;
            const barHeight = Math.max(4, (percentage / 100) * chartHeight);
            
            // X position for center of bar column
            const centerX = paddingLeft + (idx + 0.5) * (chartWidth / marks.length);
            const barX = centerX - barWidth / 2;
            const barY = paddingTop + chartHeight - barHeight;

            const isHovered = hoveredMark?.id === item.id;
            const gradeInfo = getGradeInfo(val, max);

            // Shorten subject label for clean display
            let shortLabel = item.subject;
            if (shortLabel.length > 14) {
              shortLabel = shortLabel.substring(0, 12) + '…';
            }

            return (
              <g
                key={item.id || idx}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredMark(item)}
                onMouseLeave={() => setHoveredMark(null)}
              >
                {/* Invisible hover capture area */}
                <rect
                  x={centerX - (chartWidth / marks.length) / 2}
                  y={paddingTop}
                  width={chartWidth / marks.length}
                  height={chartHeight + 35}
                  fill="transparent"
                />

                {/* Bar highlight background on hover */}
                {isHovered && (
                  <rect
                    x={barX - 4}
                    y={paddingTop}
                    width={barWidth + 8}
                    height={chartHeight}
                    rx="8"
                    ry="8"
                    fill="var(--primary-subtle)"
                    opacity="0.5"
                  />
                )}

                {/* Score Bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx="6"
                  ry="6"
                  fill={`url(#${getGradientId(percentage)})`}
                  style={{
                    filter: isHovered ? 'brightness(1.15) drop-shadow(0 4px 12px rgba(99, 102, 241, 0.4))' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />

                {/* Top value label */}
                <text
                  x={centerX}
                  y={barY - 8}
                  fill={isHovered ? 'var(--primary)' : 'var(--text-primary)'}
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                >
                  {val}
                </text>

                {/* X-axis subject name label */}
                <text
                  x={centerX}
                  y={paddingTop + chartHeight + 20}
                  fill={isHovered ? 'var(--primary)' : 'var(--text-secondary)'}
                  fontSize="11"
                  fontWeight={isHovered ? '700' : '500'}
                  textAnchor="middle"
                >
                  {shortLabel}
                </text>

                {/* Grade pill under X label */}
                <rect
                  x={centerX - 14}
                  y={paddingTop + chartHeight + 28}
                  width="28"
                  height="16"
                  rx="4"
                  ry="4"
                  fill="var(--bg-canvas)"
                  stroke="var(--border-subtle)"
                />
                <text
                  x={centerX}
                  y={paddingTop + chartHeight + 40}
                  fill={isHovered ? 'var(--primary)' : 'var(--text-muted)'}
                  fontSize="9.5"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {gradeInfo.grade}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic Hover Detail Card / Default Tip */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.75rem 1.15rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-canvas)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.8125rem'
      }}>
        {hoveredMark ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {hoveredMark.subject}:
              </span>
              <span>Marks: <strong style={{ color: 'var(--primary)' }}>{hoveredMark.marks_obtained} / {hoveredMark.maximum_marks || 100}</strong></span>
              <span>•</span>
              <span>Semester: <strong>{hoveredMark.semester || 1}</strong></span>
              <span>•</span>
              <span>Calculated Grade: <strong>{getGradeInfo(hoveredMark.marks_obtained, hoveredMark.maximum_marks || 100).grade}</strong></span>
            </div>
            <span className={`badge ${getGradeInfo(hoveredMark.marks_obtained, hoveredMark.maximum_marks || 100).badgeClass}`}>
              {getGradeInfo(hoveredMark.marks_obtained, hoveredMark.maximum_marks || 100).status}
            </span>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Info size={15} style={{ color: 'var(--primary)' }} />
            <span>Hover or tap any subject column to inspect exact marks, grading brackets, and semester term.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;
