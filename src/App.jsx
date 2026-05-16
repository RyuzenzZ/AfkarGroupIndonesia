import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast'; // <-- TAMBAHAN PENTING

// 0. Komponen Animasi Intro
import Loader from './components/ui/Loader';

// 1. Mengimpor Layout (Pembungkus Halaman)
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// 2. Mengimpor Halaman Publik (File Individu)
import Home from './pages/Home';
import About from './pages/About';
import Career from './pages/Career';
import Projects from './pages/Projects';         // ✅ sudah ada
import ProjectDetail from './pages/ProjectDetail'; // ✅ TAMBAHKAN INI
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound';

// 3. Mengimpor Halaman Admin
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Settings from './pages/admin/Settings';
import ManageLeads from './pages/admin/ManageLeads';
import ManageMessages from './pages/admin/ManageMessages';
import ManageApplications from './pages/admin/ManageApplications';
import ManageArticles from './pages/admin/ManageArticles';
import ManageProjects from './pages/admin/ManageProjects';
import ManageUnits from './pages/admin/ManageUnits';

export default function App() {
  // STATE UNTUK ANIMASI LOADER
  const [showIntro, setShowIntro] = useState(true);

  // EFEK: Tahan layar di Intro selama 3.5 detik saat pertama kali web dibuka
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ==========================================
          NOTIFIKASI GLOBAL (Wajib ada agar pesan muncul)
          ========================================== */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* ==========================================
          LAYER ANIMASI INTRO (LAYAR TUMPUK)
          ========================================== */}
      <AnimatePresence mode="wait">
        {showIntro && <Loader />}
      </AnimatePresence>

      {/* ==========================================
          KONTEN UTAMA APLIKASI (ROUTER)
          ========================================== */}
      <Routes>
        {/* A. RUTE HALAMAN PUBLIK (Untuk Pengunjung) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tentang-kami" element={<About />} />
          <Route path="/karir" element={<Career />} />
          <Route path="/proyek" element={<Projects />} />              {/* ✅ TAMBAHKAN */}
          <Route path="/proyek/:slug" element={<ProjectDetail />} />
          <Route path="/artikel" element={<Blog />} />
          <Route path="/artikel/:slug" element={<BlogDetail />} />
          <Route path="/kontak" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        {/* B. RUTE LOGIN ADMIN */}
        <Route path="/admin/login" element={<Login />} />

        {/* C. RUTE PANEL ADMIN (Untuk Anda) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="leads" element={<ManageLeads />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="applications" element={<ManageApplications />} />
          <Route path="articles" element={<ManageArticles />} /> 
          <Route path="projects" element={<ManageProjects />} />
          <Route path="units" element={<ManageUnits />} />
     
        </Route>

        {/* D. RUTE 404 (Halaman Tidak Ditemukan) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}