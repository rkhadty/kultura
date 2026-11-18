import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import QuizRunner from './QuizRunner';
import {
  DEFAULT_QUIZ_QUESTIONS,
  QUIZ_DIFFICULTY_DESCRIPTIONS,
  groupQuestionsByDifficulty,
  normalizeQuizQuestion,
} from './data';

export default function SiswaKuisTab() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      try {
        setLoading(true);

        // Ambil bank soal dari Supabase. Jika gagal/kosong, pakai soal dummy kebudayaan.
        let { data, error } = await supabase
          .from('quiz_questions')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          // Fallback jika kolom created_at tidak tersedia pada tabel.
          const retry = await supabase.from('quiz_questions').select('*');
          data = retry.data;
          error = retry.error;
        }

        if (error || !data || data.length === 0) {
          if (isMounted) setQuestions(DEFAULT_QUIZ_QUESTIONS.map(normalizeQuizQuestion));
        } else {
          if (isMounted) setQuestions(data.map(normalizeQuizQuestion));
        }
      } catch (err) {
        console.error('Error fetching quiz questions:', err?.message || err);
        if (isMounted) setQuestions(DEFAULT_QUIZ_QUESTIONS.map(normalizeQuizQuestion));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, []);

  const quizGroups = useMemo(() => groupQuestionsByDifficulty(questions), [questions]);

  return (
    <div>
      <div className="section-header">
        <h3 className="section-title">Kuis Interaktif Kebudayaan</h3>
      </div>

      {loading ? (
        <p className="siswa-loading-text">Memuat bank soal kuis...</p>
      ) : (
        <div className="siswa-kuis-grid">
          {quizGroups.map((group) => (
            <div key={group.difficulty} className="feature-card siswa-quiz-card">
              <div>
                <span className="tag-origin siswa-tag-dark siswa-tag-inline">
                  {group.difficulty}
                </span>
                <h4 className="feature-title siswa-quiz-title">
                  Kuis Kebudayaan {group.difficulty.replace(/^Tingkat\s+/i, '')}
                </h4>
                <p className="feature-desc siswa-quiz-desc">
                  {QUIZ_DIFFICULTY_DESCRIPTIONS[group.difficulty] ||
                    'Uji wawasan kamu seputar kesenian dan kebudayaan Nusantara.'}{' '}
                  Terdapat {group.items.length} soal pilihan ganda.
                </p>
              </div>
              <button
                type="button"
                className="btn-submit"
                onClick={() => setActiveQuiz(group)}
              >
                Mulai Kerjakan Kuis ({group.items.length} Soal)
              </button>
            </div>
          ))}

          <div className="feature-card siswa-quiz-card siswa-quiz-disabled">
            <div>
              <span className="tag-origin siswa-tag-soon siswa-tag-inline">
                Segera Hadir
              </span>
              <h4 className="feature-title siswa-quiz-title">
                Kuis Tari &amp; Pertunjukan Nusantara
              </h4>
              <p className="feature-desc siswa-quiz-desc">
                Mengenal ragam gerakan tari daerah, kostum adat, dan sejarah teater
                tradisional Indonesia.
              </p>
            </div>
            <button className="btn-submit siswa-btn-disabled" disabled>
              Belum Tersedia
            </button>
          </div>
        </div>
      )}

      {activeQuiz && (
        <QuizRunner
          questions={activeQuiz.items}
          difficulty={activeQuiz.difficulty}
          onClose={() => setActiveQuiz(null)}
        />
      )}
    </div>
  );
}
