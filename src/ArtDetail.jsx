import React from 'react';
import { AudioPlayer } from './AudioPlayer';

export default function ArtDetailModal({ art, onClose }) {
  if (!art) return null;

  const title = art.title || art.judul || 'Karya Seni';
  const description = art.description || art.deskripsi || '';
  const imageUrl = art.image_url || art.gambar || '';
  const categoryLabel = art.category || art.kategori || 'Seni Budaya';
  const originLabel = art.origin || art.asal || '';
  const audioUrl = art.audio_url || art.audio || null;

  return (
    <div className="siswa-modal-overlay">
      <div className="siswa-modal">
        <button onClick={onClose} className="siswa-modal-close" aria-label="Tutup Rincian">
          &times;
        </button>

        {imageUrl && (
          <img src={imageUrl} alt={title} className="siswa-modal-img" />
        )}

        <div className="siswa-modal-tags">
          {originLabel && <span className="tag-origin">{originLabel}</span>}
          <span className="tag-origin siswa-tag-dark">{categoryLabel}</span>
        </div>

        <h3 className="siswa-modal-title">{title}</h3>

        {audioUrl && (
          <div className="siswa-modal-audio">
            <p className="siswa-modal-section-label">Dengarkan Karya</p>
            <AudioPlayer audioUrl={audioUrl} title={title} />
          </div>
        )}

        {description && <p className="siswa-modal-desc">{description}</p>}

        <button onClick={onClose} className="btn-submit">Tutup Rincian</button>
      </div>
    </div>
  );
}
