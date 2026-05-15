import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiMessageSquare, FiFileText,
  FiBriefcase, FiSettings, FiLogOut, FiHome, FiX
} from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Sidebar({ onClose }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Berhasil keluar dari sistem');
      navigate('/admin/login');
    } catch {
      toast.error('Gagal saat mencoba keluar');
    }
  };

  const menuGroups = [
    {
      label: 'Utama',
      items: [
        { path: '/admin/dashboard',    icon: <FiGrid size={18} />,        label: 'Dashboard' },
      ],
    },
    {
      label: 'Konten Web',
      items: [
        { path: '/admin/projects',     icon: <MdApartment size={18} />,   label: 'Kelola Proyek' },
        { path: '/admin/articles',     icon: <FiFileText size={18} />,    label: 'Kelola Artikel' },
      ],
    },
    {
      label: 'Manajemen',
      items: [
        { path: '/admin/leads',        icon: <FiUsers size={18} />,       label: 'Data Leads' },
        { path: '/admin/messages',     icon: <FiMessageSquare size={18}/>, label: 'Pesan Masuk' },
        { path: '/admin/applications', icon: <FiBriefcase size={18} />,   label: 'Lamaran Kerja' },
      ],
    },
    {
      label: 'Sistem',
      items: [
        { path: '/admin/settings',     icon: <FiSettings size={18} />,    label: 'Pengaturan Web' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0A0A0A] text-white min-h-screen flex flex-col border-r border-white/5">

      {/* Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
        <div className="text-xl font-heading font-extrabold tracking-widest">
          AFKAR <span className="text-red-500">ADMIN</span>
        </div>
        {/* Tombol tutup sidebar di mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      {/* User info */}
      {user && (
        <div className="px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-white truncate">
                {user.displayName || 'Admin'}
              </div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigasi */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-3">
              {group.label}
            </p>
            <nav className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                        : 'text-gray-400 hover:bg-white/8 hover:text-white'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Lihat web publik + Logout */}
      <div className="p-3 border-t border-white/5 space-y-1 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-white/8 hover:text-white transition-all text-sm font-medium"
        >
          <FiHome size={16} />
          Lihat Website
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-500/15 hover:text-red-400 transition-all text-sm font-medium"
        >
          <FiLogOut size={16} />
          Keluar Sistem
        </button>
      </div>
    </aside>
  );
}