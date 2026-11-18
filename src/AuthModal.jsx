import React, { useState } from 'react';
import { supabase } from './supabase';

const MegaMendungIcon = ({ size = 1 }) => (
  <svg
    width={40 * size}
    height={24 * size}
    viewBox="0 0 60 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 25C10 20 15 15 22 15C25 10 32 8 40 12C46 8 55 12 55 18C58 20 58 25 55 27C20 30 10 28 10 25Z" fill="#8B4513" opacity="0.4" />
    <path d="M5 28C5 22 11 17 19 17C23 11 30 9 38 13C44 9 52 13 52 19C56 22 55 27 51 29C44 32 25 32 5 28Z" fill="#E6C280" />
    <path d="M15 28C15 24 19 21 24 21C27 17 32 16 37 18C41 16 46 18 46 22C49 24 48 27 45 28C40 30 25 30 15 28Z" fill="#5C2C16" />
  </svg>
);

const EyeIcons = {
  Show: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Hide: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
};

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isOpenPrev, setIsOpenPrev] = useState(isOpen);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);

  if (isOpenPrev !== isOpen) {
    setIsOpenPrev(isOpen);
    if (isOpen) {
      setAuthMode('login');
      setAuthError(null);
      setAuthSuccess(null);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setEmail('');
      setPassword('');
      onClose();
      if (onSuccess) onSuccess(data.user);
    } catch (err) {
      setAuthError(err.message || 'Gagal masuk. Periksa email dan password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      setAuthSuccess('Pendaftaran Siswa berhasil! Silakan masuk dengan akun Anda.');
      setAuthMode('login');
      setPassword('');
    } catch (err) {
      setAuthError(err.message || 'Gagal mendaftar akun siswa.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className={`login-modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="login-card animate-pop-in">
        <div className="login-header bg-megamendung">
          <button className="btn-close-modal" onClick={onClose}>âœ•</button>
          <MegaMendungIcon />
          <h3 className="login-title">AKSES KULTURA</h3>

          <div className="auth-tabs" style={{ marginTop: '1rem' }}>
            <button
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccess(null); }}
            >
              MASUK
            </button>
            <button
              className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
              onClick={() => { setAuthMode('register'); setAuthError(null); setAuthSuccess(null); }}
            >
              DAFTAR SISWA
            </button>
          </div>
        </div>

        <div className="login-body">
          {authError && <div className="alert-error">{authError}</div>}
          {authSuccess && <div className="alert-success">{authSuccess}</div>}

          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="siswa@sekolah.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kata Sandi</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input password-input"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeIcons.Hide /> : <EyeIcons.Show />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={authLoading}>
              {authLoading
                ? 'Memproses...'
                : authMode === 'login' ? 'MASUK SEKARANG' : 'DAFTAR SEBAGAI SISWA'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}