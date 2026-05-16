import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- INTERNAL SVG ICONS (To avoid unresolved dependency issues) ---
const IconMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconMail = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconMessage = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconInfo = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nama: '', email: '', telepon: '', pesan: '' });

  const waNumber = "6285705218281";
  const emailAddress = "Afkargroupindonesia@gmail.com";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Pesan Anda berhasil dikirim! Tim kami akan segera merespon.', {
        style: { borderRadius: '10px', background: '#111', color: '#fff' }
      });
      setFormData({ nama: '', email: '', telepon: '', pesan: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-[#080808] font-body min-h-screen text-white overflow-hidden">
      
      {/* =========================================
          1. HERO CONTACT (Simple Center Layout)
      ========================================= */}
      <section className="relative pt-40 pb-20 flex flex-col justify-center items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-3xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold tracking-widest text-xs uppercase">
                Hubungi Kami
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold mb-6 leading-tight text-white">
              Kami Siap Membantu
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-gray-400 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              Tinggalkan pesan atau kunjungi kantor pemasaran kami untuk informasi lebih lanjut mengenai project property syariah AFKAR LAND.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-4">
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" 
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/30"
              >
                <IconMessage /> Chat WhatsApp
              </a>
              <a href="#maps-form" 
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#111] border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition-all"
              >
                Lihat Lokasi
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          2. INTEGRATED CONTACT & HOURS INFO
      ========================================= */}
      <section className="py-12 relative z-20">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} 
            className="bg-[#111] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
              
              {/* Kolom Kiri: Informasi Kontak Saja */}
              <div className="p-10 space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center shrink-0 border border-red-500/20">
                    <IconMapPin />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Kantor Pusat</h3>
                    <p className="text-white font-medium leading-relaxed">Makassar, Sulawesi Selatan<br/>Indonesia</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center shrink-0 border border-red-500/20">
                    <IconPhone />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Telepon & WhatsApp</h3>
                    <p className="text-white font-medium">+62 857-0521-8281</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center shrink-0 border border-red-500/20">
                    <IconMail />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Email Resmi</h3>
                    <p className="text-white font-medium">{emailAddress}</p>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Jam Operasional */}
              <div className="p-10 bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-red-500">
                    <IconClock />
                  </div>
                  <h3 className="text-lg font-bold text-white">Jam Operasional Kantor</h3>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Senin – Jumat</span>
                    <span className="text-white font-bold">09.00 – 17.00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">Sabtu</span>
                    <span className="text-white font-bold">09.00 – 16.00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Minggu</span>
                    <span className="text-red-400 font-bold italic">By Confirmation</span>
                  </div>
                </div>

                <div className="mt-8 bg-red-500/5 border border-red-500/10 p-4 rounded-xl text-[11px] text-red-200/60 flex gap-3 leading-relaxed">
                  <div className="shrink-0 text-red-500 mt-0.5">
                    <IconInfo />
                  </div>
                  <p>Untuk jadwal survey hari Minggu, mohon melakukan konfirmasi terlebih dahulu dengan tim marketing kami.</p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          3. MAPS + FORM
      ========================================= */}
      <section id="maps-form" className="py-20 relative bg-[#080808]">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Kiri: Google Maps Embed */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} 
              className="w-full h-full min-h-[450px] rounded-[2.5rem] overflow-hidden border border-white/10 relative bg-[#111]"
            >
              <iframe 
                title="Lokasi Kantor AFKAR LAND"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127153.28424036074!2d119.345262!3d-5.111453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbee329d96c4671%3A0x3030bfbcaf770b0!2sMakassar%2C%20Makassar%20City%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1716301234567!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)', minHeight: '100%' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              ></iframe>
            </motion.div>

            {/* Kanan: Form Contact Minimalis */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} 
              className="bg-[#111] p-10 md:p-14 rounded-[2.5rem] border border-white/5 flex flex-col justify-center"
            >
              <div className="mb-10">
                <h2 className="text-3xl font-heading font-extrabold text-white mb-3 tracking-tight">Tinggalkan Pesan</h2>
                <p className="text-gray-400 font-light text-sm">Punya pertanyaan seputar legalitas atau skema harga? Tanyakan di sini.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Nama Lengkap</label>
                  <input 
                    type="text" name="nama" required value={formData.nama} onChange={handleChange} 
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-5 py-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none text-sm placeholder-gray-700" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Email</label>
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange} 
                      placeholder="email@contoh.com"
                      className="w-full px-5 py-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none text-sm placeholder-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">WhatsApp</label>
                    <input 
                      type="tel" name="telepon" required value={formData.telepon} onChange={handleChange} 
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-5 py-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none text-sm placeholder-gray-700" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Pesan</label>
                  <textarea 
                    name="pesan" required rows="4" value={formData.pesan} onChange={handleChange} 
                    placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."
                    className="w-full px-5 py-4 rounded-2xl bg-[#0a0a0a] border border-white/10 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none resize-none text-sm placeholder-gray-700"
                  ></textarea>
                </div>

                <button 
                  type="submit" disabled={isSubmitting} 
                  className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 text-sm uppercase tracking-widest shadow-xl shadow-white/5"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Mengirim...</span>
                  ) : (
                    'Kirim Pesan'
                  )}
                </button>
                
                <p className="text-center text-[10px] text-gray-600 mt-6 flex items-center justify-center gap-2 font-light tracking-wide uppercase">
                  <span className="text-green-500"><IconCheck /></span> Data Anda aman dan tidak akan dibagikan ke pihak ketiga.
                </p>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================
          4. CTA BOTTOM
      ========================================= */}
      <section className="py-24 bg-red-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-800 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-4xl">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} 
            className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6 leading-tight tracking-tight"
          >
            Butuh Respon Lebih Cepat?
          </motion.h2>
          
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-red-100 text-lg md:text-xl mb-12 leading-relaxed font-light max-w-2xl mx-auto"
          >
            Hubungi tim marketing AFKAR LAND langsung melalui WhatsApp untuk konsultasi property syariah yang amanah dan transparan.
          </motion.p>
          
          <motion.a initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-4 bg-white text-red-700 px-10 py-5 rounded-[1.25rem] font-black text-xl hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-2xl shadow-black/20"
          >
            <IconMessage /> Chat Sekarang
          </motion.a>
        </div>
      </section>

    </div>
  );
}