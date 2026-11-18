import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

export default function AdminDashboardTab({ displayName, onNavigate }) {
  // State statistik real-time dari Supabase (awal 0 / loading)
  const [stats, setStats] = useState({
    totalKarya: 0,
    totalUsers: 0,
    totalSoal: 0,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardStats = async () => {
      try {
        // Total Karya Seni & Total Pengguna (count exact, head tanpa payload)
        const [karyaRes, usersRes] = await Promise.all([
          supabase.from('ruang_budaya').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
        ]);

        if (karyaRes.error) throw karyaRes.error;
        if (usersRes.error) throw usersRes.error;

        // Total Soal Kuis (opsional; error terpisah agar tidak menjatuhkan statistik utama)
        let totalSoal = 0;
        try {
          const { count, error } = await supabase
            .from('quiz_questions')
            .select('*', { count: 'exact', head: true });
          if (error) throw error;
          totalSoal = count ?? 0;
        } catch (soalError) {
          console.error('Gagal memuat total soal kuis:', soalError);
        }

        if (isMounted) {
          setStats({
            totalKarya: karyaRes.count ?? 0,
            totalUsers: usersRes.count ?? 0,
            totalSoal,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Gagal memuat statistik dashboard Supabase:', error);
        if (isMounted) {
          setStats((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    fetchDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="anim-tab-content">
      {/* HERO PANEL KONTROL */}
      <div className="admin-welcome">
        <span className="admin-welcome-badge">PANEL KONTROL ADMINISTRATOR</span>
        <h2 className="admin-welcome-title">Selamat Datang, {displayName}</h2>
        <p className="admin-welcome-text">
          Kelola koleksi kebudayaan Nusantara, bank soal kuis interaktif, dan manajemen akun pengguna secara terpusat.
        </p>
      </div>

      {/* STATISTIK RINGKAS */}
      <div className="admin-stats">
        <div className="admin-stat-card admin-stat-card--brown">
          <div>
            <span className="admin-stat-label">TOTAL KOLEKSI</span>
            <div className="admin-stat-value">
              {stats.isLoading ? 0 : stats.totalKarya} Karya
            </div>
          </div>
          <i className="bx bx-images admin-stat-icon--brown"></i>
        </div>

        <div className="admin-stat-card admin-stat-card--gold">
          <div>
            <span className="admin-stat-label">TOTAL USER</span>
            <div className="admin-stat-value">
              {stats.isLoading ? 0 : stats.totalUsers} Akun
            </div>
          </div>
          <i className="bx bx-user admin-stat-icon--gold"></i>
        </div>

        <div className="admin-stat-card admin-stat-card--green">
          <div>
            <span className="admin-stat-label">DATABASE</span>
            <div className="admin-stat-value admin-db-status">
              {stats.isLoading ? (
                <>
                  <i className="bx bx-loader-alt bx-spin"></i> Memuat...
                </>
              ) : (
                <>
                  <i className="bx bxs-check-circle"></i> Terhubung
                </>
              )}
            </div>
          </div>
          <i className="bx bx-data admin-stat-icon--green"></i>
        </div>
      </div>

      {/* MODUL UTAMA */}
      <h3 className="admin-module-title">
        <i className="bx bx-category"></i> Modul Utama
      </h3>
      <div className="admin-module-grid">
        <div className="admin-card-hover" onClick={() => onNavigate('pengguna')}>
          <div className="admin-icon-box admin-icon-box--gold">
            <i className="bx bx-group"></i>
          </div>
          <h4 className="admin-card-title">Manajemen Pengguna</h4>
          <p className="admin-card-text">
            Kelola data akun siswa dan administrator (Tambah, Edit, Hapus).
          </p>
        </div>

        <div className="admin-card-hover" onClick={() => onNavigate('ruangbudaya')}>
          <div className="admin-icon-box admin-icon-box--brown">
            <i className="bx bx-book-open"></i>
          </div>
          <h4 className="admin-card-title">Ruang Budaya</h4>
          <p className="admin-card-text">
            Kelola katalog karya seni, foto resolusi tinggi, audio narasi, dan sejarah kebudayaan.
          </p>
        </div>

        <div className="admin-card-hover" onClick={() => onNavigate('kuis')}>
          <div className="admin-icon-box admin-icon-box--gold-light">
            <i className="bx bx-task"></i>
          </div>
          <h4 className="admin-card-title">Kuis & Evaluasi</h4>
          <p className="admin-card-text">
            Atur bank soal pilihan ganda, kunci jawaban, serta evaluasi pengerjaan kuis siswa.
          </p>
        </div>
      </div>
    </div>
  );
}