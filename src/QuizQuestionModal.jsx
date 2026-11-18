import React, { useEffect, useState } from 'react';
import { QUIZ_DIFFICULTIES } from './data';

const OPTION_FIELDS = ['a', 'b', 'c', 'd'];

const EMPTY_FORM = {
  question: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: 'a',
  difficulty: 'Tingkat Dasar',
};

export default function QuizQuestionModal({ showModal, setShowModal, editingItem, onSave, onSuccess }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        question: editingItem.question || '',
        option_a: editingItem.option_a || '',
        option_b: editingItem.option_b || '',
        option_c: editingItem.option_c || '',
        option_d: editingItem.option_d || '',
        correct_answer: editingItem.correct_answer || 'a',
        difficulty: editingItem.difficulty || 'Tingkat Dasar',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [editingItem, showModal]);

  if (!showModal) return null;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({ formData, editingItem });
      setShowModal(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving quiz question:', error?.message || error);
      alert('Gagal menyimpan soal kuis: ' + (error?.message || error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">
          {editingItem ? 'Edit Soal Kuis' : 'Buat Soal Kuis Baru'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Pertanyaan</label>
            <textarea
              required
              rows={3}
              className="form-control"
              placeholder="Tulis pertanyaan kuis kebudayaan..."
              value={formData.question}
              onChange={(e) => updateField('question', e.target.value)}
            />
          </div>

          {OPTION_FIELDS.map((key) => (
            <div className="form-group" key={key}>
              <label className="form-label">Opsi {key.toUpperCase()}</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder={`Jawaban pilihan ${key.toUpperCase()}`}
                value={formData[`option_${key}`]}
                onChange={(e) => updateField(`option_${key}`, e.target.value)}
              />
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Kunci Jawaban Benar</label>
            <select
              className="form-control"
              value={formData.correct_answer}
              onChange={(e) => updateField('correct_answer', e.target.value)}
            >
              {OPTION_FIELDS.map((key) => (
                <option key={key} value={key}>
                  {key.toUpperCase()}
                  {formData[`option_${key}`] ? ` — ${formData[`option_${key}`]}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group form-group--last">
            <label className="form-label">Kategori / Tingkat Kesulitan</label>
            <select
              className="form-control"
              value={formData.difficulty}
              onChange={(e) => updateField('difficulty', e.target.value)}
            >
              {QUIZ_DIFFICULTIES.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Batal
            </button>
            <button type="submit" className="btn-modal-submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
