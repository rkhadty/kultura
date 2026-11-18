import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Helper untuk validasi status Admin dari DB Profiles maupun Metadata
  const checkIsAdmin = async (user) => {
    if (!user) return false;

    // 1. Cek dari App/User Metadata
    const metaRole = user.app_metadata?.role || user.user_metadata?.role;
    if (metaRole && ['admin', 'administrator'].includes(String(metaRole).toLowerCase())) {
      return true;
    }

    // 2. Cek dari Tabel 'profiles' di Supabase
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (!error && profile?.role) {
        const roleStr = String(profile.role).toLowerCase();
        if (roleStr === 'admin' || roleStr === 'administrator') {
          return true;
        }
      }
    } catch (e) {
      console.error('Error saat verifikasi role admin:', e);
    }

    return false;
  };

  useEffect(() => {
    // Pengecekan awal jika user sudah punya session login
    supabase.auth.getSession().then(async ({ data }) => {
      const current = data.session?.user ?? null;
      if (current) {
        const adminValid = await checkIsAdmin(current);
        if (adminValid) {
          navigate('/admin', { replace: true });
        }
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const current = session?.user ?? null;
      if (current) {
        const adminValid = await checkIsAdmin(current);
        if (adminValid) {
          navigate('/admin', { replace: true });
        }
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

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

      // Verifikasi apakah user ini Admin
      const adminValid = await checkIsAdmin(data.user);

      if (!adminValid) {
        await supabase.auth.signOut();
        setAuthError('Akses ditolak. Akun ini bukan Administrator Kultura.');
        setAuthLoading(false);
        return;
      }

      setEmail('');
      setPassword('');
      navigate('/admin', { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Gagal masuk. Periksa email dan password.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF6F0', padding: '1rem' }}>
      <div className="login-card animate-pop-in">
        <div className="login-header bg-megamendung">
          <MegaMendungIcon />
          <h3 className="login-title">AKSES ADMINISTRATOR</h3>
          <p style={{ color: '#D6C2B0', margin: '0.5rem 0 0 0', fontSize: '0.8rem' }}>
            Portal khusus pengelola Kultura
          </p>
        </div>

        <div className="login-body">
          {authError && <div className="alert-error">{authError}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Administrator</label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@kultura.id"
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
              {authLoading ? 'Memproses...' : 'MASUK SEBAGAI ADMIN'}
            </button>
          </form>

          <p style={{ textAlign: 'center', margin: '1.25rem 0 0 0', fontSize: '0.75rem', color: '#999' }}>
            Halaman ini hanya untuk Administrator Kultura.
          </p>
        </div>
      </div>
    </div>
  );
}