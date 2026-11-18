import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';
import UserModal from './UserModal';
import AdminDashboardTab from './AdminHome';
import AdminPenggunaTab from './AdminPengguna';
import AdminRuangBudayaTab from './AdminRuangBudaya';
import AdminKuisTab from './AdminKuis';
import AdminTentangTab from './AdminTentang';

export default function AdminDashboard({ user: initialUser }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(initialUser || null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // State Manajemen User
  const [usersList, setUsersList] = useState([
    { id: '1', name: 'Ahmad Fauzi', email: 'ahmad@kultura.id', role: 'Siswa' },
    { id: '2', name: 'Siti Aminah', email: 'siti@kultura.id', role: 'Siswa' },
    { id: '3', name: 'Budi Santoso', email: 'budi@kultura.id', role: 'Admin' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Siswa' });

  const checkAdminRole = async (user) => {
    if (!user) return false;

    const metaRole = user.app_metadata?.role || user.user_metadata?.role;
    if (metaRole && ['admin', 'administrator'].includes(String(metaRole).toLowerCase())) {
      return true;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      const roleStr = String(profile?.role || '').toLowerCase();
      return roleStr === 'admin' || roleStr === 'administrator';
    } catch (e) {
      console.error('Verifikasi role gagal:', e);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async (user) => {
      if (isLoggingOut) return;
      setIsVerifying(true);

      if (!user) {
        if (isMounted) navigate('/', { replace: true });
        return;
      }

      const validAdmin = await checkAdminRole(user);
      if (!validAdmin) {
        if (isMounted) navigate('/', { replace: true });
      } else {
        if (isMounted) {
          setCurrentUser(user);
          setIsVerifying(false);
        }
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      verifyUser(data.session?.user ?? initialUser);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        navigate('/', { replace: true });
        return;
      }
      verifyUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [navigate, initialUser, isLoggingOut]);

  // Handler Logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      setCurrentUser(null);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.clear();
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handler CRUD User
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Siswa' });
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
    setShowModal(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      setUsersList(usersList.filter((u) => u.id !== id));
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      setUsersList(usersList.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
    } else {
      const newUser = {
        id: Date.now().toString(),
        ...formData,
      };
      setUsersList([...usersList, newUser]);
    }

    setShowModal(false);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const displayName = currentUser?.user_metadata?.full_name || currentUser?.email || 'Administrator';

  if (isVerifying || isLoggingOut) {
    return (
      <div className="admin-loading">
        <i className="bx bx-loader-alt bx-spin admin-loading-spinner"></i>
        <p className="admin-loading-text">
          {isLoggingOut ? 'MENGELUARKAN AKUN...' : 'MEMVERIFIKASI HAK AKSES ADMIN...'}
        </p>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* NAVBAR STICKY */}
      <AdminNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => navigate('/siswa')}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <AdminDashboardTab
            displayName={displayName}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'pengguna' && (
          <AdminPenggunaTab
            usersList={usersList}
            onAdd={handleOpenAddModal}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteUser}
          />
        )}

        {activeTab === 'ruangbudaya' && <AdminRuangBudayaTab />}

        {activeTab === 'kuis' && <AdminKuisTab />}

        {activeTab === 'tentang' && <AdminTentangTab />}
      </main>

      {/* MODAL TAMBAH / EDIT USER */}
      <UserModal
        isOpen={showModal}
        editingUser={editingUser}
        formData={formData}
        onChange={handleFormChange}
        onClose={() => setShowModal(false)}
        onSave={handleSaveUser}
      />

      {/* FOOTER */}
      <AdminFooter />
    </div>
  );
}