import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from './supabase';
import RuangBudayaModal from './RuangBudayaModal';

const IMAGE_BUCKET = 'budaya_assets';
const AUDIO_BUCKETS = ['karya-media', 'budaya_assets'];

// Jumlah baris karya maksimum yang tampil per halaman
const ITEMS_PER_PAGE = 5;

// Membaca judul/kategori dari berbagai kemungkinan nama field (Supabase/Dummy)
const getItemSearchableText = (item) =>
  [item?.title, item?.judul, item?.category, item?.kategori]
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

const uploadToBucket = async (bucket, file, folder) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

const uploadImage = (file) => uploadToBucket(IMAGE_BUCKET, file, 'ruang-budaya');

const uploadAudio = async (file) => {
  let lastError = null;

  for (const bucket of AUDIO_BUCKETS) {
    try {
      return await uploadToBucket(bucket, file, 'ruang-budaya/audio');
    } catch (error) {
      console.warn(`Upload audio ke bucket "${bucket}" gagal, mencoba bucket berikutnya...`, error.message);
      lastError = error;
    }
  }

  throw lastError;
};

export default function AdminRuangBudayaTab() {
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // State pencarian & paginasi (lokal, tidak mengubah logika CRUD)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ruang_budaya')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItemsList(data || []);
    } catch (error) {
      console.error('Error fetching culture items:', error.message);
      alert('Gagal mengambil data Ruang Budaya: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus karya "${title}"?`);
    if (!isConfirmed) return;

    try {
      const { error } = await supabase
        .from('ruang_budaya')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItemsList((prev) => prev.filter((item) => item.id !== id));
      alert('Karya seni berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting item:', error.message);
      alert('Gagal menghapus karya seni: ' + error.message);
    }
  };

  const handleSave = async ({ formData, imageFile, currentImageUrl, audioFile, editingItem }) => {
    let finalImageUrl = currentImageUrl;

    if (imageFile) {
      finalImageUrl = await uploadImage(imageFile);
    }

    if (!finalImageUrl) {
      throw new Error('Gambar karya belum diisi.');
    }

    const payload = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      image_url: finalImageUrl
    };

    if (audioFile) {
      payload.audio_url = await uploadAudio(audioFile);
    }

    if (editingItem) {
      const { error } = await supabase
        .from('ruang_budaya')
        .update(payload)
        .eq('id', editingItem.id);

      if (error) throw error;
      alert('Karya seni berhasil diperbarui!');
    } else {
      const { error } = await supabase
        .from('ruang_budaya')
        .insert([payload]);

      if (error) throw error;
      alert('Karya seni baru berhasil ditambahkan!');
    }
  };

  // Helper untuk format tampilan badge kategori di tabel
  const formatCategoryLabel = (cat) => {
    if (!cat) return '-';
    const labels = {
      'seni rupa': 'Seni Rupa',
      'seni tari': 'Seni Tari',
      'seni musik': 'Seni Musik',
      'seni teater/pertunjukan': 'Seni Teater/Pertunjukan',
      'seni tradisional & budaya': 'Seni Tradisional & Budaya',
      'seni kriya': 'Seni Kriya',
      'sastra & seni bahasa': 'Sastra & Seni Bahasa',
      'seni modern & digital': 'Seni Modern & Digital'
    };
    return labels[cat.toLowerCase()] || cat;
  };

  // Pencarian real-time berdasarkan Judul atau Kategori
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const searchedItems = useMemo(() => {
    if (!normalizedSearch) return itemsList;
    return itemsList.filter((item) =>
      getItemSearchableText(item).includes(normalizedSearch)
    );
  }, [itemsList, normalizedSearch]);

  const totalPages = Math.max(1, Math.ceil(searchedItems.length / ITEMS_PER_PAGE));

  // Reset ke halaman 1 setiap kali kata kunci pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedSearch]);

  // Jaga halaman tetap valid bila jumlah data mengecil (misal setelah hapus)
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
    <div className="anim-tab-content admin-panel">
      <div className="admin-panel-header">
        <div>
          <h3 className="admin-panel-title">
            <i className="bx bx-palette"></i> Manajemen Ruang Budaya
          </h3>
          <p className="admin-panel-desc">Kelola item seni dan karya kebudayaan Nusantara.</p>
        </div>
        <button onClick={handleAdd} className="admin-btn-primary">
          <i className="bx bx-plus admin-btn-icon"></i> Tambah Karya Seni
        </button>
      </div>

      {/* SEARCH BAR: pencarian real-time judul / kategori */}
      <div className="admin-search-bar">
        <svg
          className="admin-search-icon"
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
          className="admin-search-input"
          placeholder="Cari judul karya atau kategori..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Cari karya seni berdasarkan judul atau kategori"
        />
        {searchTerm && (
          <button
            type="button"
            className="admin-search-clear"
            onClick={() => setSearchTerm('')}
            aria-label="Hapus kata kunci pencarian"
          >
            &times;
          </button>
        )}
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-table-state">
            <i className="bx bx-loader-alt bx-spin admin-table-state-icon"></i>
            <p>Memuat data katalog kebudayaan...</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Judul Karya</th>
                <th>Kategori</th>
                <th>Deskripsi</th>
                <th className="admin-table-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-table-empty">
                    {normalizedSearch
                      ? `Tidak ditemukan karya seni yang cocok dengan kata kunci "${searchTerm.trim()}".`
                      : 'Belum ada karya seni yang ditambahkan.'}
                  </td>
                </tr>
              ) : (
                displayedItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ) : (
                        <i className="bx bx-image-alt" style={{ fontSize: '2rem', color: '#ccc' }}></i>
                      )}
                    </td>
                    <td className="admin-cell-name">{item.title || item.judul || '-'}</td>
                    <td>
                      <span className="admin-role-badge admin-role-badge--admin">
                        {formatCategoryLabel(item.category || item.kategori)}
                      </span>
                    </td>
                    <td className="admin-cell-muted" style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.description || item.deskripsi || '-'}
                    </td>
                    <td className="admin-table-center">
                      <button className="action-btn edit" title="Edit Karya" onClick={() => handleEdit(item)}>
                        <i className="bx bx-edit-alt"></i>
                      </button>
                      <button
                        className="action-btn delete"
                        title="Hapus Karya"
                        onClick={() => handleDelete(item.id, item.title || 'karya ini')}
                      >
                        <i className="bx bx-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* INFO HASIL & PAGINASI */}
      {!loading && searchedItems.length > 0 && (
        <p className="admin-table-result-info">
          Menampilkan <strong>{startIndex + 1}</strong>&ndash;
          <strong>{startIndex + displayedItems.length}</strong> dari{' '}
          <strong>{searchedItems.length}</strong> karya seni
        </p>
      )}

      {!loading && totalPages > 1 && (
        <nav className="admin-pagination" aria-label="Navigasi halaman tabel Ruang Budaya">
          <button
            type="button"
            className="admin-page-btn"
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
                className={`admin-page-btn ${page === activePage ? 'active' : ''}`}
                onClick={() => goToPage(page)}
                aria-current={page === activePage ? 'page' : undefined}
              >
                {page}
              </button>
            ) : (
              <span key={`ellipsis-${index}`} className="admin-page-ellipsis">
                &hellip;
              </span>
            )
          )}

          <button
            type="button"
            className="admin-page-btn"
            onClick={() => goToPage(activePage + 1)}
            disabled={activePage === totalPages}
          >
            Berikutnya &raquo;
          </button>
        </nav>
      )}

      {/* Render modal langsung ke body layar utama */}
      {showModal && createPortal(
        <RuangBudayaModal
          showModal={showModal}
          setShowModal={setShowModal}
          editingItem={editingItem}
          onSave={handleSave}
          onSuccess={fetchItems}
        />,
        document.body
      )}
    </div>
  );
}