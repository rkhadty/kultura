import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from './supabase';

export default function UserModal({ showModal, setShowModal, editingUser, onSuccess }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('pengajar_seni');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setEmail(editingUser.email || '');
      setRole(editingUser.role || 'pengajar_seni');
      setPassword(''); // Reset password field saat mode edit
    } else {
      setEmail('');
      setRole('pengajar_seni');
      setPassword('');
    }
    setShowPassword(false);
  }, [editingUser, showModal]);

  if (!showModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingUser) {
        // --- MODE EDIT ---
        // 1. Update Role/Email di tabel profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role, email })
          .eq('id', editingUser.id);

        if (profileError) throw profileError;

        // 2. Jika password diisi, update password user di Supabase Auth
        if (password.trim() !== '') {
          const { error: authError } = await supabase.rpc('admin_update_user_password', {
            target_user_id: editingUser.id,
            new_password: password,
          });

          // Jika fungsi RPC belum dibuat di Supabase, fallback gunakan updateUser
          if (authError) {
            const { error: updateAuthErr } = await supabase.auth.updateUser({
              password: password,
            });
            if (updateAuthErr) throw new Error('Gagal memperbarui password: ' + updateAuthErr.message);
          }
        }

        alert('Data pengguna berhasil diperbarui!');
      } else {
        // --- MODE TAMBAH AKUN BARU ---
        if (!password) {
          alert('Password wajib diisi untuk akun baru!');
          setLoading(false);
          return;
        }

        // SignUp akun baru
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role },
          },
        });

        if (authError) throw authError;

        // Simpan data role ke tabel profiles
        if (authData?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              email: email,
              role: role,
            });

          if (profileError) console.error('Gagal update profile role:', profileError.message);
        }

        alert('Akun pengguna baru berhasil dibuat!');
      }

      setShowModal(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving user:', error.message);
      alert('Gagal menyimpan pengguna: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            {editingUser ? 'Edit Pengguna & Password' : 'Tambah Akun Baru'}
          </h3>
          <button
            onClick={() => setShowModal(false)}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@domain.com"
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Role / Peran</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              <option value="pengajar_seni">Pengajar Seni</option>
              <option value="administrator">Administrator</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Password {editingUser && <span style={{ fontSize: '0.8rem', color: '#888' }}>(Kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required={!editingUser}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editingUser ? 'Ketik password baru...' : 'Masukkan password...'}
                style={{
                  width: '100%',
                  padding: '0.6rem 2.5rem 0.6rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <i className={showPassword ? 'bx bx-show' : 'bx bx-hide'}></i>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-btn-primary"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan' : 'Tambah Akun'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}