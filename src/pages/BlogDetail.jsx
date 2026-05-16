import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { FiCalendar, FiUser, FiArrowLeft, FiMapPin, FiShield, FiHome, FiAward, FiShare2, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export default function BlogDetail() {
  // Menangkap 'slug' (judul URL) dari artikel yang diklik
  const { slug } = useParams();
  
  // Progress Bar Reader
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Scroll ke atas setiap kali ganti artikel
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // =================================================================
  // DATABASE ARTIKEL LOKAL (Simulasi sebelum pakai Firebase backend)
  // =================================================================
  const ARTICLES_DB = {
    'soft-launching-masagena-green-hills': {
      category: 'Update Proyek',
      title: 'Alhamdulillah, Soft Launching Masagena Green Hills Telah Terlaksana',
      date: '14 Mei 2026',
      author: 'Tim AFKAR LAND',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
      content: (
        <>
          <p className="text-xl md:text-2xl text-white leading-relaxed mb-8">
            Alhamdulillah, dengan penuh rasa syukur kepada Allah Subhanahu wa Ta’ala, AFKAR LAND telah melaksanakan kegiatan Soft Launching Masagena Green Hills yang berlangsung dengan penuh antusiasme dan dukungan masyarakat.
          </p>
          <p>
            Kegiatan ini menjadi langkah awal dalam memperkenalkan kawasan hunian syariah modern yang dirancang untuk menghadirkan kenyamanan, lingkungan islami, dan nilai investasi yang baik di masa depan. Berlokasi di kawasan asri yang terus berkembang, proyek ini dikembangkan murni menggunakan sistem 100% syariah.
          </p>
          <p>
            Antusiasme masyarakat yang hadir membuktikan bahwa kesadaran akan pentingnya memiliki hunian tanpa riba, tanpa denda, dan tanpa sita semakin tinggi di kalangan keluarga muda.
          </p>

          <h3 className="text-2xl font-bold mt-12 mb-6 text-white">Keunggulan Utama Masagena Green Hills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mb-12">
            {[
              { icon: <FiMapPin />, title: 'Lokasi Strategis', desc: 'Akses mudah ke fasilitas publik.' },
              { icon: <FiShield />, title: '100% Syariah', desc: 'Tanpa pendanaan perbankan konvensional.' },
              { icon: <FiHome />, title: 'Lingkungan Islami', desc: 'Dilengkapi fasilitas masjid agung.' },
              { icon: <FiAward />, title: 'Desain Modern', desc: 'Arsitektur tropis minimalis elegan.' }
            ].map((item, i) => (
              <div key={i} className="bg-[#111] border border-white/5 p-6 rounded-2xl flex items-start gap-4 hover:border-red-500/30 transition-colors">
                <div className="text-red-500 mt-1 bg-red-500/10 p-2 rounded-lg">{item.icon}</div>
                <div>
                  <h4 className="text-white font-bold mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p>
            Kami berterima kasih kepada seluruh tim, aparat pemerintah setempat, serta para calon penghuni yang telah hadir meramaikan acara ini. Tahap pembangunan infrastruktur jalan dan gerbang utama akan segera kami mulai bulan depan.
          </p>

          <div className="not-prose my-16 relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-900 rounded-full"></div>
            <div className="bg-[#111] border border-white/5 p-8 md:p-12 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><FiUser size={100} /></div>
              <p className="text-xl md:text-2xl italic text-white leading-relaxed mb-6 relative z-10 font-light">
                “Kami berharap Masagena Green Hills menjadi langkah awal menghadirkan hunian yang nyaman, amanah, dan penuh keberkahan bagi masyarakat. Kami tidak sekadar membangun rumah, tetapi membangun peradaban.”
              </p>
              <div className="relative z-10">
                <span className="block font-bold text-lg text-white">Ustadz Haris Amrin</span>
                <span className="block text-red-500 text-xs font-bold uppercase tracking-widest mt-1">Founder AFKAR LAND</span>
              </div>
            </div>
          </div>
        </>
      )
    },
    'apa-itu-property-syariah': {
      category: 'Edukasi',
      title: 'Apa Itu Property Syariah? Pahami Konsep dan Keunggulannya',
      date: '05 Mei 2026',
      author: 'Ustadz Haris',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
      content: (
        <>
          <p className="text-xl md:text-2xl text-white leading-relaxed mb-8">
            Membeli rumah adalah salah satu keputusan finansial terbesar dalam hidup. Saat ini, skema pembiayaan properti syariah semakin menjadi primadona, terutama bagi keluarga muda yang ingin terhindar dari dosa Riba.
          </p>
          <p>
            Konsep Property Syariah pada dasarnya adalah transaksi jual beli yang dilakukan secara langsung antara pihak Developer dengan Konsumen tanpa melibatkan pihak ketiga (Bank Konvensional) untuk pembiayaan KPR. 
          </p>
          <h3 className="text-2xl font-bold mt-12 mb-6 text-white">4 Pilar Utama Property Syariah</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mb-12">
            {[
              { icon: <FiCheckCircle />, title: 'Tanpa Riba (Bunga)', desc: 'Harga rumah sudah ditetapkan di awal akad.' },
              { icon: <FiCheckCircle />, title: 'Tanpa Denda', desc: 'Tidak ada biaya tambahan jika terlambat bayar.' },
              { icon: <FiCheckCircle />, title: 'Tanpa Sita', desc: 'Kami mencari solusi bersama jika ada gagal bayar.' },
              { icon: <FiCheckCircle />, title: 'Tanpa Asuransi', desc: 'Menghindari akad gharar (ketidakpastian).' }
            ].map((item, i) => (
              <div key={i} className="bg-[#111] border border-white/5 p-6 rounded-2xl flex items-start gap-4">
                <div className="text-red-500 mt-1 bg-red-500/10 p-2 rounded-lg">{item.icon}</div>
                <div>
                  <h4 className="text-white font-bold mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p>
            Dengan memahami sistem ini, Anda tidak hanya mendapatkan hunian yang nyaman, tetapi juga ketenangan hati karena seluruh proses kepemilikannya diridhoi oleh Allah SWT.
          </p>
        </>
      )
    }
  };

  // Mencari artikel berdasarkan slug, jika tidak ada, buat Fallback Otomatis!
  const article = ARTICLES_DB[slug] || {
    category: 'Informasi',
    // Mengubah slug dari URL menjadi Judul (contoh: progress-wotu -> Progress Wotu)
    title: slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Artikel AFKAR LAND',
    date: 'Baru Saja',
    author: 'Tim Redaksi',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80',
    content: (
      <div className="bg-[#111] p-10 rounded-3xl border border-white/10 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Konten Sedang Diperbarui</h3>
        <p className="text-gray-400">Tim kami sedang menyusun materi untuk artikel <strong>{slug?.split('-').join(' ')}</strong>. Silakan kembali lagi nanti untuk membaca informasi selengkapnya.</p>
      </div>
    )
  };

  const NEWS_UPDATES = [
    { title: 'Coming Soon AFKAR MADANI ESTATE', date: '08 Mei 2026', link: '/artikel/coming-soon-afkar-madani' },
    { title: 'Progress Wotu Islamic Village Tahap 1', date: '02 Mei 2026', link: '/artikel/progress-wotu-islamic-village' },
    { title: 'Apa Itu Property Syariah?', date: '05 Mei 2026', link: '/artikel/apa-itu-property-syariah' }
  ];

  return (
    <div className="w-full bg-[#080808] font-body text-white min-h-screen relative pb-24">
      {/* Reading Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-[100] origin-left" style={{ scaleX }} />

      {/* ==========================================
          A. HEADER ARTIKEL
      ========================================== */}
      <section className="pt-32 pb-10">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <Link to="/artikel" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 mb-10 transition-colors text-sm font-bold uppercase tracking-widest">
            <FiArrowLeft /> Kembali
          </Link>
          
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                {article.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest"><FiCalendar /> {article.date}</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest"><FiUser /> {article.author}</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-[1.1] mb-8 text-white">
              {article.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          B. HERO IMAGE
      ========================================== */}
      <section className="pb-16">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          C. CONTENT ARTICLE
      ========================================== */}
      <section className="pb-20">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl flex flex-col lg:flex-row gap-12 relative">
          
          {/* Sticky Social Share (Desktop) */}
          <div className="hidden lg:block w-16 shrink-0 relative">
            <div className="sticky top-32 flex flex-col gap-4 items-center">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-2 rotate-180" style={{ writingMode: 'vertical-rl' }}>Bagikan</span>
              <div className="w-[1px] h-10 bg-white/10 mb-2"></div>
              <button className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all"><FiShare2 size={16} /></button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-gray-300 prose-p:leading-relaxed prose-p:font-light prose-a:text-red-500 hover:prose-a:text-red-400">
            
            {/* Render Konten Artikel Dinamis di sini */}
            {article.content}

            {/* 5. Penutup CTA (Muncul di semua artikel) */}
            <div className="not-prose mt-16 p-10 bg-gradient-to-br from-red-900/40 to-[#111] border border-red-500/20 rounded-3xl text-center shadow-2xl">
              <h3 className="text-2xl font-heading font-bold text-white mb-3">Ingin Menjadi Bagian dari Kawasan Islami Kami?</h3>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">Konsultasikan properti impian Anda secara gratis dan dapatkan pricelist terbaru dari tim ahli kami.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg">
                  Konsultasi Sekarang
                </a>
                <Link to="/proyek" className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                  Lihat Semua Proyek
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION NEWS UPDATE / INFORMASI TERBARU
      ========================================== */}
      <section className="py-16 border-t border-white/5 bg-[#0a0a0a]">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-heading font-bold text-white">Berita & Update Terbaru</h2>
            <Link to="/artikel" className="text-sm font-bold text-red-500 hover:text-white transition-colors">Lihat Semua</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEWS_UPDATES.map((news, idx) => (
              <Link key={idx} to={news.link} className="bg-[#111] p-6 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all group flex flex-col justify-between h-full">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 block">{news.date}</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors leading-snug mb-4">{news.title}</h3>
                </div>
                <span className="text-xs text-red-500 font-bold flex items-center gap-2 mt-auto group-hover:gap-3 transition-all">Baca <FiArrowRight/></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}