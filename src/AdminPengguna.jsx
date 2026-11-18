import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from './supabase';
import UserModal from './UserModal';

// Jumlah baris pengguna maksimum yang tampil per halaman
const USERS_PER_PAGE = 5;

// Membaca nama/email dari berbagai kemungkinan nama field
const getUserSearchableText = (user) =>
  [user?.email, user?.name, user?.full_name]
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

export default function AdminPenggunaTab() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // State pencarian & paginasi (lokal, tidak mengubah logika CRUD)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // READ: Fetch data (hanya mengambil administrator & pengajar_seni)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Kolom nama (full_name/name) diambil secara opsional untuk kebutuhan pencarian
      let { data, error } = await supabase
        .from('profiles')
        .select('id, email, role, created_at, full_name, name')
        .in('role', ['administrator', 'pengajar_seni'])
        .order('created_at', { ascending: false });

      // Fallback: jika tabel profiles belum punya kolom nama, gunakan query asli
      if (error) {
        ({ data, error } = await supabase
          .from('profiles')
          .select('id, email, role, created_at')
          .in('role', ['administrator', 'pengajar_seni'])
          .order('created_at', { ascending: false }));
      }

      if (error) throw error;
      setUsersList(data || []);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      alert('Gagal mengambil data pengguna: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  // DELETE: Hapus Pengguna
  const handleDelete = async (id, email) => {
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin menghapus akun "${email}"?`);
    if (!isConfirmed) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsersList((prev) => prev.filter((user) => user.id !== id));
      alert('Pengguna berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting user:', error.message);
      alert('Gagal menghapus pengguna: ' + error.message);
    }
  };

  // Helper Format Role Label
  const formatRoleLabel = (role) => {
    switch (role) {
      case 'administrator':
        return 'Administrator';
      case 'pengajar_seni':
        return 'Pengajar Seni';
      default:
        return role;
    }
  };

  // Pencarian real-time berdasarkan Nama atau Email
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const searchedUsers = useMemo(() => {
    if (!normalizedSearch) return usersList;
    return usersList.filter((user) =>
      getUserSearchableText(user).includes(normalizedSearch)
    );
  }, [usersList, normalizedSearch]);

  const totalPages = Math.max(1, Math.ceil(searchedUsers.length / USERS_PER_PAGE));

  // Reset ke halaman 1 setiap kali kata kunci pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedSearch]);

  // Jaga halaman tetap valid bila jumlah data mengecil (misal setelah hapus)
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * USERS_PER_PAGE;
  const displayedUsers = searchedUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
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
            <i className="bx bx-group"></i> Manajemen Pengguna
          </h3>
          <p className="admin-panel-desc">Kelola akun Administrator dan Pengajar Seni.</p>
        </div>
        <button onClick={handleAdd} className="admin-btn-primary">
          <i className="bx bx-user-plus admin-btn-icon"></i> Tambah Akun
        </button>
      </div>

      {/* SEARCH BAR: pencarian real-time nama / email */}
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
          placeholder="Cari nama atau email pengguna..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Cari pengguna berdasarkan nama atau email"
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

      {/* TABEL USER */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-table-state">
            <i className="bx bx-loader-alt bx-spin admin-table-state-icon"></i>
            <p>Memuat data pengguna...</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Tanggal Dibuat</th>
                <th className="admin-table-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="admin-table-empty">
                    {normalizedSearch
                      ? `Tidak ditemukan pengguna yang cocok dengan kata kunci "${searchTerm.trim()}".`
                      : 'Belum ada data staf/pengelola.'}
                  </td>
                </tr>
              ) : (
                displayedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="admin-cell-name">{user.email}</td>
                    <td>
                      <span className={`admin-role-badge admin-role-badge--${user.role}`}>
                        {formatRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="admin-cell-muted">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="admin-table-center">
                      <button className="action-btn edit" title="Edit User" onClick={() => handleEdit(user)}>
                        <i className="bx bx-edit-alt"></i>
                      </button>
                      <button
                        className="action-btn delete"
                        title="Hapus User"
                        onClick={() => handleDelete(user.id, user.email)}
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
      {!loading && searchedUsers.length > 0 && (
        <p className="admin-table-result-info">
          Menampilkan <strong>{startIndex + 1}</strong>&ndash;
          <strong>{startIndex + displayedUsers.length}</strong> dari{' '}
          <strong>{searchedUsers.length}</strong> pengguna
        </p>
      )}

      {!loading && totalPages > 1 && (
        <nav className="admin-pagination" aria-label="Navigasi halaman tabel pengguna">
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

      <UserModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingUser={editingUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
