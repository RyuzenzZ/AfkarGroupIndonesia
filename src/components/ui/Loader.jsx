import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================================
// LOGIKA: Loader premium AFKAR LAND
// Gunakan logo asli dari folder public/images/LogoAfkar.png
// ============================================================
export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase]       = useState(0); // 0=logo in, 1=tagline in, 2=progress, 3=done

  // LOGIKA: Simulasi progress loading bertahap
  useEffect(() => {
    // Phase 0 → 1: setelah logo muncul
    const t1 = setTimeout(() => setPhase(1), 900);
    // Phase 1 → 2: setelah tagline muncul
    const t2 = setTimeout(() => setPhase(2), 1500);
    // Phase 2: jalankan progress bar
    const t3 = setTimeout(() => {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 18 + 5;
        if (p >= 100) { p = 100; clearInterval(interval); setPhase(3); }
        setProgress(Math.min(p, 100));
      }, 120);
    }, 1600);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.04,
        filter: 'blur(12px)',
        transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white overflow-hidden"
    >

      {/* ===== LATAR DEKORATIF ===== */}
      {/* Glow merah kiri bawah */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.18, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute -bottom-32 -left-32 w-96 h-96 bg-red-500 rounded-full blur-[100px] pointer-events-none"
      />
      {/* Glow emas kanan atas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
        className="absolute -top-20 -right-20 w-80 h-80 bg-amber-400 rounded-full blur-[90px] pointer-events-none"
      />
      {/* Grid pattern latar */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* ===== KONTEN TENGAH ===== */}
      <div className="relative flex flex-col items-center">

        {/* ---- LOGO IMAGE ---- */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative mb-2"
        >
          {/* Glow di belakang logo */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.08, 0.25] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="absolute inset-0 m-auto w-32 h-32 bg-red-400 rounded-full blur-2xl"
          />
          <img
            src="/images/LogoAfkar1.png"
            alt="AFKAR LAND"
            className="relative z-10 w-36 h-36 object-contain drop-shadow-xl"
            onError={(e) => {
              // LOGIKA: Fallback jika gambar belum dipindahkan ke public/images
              e.target.style.display = 'none';
            }}
          />
        </motion.div>

        {/* ---- TEKS BRAND ---- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-[0.18em] text-gray-900 leading-none">
            AFKAR <span className="text-red-600">LAND</span>
          </h1>
        </motion.div>

        {/* ---- TAGLINE ---- */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 8 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-3 text-xs font-bold uppercase tracking-[0.45em] text-gray-400"
        >
          Developer Properti Syariah
        </motion.p>

        {/* ---- DIVIDER ORNAMEN ---- */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
          className="mt-5 flex items-center gap-3 origin-center"
        >
          <div className="w-8 h-px bg-linear-to-r from-transparent to-red-300"/>
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"/>
          <div className="w-16 h-px bg-red-200"/>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"/>
          <div className="w-8 h-px bg-linear-to-l from-transparent to-amber-300"/>
        </motion.div>

        {/* ---- PROGRESS BAR ---- */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 6 }}
          transition={{ duration: 0.4 }}
          className="mt-7 w-56"
        >
          {/* Track */}
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #dc2626, #f59e0b)',
                transition: 'width 0.15s ease-out',
              }}
            />
          </div>
          {/* Persentase */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-gray-300 font-medium uppercase tracking-widest">Memuat</span>
            <span className="text-[10px] font-bold text-gray-400">{Math.round(progress)}%</span>
          </div>
        </motion.div>

        {/* ---- TITIK ANIMASI (sebelum progress muncul) ---- */}
        {phase < 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 flex items-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-red-400"
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* ===== FOOTER BRAND ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.5 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-[10px] text-gray-400 tracking-widest uppercase font-medium">
          AFKAR GROUP INDONESIA · Sulawesi Selatan
        </p>
      </motion.div>

    </motion.div>
  );
}