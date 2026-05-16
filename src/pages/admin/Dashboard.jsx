// LOGIKA: Dashboard utama AFKAR LAND — White Clean Edition
// Background putih, kartu shadow ringan, aksen merah & abu-abu
// Statistik realtime Firestore, quick actions, shortcut fitur premium
// Built with Webapp GASP Builder Era v2.0 Masterpiece Edition by @damarmahendra

import React, { useState, useEffect } from 'react';
import {
  FiUsers, FiMessageSquare, FiFileText, FiBriefcase,
  FiArrowRight, FiTrendingUp, FiBell, FiZap,
  FiShield, FiActivity, FiDownload
} from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import {
  BarChart2, CalendarCheck, Wallet, Bot,
  BookOpen, Star, Map, Video
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

// LOGIKA: Kartu statistik — putih, border abu, hover shadow merah ringan
const StatCard = ({ stat, loading }) => (
  <Link
    to={stat.link}
    className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm
               hover:shadow-md hover:border-red-100 transition-all duration-300 overflow-hidden relative"
  >
    {/* Garis warna atas sesuai tema kartu */}
    <div className={`absolute top-0 left-0 right-0 h-0.5 ${stat.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />

    <div className="flex items-center justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
        {stat.icon}
      </div>
      <FiArrowRight
        size={14}
        className="text-gray-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all"
      />
    </div>
    <div>
      <div className="text-2xl font-extrabold text-gray-900">
        {loading
          ? <span className="inline-block w-10 h-7 bg-gray-100 rounded animate-pulse" />
          : stat.value
        }
      </div>
      <div className="text-xs font-semibold text-gray-700 mt-1">{stat.title}</div>
      <div className="text-xs text-gray-400 mt-0.5">{stat.desc}</div>
    </div>
  </Link>
);

// LOGIKA: Baris quick action — hover bg abu muda, teks merah pada panah
const QuickAction = ({ action }) => (
  <Link
    to={action.path}
    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${action.color}`}>
      {action.icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
        {action.label}
      </div>
      {action.sub && <div className="text-xs text-gray-400">{action.sub}</div>}
    </div>
    <FiArrowRight size={13} className="text-gray-300 group-hover:text-red-500 transition-all shrink-0" />
  </Link>
);

// LOGIKA: Indikator status — putih, dot hijau berkedip
const StatusDot = ({ label }) => (
  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
    <span className="text-xs font-medium text-gray-600">{label}</span>
    <span className="ml-auto text-xs font-bold text-emerald-600">Aktif</span>
  </div>
);

// LOGIKA: Widget shortcut fitur premium — kartu kecil dengan ikon
const FeatureCard = ({ icon, label, path, badge, iconBg }) => (
  <Link
    to={path}
    className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100
               rounded-2xl hover:border-red-200 hover:shadow-sm transition-all group text-center"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-xs font-medium text-gray-500 group-hover:text-gray-800 transition-colors leading-tight">
      {label}
    </span>
    {badge && (
      <span className="text-[9px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold">
        {badge}
      </span>
    )}
  </Link>
);

export default function Dashboard() {
  const [counts, setCounts] = useState({
    leads: 0, messages: 0, applications: 0,
    articles: 0, projects: 0, bookings: 0
  });
  const [loading, setLoading] = useState(true);

  // LOGIKA: Listener realtime Firestore — 6 koleksi sekaligus
  useEffect(() => {
    let resolved = 0;
    const check = () => { resolved++; if (resolved >= 6) setLoading(false); };

    const u1 = onSnapshot(collection(db, 'leads'),        s => { setCounts(p => ({ ...p, leads: s.size }));        check(); });
    const u2 = onSnapshot(collection(db, 'messages'),     s => { setCounts(p => ({ ...p, messages: s.size }));     check(); });
    const u3 = onSnapshot(collection(db, 'applications'), s => { setCounts(p => ({ ...p, applications: s.size })); check(); });
    const u4 = onSnapshot(collection(db, 'articles'),     s => { setCounts(p => ({ ...p, articles: s.size }));     check(); });
    const u5 = onSnapshot(collection(db, 'projects'),     s => { setCounts(p => ({ ...p, projects: s.size }));     check(); });
    const u6 = onSnapshot(collection(db, 'bookings'),     s => { setCounts(p => ({ ...p, bookings: s.size }));     check(); });

    return () => { u1(); u2(); u3(); u4(); u5(); u6(); };
  }, []);

  // LOGIKA: Data 6 kartu statistik
  const stats = [
    { title: 'Total Proyek',   value: counts.projects,     icon: <MdApartment size={20} className="text-red-600"/>,    iconBg: 'bg-red-50',     accent: 'bg-red-500',     link: '/admin/projects',     desc: 'Proyek properti aktif' },
    { title: 'Lead Masuk',     value: counts.leads,        icon: <FiUsers size={20} className="text-blue-600"/>,       iconBg: 'bg-blue-50',    accent: 'bg-blue-500',    link: '/admin/leads',        desc: 'Calon konsumen baru' },
    { title: 'Booking Aktif',  value: counts.bookings,     icon: <CalendarCheck size={20} className="text-emerald-600"/>, iconBg: 'bg-emerald-50', accent: 'bg-emerald-500', link: '/admin/bookings',     desc: 'Unit sedang dipesan' },
    { title: 'Pesan Masuk',    value: counts.messages,     icon: <FiMessageSquare size={20} className="text-amber-600"/>, iconBg: 'bg-amber-50',   accent: 'bg-amber-500',   link: '/admin/messages',     desc: 'Dari halaman kontak' },
    { title: 'Lamaran Kerja',  value: counts.applications, icon: <FiBriefcase size={20} className="text-purple-600"/>, iconBg: 'bg-purple-50',  accent: 'bg-purple-500',  link: '/admin/applications', desc: 'Calon tim AFKAR LAND' },
    { title: 'Artikel Publik', value: counts.articles,     icon: <FiFileText size={20} className="text-pink-600"/>,    iconBg: 'bg-pink-50',    accent: 'bg-pink-500',    link: '/admin/articles',     desc: 'Konten blog aktif' },
  ];

  // LOGIKA: Quick actions — akses fitur utama 1 klik
  const quickActions = [
    { label: 'Tambah Proyek Baru',     sub: 'Manajemen Project',  path: '/admin/projects',    icon: <MdApartment size={16}/>,  color: 'bg-red-600' },
    { label: 'Kelola Booking Unit',    sub: 'Smart Booking F.21', path: '/admin/bookings',    icon: <CalendarCheck size={16}/>, color: 'bg-emerald-600' },
    { label: 'Data Leads Masuk',       sub: 'CRM & Konsumen',     path: '/admin/leads',       icon: <FiUsers size={16}/>,       color: 'bg-blue-600' },
    { label: 'AI Content Generator',   sub: 'Tools AI F.30',      path: '/admin/ai-content',  icon: <Bot size={16}/>,           color: 'bg-violet-600' },
    { label: 'Performa Tim Marketing', sub: 'Leaderboard F.27',   path: '/admin/performance', icon: <BarChart2 size={16}/>,     color: 'bg-orange-500' },
    { label: 'Keuangan Internal',      sub: 'Financial F.34',     path: '/admin/finance',     icon: <Wallet size={16}/>,        color: 'bg-teal-600' },
  ];

  // LOGIKA: 8 shortcut fitur premium (F.22–F.49)
  const featureShortcuts = [
    { icon: <Map size={18} className="text-blue-600"/>,     label: 'Interactive Siteplan',  path: '/admin/siteplan',       badge: 'F.22', iconBg: 'bg-blue-50' },
    { icon: <FiZap size={18} className="text-yellow-600"/>, label: 'WA Automation',         path: '/admin/whatsapp-auto',  badge: 'F.29', iconBg: 'bg-yellow-50' },
    { icon: <FiBell size={18} className="text-purple-600"/>,label: 'Notifikasi',            path: '/admin/notifications',  badge: 'F.26', iconBg: 'bg-purple-50' },
    { icon: <Video size={18} className="text-red-600"/>,    label: 'Video Manager',         path: '/admin/videos',         badge: 'F.39', iconBg: 'bg-red-50' },
    { icon: <FiDownload size={18} className="text-cyan-600"/>, label: 'Download Tracking', path: '/admin/download-tracking', badge: 'F.41', iconBg: 'bg-cyan-50' },
    { icon: <FiActivity size={18} className="text-green-600"/>, label: 'Heatmap Analytics', path: '/admin/heatmap',       badge: 'F.42', iconBg: 'bg-green-50' },
    { icon: <BookOpen size={18} className="text-orange-600"/>, label: 'Form Builder',       path: '/admin/forms',          badge: 'F.31', iconBg: 'bg-orange-50' },
    { icon: <Star size={18} className="text-pink-600"/>,    label: 'Video Testimoni',       path: '/admin/testimonials',   badge: 'F.48', iconBg: 'bg-pink-50' },
  ];

  return (
    <div className="space-y-8">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-red-500 font-bold tracking-widest uppercase mb-1">AFKAR LAND</p>
          <h1 className="text-3xl font-heading font-black text-gray-900">Dashboard Utama</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Pantau aktivitas dan statistik website AFKAR LAND secara real-time.
          </p>
        </div>
        {/* Bell notifikasi desktop */}
        <Link
          to="/admin/notifications"
          className="relative hidden md:flex items-center gap-2 px-4 py-3 bg-white border border-gray-200
                     rounded-xl hover:border-red-200 hover:shadow-sm transition-all text-gray-500 hover:text-gray-800"
        >
          <FiBell size={18} />
          <span className="text-sm font-medium">Notifikasi</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </Link>
      </div>

      {/* ── GRID 6 KARTU STATISTIK ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} stat={stat} loading={loading} />
        ))}
      </div>

      {/* ── QUICK ACTIONS + STATUS SISTEM ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            <FiTrendingUp size={15} className="text-red-600" />
            Akses Cepat
          </h3>
          <div className="flex flex-col gap-1">
            {quickActions.map((action, i) => (
              <QuickAction key={i} action={action} />
            ))}
          </div>
        </div>

        {/* Status Sistem */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
          {/* Garis merah atas */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-400 rounded-t-2xl" />

          <div className="flex items-start gap-4 mt-2 mb-5">
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0">
              <FiShield size={20} />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-gray-900 mb-1">
                Sistem Integrasi Firebase Aktif
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Semua data tersimpan di Firebase Firestore secara real-time dan langsung terhubung ke halaman publik website AFKAR LAND.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {['Database Firestore', 'Firebase Auth', 'Real-time Sync', 'Data Terenkripsi', 'Backup Harian', 'Notifikasi Aktif'].map(label => (
              <StatusDot key={label} label={label} />
            ))}
          </div>
        </div>
      </div>

      {/* ── SHORTCUT FITUR PREMIUM ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-heading font-bold text-gray-900 flex items-center gap-2">
            <FiZap size={15} className="text-red-600" />
            Fitur Premium — Akses Langsung
          </h3>
          <span className="text-xs text-gray-400">Fitur Segera tersedia</span>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {featureShortcuts.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>

      {/* ── FOOTER ATTRIBUTION ── */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-[11px] text-gray-300">
          Built with Webapp GASP Builder Era v2.0 Masterpiece Edition by @damarmahendra
        </p>
      </div>

    </div>
  );
}