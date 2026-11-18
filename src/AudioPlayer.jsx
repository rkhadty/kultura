import React, { useRef, useState, useEffect, useCallback } from 'react';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
};

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="6" y="4" width="4.2" height="16" rx="1.4" />
    <rect x="13.8" y="4" width="4.2" height="16" rx="1.4" />
  </svg>
);

const NoteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l10-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
  </svg>
);

const VolumeIcon = ({ muted }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    {muted ? <path d="M22 9l-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
  </svg>
);

export const AudioPlayer = ({ audioUrl, title }) => {
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setIsMuted(false);
    setIsLoading(false);
    setHasError(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        setIsLoading(true);
        await audio.play();
      } catch (error) {
        setHasError(true);
        setIsPlaying(false);
        console.error('Gagal memutar audio:', error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      audio.pause();
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration)) {
      setDuration(audio.duration);
      setHasError(false);
    }
  };

  const handleEnded = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const seekTo = useCallback(
    (clientX) => {
      const audio = audioRef.current;
      const track = trackRef.current;
      if (!audio || !track || !duration) return;

      const rect = track.getBoundingClientRect();
      if (rect.width === 0) return;

      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      const nextTime = ratio * duration;
      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
    },
    [duration]
  );

  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    seekTo(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    seekTo(e.clientX);
  };

  const stopDragging = (e) => {
    draggingRef.current = false;
    if (e?.pointerId !== undefined) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    }
  };

  const handleKeyDown = (e) => {
    if (!duration) return;
    const audio = audioRef.current;
    if (!audio) return;

    const step = e.shiftKey ? 10 : 5;
    let next = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(audio.currentTime + step, duration);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(audio.currentTime - step, 0);
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = duration;
    if (next === null) return;

    e.preventDefault();
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <div className="audio-card">
      <div className="audio-head">
        <span className={`audio-icon-badge ${isPlaying ? 'is-playing' : ''}`}>
          <NoteIcon />
        </span>

        <div className="audio-head-text">
          <p className="audio-sub">Sampel Audio</p>
          <p className="audio-title" title={title}>{title || 'Tanpa Judul'}</p>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className={`audio-volume-btn ${isMuted ? 'is-muted' : ''}`}
          title={isMuted ? 'Aktifkan suara' : 'Matikan suara'}
          aria-label={isMuted ? 'Aktifkan suara' : 'Matikan suara'}
        >
          <VolumeIcon muted={isMuted} />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          className="audio-play-btn"
          title={isPlaying ? 'Jeda' : 'Putar'}
          aria-label={isPlaying ? 'Jeda' : 'Putar'}
        >
          {isLoading ? <span className="audio-spinner" /> : isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
          setIsPlaying(false);
        }}
      />

      <div
        ref={trackRef}
        className={`audio-track ${duration ? '' : 'is-disabled'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onKeyDown={handleKeyDown}
        role="slider"
        tabIndex={0}
        aria-label="Garis waktu audio"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={`${formatTime(currentTime)} dari ${formatTime(duration)}`}
      >
        <div className="audio-track-fill" style={{ width: `${progress}%` }} />
        <div className="audio-track-thumb" style={{ left: `${progress}%` }} />
      </div>

      <div className="audio-times">
        <span className="audio-time-current">{formatTime(currentTime)}</span>
        <span className="audio-time-duration">{formatTime(duration)}</span>
      </div>

      {hasError && (
        <p className="audio-error">Audio tidak dapat dimuat. Periksa koneksi atau format file.</p>
      )}
    </div>
  );
};
