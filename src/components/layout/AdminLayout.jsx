// LOGIKA: Layout wrapper semua halaman admin AFKAR LAND
// Desain: background konten PUTIH CLEAN, sidebar hitam terpisah
// Built with Webapp GASP Builder Era v2.0 Masterpiece Edition by @damarmahendra

import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiBell } from 'react-icons/fi';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // LOGIKA: Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-medium tracking-widest uppercase">Memuat sistem...</p>
        </div>
      </div>
    );
  }

  // LOGIKA: Guard — tidak ada sesi aktif
  if (!user) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="max-w-md bg-white p-10 rounded-3xl shadow-xl border-2 border-red-500 text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-black text-red-600 mb-3">Sesi Habis</h1>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Sesi login Anda tidak ditemukan. Silakan login kembali untuk mengakses panel admin AFKAR LAND.
          </p>
          <Link
            to="/admin/login"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Login Kembali
          </Link>
        </div>
      </div>
    );
  }

  return (
    // LOGIKA: Background utama PUTIH — sidebar hitam di kiri, konten putih di kanan
    <div className="flex min-h-screen bg-gray-50 font-body">

      {/* Overlay gelap saat sidebar mobile terbuka */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed kiri, lebar 256px */}
      <div className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Area konten utama — putih, geser kanan sejauh sidebar */}
      <main className="flex-1 md:ml-64 min-h-screen overflow-y-auto bg-gray-50">

        {/* ── TOPBAR MOBILE — putih bersih ── */}
        <div className="md:hidden flex items-center justify-between gap-4 px-5 py-4
                        bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <span className="text-lg font-heading font-extrabold tracking-widest text-gray-900">
              AFKAR <span className="text-red-600">LAND</span>
            </span>
          </div>
          {/* Bell notifikasi mobile */}
          <button className="relative p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <FiBell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
        </div>

        {/* ── KONTEN HALAMAN ── */}
        <div className="p-6 md:p-10">
          <Outlet />
        </div>

      </main>
    </div>
  );
}