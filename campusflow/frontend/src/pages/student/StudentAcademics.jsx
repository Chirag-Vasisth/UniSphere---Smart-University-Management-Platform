import React from 'react';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  BookOpen, 
  Clock,
  Sparkles
} from 'lucide-react';
import { currentStudent, gpaHistory } from '../../data/mockData';

const StudentAcademics = () => {
  const { stats } = currentStudent;

  const creditCategories = [
    { title: "Core Computer Science", earned: 52, total: 68, color: "var(--primary)" },
    { title: "Engineering & Applied Math", earned: 18, total: 24, color: "var(--secondary)" },
    { title: "Electives & Specializations", earned: 10, total: 20, color: "var(--purple)" },
    { title: "Capstone & Industry Labs", earned: 4, total: 8, color: "var(--success)" }
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="heading-lg">Degree Curriculum & Academic Roadmap</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Bachelor of Technology in Computer Science & Engineering (2023 - 2027)
        </p>
      </div>

      {/* Degree Credit Audit Progress Card */}
      <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Degree Progress Audit</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>84 of 120 Total Credits Completed</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              On track for graduation in May 2027. All prerequisite criteria cleared without backlog.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>70.0%</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Curriculum Completion</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div style={{ width: '100%', height: 10, background: 'var(--bg-canvas)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{ width: '70%', height: '100%', background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)', borderRadius: 'var(--radius-full)' }} />
        </div>

        {/* Breakdown Categories */}
        <div className="grid-cols-4">
          {creditCategories.map((cat, idx) => (
            <div key={idx} style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{cat.title}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.25rem 0' }}>{cat.earned} / {cat.total} Cr</div>
              <div style={{ width: '100%', height: 4, background: 'var(--bg-canvas)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${(cat.earned / cat.total) * 100}%`, height: '100%', background: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Semester Journey Timeline Breakdown */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={20} style={{ color: 'var(--primary)' }} /> Semester-by-Semester Progression
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {gpaHistory.map((sem, idx) => (
          <div 
            key={idx} 
            className="card card-hover"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              borderLeft: idx === gpaHistory.length - 1 ? '4px solid var(--primary)' : '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: idx === gpaHistory.length - 1 ? 'var(--primary-subtle)' : 'var(--bg-canvas)',
                color: idx === gpaHistory.length - 1 ? 'var(--primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem'
              }}>
                {sem.semester.replace('Sem ', 'S')}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{sem.semester} Academic Term</h4>
                  {idx === gpaHistory.length - 1 && <span className="badge badge-primary">Current Active Term</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {sem.credits} Course Credits • {sem.attendance}% Term Attendance
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Semester SGPA</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{sem.gpa} / 4.0</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> Completed
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAcademics;
