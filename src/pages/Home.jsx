import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, FiShield, FiHome, FiHeart, FiCheckCircle, 
  FiTarget, FiTrendingUp, FiLayers, FiUsers, FiAward, 
  FiDownload, FiStar, FiMapPin, FiMessageSquare
} from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// --- DATA PROJECT (Untuk Beranda) ---
const featuredProjects = [
  { slug: 'masagena-green-hills', name: 'Masagena Green Hills', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80', desc: 'Kawasan hunian modern bernuansa hijau dengan lingkungan strategis.' },
  { slug: 'wotu-islamic-village', name: 'Wotu Islamic Village', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80', desc: 'Kawasan islami terpadu dengan masjid agung dan lingkungan syariah.' },
  { slug: 'hasanah-panakkukang', name: 'The Hasanah Panakkukang', img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80', desc: 'Hunian premium modern di kawasan paling strategis pusat kota Makassar.' },
  { slug: 'afkar-madani-estate', name: 'Afkar Madani Estate', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', desc: 'Perumahan premium eksklusif dengan gerbang mewah & infrastruktur modern.' }
];

export default function Home() {
  return (
    <div className="w-full bg-[#080808] font-body overflow-hidden text-white">

      {/* ==========================================
          1. HERO SECTION (UPDATE)
      ========================================== */}
      <section className="relative h-screen min-h-[900px] flex items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80"
            alt="AFKAR LAND"
            className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-[#080808]/50 to-[#080808]" />
          <div className="absolute inset-0 bg-red-900/10 mix-blend-overlay" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 mt-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto text-center">
            
            {/* Logo / Badge Area */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="inline-block text-3xl font-heading font-extrabold tracking-[0.2em] mb-2">
                AFKAR <span className="text-red-600">LAND</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-red-500 font-bold tracking-widest text-[10px] uppercase">
                <span className="w-1 h-1 rounded-full bg-red-500" />
                Developer Property Syariah Terpercaya
                <span className="w-1 h-1 rounded-full bg-red-500" />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.1] mb-6 tracking-tight">
              Hunian Syariah Modern<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">
                untuk Masa Depan Keluarga Anda
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeUp} className="text-base md:text-lg text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
              AFKAR LAND menghadirkan kawasan property syariah premium tanpa riba, tanpa bank, tanpa bunga, dan tanpa sita dengan konsep hunian modern islami di Indonesia Timur.
            </motion.p>
            
            <motion.div variants={fadeUp}>
              <Link to="/proyek" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/30 hover:-translate-y-1">
                Lihat Project Kami <FiArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Statistics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-10 left-0 right-0 z-20 px-6 hidden md:block"
        >
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: <FiShield />, title: '100% Syariah' },
                { icon: <FiLayers />, title: '4 Project Aktif' },
                { icon: <FiUsers />, title: 'Tim Professional' },
                { icon: <FiAward />, title: 'Legalitas Aman' }
              ].map((stat, i) => (
                <div key={i} className="bg-[#111]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-red-500/50 transition-colors">
                  <div className="text-red-500 bg-red-500/10 p-3 rounded-xl">{stat.icon}</div>
                  <h4 className="font-bold text-sm">{stat.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          2. SECTION TENTANG AFKAR LAND
      ========================================== */}
      <section className="py-24 md:py-32 bg-[#080808] relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                Tentang AFKAR LAND
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-6 leading-tight">
                Membangun Hunian,<br />Membangun Kehidupan yang Lebih Berkah
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed text-sm md:text-base">
                <p>
                  <strong className="text-white">AFKAR LAND</strong> adalah perusahaan pengembang property syariah modern yang berfokus menghadirkan kawasan hunian nyaman, berkualitas, dan bernilai investasi tinggi.
                </p>
                <p>
                  Kami hadir untuk memberikan solusi kepemilikan rumah tanpa riba melalui sistem transaksi syariah yang aman, transparan, dan sesuai prinsip Islam. Menghindari sistem denda dan sita yang memberatkan.
                </p>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" alt="Premium House" className="rounded-3xl w-full h-64 object-cover mt-8 border border-white/5" />
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80" alt="Islamic Environment" className="rounded-3xl w-full h-80 object-cover border border-white/5" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-600 rounded-full flex items-center justify-center border-8 border-[#080808] shadow-2xl z-10">
                <FiHome className="text-white w-8 h-8" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. SECTION FOUNDER & MANAGEMENT
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">Pimpinan & Manajemen</h2>
            <p className="text-gray-400 text-sm">Orang-orang hebat di balik berdirinya AFKAR LAND.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FOUNDER CARD */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden group h-full border border-white/5 bg-[#1a1a1a]">
                <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80" alt="Ustadz Haris Amrin" className="w-full h-[400px] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <div className="mb-4">
                    <FiMessageSquare className="text-red-500 w-8 h-8 mb-3 opacity-50" />
                    <p className="text-sm font-medium italic text-gray-300">
                      "Membangun property bukan sekadar bisnis, tetapi menghadirkan hunian yang membawa keberkahan bagi keluarga muslim."
                    </p>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Ustadz Haris Amrin</h3>
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Founder AFKAR LAND</p>
                </div>
              </div>
            </motion.div>

            {/* MANAGEMENT CARD */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row gap-6 items-center">
                <img src="https://ui-avatars.com/api/?name=Nia+Kartika+Putri&background=111&color=fff&size=200" alt="Nia Kartika" className="w-24 h-24 rounded-full border-2 border-red-500/50" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Nia Kartika Putri</h3>
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-3">Project Management</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Berkomitmen memastikan setiap project AFKAR LAND dibangun dengan kualitas terbaik, tepat waktu, dan memberikan pelayanan profesional kepada konsumen.
                  </p>
                </div>
              </motion.div>

              {/* TIM MARKETING PREVIEW */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 flex-1">
                <h4 className="text-sm font-bold text-white mb-6">Tim Konsultan Property Kami</h4>
                <div className="flex flex-wrap gap-4">
                  {['Damar Mahendra', 'Fila Amelia', 'Hazfira', 'Nabila Azzahra', 'Sultan Alfatih'].map((name, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-red-500 overflow-hidden transition-all duration-300">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=080808&color=fff`} alt={name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] text-gray-500 group-hover:text-white transition-colors">{name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. SECTION VISI & MISI
      ========================================== */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/10 p-10 md:p-14 rounded-3xl">
              <FiTarget className="text-red-500 w-12 h-12 mb-6" />
              <h3 className="text-3xl font-heading font-bold mb-4">Visi</h3>
              <p className="text-gray-400 leading-relaxed">
                Menjadi developer property syariah terpercaya yang menghadirkan kawasan hunian modern islami berkualitas di Indonesia.
              </p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/10 p-10 md:p-14 rounded-3xl">
              <FiTrendingUp className="text-red-500 w-12 h-12 mb-6" />
              <h3 className="text-3xl font-heading font-bold mb-4">Misi</h3>
              <ul className="space-y-3">
                {[
                  'Menghadirkan property tanpa riba',
                  'Memberikan pelayanan terbaik',
                  'Membangun lingkungan islami',
                  'Menjadi solusi investasi property syariah'
                ].map((misi, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400 text-sm"><FiCheckCircle className="text-red-500 w-4 h-4 shrink-0" /> {misi}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. SECTION KENAPA PILIH AFKAR LAND
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">Kenapa Pilih AFKAR LAND?</h2>
            <p className="text-gray-400 text-sm">Alasan mengapa ribuan keluarga mempercayakan huniannya pada kami.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <FiHeart />, title: 'Tanpa Riba', desc: 'Transaksi bersih 100% tanpa adanya unsur bunga yang diharamkan.' },
              { icon: <FiLayers />, title: 'Tanpa Bank', desc: 'Cicilan langsung ke developer, tanpa pihak ketiga yang memberatkan.' },
              { icon: <FiShield />, title: 'Legalitas Aman', desc: 'Lahan sudah milik perusahaan, legalitas SHM & IMB/PBG terjamin.' },
              { icon: <FiMapPin />, title: 'Lokasi Strategis', desc: 'Berada di kawasan sunrise property yang dekat fasilitas publik.' },
              { icon: <FiAward />, title: 'Material Berkualitas', desc: 'Dibangun menggunakan material premium dan standar SNI.' },
              { icon: <FiHome />, title: 'Lingkungan Islami', desc: 'Fasilitas ibadah lengkap & komunitas tetangga yang saleh.' }
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:bg-red-500/10 transition-colors mb-6">
                  {item.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          6. SECTION PROJECT UNGGULAN (WAJIB)
      ========================================== */}
      <section className="py-32 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold mb-4">Project Property AFKAR LAND</h2>
              <p className="text-gray-400">Temukan kawasan hunian syariah modern terbaik yang sedang kami kembangkan.</p>
            </div>
            <Link to="/proyek" className="inline-flex items-center gap-2 text-red-500 font-bold hover:text-white transition-colors border-b border-red-500/30 pb-1">
              Lihat Semua Project <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((proj, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden group hover:border-red-500/50 transition-colors flex flex-col h-full"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={proj.img} alt={proj.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#C9A84C] text-black text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      PROPERTY SYARIAH
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-red-400 transition-colors">{proj.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6 flex-1">{proj.desc}</p>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <Link to={`/proyek/${proj.slug}`} className="w-full text-center py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors">
                      Lihat Detail
                    </Link>
                    <button className="w-full text-center py-2.5 bg-transparent border border-white/10 hover:border-white/30 text-white/70 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                      <FiDownload size={14} /> Download Brosur
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. SECTION SISTEM PROPERTY SYARIAH
      ========================================== */}
      <section className="py-24 bg-[#111] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-4">7 Pilar Transaksi Syariah</h2>
            <p className="text-gray-400 text-sm">Menghindari jebakan finansial demi rumah yang berkah.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {['Tanpa Bank', 'Tanpa Bunga', 'Tanpa Denda', 'Tanpa Sita', 'Tanpa BI Checking', 'Tanpa Penalti', 'Tanpa Asuransi'].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#080808]/50 backdrop-blur-sm border border-red-500/10 p-6 rounded-2xl text-center hover:bg-red-600/10 transition-colors group flex-1 min-w-[140px] max-w-[180px]"
              >
                <FiCheckCircle className="text-red-500 w-8 h-8 mx-auto mb-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-bold text-sm text-gray-200">{item}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. SECTION TRUST / TESTIMONI
      ========================================== */}
      <section className="py-32 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-heading font-extrabold mb-6">Dipercaya Ratusan Keluarga Muslim</h2>
              <p className="text-gray-400 mb-10 leading-relaxed text-sm">
                Alhamdulillah, progres pembangunan terus berjalan dan serah terima unit telah dilakukan kepada konsumen-konsumen setia kami.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div>
                  <div className="text-4xl font-black text-red-500 mb-1">500+</div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Konsumen Percaya</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-red-500 mb-1">4</div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Project Berkembang</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
              <div className="bg-[#111] p-8 rounded-3xl border border-white/5 relative z-10">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(star => <FiStar key={star} className="text-yellow-500 w-4 h-4 fill-yellow-500" />)}
                </div>
                <p className="text-gray-300 italic text-sm leading-relaxed mb-6">
                  "Alhamdulillah, proses pembelian sangat mudah tanpa ribet urusan bank. Developer sangat kooperatif dan yang terpenting hati tenang karena tidak ada denda jika telat bayar. Sangat merekomendasikan AFKAR LAND."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-red-500">
                    B
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Bapak Budi & Keluarga</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Konsumen Masagena Green Hills</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          9. CTA PENUTUP
      ========================================== */}
      <section className="py-24 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative bg-gradient-to-br from-red-800 via-red-600 to-[#1a0000] rounded-3xl p-12 md:p-20 text-center overflow-hidden border border-red-500/30 shadow-2xl shadow-red-900/20"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">
                Siap Memiliki Hunian Syariah Impian Anda?
              </h2>
              <p className="text-red-100 mb-10 max-w-2xl mx-auto text-sm md:text-base">
                Konsultasikan kebutuhan property Anda bersama tim konsultan profesional AFKAR LAND sekarang juga. Gratis tanpa komitmen!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:-translate-y-1"
                >
                  Hubungi Marketing <FiArrowRight size={18} />
                </a>
                <Link to="/kontak"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Jadwalkan Survey Lokasi
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}