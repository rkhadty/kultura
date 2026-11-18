import React from 'react';

export default function AdminFooter() {
  return (
    <footer className="admin-footer">
      <p className="admin-footer-text">
        <i className="bx bx-copyright"></i> {new Date().getFullYear()}{' '}
        <strong className="admin-footer-brand">KULTURA</strong> â€” Platform Administrator Edukasi Budaya.
      </p>
    </footer>
  );
}