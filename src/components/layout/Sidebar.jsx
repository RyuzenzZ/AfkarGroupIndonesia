// LOGIKA: Sidebar navigasi utama AFKAR LAND
// Desain: background hitam #080808, teks putih, aksen merah
// Fitur scrollable: area menu bisa digulir ke bawah, logo & logout tetap di tempat
// Built with Webapp GASP Builder Era v2.0 Masterpiece Edition by @damarmahendra

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building, FileText,
  LogOut, X, ChevronDown, ChevronRight,
  Wallet, Shield, PieChart, CalendarCheck,
  Bell, Map, Video, Zap, BarChart2,
  BookOpen, Star, Bot, Home,
  Download, Activity, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

// LOGIKA: Sub-menu item — aktif = merah, default = abu-abu
const SubMenuItem = ({ path, label, badge, onClose }) => (
  <NavLink
    to={path}
    onClick={onClose}
    className={({ isActive }) =>
      `flex items-center pl-10 pr-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
        isActive
          ? 'bg-red-600/15 text-red-400 font-bold border-l-2 border-red-500'
          : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
      }`
    }
  >
    <span className="flex-1 truncate text-[13px]">{label}</span>
    {badge && (
      <span className="ml-2 text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-bold shrink-0">
        {badge}
      </span>
    )}
  </NavLink>
);

// LOGIKA: Grup menu collapsible dengan toggle
const MenuGroup = ({ id, label, icon, children, openMenus, toggleMenu }) => (
  <div>
    <button
      onClick={() => toggleMenu(id)}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl
                 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
    >
      <div className="flex items-center gap-3 font-medium text-[13px]">
        {icon}
        {label}
      </div>
      <span className="text-gray-600 shrink-0">
        {openMenus[id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </span>
    </button>
    {openMenus[id] && (
      <div className="mt-0.5 space-y-0.5 pb-1">
        {children}
      </div>
    )}
  </div>
);

// LOGIKA: Label pemisah antar seksi menu
const SectionLabel = ({ label }) => (
  <div className="px-4 pt-5 pb-1.5">
    <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600 font-bold">{label}</p>
  </div>
);

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  // LOGIKA: State semua grup menu — project default terbuka
  const [openMenus, setOpenMenus] = useState({
    crm:        false,
    booking:    false,
    customer:   false,
    project:    true,
    marketing:  false,
    content:    false,
    automation: false,
    analytics:  false,
    system:     false,
  });

  const toggleMenu = (menu) =>
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));

  const handleLogout = () => {
    toast.success('Berhasil keluar dari sistem');
    navigate('/admin/login');
  };

  return (
    // LOGIKA: h-screen + flex-col → logo atas fixed, menu scroll, logout bawah fixed
    <aside className="w-64 bg-[#080808] text-white h-screen flex flex-col border-r border-white/5 shadow-2xl">

      {/* Tombol X — hanya tampil mobile */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-5 right-4 p-2 text-gray-400 hover:text-white z-10"
      >
        <X size={20} />
      </button>

      {/* ── LOGO — shrink-0 agar tidak ikut scroll ── */}
      <div className="shrink-0 h-20 flex flex-col items-center justify-center border-b border-white/5 px-6">
        <div className="text-xl font-heading font-extrabold tracking-[0.15em] text-center">
          AFKAR <span className="text-red-500">LAND</span>
        </div>
        <p className="text-[9px] text-gray-500 tracking-widest mt-1 uppercase">Admin Panel</p>
      </div>

      {/* ── MENU SCROLL AREA ──
          LOGIKA: flex-1 mengisi sisa ruang, overflow-y-auto mengaktifkan scroll
          Logo dan Logout tidak ikut scroll karena keduanya pakai shrink-0
      ── */}
      <div
        className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >

        {/* ─ DASHBOARD UTAMA ─ */}
        <NavLink
          to="/admin/dashboard"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[13px] transition-all duration-200 ${
              isActive
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <LayoutDashboard size={16} /> Dashboard Utama
        </NavLink>

        {/* ════════════════════════ */}
        {/* CRM & KONSUMEN          */}
        {/* ════════════════════════ */}
        <SectionLabel label="CRM & Konsumen" />

        <MenuGroup id="crm" label="CRM & Leads" icon={<Users size={16} />} openMenus={openMenus} toggleMenu={toggleMenu}>
          <SubMenuItem path="/admin/leads"    label="Data Leads Baru"    onClose={onClose} />
          <SubMenuItem path="/admin/messages" label="Pesan & Konsultasi" onClose={onClose} />
          <SubMenuItem path="/admin/survey"   label="Jadwal Survey"      onClose={onClose} badge="F.25" />
        </MenuGroup>

        <MenuGroup id="booking" label="Booking Management" icon={<CalendarCheck size={16} />} openMenus={openMenus} toggleMenu={toggleMenu}>
          <SubMenuItem path="/admin/bookings"          label="Daftar Booking"   onClose={onClose} badge="F.21" />
          <SubMenuItem path="/admin/bookings/approval" label="Approval Booking" onClose={onClose} />
          <SubMenuItem path="/admin/bookings/invoice"  label="Generate Invoice" onClose={onClose} />
        </MenuGroup>

        <MenuGroup id="customer" label="Customer Portal" icon={<Home size={16} />} openMenus={openMenus} toggleMenu={toggleMenu}>
          <SubMenuItem path="/admin/customers"          label="Data Customer"     onClose={onClose} badge="F.28" />
          <SubMenuItem path="/admin/customers/progress" label="Progress Unit"     onClose={onClose} />
          <SubMenuItem path="/admin/customers/payments" label="Jadwal Pembayaran" onClose={onClose} />
          <SubMenuItem path="/admin/live-chat"          label="Live Chat CS"      onClose={onClose} badge="F.35" />
        </MenuGroup>

        {/* ════════════════════════ */}
        {/* PROJECT & UNIT          */}
        {/* ════════════════════════ */}
        <SectionLabel label="Project & Unit" />

        <MenuGroup id="project" label="Manajemen Project" icon={<Building size={16} />} openMenus={openMenus} toggleMenu={toggleMenu}>
          <SubMenuItem path="/admin/projects"   label="Daftar Project"        onClose={onClose} />
          <SubMenuItem path="/admin/units"      label="Manajemen Unit (Blok)" onClose={onClose} badge="F.23" />
          <SubMenuItem path="/admin/siteplan"   label="Interactive Siteplan"  onClose={onClose} badge="F.22" />
          <SubMenuItem path="/admin/documents"  label="Dokumen & Legalitas"   onClose={onClose} badge="F.24" />
          <SubMenuItem path="/admin/videos"     label="Video Management"      onClose={onClose} badge="F.39" />
          <SubMenuItem path="/admin/comparison" label="Perbandingan Project"  onClose={onClose} badge="F.37" />
        </MenuGroup>

        {/* ════════════════════════ */}
        {/* MARKETING & KONTEN      */}
        {/* ════════════════════════ */}
        <SectionLabel label="Marketing & Konten" />

        <MenuGroup id="marketing" label="Marketing Performance" icon={<PieChart size={16} />} openMenus={openMenus} toggleMenu={toggleMenu}>
          <SubMenuItem path="/admin/performance"             label="Statistik Tim"   onClose={onClose} badge="F.27" />
          <SubMenuItem path="/admin/performance/leaderboard" label="Leaderboard"     onClose={onClose} />
          <SubMenuItem path="/admin/applications"            label="Lamaran Kerja"   onClose={onClose} />
          <SubMenuItem path="/admin/tasks"                   label="Task Management" onClose={onClose} badge="F.44" />
        </MenuGroup>

        <MenuGroup id="content" label="Konten & Media" icon={<FileText size={16} />} openMenus={openMenus} toggleMenu={toggleMenu}>
          <SubMenuItem path="/admin/articles"      label="Kelola Artikel / Blog" onClose={onClose} />
          <SubMenuItem path="/admin/ai-content"    label="AI Content Tools"      onClose={onClose} badge="F.30" />
          <SubMenuItem path="/admin/social-media"  label="Social Media Manager"  onClose={onClose} badge="F.33" />
          <SubMenuItem path="/admin/events"        label="Event & Webinar"       onClose={onClose} badge="F.32" />
          <SubMenuItem path="/admin/promotions"    label="Promo Engine"          onClose={onClose} badge="F.49" />
          <SubMenuItem path="/admin/testimonials"  label="Video Testimoni"       onClose={onClose} badge="F.48" />
          <SubMenuItem path="/admin/forms"         label="Form Builder"          onClose={onClose} badge="F.31" />
          <SubMenuItem path="/admin/landing-pages" label="Multi Landing Page"    onClose={onClose} badge="F.46" />
        </MenuGroup>

        {/* ════════════════════════ */}
        {/* OTOMASI & NOTIFIKASI    */}
        {/* ════════════════════════ */}
        <SectionLabel label="Otomasi & Notifikasi" />

        <MenuGroup id="automation" label="Automation System" icon={<Zap size={16} />} openMenus={openMenus} toggleMenu={toggleMenu}>
          <SubMenuItem path="/admin/whatsapp-auto"     label="Smart WA Automation"    onClose={onClose} badge="F.29" />
          <SubMenuItem path="/admin/notifications"     label="Notifikasi Realtime"    onClose={onClose} badge="F.26" />
          <SubMenuItem path="/admin/download-tracking" label="Download Tracking"      onClose={onClose} badge="F.41" />
          <SubMenuItem path="/admin/mobile-app"        label="Mobile App Integration" onClose={onClose} badge="F.40" />
        </MenuGroup>

        {/* ════════════════════════ */}
        {/* ANALITIK & KEUANGAN     */}
        {/* ════════════════════════ */}
        <SectionLabel label="Analitik & Keuangan" />

        <MenuGroup id="analytics" label="Analytics & Insight" icon={<BarChart2 size={16} />} openMenus={openMenus} toggleMenu={toggleMenu}>
          <SubMenuItem path="/admin/heatmap"      label="Heatmap Analytics"    onClose={onClose} badge="F.42" />
          <SubMenuItem path="/admin/smart-search" label="Smart Search System"  onClose={onClose} badge="F.36" />
          <SubMenuItem path="/admin/map"          label="Interactive Map"      onClose={onClose} badge="F.38" />
          <SubMenuItem path="/admin/calculator"   label="Kalkulator Investasi" onClose={onClose} badge="F.47" />
        </MenuGroup>

        {/* Keuangan Internal — standalone link */}
        <NavLink
          to="/admin/finance"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[13px] transition-all duration-200 ${
              isActive
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Wallet size={16} />
          <span className="flex-1">Keuangan Internal</span>
          <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-bold">F.34</span>
        </NavLink>

        {/* ════════════════════════ */}
        {/* SISTEM & KEAMANAN       */}
        {/* ════════════════════════ */}
        <SectionLabel label="Sistem & Keamanan" />

        <MenuGroup id="system" label="Sistem & Keamanan" icon={<Shield size={16} />} openMenus={openMenus} toggleMenu={toggleMenu}>
          <SubMenuItem path="/admin/settings"          label="Pengaturan Web"     onClose={onClose} />
          <SubMenuItem path="/admin/users"             label="Manajemen Admin"    onClose={onClose} />
          <SubMenuItem path="/admin/security"          label="Enterprise Security" onClose={onClose} badge="F.50" />
          <SubMenuItem path="/admin/backup"            label="Backup Otomatis"    onClose={onClose} badge="F.43" />
          <SubMenuItem path="/admin/widget-customizer" label="Widget Customizer"  onClose={onClose} badge="F.45" />
        </MenuGroup>

        {/* Spacer akhir agar item terakhir tidak terpotong */}
        <div className="h-6" />
      </div>

      {/* ── LOGOUT — shrink-0 agar tetap di bawah ── */}
      <div className="shrink-0 p-4 border-t border-white/5 bg-[#060606]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3
                     bg-red-600/10 hover:bg-red-600/20 text-red-500
                     rounded-xl transition-colors font-bold text-sm"
        >
          <LogOut size={15} /> Keluar Sistem
        </button>
        <p className="text-center text-[9px] text-gray-700 mt-2">
          Built with Webapp GASP Builder Era v2.0 by @damarmahendra
        </p>
      </div>

    </aside>
  );
}