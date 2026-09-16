import React, { useState } from 'react';
import { Award, Info } from 'lucide-react';
import { gpaHistory } from '../../data/mockData';

const AcademicChart = () => {
  const [activePoint, setActivePoint] = useState(null);

  // SVG Chart dimensions
  const width = 640;
  const height = 240;
  const paddingX = 50;
  const paddingY = 40;

  // Range calculations for GPA scale 7.0 to 10.0
  const minGpa = 7.0;
  const maxGpa = 10.0;

  const getX = (index) => paddingX + (index * (width - 2 * paddingX)) / (gpaHistory.length - 1);
  const getY = (gpa) => height - paddingY - ((gpa - minGpa) / (maxGpa - minGpa)) * (height - 2 * paddingY);

  // Generate SVG path line
  const points = gpaHistory.map((item, idx) => ({
    ...item,
    x: getX(idx),
    y: getY(item.gpa)
  }));

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  // Generate area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Dean's honors line at 9.0
  const honorsY = getY(9.0);

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Academic Performance Trajectory</h3>
            <span className="badge badge-primary">Current: 9.78 SGPA</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Semester-by-semester Grade Point Average (GPA) progression across degree curriculum.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 12, height: 3, backgroundColor: 'var(--primary)', borderRadius: 2 }} />
            <span style={{ color: 'var(--text-secondary)' }}>Semester GPA</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 12, height: 2, borderTop: '2px dashed var(--warning)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Honors (9.0 / 10)</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          style={{ width: '100%', height: 'auto', minWidth: '480px', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line 
                  x1={paddingX} 
                  y1={y} 
                  x2={width - paddingX} 
                  y2={y} 
                  stroke="var(--border-subtle)" 
                  strokeWidth="1" 
                />
                <text 
                  x={paddingX - 10} 
                  y={y + 4} 
                  fill="var(--text-muted)" 
                  fontSize="10" 
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Honors Threshold line */}
          <line 
            x1={paddingX} 
            y1={honorsY} 
            x2={width - paddingX} 
            y2={honorsY} 
            stroke="var(--warning)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            opacity="0.75"
          />

          {/* Area Fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line Path */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="var(--primary)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Points & Interactive Nodes */}
          {points.map((p, idx) => (
            <g key={idx} style={{ cursor: 'pointer' }} onMouseEnter={() => setActivePoint(p)}>
              {/* Invisible touch target */}
              <circle cx={p.x} cy={p.y} r="16" fill="transparent" />

              {/* Outer glow circle */}
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={activePoint?.semester === p.semester ? "8" : "5"} 
                fill="var(--bg-surface)" 
                stroke="var(--primary)" 
                strokeWidth="3"
                style={{ transition: 'all 0.2s ease' }}
              />

              {/* X Axis labels */}
              <text 
                x={p.x} 
                y={height - paddingY + 22} 
                fill={activePoint?.semester === p.semester ? "var(--primary)" : "var(--text-secondary)"} 
                fontSize="11" 
                fontWeight={activePoint?.semester === p.semester ? "700" : "500"} 
                textAnchor="middle"
              >
                {p.semester}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Floating or Status Tooltip Card */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.75rem 1rem',
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
        {activePoint ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{activePoint.semester} Detail:</span>
              <span>SGPA: <strong>{activePoint.gpa}</strong></span>
              <span>•</span>
              <span>Credits: <strong>{activePoint.credits}</strong></span>
              <span>•</span>
              <span>Attendance: <strong>{activePoint.attendance}%</strong></span>
            </div>
            <span className="badge badge-success">Consistent Honors Standing</span>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <Info size={14} />
            <span>Hover or tap on any semester data node to inspect exact GPA and credit metrics.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademicChart;
