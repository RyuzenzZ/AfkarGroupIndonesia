import React, { useState, useEffect } from 'react';
import {
  FiUsers, FiMessageSquare, FiFileText, FiBriefcase,
  FiArrowRight, FiTrendingUp
} from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

export default function Dashboard() {
  const [counts, setCounts] = useState({ leads: 0, messages: 0, applications: 0, articles: 0, projects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let resolved = 0;
    const check = () => { resolved++; if (resolved >= 5) setLoading(false); };

    const u1 = onSnapshot(collection(db, 'leads'),        (s) => { setCounts(p => ({ ...p, leads: s.size }));        check(); });
    const u2 = onSnapshot(collection(db, 'messages'),     (s) => { setCounts(p => ({ ...p, messages: s.size }));     check(); });
    const u3 = onSnapshot(collection(db, 'applications'), (s) => { setCounts(p => ({ ...p, applications: s.size })); check(); });
    const u4 = onSnapshot(collection(db, 'articles'),     (s) => { setCounts(p => ({ ...p, articles: s.size }));     check(); });
    const u5 = onSnapshot(collection(db, 'projects'),     (s) => { setCounts(p => ({ ...p, projects: s.size }));     check(); });

    return () => { u1(); u2(); u3(); u4(); u5(); };
  }, []);

  const stats = [
    { title: 'Total Proyek',   value: counts.projects,     icon: <MdApartment size={22}/>,      color: 'bg-red-50 text-red-600',       border: 'border-red-100',     link: '/admin/projects',     desc: 'Proyek properti aktif' },
    { title: 'Lead Masuk',     value: counts.leads,        icon: <FiUsers size={22}/>,           color: 'bg-blue-50 text-blue-600',     border: 'border-blue-100',    link: '/admin/leads',        desc: 'Calon konsumen' },
    { title: 'Pesan Masuk',    value: counts.messages,     icon: <FiMessageSquare size={22}/>,   color: 'bg-amber-50 text-amber-600',   border: 'border-amber-100',   link: '/admin/messages',     desc: 'Dari halaman Kontak' },
    { title: 'Lamaran Kerja',  value: counts.applications, icon: <FiBriefcase size={22}/>,       color: 'bg-emerald-50 text-emerald-600',border:'border-emerald-100', link: '/admin/applications', desc: 'Calon tim AFKAR LAND' },
    { title: 'Artikel Publik', value: counts.articles,     icon: <FiFileText size={22}/>,        color: 'bg-purple-50 text-purple-600', border: 'border-purple-100',  link: '/admin/articles',     desc: 'Konten blog aktif' },
  ];

  const quickActions = [
    { label: 'Tambah Proyek Baru',  path: '/admin/projects',     icon: <MdApartment size={17}/>,      color: 'bg-red-600' },
    { label: 'Kelola Lead Proyek',  path: '/admin/leads',        icon: <FiUsers size={17}/>,           color: 'bg-blue-600' },
    { label: 'Baca Pesan Masuk',    path: '/admin/messages',     icon: <FiMessageSquare size={17}/>,   color: 'bg-amber-500' },
    { label: 'Review Lamaran',      path: '/admin/applications', icon: <FiBriefcase size={17}/>,       color: 'bg-emerald-600' },
    { label: 'Tulis Artikel Baru',  path: '/admin/articles',     icon: <FiFileText size={17}/>,        color: 'bg-purple-600' },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">Dashboard Utama</h1>
        <p className="text-gray-500 mt-1">Pantau aktivitas dan statistik website AFKAR LAND secara real-time.</p>
      </div>

      {/* GRID STATISTIK */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <Link
            key={i}
            to={stat.link}
            className={`bg-white p-5 rounded-2xl shadow-sm border ${stat.border} hover:shadow-md transition-all group flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <FiArrowRight size={14} className="text-gray-200 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">
                {loading ? <span className="text-gray-200">—</span> : stat.value}
              </div>
              <div className="text-xs font-semibold text-gray-600 mt-0.5">{stat.title}</div>
              <div className="text-xs text-gray-400">{stat.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* QUICK ACTIONS + STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-heading font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            <FiTrendingUp size={15} className="text-red-600" /> Akses Cepat
          </h3>
          <div className="flex flex-col gap-1">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.path}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${action.color} shrink-0`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {action.label}
                </span>
                <FiArrowRight size={13} className="ml-auto text-gray-200 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Status Sistem */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 to-red-400 rounded-t-2xl" />
          <div className="flex items-start gap-4 mt-2">
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0">
              <FiTrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-gray-900 mb-1">
                Sistem Integrasi Firebase Aktif
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Semua data proyek, lead, pesan, dan lamaran tersimpan di Firebase Firestore secara real-time
                dan langsung terhubung ke halaman publik website.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {[
              'Database Firestore', 'Firebase Auth',
              'Real-time Sync', 'Data Terenkripsi',
            ].map((label) => (
              <div key={label} className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-xs font-semibold text-gray-600">{label}</span>
                <span className="ml-auto text-xs text-emerald-600 font-bold">Aktif</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}