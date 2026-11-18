import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from './supabase';
import QuizQuestionModal from './QuizQuestionModal';
import { normalizeQuizQuestion } from './data';

const TABLE_NAME = 'quiz_questions';

export default function AdminKuisTab() {
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      let { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        // Fallback jika kolom created_at belum ada pada tabel.
        const retry = await supabase.from(TABLE_NAME).select('*');
        data = retry.data;
        error = retry.error;
      }

      if (error) throw error;
      setQuestionsList((data || []).map(normalizeQuizQuestion));
    } catch (error) {
      console.error('Error fetching quiz questions:', error?.message || error);
      alert(
        `Gagal mengambil bank soal kuis: ${error?.message || error}\n\n` +
          `Pastikan tabel "${TABLE_NAME}" sudah dibuat di Supabase.`
      );
      setQuestionsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id, questionText) => {
    const preview = String(questionText || '').slice(0, 60);
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus soal "${preview}${preview.length >= 60 ? '...' : ''}"?`
    );
    if (!isConfirmed) return;

    try {
      const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);
      if (error) throw error;

      setQuestionsList((prev) => prev.filter((item) => item.id !== id));
      alert('Soal kuis berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting quiz question:', error?.message || error);
      alert('Gagal menghapus soal kuis: ' + (error?.message || error));
    }
  };

  const handleSave = async ({ formData, editingItem: itemToEdit }) => {
    const payload = {
      question: formData.question,
      option_a: formData.option_a,
      option_b: formData.option_b,
      option_c: formData.option_c,
      option_d: formData.option_d,
      correct_answer: formData.correct_answer,
      difficulty: formData.difficulty,
    };

    if (itemToEdit) {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update(payload)
        .eq('id', itemToEdit.id);
      if (error) throw error;
      alert('Soal kuis berhasil diperbarui!');
    } else {
      const { error } = await supabase.from(TABLE_NAME).insert([payload]);
      if (error) throw error;
      alert('Soal kuis baru berhasil ditambahkan!');
    }
  };

  return (
    <div className="anim-tab-content admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">
            <i className="bx bx-select-multiple"></i> Kelola Bank Soal Kuis
          </h3>
          <p className="admin-panel-desc">
            Susun pertanyaan kuis interaktif untuk siswa.
          </p>
        </div>
        <button onClick={handleAdd} className="admin-btn-primary">
          <i className="bx bx-plus admin-btn-icon"></i> Buat Soal Baru
        </button>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-table-state">
            <i className="bx bx-loader-alt bx-spin admin-table-state-icon"></i>
            <p>Memuat bank soal kuis...</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>No</th>
                <th>Pertanyaan</th>
                <th>Kunci Jawaban</th>
                <th>Kategori / Tingkat</th>
                <th className="admin-table-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {questionsList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-table-empty">
                    Belum ada soal kuis. Klik &quot;Buat Soal Baru&quot; untuk menambahkan.
                  </td>
                </tr>
              ) : (
                questionsList.map((item, index) => {
                  const correctKey = item.correct_answer;
                  const correctText = item[`option_${correctKey}`];

                  return (
                    <tr key={item.id ?? index}>
                      <td className="admin-cell-muted">{index + 1}</td>
                      <td className="admin-cell-name admin-quiz-question-cell">
                        {item.question || '-'}
                      </td>
                      <td>
                        <span className="admin-role-badge admin-role-badge--admin">
                          {correctKey.toUpperCase()}
                        </span>{' '}
                        <span className="admin-cell-muted admin-quiz-answer-text">
                          {correctText || '-'}
                        </span>
                      </td>
                      <td>
                        <span className="admin-role-badge admin-role-badge--siswa">
                          {item.difficulty}
                        </span>
                      </td>
                      <td className="admin-table-center">
                        <button
                          className="action-btn edit"
                          title="Edit Soal"
                          onClick={() => handleEdit(item)}
                        >
                          <i className="bx bx-edit-alt"></i>
                        </button>
                        <button
                          className="action-btn delete"
                          title="Hapus Soal"
                          onClick={() => handleDelete(item.id, item.question)}
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal &&
        createPortal(
          <QuizQuestionModal
            showModal={showModal}
            setShowModal={setShowModal}
            editingItem={editingItem}
            onSave={handleSave}
            onSuccess={fetchQuestions}
          />,
          document.body
        )}
    </div>
  );
}
