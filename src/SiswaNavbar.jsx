import React from 'react';
import MegaMendungIcon from './MegaMendungIcon';
import { SiswaIcons } from './SiswaIcons';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', Icon: SiswaIcons.Dashboard },
  { key: 'ruang-budaya', label: 'Ruang Budaya', Icon: SiswaIcons.RuangBudaya },
  { key: 'kuis', label: 'Kuis', Icon: SiswaIcons.Kuis },
  { key: 'tentang', label: 'Tentang', Icon: SiswaIcons.Tentang },
];

export default function SiswaNavbar({ activeTab, onTabChange, isMobileMenuOpen, onToggleMobile }) {
  return (
    <header className="navbar bg-megamendung">
      <div className="navbar-container">
        <div className="brand siswa-brand-clickable" onClick={() => onTabChange('dashboard')}>
          <MegaMendungIcon />
          <h1 className="brand-title">KULTURA</h1>
        </div>

        {/* MENUS DESKTOP */}
        <nav className="siswa-nav-desktop">
          {NAV_ITEMS.map(({ key, label, Icon }) => (
            <button
              key={key}
              className={`siswa-nav-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => onTabChange(key)}
            >
              <Icon /> {label}
            </button>
          ))}
        </nav>

        {/* HAMBURGER MOBILE */}
        <button className="btn-hamburger-siswa" onClick={onToggleMobile} aria-label="Toggle Menu">
          {isMobileMenuOpen ? <SiswaIcons.Close /> : <SiswaIcons.Menu />}
        </button>
      </div>

      {/* DRAWER MOBILE */}
      {isMobileMenuOpen && (
        <div className="siswa-nav-mobile bg-megamendung">
          {NAV_ITEMS.map(({ key, label, Icon }) => (
            <button
              key={key}
              className={`siswa-nav-btn-mobile ${activeTab === key ? 'active' : ''}`}
              onClick={() => onTabChange(key)}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}