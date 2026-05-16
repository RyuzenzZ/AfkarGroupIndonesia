import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiExternalLink, FiBriefcase, FiTrendingUp, 
  FiUsers, FiAward, FiArrowRight, FiMail 
} from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Career() {
  // Ganti link ini dengan link portal HRD asli AFKAR LAND
  const hrPortalLink = "https://sites.google.com/view/afkar-rekrutmen/"; 

  return (
    <div className="w-full bg-[#080808] font-body min-h-screen text-white overflow-hidden pb-24">
      
      {/* =========================================
          1. HERO SECTION — KARIR & PELUANG
      ========================================= */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Kiri: Copywriting */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-xs uppercase">
                  Karir & Peluang
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold mb-6 leading-tight">
                Tumbuh Bersama <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">AFKAR LAND</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-10 max-w-lg">
                Bangun karir cemerlang di industri properti sambil mengumpulkan amal jariyah melalui sistem kerja yang profesional dan islami.
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <a href={hrPortalLink} target="_blank" rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/30"
                >
                  Cek Lowongan <FiExternalLink size={18} />
                </a>
                <Link to="/kontak" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  Hubungi HRD
                </Link>
              </motion.div>
            </motion.div>

            {/* Kanan: Foto Tim Modern */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative hidden lg:block">
              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 relative z-10 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80" 
                  alt="Tim AFKAR LAND Meeting" 
                  className="w-full h-full object-cover opacity-90" 
                />
                {/* Gradient transisi halus */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#080808] via-transparent to-transparent opacity-80" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================
          2. PORTAL REKRUTMEN (Glassmorphism)
      ========================================= */}
      <section className="py-12 relative z-20">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} 
            className="bg-[#111]/80 backdrop-blur-xl p-10 md:p-16 rounded-[2.5rem] shadow-2xl border border-white/10 text-center relative overflow-hidden group"
          >
            {/* Glow halus saat dihover */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="w-20 h-20 bg-black border border-white/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <FiBriefcase size={32} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-6">
              Portal Rekrutmen Terpadu
            </h2>
            
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Untuk menjaga transparansi dan standar profesionalisme, seluruh proses seleksi, lowongan pekerjaan, dan tes masuk <strong className="text-white">AFKAR LAND</strong> dilakukan melalui Portal Rekrutmen Resmi HRD kami.
            </p>
            
            <a href={hrPortalLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 hover:-translate-y-1 transition-all duration-300"
            >
              Cek Lowongan Pekerjaan <FiArrowRight size={20} />
            </a>
            
            <p className="text-xs text-red-400 mt-6 font-bold tracking-widest uppercase">
              *Anda akan diarahkan ke halaman rekrutmen terpisah
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          3. MENGAPA BERGABUNG DENGAN KAMI?
      ========================================= */}
      <section className="py-24 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white">Keuntungan Bergabung di Tim Kami</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <FiTrendingUp size={28} />, 
                title: 'Pengembangan Karir', 
                desc: 'Kami mendukung peningkatan skill karyawan melalui berbagai pelatihan internal maupun eksternal di bidang properti dan digital marketing.' 
              },
              { 
                icon: <FiUsers size={28} />, 
                title: 'Lingkungan Islami', 
                desc: 'Budaya kerja yang mengedepankan nilai-nilai syariat, saling mengingatkan dalam kebaikan, dan menjaga integritas (Amanah).' 
              },
              { 
                icon: <FiAward size={28} />, 
                title: 'Sistem Reward Kompetitif', 
                desc: 'Kami mengapresiasi setiap kerja keras tim dengan skema gaji, bonus, dan komisi penjualan yang transparan dan adil.' 
              }
            ].map((benefit, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden" whileInView="visible" viewport={{ once: true }} 
                variants={fadeUp} transition={{ delay: idx * 0.1 }} 
                className="bg-[#111] p-10 rounded-3xl border border-white/5 hover:border-red-500/30 hover:bg-[#1a1a1a] transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-black border border-white/10 text-red-500 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{benefit.title}</h4>
                <p className="text-gray-500 font-light leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          4. BUDAYA KERJA AFKAR LAND
      ========================================= */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} 
            className="relative rounded-[3rem] overflow-hidden bg-[#111] aspect-[4/3] md:aspect-[21/9] flex items-center"
          >
            {/* Background Image full width */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
                alt="Budaya Kerja Kolaboratif" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gradient Overlay untuk text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent" />

            <div className="relative z-10 p-10 md:p-20 max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-[10px] uppercase mb-6">
                Budaya Perusahaan
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
                Bekerja dengan Amanah dan Profesionalisme
              </h2>
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
                Kami percaya bahwa lingkungan kerja yang sehat akan melahirkan tim yang kuat. Karena itu, AFKAR LAND membangun budaya kerja yang kolaboratif, islami, dan berorientasi pada pertumbuhan bersama.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          5. CTA HRD
      ========================================= */}
      <section className="py-24 border-t border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative bg-gradient-to-br from-red-900 via-red-800 to-[#0A0A0A] rounded-3xl p-12 md:p-20 text-center overflow-hidden border border-red-500/30 shadow-2xl shadow-red-900/20"
          >
            {/* Tekstur grid halus */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">
                Ada Pertanyaan Seputar Rekrutmen?
              </h2>
              <p className="text-red-100 mb-10 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                Hubungi tim HRD kami langsung melalui halaman kontak untuk mendapatkan informasi lebih lanjut mengenai proses perekrutan AFKAR LAND.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/kontak"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-red-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-xl shadow-black/20"
                >
                  Hubungi HRD <FiMail size={18} />
                </Link>
                <a href={hrPortalLink} target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Lihat Lowongan <FiExternalLink size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}