import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiArrowRight, FiSearch, FiTag } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Data Dummy Sesuai Struktur
const CATEGORIES = ['Semua', 'Update Proyek', 'Property Syariah', 'Edukasi', 'Investasi', 'Event', 'AFKAR LAND'];

const FEATURED_ARTICLE = {
  slug: 'soft-launching-masagena-green-hills',
  kategori: 'Update Proyek',
  judul: 'Alhamdulillah, Soft Launching Masagena Green Hills Telah Terlaksana',
  deskripsi: 'AFKAR LAND resmi memperkenalkan proyek terbaru Masagena Green Hills sebagai kawasan hunian syariah modern dengan konsep nyaman, islami, dan strategis.',
  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
  date: '14 Mei 2026',
  author: 'Tim AFKAR LAND'
};

const ARTICLES = [
  { slug: 'progress-wotu-islamic-village', kategori: 'Update Proyek', judul: 'Progress Pembangunan Wotu Islamic Village Tahap 1', image: 'https://images.unsplash.com/photo-1541888082470-bf2e36125eb8?auto=format&fit=crop&q=80', date: '10 Mei 2026', author: 'Tim Proyek' },
  { slug: 'coming-soon-afkar-madani', kategori: 'Coming Soon', judul: 'Coming Soon: AFKAR MADANI ESTATE BTP', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80', date: '08 Mei 2026', author: 'Tim Redaksi' },
  { slug: 'apa-itu-property-syariah', kategori: 'Edukasi', judul: 'Apa Itu Property Syariah? Pahami Konsep dan Keunggulannya', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80', date: '05 Mei 2026', author: 'Ustadz Haris' },
  { slug: 'menuju-1-juta-unit', kategori: 'Branding Vision', judul: 'Menuju 1 Juta Unit Property Syariah di Indonesia Timur', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80', date: '01 Mei 2026', author: 'Management' },
  { slug: 'kenapa-riba-diharamkan', kategori: 'Edukasi', judul: 'Kenapa Riba Diharamkan? Dampak Buruk KPR Konvensional', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80', date: '28 Apr 2026', author: 'Tim Edukasi' },
  { slug: 'grand-opening-gallery', kategori: 'Update Proyek', judul: 'Grand Opening Marketing Gallery The Hasanah Panakkukang', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80', date: '25 Apr 2026', author: 'Tim Redaksi' }
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = ARTICLES.filter(article => {
    const matchCat = activeCategory === 'Semua' || article.kategori === activeCategory;
    const matchSearch = article.judul.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-full bg-[#080808] min-h-screen text-white font-body pb-24 overflow-hidden">
      
      {/* ==========================================
          1. HERO ARTICLE
      ========================================== */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-xs uppercase mb-6">
              Artikel & Informasi
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 leading-tight">
              Insight, Edukasi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">Update Proyek</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg leading-relaxed">
              Temukan informasi terbaru seputar property syariah, perkembangan proyek, edukasi investasi, dan perjalanan AFKAR LAND dalam membangun hunian islami yang amanah.
            </motion.p>
          </div>

          {/* Search & Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-4xl mx-auto">
            <div className="relative mb-8">
              <FiSearch className="absolute left-5 top-4 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Cari artikel, panduan, atau update proyek..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors shadow-lg"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border ${
                    activeCategory === cat 
                      ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20' 
                      : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          2. FEATURED ARTICLE
      ========================================== */}
      {(activeCategory === 'Semua' && searchQuery === '') && (
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-[#111] border border-white/10 rounded-[2.5rem] p-4 md:p-6 shadow-2xl hover:border-red-500/30 transition-colors group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-[2rem]">
                  <img src={FEATURED_ARTICLE.image} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      {FEATURED_ARTICLE.kategori}
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-8 lg:p-12 lg:pl-0 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wider mb-6">
                    <span className="flex items-center gap-1.5"><FiCalendar /> {FEATURED_ARTICLE.date}</span>
                    <span className="flex items-center gap-1.5"><FiUser /> {FEATURED_ARTICLE.author}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-6 leading-tight group-hover:text-red-400 transition-colors">
                    {FEATURED_ARTICLE.judul}
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-10">
                    {FEATURED_ARTICLE.deskripsi}
                  </p>
                  <div>
                    <Link to={`/artikel/${FEATURED_ARTICLE.slug}`} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                      Baca Selengkapnya <FiArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ==========================================
          3. GRID ARTIKEL MODERN
      ========================================== */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-[#111] border border-white/5 rounded-3xl">
              <FiSearch className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-400">Artikel tidak ditemukan</h3>
              <p className="text-gray-500 mt-2">Coba gunakan kata kunci atau kategori lain.</p>
            </div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, idx) => (
                <motion.div key={idx} variants={fadeUp} className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-lg hover:border-red-500/40 hover:shadow-red-900/10 transition-all duration-300 group flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={article.image} alt={article.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        <FiTag className="inline mr-1 mb-0.5" />{article.kategori}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1 relative bg-[#111]">
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1.5"><FiCalendar size={12} /> {article.date}</span>
                      <span className="flex items-center gap-1.5"><FiUser size={12} /> {article.author}</span>
                    </div>
                    
                    <h3 className="text-xl font-heading font-bold text-white mb-6 line-clamp-3 leading-snug group-hover:text-red-400 transition-colors flex-1">
                      {article.judul}
                    </h3>
                    
                    <div className="pt-6 border-t border-white/5 mt-auto">
                      <Link to={`/artikel/${article.slug}`} className="inline-flex items-center gap-2 text-sm text-red-500 font-bold hover:text-white transition-colors">
                        Baca Artikel <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
}