import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, FiShield, FiHeart, FiCheckCircle, 
  FiMessageSquare, FiStar 
} from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function About() {
  return (
    <div className="w-full bg-[#080808] font-body overflow-hidden text-white">

      {/* ==========================================
          1. HERO SECTION — TENTANG AFKAR LAND
      ========================================== */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Background glow premium */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Kiri: Copywriting */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-xs uppercase">
                  Tentang AFKAR LAND
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.1] mb-6 tracking-tight text-white">
                Membangun Hunian Syariah dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">Amanah</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-400 font-light mb-10 leading-relaxed max-w-lg">
                <strong className="text-white font-bold">AFKAR LAND</strong> adalah perusahaan pengembang properti syariah yang berkomitmen menghadirkan hunian nyaman, berkualitas, dan sesuai prinsip Islam tanpa riba.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Link to="/proyek" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/30">
                  Lihat Proyek <FiArrowRight size={18} />
                </Link>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                  Konsultasi
                </a>
              </motion.div>
            </motion.div>

            {/* Kanan: Foto Proyek Premium */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative">
              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 relative z-10 aspect-[4/5] md:aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80" 
                  alt="Proyek AFKAR LAND" 
                  className="w-full h-full object-cover opacity-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#080808] via-transparent to-transparent" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==========================================
          2. TENTANG PERUSAHAAN
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Kiri: Foto */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden border border-white/10 relative z-10 aspect-video lg:aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" 
                  alt="Suasana Proyek" 
                  className="w-full h-full object-cover opacity-80" 
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20"></div>
            </motion.div>

            {/* Kanan: Penjelasan */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-8 leading-tight">
                Berawal dari Sebuah Tujuan yang Baik
              </h2>
              <div className="space-y-6 text-gray-400 font-light text-lg leading-relaxed">
                <p>
                  AFKAR LAND hadir untuk membantu masyarakat memiliki hunian yang nyaman dengan proses yang lebih aman, transparan, dan sesuai prinsip syariah.
                </p>
                <p>
                  Kami percaya bahwa rumah bukan hanya tempat tinggal, tetapi tempat tumbuhnya keluarga, pendidikan anak, dan keberkahan kehidupan.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==========================================
          3. EDUKASI PROPERTY SYARIAH
      ========================================== */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6">
              Apa Itu Property Syariah?
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="space-y-4 text-gray-400 font-light text-lg leading-relaxed">
              <p>
                Property syariah adalah konsep kepemilikan rumah yang dijalankan berdasarkan prinsip Islam — mengedepankan transaksi yang adil, transparan, dan bebas dari praktik riba.
              </p>
              <p>
                Dalam sistem property syariah, proses jual beli dilakukan dengan akad yang jelas, tanpa bunga, tanpa denda keterlambatan, dan tanpa unsur yang merugikan salah satu pihak.
              </p>
            </motion.div>
          </div>

          {/* BOX AYAT AL-QUR'AN */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} 
            className="max-w-3xl mx-auto mb-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-900 opacity-10 rounded-3xl blur-xl"></div>
            <div className="relative bg-[#111] border border-red-500/20 p-10 md:p-14 rounded-3xl text-center shadow-2xl">
              <p className="text-3xl md:text-5xl text-red-500 mb-6 font-serif leading-loose" dir="rtl">
                وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا
              </p>
              <p className="text-gray-400 italic mb-4">
                "Wa aḥallallāhul-bai‘a wa ḥarramar-ribā"
              </p>
              <p className="text-white font-medium text-lg mb-6">
                “Padahal Allah telah menghalalkan jual beli dan mengharamkan riba.”
              </p>
              <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-400 text-sm font-bold tracking-wider">
                QS. Al-Baqarah : 275
              </div>
            </div>
          </motion.div>

          {/* CARD BENEFIT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FiHeart />, title: 'Tanpa Riba', desc: 'Transaksi lebih tenang tanpa sistem bunga.' },
              { icon: <FiCheckCircle />, title: 'Akad Transparan', desc: 'Seluruh proses dijelaskan secara terbuka.' },
              { icon: <FiShield />, title: 'Tanpa Denda', desc: 'Tidak memberatkan konsumen.' },
              { icon: <FiStar />, title: 'Amanah & Berkah', desc: 'Mengutamakan kepercayaan dan keberkahan.' }
            ].map((item, idx) => (
              <motion.div key={idx} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }}
                className="bg-[#111] p-8 rounded-3xl border border-white/5 text-center hover:border-red-500/30 transition-colors group"
              >
                <div className="w-14 h-14 mx-auto bg-black rounded-xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                  {React.cloneElement(item.icon, { size: '24' })}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          4. FOUNDER SECTION
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5 relative overflow-hidden">
        {/* Ornamen aksen */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Kiri: Foto Founder */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-red-600 rounded-3xl -translate-x-4 translate-y-4 opacity-20" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[3/4] bg-[#1a1a1a]">
                <img 
                  src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80" 
                  alt="Ustadz Haris Amrin" 
                  className="w-full h-full object-cover filter contrast-125 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Kanan: Kata-kata Founder */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-7 lg:pl-12">
              <div className="mb-4">
                <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Pesan Founder</span>
              </div>
              <FiMessageSquare className="text-red-900/40 w-16 h-16 mb-6" />
              
              <h3 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
                "Kami Tidak Sekadar Menjual Rumah"
              </h3>
              
              <p className="text-xl md:text-2xl text-gray-300 italic leading-relaxed mb-10 font-light border-l-4 border-red-500 pl-6">
                “Kami ingin menghadirkan lingkungan yang nyaman, islami, dan membawa keberkahan bagi setiap keluarga.”
              </p>
              
              <div>
                <h4 className="text-2xl font-bold text-white mb-1">Ustadz Haris Amrin</h4>
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Founder AFKAR LAND</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==========================================
          5. CTA — LIHAT PROYEK
      ========================================== */}
      <section className="py-24 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative bg-gradient-to-br from-red-900 via-red-800 to-[#0A0A0A] rounded-3xl p-12 md:p-20 text-center overflow-hidden border border-red-500/30 shadow-2xl shadow-red-900/20"
          >
            {/* Tekstur mesh/glow */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">
                Temukan Hunian Syariah Pilihan Anda
              </h2>
              <p className="text-red-100 mb-10 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                Jelajahi berbagai proyek property syariah AFKAR LAND yang dirancang untuk kenyamanan dan masa depan keluarga Anda.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/proyek"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-red-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-xl shadow-black/20"
                >
                  Lihat Semua Proyek <FiArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}