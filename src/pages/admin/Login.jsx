import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Login Berhasil! Membuka Dashboard...', { duration: 2000 });
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch {
      toast.error('Gagal login. Periksa email dan password Anda.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/6 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10">

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-10 backdrop-blur-sm shadow-2xl">

          {/* Back link */}
          <Link to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-white transition-colors mb-8">
            <FiArrowLeft size={14} /> Kembali ke Beranda
          </Link>

          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-5 shadow-xl shadow-red-900/50">
              <FiLock size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight mb-2">
              AFKAR <span className="text-red-500">ADMIN</span>
            </h1>
            <p className="text-gray-500 text-sm">Masuk untuk mengelola data website</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Admin</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-3.5 text-gray-600" size={16} />
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-700 text-sm focus:outline-none focus:border-red-500/60 focus:bg-white/8 transition-all"
                  placeholder="admin@afkarland.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-3.5 text-gray-600" size={16} />
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-700 text-sm focus:outline-none focus:border-red-500/60 focus:bg-white/8 transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-red-900/40 hover:-translate-y-0.5 mt-2">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <><FiArrowRight size={16} /> Masuk ke Dashboard</>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-700 mt-8">
            Hanya bisa diakses oleh Admin
          </p>
        </div>
      </motion.div>
    </div>
  );
}