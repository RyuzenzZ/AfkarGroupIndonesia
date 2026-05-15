import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-gray-400 pt-16 pb-8 border-t border-gray-900">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-heading font-extrabold text-white tracking-tight">AFKAR <span className="text-brand-primary">LAND</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">100% Syariah, Tanpa Riba, Tanpa Sita.</p>
          </div>

          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6">Jelajahi</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/tentang-kami" className="hover:text-brand-primary transition-colors">Tentang Perusahaan</Link></li>
              <li><Link to="/proyek" className="hover:text-brand-primary transition-colors">Proyek Eksklusif</Link></li>
              <li><Link to="/karir" className="hover:text-brand-primary transition-colors">Karir</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6">Kontak</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3"><FiMapPin className="text-brand-primary mt-1 shrink-0" size={18} /><span>Makassar, Indonesia</span></li>
              <li className="flex items-center gap-3"><FiPhone className="text-brand-primary shrink-0" size={18} /><span>+62 857-0521-8281</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} AFKAR LAND. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}