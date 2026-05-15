import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiBriefcase, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';

// Animasi Reusable
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Career() {
  // Ganti link ini dengan link portal HRD / Web Tes asli milik AFKAR LAND
  const hrPortalLink = "https://sites.google.com/view/afkar-rekrutmen/"; 

  return (
    <div className="w-full bg-gray-50 font-body min-h-screen overflow-hidden">
      
      {/* =========================================
          1. HEADER SECTION (Gelap & Mewah)
          ========================================= */}
      <section className="pt-32 pb-24 bg-[#0A0A0A] text-white relative">
        {/* Ornamen Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-red-600/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 mb-6 rounded-full border border-brand-primary/50 bg-brand-primary/10 backdrop-blur-sm text-brand-primary font-bold tracking-widest text-sm uppercase">
              Karir & Peluang
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-heading font-extrabold mb-6 leading-tight">
              Tumbuh Bersama <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-red-400">AFKAR LAND</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-gray-400 font-light leading-relaxed mb-10">
              Bangun karir cemerlang di industri properti sambil mengumpulkan amal jariyah melalui sistem kerja yang profesional dan islami.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          2. CALL TO ACTION: PORTAL HRD
          ========================================= */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-red-50 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-8">
              <FiBriefcase size={40} />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
              Portal Rekrutmen Terpadu
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Untuk menjaga transparansi dan standar profesionalisme, seluruh proses seleksi, lowongan pekerjaan, dan tes masuk AFKAR LAND kini dilakukan melalui <strong>Portal Rekrutmen Resmi HRD</strong> kami.
            </p>
            
            <a 
              href={hrPortalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-brand-primary text-white px-8 py-5 rounded-xl font-bold text-lg hover:bg-brand-accent hover:shadow-xl hover:shadow-brand-primary/30 hover:-translate-y-1 transition-all duration-300"
            >
              Cek Lowongan Pekerjaan <FiExternalLink size={22} />
            </a>
            
            <p className="text-sm text-gray-400 mt-6">
              *Anda akan diarahkan ke halaman website rekrutmen terpisah.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          3. BENEFIT BERGABUNG DENGAN AFKAR LAND
          ========================================= */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-3">Mengapa Kami?</h2>
            <h3 className="text-3xl font-heading font-bold text-gray-900">Keuntungan Bergabung di Tim Kami</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <FiTrendingUp size={28} />, 
                title: 'Pengembangan Karir', 
                desc: 'Kami sangat mendukung peningkatan skill karyawan melalui berbagai pelatihan internal maupun eksternal di bidang properti dan digital marketing.' 
              },
              { 
                icon: <FiUsers size={28} />, 
                title: 'Lingkungan Islami', 
                desc: 'Budaya kerja yang mengedepankan nilai-nilai syariat, saling mengingatkan dalam kebaikan, dan menjaga integritas (Amanah).' 
              },
              { 
                icon: <FiAward size={28} />, 
                title: 'Sistem Reward Kompetitif', 
                desc: 'Kami mengapresiasi setiap kerja keras tim dengan skema gaji, bonus, dan komisi penjualan yang sangat transparan dan adil.' 
              }
            ].map((benefit, idx) => (
              <motion.div 
                key={idx} 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} 
                variants={fadeUp} transition={{ delay: idx * 0.2 }} 
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="w-14 h-14 bg-gray-50 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}