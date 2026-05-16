import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLock } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // LOGIKA: Transisi warna Navbar saat halaman di-scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // LOGIKA: Tutup menu mobile otomatis saat berpindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/tentang-kami' },
    { name: 'Project', path: '/proyek' },
    { name: 'Article', path: '/artikel' },
    { name: 'Career', path: '/karir' },
    { name: 'Contact', path: '/kontak' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-red-700 shadow-lg py-4' : 'bg-red-600 py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">

        {/* ===================== LOGO ===================== */}
        <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform shrink-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
            <img
              src="/images/LogoAfkar.png"
              alt="LogoAfkar.png"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-2xl font-heading font-extrabold text-white tracking-widest">
            AFKAR <span className="text-red-200">LAND</span>
          </div>
        </Link>

        {/* ===================== NAVIGASI DESKTOP ===================== */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-bold text-white hover:text-red-200 transition-colors uppercase tracking-wider relative group"
            >
              {link.name}
              {/* LOGIKA: Garis bawah animasi aktif/hover */}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-red-200 transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}

          {/* ===== TOMBOL LOGIN ADMIN (DESKTOP) ===== */}
          <Link
            to="/admin/login"
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/60 text-white text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 uppercase tracking-wider backdrop-blur-sm"
          >
            <FiLock size={14} />
            <span>Login</span>
          </Link>
        </nav>

        {/* ===================== TOMBOL HAMBURGER MOBILE ===================== */}
        <button
          className="md:hidden text-white hover:text-red-200 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* ===================== MENU DROPDOWN MOBILE ===================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-red-800 absolute top-full left-0 w-full shadow-2xl border-t border-red-900/50 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-white font-bold text-lg py-3 border-b border-red-700/50 transition-colors ${
                    location.pathname === link.path ? 'text-red-300' : 'hover:text-red-200'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* ===== TOMBOL LOGIN ADMIN (MOBILE) ===== */}
              <Link
                to="/admin/login"
                className="flex items-center justify-center gap-2 mt-4 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-base py-3 rounded-xl transition-all duration-300"
              >
                <FiLock size={16} />
                <span>Login Admin</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}