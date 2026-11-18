import React, { useMemo, useState } from 'react';

const OPTION_KEYS = ['a', 'b', 'c', 'd'];

const getOptionText = (question, key) => question?.[`option_${key}`] || '';

export default function QuizRunner({ questions = [], difficulty = '', onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentIndex];

  const result = useMemo(() => {
    const correctCount = questions.reduce(
      (acc, question, index) =>
        acc + (answers[index] === question.correct_answer ? 1 : 0),
      0
    );
    const answeredCount = Object.keys(answers).length;

    return {
      correctCount,
      wrongCount: total - correctCount,
      answeredCount,
      score: total > 0 ? Math.round((correctCount / total) * 100) : 0,
    };
  }, [questions, answers, total]);

  if (total === 0) return null;

  const handleSelect = (key) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: key }));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(total - 1, prev + 1));
  };

  const handleSubmit = () => {
    const unanswered = total - Object.keys(answers).length;
    if (
      unanswered > 0 &&
      !window.confirm(
        `Masih ada ${unanswered} soal yang belum dijawab. Tetap kumpulkan jawaban?`
      )
    ) {
      return;
    }
    setSubmitted(true);
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
  };

  const progressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <div className="siswa-modal-overlay" onClick={onClose}>
      <div className="siswa-modal quiz-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="siswa-modal-close"
          onClick={onClose}
          aria-label="Tutup Kuis"
        >
          &times;
        </button>

        {!submitted ? (
          <>
            <div className="quiz-progress-head">
              {difficulty && (
                <span className="tag-origin siswa-tag-dark siswa-tag-inline">
                  {difficulty}
                </span>
              )}
              <span className="quiz-counter">
                Soal {currentIndex + 1} dari {total}
              </span>
            </div>

            <div className="quiz-progress-bar">
              <div
                className="quiz-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <h3 className="quiz-question">{currentQuestion.question}</h3>

            <div className="quiz-options">
              {OPTION_KEYS.map((key) => {
                const text = getOptionText(currentQuestion, key);
                if (!text) return null;
                const isSelected = selectedAnswer === key;

                return (
                  <button
                    key={key}
                    type="button"
                    className={`quiz-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(key)}
                  >
                    <span className="quiz-option-letter">{key.toUpperCase()}</span>
                    <span className="quiz-option-text">{text}</span>
                  </button>
                );
              })}
            </div>

            <div className="quiz-nav">
              <button
                type="button"
                className="quiz-btn"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
              >
                &larr; Sebelumnya
              </button>

              {currentIndex < total - 1 ? (
                <button type="button" className="quiz-btn quiz-btn-primary" onClick={goToNext}>
                  Berikutnya &rarr;
                </button>
              ) : (
                <button
                  type="button"
                  className="quiz-btn quiz-btn-gold"
                  onClick={handleSubmit}
                >
                  Selesai &amp; Lihat Skor
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="quiz-result">
            <div className="quiz-score-circle">
              <span className="quiz-score-value">{result.score}</span>
              <span className="quiz-score-label">Nilai Akhir</span>
            </div>

            <h3 className="quiz-result-title">
              {result.score >= 80
                ? 'Luar Biasa!'
                : result.score >= 60
                ? 'Kerja Bagus!'
                : 'Ayo Belajar Lagi!'}
            </h3>
            <p className="quiz-result-sub">
              Kamu menjawab benar {result.correctCount} dari {total} soal.
            </p>

            <div className="quiz-stats">
              <div className="quiz-stat quiz-stat--correct">
                <span className="quiz-stat-value">{result.correctCount}</span>
                <span className="quiz-stat-label">Jawaban Benar</span>
              </div>
              <div className="quiz-stat quiz-stat--wrong">
                <span className="quiz-stat-value">{result.wrongCount}</span>
                <span className="quiz-stat-label">Jawaban Salah</span>
              </div>
            </div>

            <div className="quiz-review">
              {questions.map((question, index) => {
                const chosen = answers[index];
                const isCorrect = chosen === question.correct_answer;

                return (
                  <div className="quiz-review-item" key={question.id ?? index}>
                    <p className="quiz-review-q">
                      {index + 1}. {question.question}
                    </p>
                    <p className={`quiz-review-ans ${isCorrect ? 'correct' : 'wrong'}`}>
                      {isCorrect ? 'Benar' : 'Salah'} &mdash; Jawabanmu:{' '}
                      {chosen
                        ? `${chosen.toUpperCase()}) ${getOptionText(question, chosen)}`
                        : 'Tidak dijawab'}
                    </p>
                    {!isCorrect && (
                      <p className="quiz-review-ans correct">
                        Kunci: {question.correct_answer.toUpperCase()}){' '}
                        {getOptionText(question, question.correct_answer)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="quiz-result-actions">
              <button type="button" className="quiz-btn quiz-btn-primary" onClick={handleRetry}>
                Coba Lagi
              </button>
              <button type="button" className="quiz-btn" onClick={onClose}>
                Kembali ke Menu Kuis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
