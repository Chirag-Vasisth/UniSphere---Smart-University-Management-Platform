import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { getGradeInfo } from '../../utils/gradeCalculator';

const AdminMarksModal = ({ isOpen, student, onClose }) => {
  const { showToast } = useToast();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Add new mark form state
  const [newMark, setNewMark] = useState({
    subject: '',
    marks_obtained: '',
    maximum_marks: 100,
    semester: 1
  });
  const [addingMark, setAddingMark] = useState(false);

  // Edit mark state
  const [editingMarkId, setEditingMarkId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    subject: '',
    marks_obtained: '',
    maximum_marks: 100,
    semester: 1
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchMarks = async () => {
    if (!student) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.students.getMarks(student.id);
      if (res.ok) {
        setMarks(Array.isArray(res.data) ? res.data : []);
      } else {
        setError(res.data?.message || res.error || 'Failed to fetch student marks.');
      }
    } catch (err) {
      setError('Error loading student marks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && student) {
      fetchMarks();
      setEditingMarkId(null);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  // Add mark submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newMark.subject || !newMark.subject.trim()) {
      setError('Subject name is required.');
      return;
    }

    const obtained = parseFloat(newMark.marks_obtained);
    const max = parseFloat(newMark.maximum_marks) || 100;

    if (isNaN(obtained) || obtained < 0 || obtained > 100 || obtained > max) {
      setError(`Marks obtained must be a valid number between 0 and 100.`);
      return;
    }

    setAddingMark(true);
    try {
      const res = await api.students.addMark(student.id, {
        subject: newMark.subject.trim(),
        marks_obtained: obtained,
        maximum_marks: max,
        semester: parseInt(newMark.semester, 10) || 1
      });

      if (res.ok) {
        showToast(`Marks for "${newMark.subject.trim()}" added successfully!`, 'success');
        setSuccess('Marks record added successfully!');
        setNewMark({
          subject: '',
          marks_obtained: '',
          maximum_marks: 100,
          semester: 1
        });
        fetchMarks();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const msg = res.data?.message || res.error || 'Failed to add mark.';
        setError(msg);
        showToast(msg, 'error');
      }
    } catch (err) {
      setError('An error occurred while adding the mark.');
      showToast('Error adding mark.', 'error');
    } finally {
      setAddingMark(false);
    }
  };

  // Edit mark helpers
  const handleStartEdit = (mark) => {
    setEditingMarkId(mark.id);
    setEditFormData({
      subject: mark.subject,
      marks_obtained: mark.marks_obtained,
      maximum_marks: mark.maximum_marks || 100,
      semester: mark.semester || 1
    });
  };

  const handleCancelEdit = () => {
    setEditingMarkId(null);
  };

  const handleSaveEdit = async (markId) => {
    setError(null);
    setSuccess(null);

    if (!editFormData.subject || !editFormData.subject.trim()) {
      setError('Subject name is required.');
      return;
    }

    const obtained = parseFloat(editFormData.marks_obtained);
    const max = parseFloat(editFormData.maximum_marks) || 100;

    if (isNaN(obtained) || obtained < 0 || obtained > 100 || obtained > max) {
      setError(`Marks obtained must be between 0 and 100.`);
      return;
    }

    setSavingEdit(true);
    try {
      const res = await api.marks.update(markId, {
        subject: editFormData.subject.trim(),
        marks_obtained: obtained,
        maximum_marks: max,
        semester: parseInt(editFormData.semester, 10) || 1
      });

      if (res.ok) {
        showToast('Marks record updated successfully!', 'success');
        setSuccess('Marks record updated successfully!');
        setEditingMarkId(null);
        fetchMarks();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const msg = res.data?.message || res.error || 'Failed to update mark.';
        setError(msg);
        showToast(msg, 'error');
      }
    } catch (err) {
      setError('Failed to update marks record.');
      showToast('Error updating mark.', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete mark
  const handleDeleteMark = async (markId, subjectName) => {
    if (!window.confirm(`Delete marks record for "${subjectName}"?`)) {
      return;
    }

    try {
      const res = await api.marks.delete(markId);
      if (res.ok) {
        showToast(`Marks for "${subjectName}" deleted.`, 'info');
        fetchMarks();
      } else {
        const msg = res.data?.message || res.error || 'Failed to delete mark record.';
        setError(msg);
        showToast(msg, 'error');
      }
    } catch (err) {
      setError('Error connecting to marks service.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ padding: '2rem', maxWidth: '780px', width: '95%' }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: 'var(--primary)' }} /> Manage Academic Marks
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
              Evaluation records for <strong style={{ color: 'var(--text-primary)' }}>{student.name}</strong> ({student.enrollment_number})
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Feedback Notifications */}
        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--danger-subtle)',
            color: 'var(--danger)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--success-subtle)',
            color: 'var(--success)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        {/* Existing Marks Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Current Registered Marks ({marks.length})
            </span>
          </div>

          <div className="table-container" style={{ maxHeight: '260px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Sem</th>
                  <th>Marks (0-100)</th>
                  <th>Grade</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      Loading academic marks...
                    </td>
                  </tr>
                ) : marks.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No marks registered yet. Add the first mark using the form below.
                    </td>
                  </tr>
                ) : (
                  marks.map((m) => {
                    const isEditing = editingMarkId === m.id;
                    const gradeInfo = getGradeInfo(m.marks_obtained, m.maximum_marks || 100);

                    if (isEditing) {
                      return (
                        <tr key={m.id} style={{ background: 'var(--primary-subtle)' }}>
                          <td>
                            <input
                              type="text"
                              className="input-control"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                              value={editFormData.subject}
                              onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                            />
                          </td>
                          <td>
                            <select
                              className="input-control"
                              style={{ padding: '0.35rem 0.4rem', fontSize: '0.8rem', width: '65px' }}
                              value={editFormData.semester}
                              onChange={(e) => setEditFormData({ ...editFormData, semester: e.target.value })}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>S{s}</option>)}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="input-control"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', width: '80px' }}
                              value={editFormData.marks_obtained}
                              onChange={(e) => setEditFormData({ ...editFormData, marks_obtained: e.target.value })}
                            />
                          </td>
                          <td>
                            <span className="badge badge-neutral">Updating</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                              <button
                                onClick={() => handleSaveEdit(m.id)}
                                className="btn btn-primary btn-sm"
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                disabled={savingEdit}
                              >
                                {savingEdit ? '...' : <Save size={14} />}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={m.id}>
                        <td style={{ fontWeight: 600 }}>{m.subject}</td>
                        <td>
                          <span className="badge badge-neutral">Sem {m.semester || 1}</span>
                        </td>
                        <td>
                          <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontSize: '0.95rem' }}>
                            {m.marks_obtained}
                          </strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}> / {m.maximum_marks || 100}</span>
                        </td>
                        <td>
                          <span className={`badge ${gradeInfo.badgeClass}`}>
                            {gradeInfo.grade}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => handleStartEdit(m)}
                              className="btn-icon"
                              style={{ width: 28, height: 28 }}
                              title="Edit Marks"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteMark(m.id, m.subject)}
                              className="btn-icon"
                              style={{ width: 28, height: 28, color: 'var(--danger)' }}
                              title="Delete Marks"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add New Mark Form */}
        <form onSubmit={handleAddSubmit} style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} style={{ color: 'var(--primary)' }} /> Add Subject Evaluation Mark
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }} className="responsive-marks-form">
            <div className="input-group">
              <label className="input-label">Subject Name *</label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Cloud Computing"
                value={newMark.subject}
                onChange={(e) => setNewMark({ ...newMark, subject: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Semester</label>
              <select
                className="input-control"
                value={newMark.semester}
                onChange={(e) => setNewMark({ ...newMark, semester: e.target.value })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Marks (0-100) *</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                className="input-control"
                placeholder="e.g. 85"
                value={newMark.marks_obtained}
                onChange={(e) => setNewMark({ ...newMark, marks_obtained: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={addingMark}
              style={{ height: '38px' }}
            >
              {addingMark ? 'Adding...' : 'Add Mark'}
            </button>
          </div>
        </form>

        <style>{`
          @media (max-width: 640px) {
            .responsive-marks-form {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AdminMarksModal;
