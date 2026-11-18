import React, { useMemo } from 'react';
import { SiswaIcons } from './SiswaIcons';

const HIGHLIGHT_LIMIT = 4;

export default function SiswaDashboardTab({ arts = [], onGoToRuangBudaya }) {
  // HIGHLIGHT: acak urutan data setiap kali komponen dimuat, lalu ambil maksimal 4 item
  const highlightArts = useMemo(() => {
    const source = Array.isArray(arts) ? [...arts] : [];
    return source.sort(() => Math.random() - 0.5).slice(0, HIGHLIGHT_LIMIT);
  }, [arts]);

  const goToRuangBudaya = () => {
    if (onGoToRuangBudaya) {
      onGoToRuangBudaya();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* HERO SAMBUTAN */}
      <div className="bg-megamendung siswa-hero">
        <h2 className="siswa-hero-title">Selamat Datang di Kultura! 👋</h2>
        <p className="siswa-hero-text">
          Pusat Pembelajaran Kebudayaan Nusantara. Silakan eksplorasi Ruang Budaya atau uji wawasan kamu di menu Kuis Interaktif.
        </p>
      </div>

      <div className="section-header">
        <h3 className="section-title">Ringkasan Aktivitas</h3>
      </div>

      <div className="portfolio-features siswa-features-gap">
        <div className="feature-card">
          <div className="feature-icon"><SiswaIcons.RuangBudaya /></div>
          <h4 className="feature-title">Ruang Budaya</h4>
          <p className="feature-desc">Tersedia {arts.length} katalog warisan kesenian dari 8 kategori budaya.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><SiswaIcons.Kuis /></div>
          <h4 className="feature-title">Kuis Kebudayaan</h4>
          <p className="feature-desc">1 Kuis Aktif siap dikerjakan untuk melatih wawasan kesenian Nusantara.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><SiswaIcons.Profile /></div>
          <h4 className="feature-title">Status Akun</h4>
          <p className="feature-desc">Pengunjung (Publik) — Akses penuh tanpa perlu login.</p>
        </div>
      </div>

      <div className="section-header siswa-highlight-header">
        <h3 className="section-title">Highlight Kesenian Nusantara</h3>
      </div>

      <div className="card-grid">
        {highlightArts.map((item) => {
          // Fallback pembacaan data dari Supabase agar kartu tetap rapi
          const title = item.title || item.judul || 'Karya Seni Nusantara';
          const description = item.description || item.deskripsi || '';
          const imageUrl =
            item.image_url ||
            item.gambar ||
            'https://via.placeholder.com/400x250?text=Tanpa+Gambar';
          const originLabel = item.origin || item.asal || '';
          const categoryLabel = item.category || item.kategori || '';

          return (
            <div key={item.id || item.created_at || title} className="card">
              <img
                src={imageUrl}
                alt={title}
                className="card-image"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    'https://via.placeholder.com/400x250?text=Tanpa+Gambar';
                }}
              />
              <div className="card-body">
                <div className="siswa-tag-row">
                  {originLabel && <span className="tag-origin">{originLabel}</span>}
                  {categoryLabel && (
                    <span className="tag-origin siswa-tag-dark">{categoryLabel}</span>
                  )}
                </div>
                <h4 className="card-item-title">{title}</h4>
                <p className="card-description siswa-card-clamp">{description}</p>
              </div>
              <div className="card-footer">
                <button
                  type="button"
                  onClick={goToRuangBudaya}
                  className="siswa-btn-detail"
                >
                  Lihat Selengkapnya
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}