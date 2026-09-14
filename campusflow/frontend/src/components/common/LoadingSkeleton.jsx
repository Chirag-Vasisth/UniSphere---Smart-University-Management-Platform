import React from 'react';

export const SkeletonLine = ({ width = '100%', height = '14px', style = {} }) => (
  <div
    className="skeleton"
    style={{
      width,
      height,
      borderRadius: 'var(--radius-sm)',
      ...style
    }}
  />
);

export const SkeletonCard = () => (
  <div className="card" style={{ padding: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <SkeletonLine width="40%" height="16px" />
      <div className="skeleton skeleton-circle" style={{ width: 36, height: 36 }} />
    </div>
    <SkeletonLine width="60%" height="28px" style={{ marginBottom: '0.5rem' }} />
    <SkeletonLine width="75%" height="12px" />
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 6 }) => (
  <div className="table-container">
    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '1rem' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonLine key={i} width={`${100 / columns}%`} height="16px" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div
        key={r}
        style={{
          padding: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        {Array.from({ length: columns }).map((_, c) => (
          <SkeletonLine key={c} width={`${100 / columns}%`} height="14px" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="card" style={{ padding: '1.75rem', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <SkeletonLine width="35%" height="20px" />
      <SkeletonLine width="20%" height="16px" />
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '180px', padding: '0 1rem' }}>
      {[60, 85, 45, 95, 70, 80].map((h, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            flex: 1,
            height: `${h}%`,
            borderRadius: 'var(--radius-sm)'
          }}
        />
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
      <SkeletonLine width="100%" height="12px" />
    </div>
  </div>
);

export default {
  SkeletonLine,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart
};
