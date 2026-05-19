import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiMapPin, FiArrowRight, FiShield, FiHome, FiTrendingUp,
  FiDownload, FiChevronRight, FiStar, FiNavigation,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

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
    case 'BEST SELLER':             return 'bg-brand-primary text-white';
    case 'COMING SOON':             return 'bg-gray-700 text-white/80';
    case 'LAUNCHING JUNI':          return 'bg-purple-700 text-white';
    case 'BEST PREMIUM LOCATION':   return 'bg-[#C9A84C] text-black';
    default:                        return 'bg-brand-primary text-white';
  }
}

// LOGIKA: Handler download brosur dengan feedback toast
// ✅ SYNC: Sama persis dengan triggerDownload di ProjectDetail.jsx
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
// ✅ SYNC: Semua field disesuaikan dengan struktur data ProjectDetail.jsx
//          Field yang dipakai: image, name, tagline, status, statusLabel,
//          badge, location, locationDetail, harga, desc, features,
//          brosurUrl, brosurFileName, slug, launchingDate
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

        {/* COMING SOON overlay */}
        {/* ✅ SYNC: launchingDate diambil dari Firestore, bukan hardcode */}
        {project.status === 'Coming Soon' && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
            <span className="text-white font-black text-sm uppercase tracking-widest px-4 py-2 border border-white/30 rounded-xl bg-black/40">
              🚀 Coming Soon
            </span>
            {project.launchingDate && (
              <span className="text-[#C9A84C] font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 animate-pulse">
                Grand Launching {project.launchingDate}
              </span>
            )}
          </div>
        )}

        {/* BADGES kiri atas: badge proyek + badge syariah glowing */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {/* Badge utama proyek */}
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${getBadgeClass(project.badge)}`}>
            {project.badge}
          </span>

          {/* LOGIKA: Badge Syariah glowing green premium */}
          <span className="
            inline-flex items-center gap-1 w-fit
            text-[9px] font-black px-2 py-1 rounded-full
            uppercase tracking-wider
            bg-black/60 backdrop-blur-sm
            border border-emerald-500/60
            text-emerald-400
          "
            style={{
              boxShadow: '0 0 8px rgba(52,211,153,0.5), 0 0 16px rgba(52,211,153,0.2)',
              textShadow: '0 0 6px rgba(52,211,153,0.8)',
            }}
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            ✦ Property Syariah
          </span>
        </div>

        {/* BADGE status kanan atas */}
        {project.status === 'Sisa Sedikit' && (
          <div className="absolute top-3 right-3">
            {/* ✅ SYNC: statusLabel dari Firestore */}
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-orange-600 text-white animate-pulse uppercase tracking-wider">
              {project.statusLabel || 'Sisa Sedikit!'}
            </span>
          </div>
        )}
        {project.status === 'Tersedia' && (
          <div className="absolute top-3 right-3">
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-green-700/80 text-white uppercase tracking-wider">
              ✓ Unit Tersedia
            </span>
          </div>
        )}
      </div>

      {/* ── KONTEN CARD ── */}
      <div className="flex flex-col grow p-4 gap-2">

        {/* LOKASI */}
        {/* ✅ SYNC: Pakai locationDetail jika ada, fallback ke location — sama dengan ProjectDetail */}
        <div className="flex items-center gap-1 text-[#C9A84C] text-[9px] font-bold tracking-widest uppercase">
          <FiMapPin size={8} />
          {project.locationDetail || project.location}
        </div>

        {/* NAMA PROJECT */}
        <h3 className="font-heading font-extrabold text-white text-sm md:text-base leading-tight group-hover:text-[#C9A84C] transition-colors duration-300">
          {project.name}
        </h3>

        {/* TAGLINE */}
        {/* ✅ SYNC: Field tagline baru — ditampilkan di card jika ada, sama dengan hero ProjectDetail */}
        {project.tagline && (
          <p className="text-white/35 text-[10px] font-medium italic leading-snug -mt-0.5">
            {project.tagline}
          </p>
        )}

        {/* HARGA */}
        <p className={`font-bold text-xs leading-none ${project.status === 'Coming Soon' ? 'text-[#C9A84C]' : 'text-brand-primary'}`}>
          {project.harga}
        </p>

        {/* DESKRIPSI */}
        <p className="text-white/38 text-xs leading-relaxed line-clamp-2 grow">{project.desc}</p>

        {/* FITUR KECIL 2x2 */}
        {/* ✅ SYNC: features array dari Firestore, sama dengan ProjectDetail */}
        <div className="grid grid-cols-2 gap-y-1 gap-x-2">
          {(project.features || []).map((f, i) => (
            <div key={i} className="flex items-center gap-1 text-white/40 text-[9px]">
              <span className="w-1 h-1 rounded-full bg-[#C9A84C] shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <div className="border-t border-white/6 pt-2.5 flex flex-col gap-2">
          {/* CTA 1: Lihat Detail */}
          {/* ✅ SYNC: Route /proyek/:slug — cocok dengan useParams di ProjectDetail */}
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
          {/* ✅ SYNC: brosurUrl + brosurFileName dari Firestore */}
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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── FETCH REALTIME DARI FIRESTORE ──
  // ✅ SYNC: Struktur data yang difetch harus memiliki semua field yang dipakai
  //         di ProjectDetail: name, image, tagline, status, statusLabel, badge,
  //         location, locationDetail, harga, desc, features, brosurUrl,
  //         brosurFileName, brosurSize, slug, about, aboutExtra, tipeUnit,
  //         gallery, faq, progress, marketingIds, launchingDate, order
  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => {
        // Fallback jika index belum dibuat
        const unsub2 = onSnapshot(collection(db, 'projects'), (snap) => {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          data.sort((a, b) => (a.order || 0) - (b.order || 0));
          setProjects(data);
          setLoading(false);
        });
        return unsub2;
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === 'Semua') return projects;
    return projects.filter(p => p.status === activeFilter);
  }, [activeFilter, projects]);

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

            {/* ✅ SYNC: Filter status harus cocok dengan nilai field status di Firestore
                         Tersedia | Sisa Sedikit | Coming Soon — sama dengan ProjectDetail */}
            <div className="flex gap-1 bg-white/4 p-1 rounded-xl border border-white/7">
              {['Semua', 'Tersedia', 'Sisa Sedikit', 'Coming Soon'].map((f) => (
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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl aspect-[3/4] animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
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
                  <ProjectCard key={project.slug || project.id} project={project} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-white/20 text-sm py-14">
              Tidak ada project dengan filter ini saat ini.
            </p>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION BAWAH
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

                <Link
                  to="/kontak"
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

    </div>
  );
}