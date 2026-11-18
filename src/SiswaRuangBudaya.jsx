import React, { useEffect, useMemo, useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { isAllCategories } from './data';

// Jumlah kartu maksimum yang tampil per halaman
const ITEMS_PER_PAGE = 6;

// Membaca judul/asal daerah dari berbagai kemungkinan nama field (Supabase/Dummy)
const getSearchableText = (item) =>
  [item?.title, item?.judul, item?.origin, item?.asal]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

// Daftar nomor halaman yang ringkas (dengan elipsis bila halamannya banyak)
const buildPageNumbers = (totalPages, currentPage) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const rangeStart = Math.max(2, currentPage - 1);
  const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

  if (rangeStart > 2) pages.push('...');
  for (let page = rangeStart; page <= rangeEnd; page += 1) pages.push(page);
  if (rangeEnd < totalPages - 1) pages.push('...');
  pages.push(totalPages);

  return pages;
};

export default function SiswaRuangBudayaTab({
  loading,
  filteredArts = [],
  selectedCategory = 'Semua Kategori',
  categories = [],
  onSelectCategory,
  onSelectArt,
}) {
  // State pencarian & paginasi (lokal, tidak mengubah logika Supabase/kategori)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const showAllCategories = isAllCategories(selectedCategory);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  // Pencarian real-time berdasarkan Judul atau Asal Daerah,
  // diterapkan DI ATAS hasil filter kategori dari parent
  const searchedItems = useMemo(() => {
    if (!normalizedSearch) return filteredArts;
    return filteredArts.filter((item) =>
      getSearchableText(item).includes(normalizedSearch)
    );
  }, [filteredArts, normalizedSearch]);

  const totalPages = Math.max(1, Math.ceil(searchedItems.length / ITEMS_PER_PAGE));

  // Reset ke halaman 1 setiap kali kategori atau kata kunci pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, normalizedSearch]);

  // Jaga halaman tetap valid bila jumlah hasil mengecil
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const displayedItems = searchedItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const pageNumbers = buildPageNumbers(totalPages, activePage);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className="siswa-ruang-budaya">
      <div className="section-header">
        <h3 className="section-title">Eksplorasi Ruang Budaya Nusantara</h3>
      </div>

      <div className="category-scroll-container">
        {categories.map((category) => {
          const isActive = showAllCategories
            ? isAllCategories(category)
            : String(category ?? '').trim().toLowerCase() ===
              String(selectedCategory ?? '').trim().toLowerCase();
          return (
            <button
              key={category}
              onClick={() => onSelectCategory && onSelectCategory(category)}
              className={`category-chip ${isActive ? 'active' : ''}`}
            >
              <span className="category-chip-text">{category}</span>
              {isActive && <span className="category-active-dot" />}
            </button>
          );
        })}
      </div>

      {/* SEARCH BAR: pencarian real-time judul / asal daerah */}
      <div className="siswa-search-bar">
        <svg
          className="siswa-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="siswa-search-input"
          placeholder="Cari judul karya atau asal daerah..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Cari karya seni berdasarkan judul atau asal daerah"
        />
        {searchTerm && (
          <button
            type="button"
            className="siswa-search-clear"
            onClick={() => setSearchTerm('')}
            aria-label="Hapus kata kunci pencarian"
          >
            &times;
          </button>
        )}
      </div>

      {loading ? (
        <p className="siswa-loading-text">Memuat koleksi kebudayaan...</p>
      ) : displayedItems.length === 0 ? (
        <div className="feature-card siswa-empty-state">
          {normalizedSearch ? (
            <p className="siswa-empty-text">
              Tidak ditemukan karya seni yang cocok dengan kata kunci{' '}
              <strong>"{searchTerm.trim()}"</strong>. Coba kata kunci lain.
            </p>
          ) : showAllCategories ? (
            <p className="siswa-empty-text">
              Belum ada karya seni yang tersedia saat ini.
            </p>
          ) : (
            <p className="siswa-empty-text">
              Belum ada karya seni pada kategori <strong>"{selectedCategory}"</strong>.
            </p>
          )}
        </div>
      ) : (
        <React.Fragment>
          <div className="card-grid">
            {displayedItems.map((item) => {
              // Logika Fallback pembacaan data dari Supabase/Database
              const title = item.title || item.judul || 'Karya Seni';
              const description = item.description || item.deskripsi || '';
              const imageUrl =
                item.image_url ||
                item.gambar ||
                'https://via.placeholder.com/400x250?text=Tanpa+Gambar';
              const categoryLabel = item.category || item.kategori || '';
              const originLabel = item.origin || item.asal || '';
              const audioUrl = item.audio_url || item.audio || null;

              return (
                <div key={item.id || item.created_at} className="card">
                  <div className="card-image-container">
                    <img src={imageUrl} alt={title} className="card-image" loading="lazy" />
                  </div>
                  <div className="card-body">
                    <div className="siswa-tag-row">
                      {originLabel && <span className="tag-origin">{originLabel}</span>}
                      {categoryLabel && (
                        <span className="tag-origin siswa-tag-dark">
                          {categoryLabel}
                        </span>
                      )}
                    </div>
                    <h4 className="card-item-title">{title}</h4>
                    <p className="card-description siswa-card-desc">{description}</p>
                  </div>
                  <div className="card-footer siswa-card-footer-col">
                    {audioUrl && (
                      <AudioPlayer audioUrl={audioUrl} title={title} />
                    )}
                    <button
                      onClick={() => onSelectArt && onSelectArt(item)}
                      className="siswa-btn-detail-light"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INFO HASIL & PAGINASI */}
          <div className="siswa-pagination-info">
            Menampilkan <strong>{startIndex + 1}</strong>&ndash;
            <strong>{startIndex + displayedItems.length}</strong> dari{' '}
            <strong>{searchedItems.length}</strong> karya seni
          </div>

          {totalPages > 1 && (
            <nav className="siswa-pagination" aria-label="Navigasi halaman Ruang Budaya">
              <button
                type="button"
                className="siswa-page-btn"
                onClick={() => goToPage(activePage - 1)}
                disabled={activePage === 1}
              >
                &laquo; Sebelumnya
              </button>

              {pageNumbers.map((page, index) =>
                typeof page === 'number' ? (
                  <button
                    type="button"
                    key={`page-${page}`}
                    className={`siswa-page-btn ${page === activePage ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                    aria-current={page === activePage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={`ellipsis-${index}`} className="siswa-page-ellipsis">
                    &hellip;
                  </span>
                )
              )}

              <button
                type="button"
                className="siswa-page-btn"
                onClick={() => goToPage(activePage + 1)}
                disabled={activePage === totalPages}
              >
                Berikutnya &raquo;
              </button>
            </nav>
          )}
        </React.Fragment>
      )}
    </div>
  );
}
