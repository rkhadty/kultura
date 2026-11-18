import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from './supabase';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;

        if (!currentUser) {
          setLoading(false);
          return;
        }

        setUser(currentUser);

        // Cek metadata
        const metaRole = currentUser.app_metadata?.role || currentUser.user_metadata?.role;
        if (metaRole && ['admin', 'administrator'].includes(String(metaRole).toLowerCase())) {
          setIsAdminUser(true);
          setLoading(false);
          return;
        }

        // Cek tabel profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .maybeSingle();

        const roleStr = String(profile?.role || '').toLowerCase();
        if (roleStr === 'admin' || roleStr === 'administrator') {
          setIsAdminUser(true);
        }
      } catch (err) {
        console.error('Error ProtectedRoute:', err);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF6F0', color: '#8B4513' }}>
        <p>Memuat halaman...</p>
      </div>
    );
  }

  // Jika bukan admin, redirect ke Home
  if (!user || !isAdminUser) {
    return <Navigate to="/" replace />;
  }

  // Render children (AdminDashboard)
  return typeof children === 'function' ? children(user) : children;
}