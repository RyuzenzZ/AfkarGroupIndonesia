import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg text-center relative z-10">

        {/* 404 */}
        <div className="text-[10rem] md:text-[14rem] font-heading font-extrabold leading-none text-white/[0.04] select-none mb-4">
          404
        </div>

        <div className="-mt-8 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-bold tracking-widest text-xs uppercase mb-6">
            Halaman Tidak Ditemukan
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 leading-tight">
            Ups! Halaman ini<br />tidak ada.
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Halaman yang Anda cari mungkin telah dihapus, dipindahkan, atau tidak pernah ada. Kembali ke halaman utama kami.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/"
            className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-red-500 hover:shadow-xl hover:shadow-red-900/40 transition-all hover:-translate-y-0.5">
            <FiHome size={16} /> Kembali ke Beranda
          </Link>
          <Link to="/proyek"
            className="inline-flex items-center justify-center gap-2 border border-white/15 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-white/5 hover:border-white/30 transition-all text-sm">
            Lihat Proyek <FiArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}