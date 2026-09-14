import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SkeletonLine } from './LoadingSkeleton';

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendPositive = true, 
  color = 'primary',
  progress = null,
  loading = false
}) => {
  const colorMap = {
    primary: {
      bg: 'var(--primary-subtle)',
      text: 'var(--primary)',
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.02) 100%)'
    },
    secondary: {
      bg: 'var(--secondary-subtle)',
      text: 'var(--secondary)',
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(6, 182, 212, 0.02) 100%)'
    },
    success: {
      bg: 'var(--success-subtle)',
      text: 'var(--success)',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.02) 100%)'
    },
    warning: {
      bg: 'var(--warning-subtle)',
      text: 'var(--warning)',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.02) 100%)'
    },
    purple: {
      bg: 'var(--purple-subtle)',
      text: 'var(--purple)',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.02) 100%)'
    }
  };

  const currentTheme = colorMap[color] || colorMap.primary;

  if (loading) {
    return (
      <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <SkeletonLine width="45%" height="15px" />
          <div className="skeleton skeleton-circle" style={{ width: 40, height: 40 }} />
        </div>
        <SkeletonLine width="65%" height="28px" style={{ marginBottom: '0.6rem' }} />
        <SkeletonLine width="80%" height="13px" />
      </div>
    );
  }

  return (
    <div 
      className="card card-hover"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: currentTheme.gradient,
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {title}
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '0.25rem', lineHeight: 1.15, color: 'var(--text-primary)' }}>
              {value}
            </div>
          </div>

          {Icon && (
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: currentTheme.bg,
              color: currentTheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${currentTheme.bg}`
            }}>
              <Icon size={22} />
            </div>
          )}
        </div>

        {progress !== null && (
          <div style={{ margin: '0.65rem 0' }}>
            <div style={{
              width: '100%',
              height: 6,
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-canvas)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
                height: '100%',
                backgroundColor: currentTheme.text,
                borderRadius: 'var(--radius-full)',
                transition: 'width var(--transition-slow)'
              }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        {trend && (
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.25rem', 
            fontWeight: 700,
            color: trendPositive ? 'var(--success)' : 'var(--danger)'
          }}>
            {trendPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trend}</span>
          </div>
        )}

        {subtitle && (
          <span style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
