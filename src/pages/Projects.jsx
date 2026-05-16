import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiMapPin, FiArrowRight, FiShield, FiHome, FiTrendingUp,
  FiDownload, FiChevronRight, FiStar, FiNavigation,
  FiCheckCircle, FiFilter
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────
// CANVAS 1 — KONSTANTA & DATA LAYER
// GOLD ACCENT: #C9A84C | RED: brand-primary | BG: #080808
// ─────────────────────────────────────────────────────────────

const featureHighlights = [
  { icon: <FiShield size={14} />,     label: 'Legalitas Aman' },
  { icon: <span>☽</span>,             label: 'Konsep Syariah' },
  { icon: <FiNavigation size={14} />, label: 'Lokasi Strategis' },
  { icon: <FiHome size={14} />,       label: 'Lingkungan Nyaman' },
  { icon: <FiTrendingUp size={14} />, label: 'Investasi Prospektif' },
];

// LOGIKA: Setiap badge punya style warna berbeda
function getBadgeClass(badge) {
  switch (badge) {
    case 'BEST SELLER':      return 'bg-brand-primary text-white';
    case 'NEW PROJECT':      return 'bg-blue-600 text-white';
    case 'COMING SOON':      return 'bg-gray-700 text-white/80';
    default:                 return 'bg-[#C9A84C] text-black'; // PROPERTY SYARIAH = gold
  }
}

// LOGIKA: Data proyek — idealnya fetch dari Firestore collection 'projects'
// Admin bisa menambah/menghapus/mengubah urutan melalui panel admin
const projects = [
  {
    slug: 'masagena-green-hills',
    name: 'Masagena Green Hills',
    desc: 'Kawasan hunian modern bernuansa hijau dengan konsep lingkungan nyaman dan strategis untuk keluarga masa kini.',
    location: 'Sulawesi Selatan',
    status: 'Tersedia',
    badge: 'BEST SELLER',
    harga: 'Mulai Rp 295 Juta',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
    brosurUrl: '/assets/brosur/masagena-green-hills.pdf',
    brosurFileName: 'Brosur-Masagena-Green-Hills.pdf',
    features: ['Area Berkembang', 'Lingkungan Islami', 'Akses Mudah', 'Cocok Investasi'],
    order: 1,
    isFeatured: true,
  },
  {
    slug: 'wotu-islamic-village',
    name: 'Wotu Islamic Village',
    desc: 'Kawasan islami terpadu pertama dengan masjid agung dan lingkungan bertetangga yang menjunjung nilai syariah.',
    location: 'Luwu Timur, Sulsel',
    status: 'Tersedia',
    badge: 'NEW PROJECT',
    harga: 'Mulai Rp 350 Juta',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
    brosurUrl: '/assets/brosur/wotu-islamic-village.pdf',
    brosurFileName: 'Brosur-Wotu-Islamic-Village.pdf',
    features: ['Masjid Agung', 'Lingkungan Islami', 'One Gate System', 'Cocok Investasi'],
    order: 2,
    isFeatured: false,
  },
  {
    slug: 'hasanah-panakkukang',
    name: 'The Hasanah Panakkukang',
    desc: 'Hunian premium modern di kawasan paling strategis Makassar — akses mudah ke pusat bisnis dan fasilitas publik.',
    location: 'Makassar',
    status: 'Sisa Sedikit',
    badge: 'PROPERTY SYARIAH',
    harga: 'Mulai Rp 650 Juta',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80',
    brosurUrl: '/assets/brosur/hasanah-panakkukang.pdf',
    brosurFileName: 'Brosur-Hasanah-Panakkukang.pdf',
    features: ['Lokasi Premium', 'Lingkungan Islami', 'Akses Mudah', 'Cocok Investasi'],
    order: 3,
    isFeatured: false,
  },
  {
    slug: 'afkar-madani-estate',
    name: 'Afkar Madani Estate',
    desc: 'Perumahan premium eksklusif dengan gerbang mewah, infrastruktur modern, dan keamanan satu pintu 24 jam.',
    location: 'Sulawesi Selatan',
    status: 'Tersedia',
    badge: 'PROPERTY SYARIAH',
    harga: 'Mulai Rp 480 Juta',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    brosurUrl: '/assets/brosur/afkar-madani-estate.pdf',
    brosurFileName: 'Brosur-Afkar-Madani-Estate.pdf',
    features: ['Area Berkembang', 'Lingkungan Islami', 'SHM Aman', 'Cocok Investasi'],
    order: 4,
    isFeatured: false,
  },
];

// LOGIKA: Handler download brosur dengan feedback toast
function triggerDownload(url, fileName, name) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(`📄 Brosur ${name} sedang diunduh...`);
}

// ─────────────────────────────────────────────────────────────
// CANVAS 2 — KOMPONEN PROJECT CARD
// ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.46, delay: index * 0.07 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="
        group flex flex-col bg-[#111111] rounded-2xl overflow-hidden
        border border-white/6 hover:border-[#C9A84C]/30
        shadow-lg hover:shadow-xl hover:shadow-black/40
        transition-all duration-400
      "
    >
      {/* ── THUMBNAIL IMAGE ── */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        />
        {/* OVERLAY gradien hitam */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/20 to-transparent" />

        {/* BADGES kiri atas: tipe project + syariah */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${getBadgeClass(project.badge)}`}>
            {project.badge}
          </span>
          <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/10 uppercase tracking-wider w-fit">
            ☽ Syariah
          </span>
        </div>

        {/* BADGE status kanan atas */}
        {project.status === 'Sisa Sedikit' && (
          <div className="absolute top-3 right-3">
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-brand-primary text-white animate-pulse uppercase tracking-wider">
              Sisa Sedikit!
            </span>
          </div>
        )}
      </div>

      {/* ── KONTEN CARD ── */}
      <div className="flex flex-col grow p-4 gap-2.5">

        {/* LOKASI */}
        <div className="flex items-center gap-1 text-[#C9A84C] text-[9px] font-bold tracking-widest uppercase">
          <FiMapPin size={8} />
          {project.location}
        </div>

        {/* NAMA PROJECT */}
        <h3 className="font-heading font-extrabold text-white text-sm md:text-base leading-tight group-hover:text-[#C9A84C] transition-colors duration-300">
          {project.name}
        </h3>

        {/* HARGA */}
        <p className="text-brand-primary font-bold text-xs leading-none">{project.harga}</p>

        {/* DESKRIPSI */}
        <p className="text-white/38 text-xs leading-relaxed line-clamp-2 grow">{project.desc}</p>

        {/* FITUR KECIL 2x2 */}
        <div className="grid grid-cols-2 gap-y-1 gap-x-2">
          {project.features.map((f, i) => (
            <div key={i} className="flex items-center gap-1 text-white/40 text-[9px]">
              <span className="w-1 h-1 rounded-full bg-[#C9A84C] shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <div className="border-t border-white/6 pt-2.5 flex flex-col gap-2">
          {/* CTA 1: Lihat Detail */}
          <Link
            to={`/proyek/${project.slug}`}
            className="
              flex items-center justify-center gap-1.5 py-2.5
              bg-brand-primary hover:bg-[#C9A84C]
              text-white hover:text-black
              font-bold text-xs rounded-xl
              transition-all duration-300 hover:shadow-md group/btn
            "
          >
            Lihat Detail Project
            <FiArrowRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>

          {/* CTA 2: Download Brosur */}
          <button
            onClick={() => triggerDownload(project.brosurUrl, project.brosurFileName, project.name)}
            className="
              flex items-center justify-center gap-1.5 py-2.5
              bg-transparent hover:bg-[#C9A84C]/8
              text-white/45 hover:text-[#C9A84C]
              font-bold text-xs rounded-xl
              border border-white/8 hover:border-[#C9A84C]/35
              transition-all duration-300
            "
          >
            <FiDownload size={10} />
            Download Brosur
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// CANVAS 3 — HALAMAN UTAMA: Hero + Highlights + Grid + CTA
// ─────────────────────────────────────────────────────────────

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('Semua');

  const filtered = useMemo(() => {
    const sorted = [...projects].sort((a, b) => a.order - b.order);
    if (activeFilter === 'Semua') return sorted;
    return sorted.filter(p => p.status === activeFilter);
  }, [activeFilter]);

  return (
    <div className="w-full bg-[#080808] min-h-screen pb-20">

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        {/* Garis gold kiri */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#C9A84C] opacity-40" />
        {/* Blur atmosfer merah */}
        <div className="absolute -top-10 right-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
        {/* Blur atmosfer gold */}
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-[#C9A84C]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-5 md:px-10 relative z-10">

          {/* PRE-BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              inline-flex items-center gap-2 mb-5
              bg-[#C9A84C]/10 border border-[#C9A84C]/30
              text-[#C9A84C] text-[10px] font-bold
              px-4 py-2 rounded-full uppercase tracking-[0.18em]
            "
          >
            <FiStar size={9} />
            Property Syariah AFKAR LAND
          </motion.div>

          {/* HEADLINE */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading font-extrabold text-white leading-[1.07] mb-4 text-3xl sm:text-4xl md:text-5xl max-w-4xl"
          >
            Temukan Kawasan Hunian{' '}
            <span className="text-brand-primary">Syariah Modern</span>
            {' '}untuk Masa Depan Keluarga Anda
          </motion.h1>

          {/* SUBHEADLINE 2 paragraf */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.17 }}
            className="max-w-2xl mb-7 space-y-2"
          >
            <p className="text-white/45 text-sm leading-relaxed">
              AFKAR LAND menghadirkan berbagai pilihan kawasan property syariah modern dengan konsep
              transaksi yang aman, transparan, dan sesuai prinsip syariah.
            </p>
            <p className="text-white/45 text-sm leading-relaxed">
              Setiap project dirancang untuk memberikan kenyamanan hunian, potensi investasi, dan
              lingkungan terbaik bagi keluarga Indonesia —{' '}
              <span className="text-[#C9A84C] font-semibold">
                tanpa riba, tanpa bunga, tanpa denda, tanpa sita, dan tanpa BI checking.
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURE HIGHLIGHTS BAR (5 Icons)
      ══════════════════════════════════════ */}
      <section className="border-y border-white/5 bg-white/[0.013]">
        <div className="container mx-auto px-5 md:px-10">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-4 gap-y-3 py-4">
            {featureHighlights.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2 group cursor-default"
              >
                <span className="text-[#C9A84C] group-hover:scale-110 transition-transform duration-200 text-sm">
                  {f.icon}
                </span>
                <span className="text-white/55 group-hover:text-[#C9A84C] text-[11px] font-semibold transition-colors duration-300 whitespace-nowrap">
                  {f.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FILTER BAR + 4-COLUMN GRID
      ══════════════════════════════════════ */}
      <section className="pt-9">
        <div className="container mx-auto px-5 md:px-10">

          {/* FILTER */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-7">
            <div>
              <h2 className="text-white font-heading font-bold text-base">
                Semua Project{' '}
                <span className="text-[#C9A84C]">({filtered.length})</span>
              </h2>
              <p className="text-white/25 text-[11px] mt-0.5">
                Klik project untuk detail lengkap, konsultasi & download brosur
              </p>
            </div>

            <div className="flex gap-1 bg-white/4 p-1 rounded-xl border border-white/7">
              {['Semua', 'Tersedia', 'Sisa Sedikit'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                    ${activeFilter === f
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'text-white/30 hover:text-white/60'
                    }
                  `}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* GRID: 1 col mobile | 2 col tablet | 4 col desktop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {filtered.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center text-white/20 text-sm py-14">
              Tidak ada project dengan filter ini saat ini.
            </p>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION BAWAH
          Background: Gradient merah premium + gold accent
      ══════════════════════════════════════ */}
      <section className="pt-14">
        <div className="container mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="
              relative overflow-hidden rounded-2xl text-center
              px-7 py-12 md:px-14 md:py-14
              bg-gradient-to-br from-[#1a0000] via-brand-primary to-[#4a0000]
              border border-[#C9A84C]/20
            "
          >
            {/* Gold accent line atas & bawah */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

            {/* Decorative blurs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/6 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              {/* LABEL */}
              <div className="inline-flex items-center gap-1.5 bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-5">
                <FiStar size={9} />
                Konsultasi Gratis · Tanpa Komitmen
              </div>

              {/* HEADLINE CTA */}
              <h2 className="font-heading font-extrabold text-white text-2xl md:text-4xl leading-tight mb-3">
                Masih Bingung Memilih Project yang Paling Cocok?
              </h2>

              {/* SUBHEADLINE */}
              <p className="text-white/60 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                Tim marketing AFKAR LAND siap membantu Anda menemukan kawasan hunian syariah terbaik
                sesuai kebutuhan keluarga maupun investasi Anda.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* Tombol Utama: gold */}
                <Link
                  to="/kontak"
                  className="
                    inline-flex items-center gap-2 px-7 py-3
                    bg-[#C9A84C] hover:bg-[#e0c46e] text-black
                    font-bold text-sm rounded-xl
                    transition-all duration-300 hover:-translate-y-0.5
                    shadow-lg shadow-black/20 group
                  "
                >
                  Konsultasi Gratis Sekarang
                  <FiChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>

                {/* Tombol Kedua: outline */}
                <Link
                  to="/tim"
                  className="
                    inline-flex items-center gap-2 px-7 py-3
                    bg-white/8 hover:bg-white/14 text-white
                    font-bold text-sm rounded-xl
                    border border-white/20 hover:border-white/35
                    transition-all duration-300 hover:-translate-y-0.5
                  "
                >
                  Hubungi Marketing Executive
                </Link>
              </div>

              <p className="text-white/25 text-[11px] mt-6">
                Dipercaya 500+ keluarga di Sulawesi Selatan · Respon dalam 1×24 jam
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Built with Webapp GASP Builder Era v.1.0 by @damarmahendra */}
    </div>
  );
}