import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import SiswaDashboard from './SiswaPage.jsx';
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from './AdminPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rute utama Landing Page (Publik) */}
        <Route path="/" element={<App />} />

        {/* Rute Dashboard Utama (Publik / Tanpa Login) */}
        <Route path="/siswa" element={<SiswaDashboard />} />

        {/* Rute Tersembunyi Login Khusus Administrator */}
        <Route path="/poiuqwerty" element={<AdminLogin />} />

        {/* Rute Dashboard Administrator (Terproteksi) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              {(user) => <AdminDashboard user={user} />}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);