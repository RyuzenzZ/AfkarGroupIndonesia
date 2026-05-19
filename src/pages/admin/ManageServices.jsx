// ManageServices.jsx — AFKAR LAND Admin Panel (PREMIUM UPGRADE)
// CRUD layanan perusahaan — enterprise SaaS dashboard experience

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiSave,
  FiSearch, FiEye, FiEyeOff, FiCopy, FiMoreVertical,
  FiCheck, FiZap,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// ─── Constants ──────────────────────────────────────────────────────
const ICON_OPTIONS = ['🏠','🏢','🌿','💎','🔑','📐','🏗️','🤝','⚡','🛡️','📊','🌍','🎯','✨','🏆','💡'];
const INITIAL_FORM = { nama: '', deskripsi: '', icon: '🏠', detail: '', urutan: 0, aktif: true };

// ─── Sub-components ──────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 animate-pulse">
    <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
    <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
    <div className="h-3 bg-gray-100 rounded-lg w-full" />
    <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
  </div>
);

const EmptyState = ({ hasSearch }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-3xl mb-4 border border-gray-100">
      {hasSearch ? '🔍' : '🏗️'}
    </div>
    <h3 className="font-semibold text-gray-700 mb-1">
      {hasSearch ? 'Tidak ada hasil' : 'Belum ada layanan'}
    </h3>
    <p className="text-sm text-gray-400 max-w-xs">
      {hasSearch ? 'Coba kata kunci lain.' : 'Tambahkan layanan pertama untuk ditampilkan di website.'}
    </p>
  </motion.div>
);

function ServiceCard({ service, onEdit, onDelete, onToggle, onDuplicate, index }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden
        ${service.aktif === false
          ? 'border-gray-100 opacity-60'
          : 'border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/80'}`}
    >
      {/* Status indicator stripe */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-300
        ${service.aktif !== false ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gray-200'}`} />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl
            bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100
            group-hover:scale-105 transition-transform duration-300`}>
            {service.icon}
          </div>

          {/* Action menu */}
          <div className="relative">
            <button onClick={() => setMenuOpen(v => !v)}
              className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100">
              <FiMoreVertical size={16} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 z-20 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 py-1.5 w-44 overflow-hidden"
                  >
                    {[
                      { icon: <FiEdit2 size={13}/>, label: 'Edit', action: () => { onEdit(service); setMenuOpen(false); } },
                      { icon: service.aktif !== false ? <FiEyeOff size={13}/> : <FiEye size={13}/>,
                        label: service.aktif !== false ? 'Sembunyikan' : 'Tampilkan',
                        action: () => { onToggle(service.id, service.aktif !== false); setMenuOpen(false); } },
                      { icon: <FiCopy size={13}/>, label: 'Duplikat', action: () => { onDuplicate(service); setMenuOpen(false); } },
                      { icon: <FiTrash2 size={13}/>, label: 'Hapus', action: () => { onDelete(service.id); setMenuOpen(false); }, danger: true },
                    ].map((item, i) => (
                      <button key={i} onClick={item.action}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left
                          ${item.danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                        {item.icon} {item.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Order badge */}
        <div className="absolute top-4 left-4">
          <span className="text-[9px] font-black text-gray-300 tracking-widest">#{service.urutan + 1}</span>
        </div>

        {/* Content */}
        <h3 className="font-bold text-gray-900 mb-1.5 leading-snug">{service.nama}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{service.deskripsi}</p>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full
            ${service.aktif !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${service.aktif !== false ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            {service.aktif !== false ? 'Aktif' : 'Disembunyikan'}
          </span>
          <button onClick={() => onEdit(service)}
            className="text-xs text-gray-400 hover:text-gray-700 font-semibold flex items-center gap-1 transition-colors">
            <FiEdit2 size={11}/> Edit
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ServiceModal({ open, onClose, onSave, isEditing, form, setForm }) {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(e);
    setSaving(false);
  };

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 28, stiffness: 360 }}
          className="bg-white w-full md:max-w-xl rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white text-lg">
                {form.icon}
              </div>
              <h2 className="font-bold text-gray-900">{isEditing ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
              <FiX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh]">
            <div className="p-6 space-y-5">
              {/* Icon picker */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Pilih Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(ic => (
                    <button type="button" key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                      className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center border-2 transition-all
                        ${form.icon === ic ? 'border-gray-900 bg-gray-900/5 scale-110' : 'border-gray-100 hover:border-gray-200 hover:scale-105'}`}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nama Layanan *</label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none text-sm transition-all font-medium"
                  value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                  required placeholder="Konsultasi Properti Syariah" />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Deskripsi Singkat</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none text-sm transition-all resize-none"
                  rows={2} value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                  placeholder="Kami membantu Anda menemukan properti ideal..." />
              </div>

              {/* Detail */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Detail Lengkap</label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none text-sm transition-all resize-none"
                  rows={3} value={form.detail} onChange={e => setForm(f => ({ ...f, detail: e.target.value }))}
                  placeholder="Penjelasan lebih lengkap tentang layanan ini..." />
              </div>

              {/* Urutan & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Urutan</label>
                  <input type="number" min={0}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                    value={form.urutan} onChange={e => setForm(f => ({ ...f, urutan: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Status</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                    value={form.aktif ? 'aktif' : 'sembunyikan'}
                    onChange={e => setForm(f => ({ ...f, aktif: e.target.value === 'aktif' }))}>
                    <option value="aktif">✅ Tampilkan</option>
                    <option value="sembunyikan">🚫 Sembunyikan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                ) : (
                  <><FiSave size={14}/> {isEditing ? 'Simpan Perubahan' : 'Tambah Layanan'}</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DeleteDialog({ id, onConfirm, onCancel }) {
  if (!id) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onCancel}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 28 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
          onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl">🗑️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hapus Layanan?</h2>
          <p className="text-sm text-gray-500 mb-6">Data ini akan dihapus permanen dan tidak bisa dikembalikan.</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">Batal</button>
            <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors">Hapus</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function ManageServices() {
  const [services, setServices]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [isModalOpen, setIsModal]   = useState(false);
  const [isEditing, setIsEditing]   = useState(false);
  const [editId, setEditId]         = useState(null);
  const [form, setForm]             = useState(INITIAL_FORM);
  const [modalHapus, setModalHapus] = useState(null);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilter]   = useState('semua');

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('urutan', 'asc'));
    const unsub = onSnapshot(q,
      snap => { setServices(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      () => {
        const u2 = onSnapshot(collection(db, 'services'), snap => {
          setServices(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false);
        });
        return u2;
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return services
      .filter(s => !search || s.nama?.toLowerCase().includes(search.toLowerCase()) || s.deskripsi?.toLowerCase().includes(search.toLowerCase()))
      .filter(s => filterStatus === 'semua' || (filterStatus === 'aktif' ? s.aktif !== false : s.aktif === false));
  }, [services, search, filterStatus]);

  const openAdd = () => {
    setForm({ ...INITIAL_FORM, urutan: services.length });
    setIsEditing(false); setIsModal(true);
  };
  const openEdit = (s) => { setForm(s); setEditId(s.id); setIsEditing(true); setIsModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, urutan: Number(form.urutan), updatedAt: serverTimestamp() };
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'services', editId), payload);
        toast.success('Layanan diperbarui!');
      } else {
        await addDoc(collection(db, 'services'), { ...payload, createdAt: serverTimestamp() });
        toast.success('Layanan baru ditambahkan!');
      }
      setIsModal(false);
    } catch { toast.error('Gagal menyimpan.'); }
  };

  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'services', modalHapus));
      toast.success('Layanan dihapus.'); setModalHapus(null);
    } catch { toast.error('Gagal menghapus.'); }
  };

  const handleToggle = async (id, current) => {
    try {
      await updateDoc(doc(db, 'services', id), { aktif: !current });
      toast.success(!current ? 'Layanan ditampilkan' : 'Layanan disembunyikan');
    } catch { toast.error('Gagal.'); }
  };

  const handleDuplicate = async (s) => {
    const { id, ...rest } = s;
    try {
      await addDoc(collection(db, 'services'), {
        ...rest, nama: `${s.nama} (Salinan)`, urutan: services.length, createdAt: serverTimestamp()
      });
      toast.success('Layanan diduplikat!');
    } catch { toast.error('Gagal menduplikat.'); }
  };

  const stats = [
    { label: 'Total Layanan', value: services.length, color: 'text-gray-900', bg: 'bg-gray-50' },
    { label: 'Aktif', value: services.filter(s => s.aktif !== false).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Disembunyikan', value: services.filter(s => s.aktif === false).length, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-7 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Sync</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Layanan Perusahaan</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola layanan yang tampil di halaman publik website.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-sm transition-colors shadow-sm">
          <FiPlus size={16} /> Tambah Layanan
        </motion.button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`${s.bg} rounded-2xl p-5 border border-white/80`}>
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 font-medium mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-gray-400 focus:outline-none transition-all"
            placeholder="Cari layanan..."
          />
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {[['semua','Semua'], ['aktif','Aktif'], ['hidden','Sembunyikan']].map(([val, lbl]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all
                ${filterStatus === val ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <EmptyState hasSearch={!!search} />
            ) : (
              filtered.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i}
                  onEdit={openEdit} onDelete={setModalHapus}
                  onToggle={handleToggle} onDuplicate={handleDuplicate} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Modals ── */}
      <ServiceModal
        open={isModalOpen} onClose={() => setIsModal(false)}
        onSave={handleSave} isEditing={isEditing}
        form={form} setForm={setForm}
      />
      <DeleteDialog id={modalHapus} onConfirm={handleHapus} onCancel={() => setModalHapus(null)} />
    </div>
  );
}