import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import SiswaNavbar from './SiswaNavbar';
import SiswaFooter from './SiswaFooter';
import ArtDetailModal from './ArtDetail';
import SiswaDashboardTab from './SiswaHome';
import SiswaRuangBudayaTab from './SiswaRuangBudaya';
import SiswaKuisTab from './SiswaKuis';
import SiswaTentangTab from './SiswaTentang';
import { RUANG_BUDAYA_CATEGORIES, DEFAULT_ARTS, filterArtsByCategory } from './data';

export default function SiswaDashboard() {
  const [arts, setArts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedArtModal, setSelectedArtModal] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // PUBLIK: data diambil dari tabel 'ruang_budaya' Supabase
  const fetchArts = async () => {
    try {
      setLoading(true);
      // PERBAIKAN 1: Ganti nama tabel dari 'arts' ke 'ruang_budaya'
      const { data, error } = await supabase
        .from('ruang_budaya')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setArts(DEFAULT_ARTS);
      } else {
        setArts(data);
      }
    } catch (err) {
      console.error('Error fetching arts:', err);
      setArts(DEFAULT_ARTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArts();
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
  };

  // Filter kategori memakai helper tunggal agar tidak ada logika berbeda antar komponen
  const filteredArts = filterArtsByCategory(arts, selectedCategory);

  return (
    <div className="siswa-shell">
      {/* NAVBAR RESPONSIVE */}
      <SiswaNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobile={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* MAIN CONTENT */}
      <main className="main-container siswa-main">
        {activeTab === 'dashboard' && (
          <SiswaDashboardTab
            arts={arts}
            onGoToRuangBudaya={() => handleTabChange('ruang-budaya')}
          />
        )}

        {activeTab === 'ruang-budaya' && (
          <SiswaRuangBudayaTab
            loading={loading}
            filteredArts={filteredArts}
            selectedCategory={selectedCategory}
            categories={RUANG_BUDAYA_CATEGORIES}
            onSelectCategory={setSelectedCategory}
            onSelectArt={setSelectedArtModal}
          />
        )}

        {activeTab === 'kuis' && <SiswaKuisTab />}

        {activeTab === 'tentang' && <SiswaTentangTab />}
      </main>

      {/* MODAL SPOILER */}
      {selectedArtModal && (
        <ArtDetailModal art={selectedArtModal} onClose={() => setSelectedArtModal(null)} />
      )}

      {/* FOOTER */}
      <SiswaFooter />
    </div>
  );
}