import React from 'react';

export default function AdminTentangTab() {
  return (
    <div className="anim-tab-content admin-panel">
      <h3 className="admin-panel-title">
        <i className="bx bx-info-circle"></i> Tentang Platform Admin Kultura
      </h3>
      <p className="admin-about-text">
        <strong>Kultura Admin Portal</strong> adalah sistem pusat kontrol untuk mengelola konten media
        pembelajaran kebudayaan dan kuis interaktif dengan gaya visual etnik Megamendung modern.
      </p>

      <div className="admin-about-grid">
        <div className="admin-about-card">
          <i className="bx bx-shield-quarter admin-about-icon admin-about-icon--brown"></i>
          <div>
            <span className="admin-about-label">PERAN SEKARANG</span>
            <div className="admin-about-value">Super Administrator</div>
          </div>
        </div>

        <div className="admin-about-card">
          <i className="bx bx-server admin-about-icon admin-about-icon--green"></i>
          <div>
            <span className="admin-about-label">STATUS KONEKSI</span>
            <div className="admin-about-value">Supabase Connected</div>
          </div>
        </div>
      </div>
    </div>
  );
}