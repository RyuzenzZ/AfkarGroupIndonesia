import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nama: '', email: '', telepon: '', pesan: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Mockup fungsi kirim pesan (Nanti kita hubungkan ke Firestore)
      setTimeout(() => {
        toast.success('Pesan Anda berhasil dikirim! Tim kami akan segera merespon.');
        setFormData({ nama: '', email: '', telepon: '', pesan: '' });
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      toast.error('Gagal mengirim pesan.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 pb-24">
      <section className="pt-32 pb-20 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-extrabold mb-6">
            Hubungi <span className="text-brand-primary">Kami</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
            Silakan tinggalkan pesan atau kunjungi kantor pemasaran kami untuk informasi lebih lanjut.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            
            {/* Kiri: Info Kontak */}
            <div className="bg-black text-white p-10 md:p-16 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-8">Informasi Kontak</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-4 text-lg">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-brand-primary shrink-0">
                      <FiMapPin size={24} />
                    </div>
                    <div>
                      <p className="font-bold mb-1">Kantor Pusat AFKAR LAND</p>
                      <p className="text-gray-400 leading-relaxed text-base">Makassar, Sulawesi Selatan<br/>Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-lg">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-brand-primary shrink-0">
                      <FiPhone size={24} />
                    </div>
                    <div>
                      <p className="font-bold mb-1">Telepon & WhatsApp</p>
                      <p className="text-gray-400 text-base">+62 857-0521-8281</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-lg">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-brand-primary shrink-0">
                      <FiMail size={24} />
                    </div>
                    <div>
                      <p className="font-bold mb-1">Email Resmi</p>
                      <p className="text-gray-400 text-base">Afkargroupindonesia@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kanan: Form Kontak */}
            <div className="p-10 md:p-16">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Tinggalkan Pesan</h2>
              <p className="text-gray-500 mb-8">Punya pertanyaan seputar legalitas atau skema harga? Tanyakan di sini.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                  <input type="text" name="nama" required value={formData.nama} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor WhatsApp</label>
                    <input type="tel" name="telepon" required value={formData.telepon} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pesan Anda</label>
                  <textarea name="pesan" required rows="4" value={formData.pesan} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-primary outline-none"></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary hover:bg-brand-accent text-white font-bold py-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2">
                  {isSubmitting ? 'Mengirim...' : <><FiSend /> Kirim Pesan</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}