import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AOS from 'aos';
import 'aos/dist/aos.css';

import './App.css';

// ==========================================
// NATIVE SVG ICON PACK (Bebas Error Import)
// ==========================================

// SVG Megamendung Logo
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

const TechIcons = {
  Code: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Zap: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Terminal: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Cpu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    </svg>
  ),
  Database: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  GitBranch: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  ),
  Cloud: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" />
    </svg>
  ),
  Book: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  ),
  Music: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Award: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  )
};

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Inisialisasi AOS Animasi
    AOS.init({ 
      duration: 1000, 
      once: true, 
      easing: 'ease-out-cubic',
      offset: 100
    });

    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* 1. INITIAL LOADING SPLASH SCREEN */}
      <div className={`splash-screen ${!initialLoading ? 'fade-out' : ''}`}>
        <div className="splash-logo-wrapper">
          <MegaMendungIcon size={1.8} />
        </div>
        <h1 className="splash-title">KULTURA</h1>
        <p className="splash-sub">Platform Edukasi Kesenian Nusantara</p>
        <div className="splash-spinner"></div>
      </div>

      {/* 2. NAVBAR UTAMA */}
      <header className="navbar bg-megamendung">
        <div className="navbar-container">
          <div className="brand">
            <MegaMendungIcon />
            <h1 className="brand-title">KULTURA</h1>
          </div>
          <Link to="/siswa" className="nav-jelajahi-btn">
            Jelajahi Galeri
          </Link>
        </div>
      </header>

      {/* HERO BANNER DENGAN ANIMASI AOS & CSS */}
      <section className="hero bg-megamendung" id="hero">
        {/* Glow Effect di Background */}
        <div className="hero-glow"></div>
        
        <div className="hero-container" data-aos="zoom-out-up">
          <h2 className="hero-title animate-text-float">Platform Preservasi & Edukasi Seni Nusantara</h2>
          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.3s' }}>
            KULTURA adalah ensiklopedia digital interaktif yang dirancang untuk memperkenalkan, mendokumentasikan, dan melestarikan ragam kesenian tradisional Indonesia.
          </p>
          <div className="megamendung-divider animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <MegaMendungIcon />
            <MegaMendungIcon />
            <MegaMendungIcon />
          </div>
        </div>
      </section>

      {/* 4. LANDING PAGE PORTOFOLIO */}
      <main className="main-container">
        {/* FITUR UTAMA DENGAN ANIMASI HOVER & AOS */}
        <div className="section-header" style={{ textAlign: 'center' }} data-aos="fade-up" id="fitur">
          <h3 className="section-title" style={{ justifyContent: 'center' }}>
            Fitur Utama Platform KULTURA
          </h3>
        </div>

        <div className="portfolio-features">
          <div className="feature-card animated-card" data-aos="fade-up" data-aos-delay="100">
            <div className="feature-icon glow-icon"><TechIcons.Book /></div>
            <h4 className="feature-title">Katalog Seni Digital</h4>
            <p className="feature-desc">Arsip lengkap alat musik tradisional, tarian daerah, dan karya kriya Nusantara beserta asal-usul daerah.</p>
          </div>

          <div className="feature-card animated-card" data-aos="fade-up" data-aos-delay="300">
            <div className="feature-icon glow-icon"><TechIcons.Music /></div>
            <h4 className="feature-title">Audio Player Interaktif</h4>
            <p className="feature-desc">Dengarkan alunan instrumen khas daerah secara langsung melalui pemutar audio Supabase.</p>
          </div>

          <div className="feature-card animated-card" data-aos="fade-up" data-aos-delay="500">
            <div className="feature-icon glow-icon"><TechIcons.Award /></div>
            <h4 className="feature-title">Kuis Edukasi</h4>
            <p className="feature-desc">Modul kuis interaktif yang dirancang untuk menguji pengetahuan kebudayaan Nusantara.</p>
          </div>
        </div>

        {/* TEKNOLOGI STACK DENGAN ANIMASI AOS & HOVER */}
        <div className="section-header" style={{ textAlign: 'center', marginTop: '6rem' }} data-aos="fade-up" id="tech">
          <h3 className="section-title" style={{ justifyContent: 'center' }}>
            Teknologi & Development Stack
          </h3>
        </div>

        <div className="tech-grid">
          {[
            { Icon: TechIcons.Code, title: 'React JS', badge: 'Frontend UI', desc: 'Library UI modern untuk membangun komponen visual web yang cepat dan responsif.' },
            { Icon: TechIcons.Zap, title: 'Vite JS', badge: 'Bundler', desc: 'Build tool generasi baru super cepat untuk pengalaman pengembangan efisien.' },
            { Icon: TechIcons.Terminal, title: 'VS Code', badge: 'IDE Code', desc: 'Editor kode utama dengan ekstensi modern untuk menjaga kerapian sintaksis.' },
            { Icon: TechIcons.Cpu, title: 'Node.js', badge: 'Runtime', desc: 'Lingkungan eksekusi JavaScript serta manajer paket (npm) untuk mengelola dependensi.' },
            { Icon: TechIcons.Database, title: 'Supabase', badge: 'Backend & Auth', desc: 'Backend PostgreSQL untuk otentikasi role, penyimpanan audio/gambar, & DB real-time.' },
            { Icon: TechIcons.GitBranch, title: 'GitHub', badge: 'Version Control', desc: 'Repository cloud untuk mengelola versi aplikasi dan kolaborasi antar pengembang.' },
            { Icon: TechIcons.Cloud, title: 'Vercel', badge: 'Cloud Hosting</span>', desc: 'Platform cloud hosting otomatis terhubung ke GitHub untuk publikasi cepat.' },
          ].map((tech, index) => (
            <div key={tech.title} className="tech-card animated-tech-card" data-aos="flip-left" data-aos-delay={index * 100}>
              <div className="tech-header-info">
                <div className="tech-icon-wrapper glow-icon"><tech.Icon /></div>
                <div>
                  <h4 className="tech-title">{tech.title}</h4>
                  <span className="tech-badge" dangerouslySetInnerHTML={{ __html: tech.badge }}></span>
                </div>
              </div>
              <p className="tech-desc">{tech.desc}</p>
            </div>
          ))}
        </div>

        <div className="cta-banner bg-megamendung" data-aos="zoom-in" data-aos-offset="50">
          <div className="hero-glow opacity-50"></div>
          <h3 className="cta-title">Siap Mengeksplorasi Kebudayaan Nusantara?</h3>
          <p style={{ color: '#E6D2B5', maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            Tidak perlu akun untuk menjelajah! Langsung akses Ruang Budaya, Kuis, dan Tentang kapan saja,
            dari mana saja.
          </p>
          <a href="/siswa" className="btn-cta animate-pulse">
            JELAJAHI GALERI
          </a>
        </div>
      </main>

      {/* FOOTER APLIKASI */}
      <footer className="footer bg-megamendung">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-brand-header">
              <MegaMendungIcon size={0.9} />
              <h3 className="footer-brand-title">KULTURA</h3>
            </div>
            <p className="footer-desc">
              Platform preservasi dan edukasi kebudayaan Nusantara modern. Wadah interaktif untuk mengenal kesenian daerah, musik tradisional, dan sejarah lokal Indonesia.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Navigasi</h4>
            <ul className="footer-links">
              <li><a href="#hero">&bull; Beranda</a></li>
              <li><a href="#fitur">&bull; Fitur Utama</a></li>
              <li><a href="#tech">&bull; Tech Stack</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Teknologi</h4>
            <ul className="footer-links">
              <li><a href="https://react.dev" target="_blank" rel="noreferrer">&bull; React JS & Vite</a></li>
              <li><a href="https://supabase.com" target="_blank" rel="noreferrer">&bull; Supabase Database</a></li>
              <li><a href="https://vercel.com" target="_blank" rel="noreferrer">&bull; Vercel Cloud</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} <span style={{color: '#E6C280'}}>KULTURA</span> &mdash; Preservasi Kebudayaan Nusantara. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}