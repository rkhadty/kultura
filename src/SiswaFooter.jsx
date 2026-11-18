import React from 'react';

export default function SiswaFooter() {
  return (
    <footer className="footer bg-megamendung siswa-footer">
      <div className="footer-bottom">
        <p className="siswa-footer-text">
          &copy; {new Date().getFullYear()} <span>KULTURA</span> &mdash; Dashboard Siswa Nusantara.
        </p>
      </div>
    </footer>
  );
}