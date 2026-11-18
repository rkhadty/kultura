import React from 'react';
import MegaMendungIcon from './MegaMendungIcon';

const NAV_ITEMS = [
  { key: 'dashboard', icon: 'bx-grid-alt', label: 'Beranda' },
  { key: 'pengguna', icon: 'bx-group', label: 'Pengguna' },
  { key: 'ruangbudaya', icon: 'bx-palette', label: 'Ruang Budaya' },
  { key: 'kuis', icon: 'bx-select-multiple', label: 'Kuis & Soal' },
  { key: 'tentang', icon: 'bx-info-circle', label: 'Tentang' },
];

export default function AdminNavbar({ activeTab, onTabChange, onBack, onLogout, isLoggingOut }) {
  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        {/* Brand Logo */}
        <div className="admin-brand" onClick={() => onTabChange('dashboard')}>
          <MegaMendungIcon size={1.1} shadow />
          <div>
            <h1 className="admin-brand-title">KULTURA</h1>
            <span className="admin-brand-sub">ADMIN PORTAL</span>
          </div>
        </div>

        {/* Menu Navigasi Tab */}
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-btn ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => onTabChange(item.key)}
            >
              <i className={`bx ${item.icon} admin-nav-icon`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="admin-nav-actions">
          <button onClick={onBack} className="admin-btn-return">
            <i className="bx bx-left-arrow-alt admin-btn-icon"></i>
            Kembali
          </button>

          <button
            onClick={onLogout}
            disabled={isLoggingOut}
            title="Keluar / Logout Akun"
            className="admin-btn-logout"
          >
            <i className={isLoggingOut ? 'bx bx-loader-alt bx-spin' : 'bx bx-log-out-circle'}></i>
            <span>{isLoggingOut ? 'Proses...' : 'Keluar'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}