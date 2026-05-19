// ManageTestimonials.jsx — AFKAR LAND Admin Panel (PREMIUM UPGRADE)
// CRUD testimoni klien — premium review management dashboard

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiStar, FiSearch, FiEye, FiEyeOff, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

// ─── Constants ─────────────────────────────────────────────────────────
const PROYEK_LIST = ['Masagena Green Hills', 'Wotu Islamic Village', 'The Hasanah Panakkukang', 'Afkar Madani Estate'];
const INITIAL_FORM = { nama: '', jabatan: '', perusahaan: '', foto: '', isi: '', rating: 5, proyek: '', tampil: true, featured: false };

// ─── Sub-components ────────────────────────────────────────────────────

const StarRating = ({ value, onChange, size = 22, readonly = false }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(s => (
      <button type="button" key={s}
        onClick={() => !readonly && onChange?.(s)}
        className={`transition-all ${readonly ? 'cursor-default' : 'hover:scale-110'} ${s <= value ? 'text-amber-400' : 'text-gray-200'}`}>
        <FiStar size={size} fill={s <= value ? '#fbbf24' : 'none'}/>
      </button>
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 animate-pulse">
    <div className="flex gap-1">{Array(5).fill(0).map((_, i) => <div key={i} className="w-4 h-4 bg-gray-100 rounded"/>)}</div>
    <div className="h-3 bg-gray-100 rounded w-full"/>
    <div className="h-3 bg-gray-100 rounded w-4/5"/>
    <div className="h-3 bg-gray-100 rounded w-3/5"/>
    <div className="flex gap-3 pt-2">
      <div className="w-10 h-10 rounded-full bg-gray-100"/>
      <div className="space-y-1.5">
        <div className="h-3 bg-gray-100 rounded w-24"/>
        <div className="h-2.5 bg-gray-100 rounded w-16"/>
      </div>
    </div>
  </div>
);

const EmptyState = ({ hasFilter }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="col-span-full flex flex-col items-center justify-center py-24 text-center">
    <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-4xl mb-5 border border-amber-100">
      {hasFilter ? '🔍' : '⭐'}
    </div>
    <h3 className="font-bold text-gray-700 text-lg mb-1">{hasFilter ? 'Tidak ada hasil' : 'Belum ada testimoni'}</h3>
    <p className="text-sm text-gray-400">{hasFilter ? 'Coba ganti filter.' : 'Tambahkan testimoni klien pertama.'}</p>
  </motion.div>
);

// ─── Rating Distribution ────────────────────────────────────────────────
function RatingBar({ rating, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-gray-500 w-3">{rating}</span>
      <FiStar size={11} fill="#fbbf24" className="text-amber-400 shrink-0"/>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: 0.1 }}
          className="h-full bg-amber-400 rounded-full"/>
      </div>
      <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
    </div>
  );
}

// ─── Review Card ────────────────────────────────────────────────────────
function ReviewCard({ t, onEdit, onHapus, onToggle, onFeatured, index }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = t.isi?.length > 120;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`group relative bg-white rounded-2xl border transition-all duration-300
        ${t.tampil === false ? 'opacity-60 border-gray-100' : 'border-gray-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50/80'}`}
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl
        ${t.featured ? 'bg-gradient-to-r from-amber-400 to-orange-400' : t.tampil !== false ? 'bg-gray-100' : 'bg-gray-100'}`}/>

      {/* Featured badge */}
      {t.featured && (
        <div className="absolute top-3 left-3">
          <span className="text-[9px] font-black bg-amber-400 text-black px-2 py-1 rounded-full uppercase tracking-wider">⭐ Unggulan</span>
        </div>
      )}

      {/* Actions */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onFeatured(t)}
          className={`p-1.5 rounded-lg text-[10px] font-bold transition-colors ${t.featured ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          title={t.featured ? 'Hapus unggulan' : 'Jadikan unggulan'}>★</button>
        <button onClick={() => onToggle(t)}
          className={`p-1.5 rounded-lg transition-colors ${t.tampil !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
          {t.tampil !== false ? <FiEye size={12}/> : <FiEyeOff size={12}/>}
        </button>
        <button onClick={() => onEdit(t)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
          <FiEdit2 size={12}/>
        </button>
        <button onClick={() => onHapus(t.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
          <FiTrash2 size={12}/>
        </button>
      </div>

      <div className={`p-5 ${t.featured ? 'pt-8' : ''}`}>
        {/* Stars */}
        <StarRating value={t.rating} readonly size={14}/>

        {/* Quote */}
        <div className="mt-3 mb-4">
          <p className={`text-sm text-gray-600 leading-relaxed italic ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
            "{t.isi}"
          </p>
          {isLong && (
            <button onClick={() => setExpanded(v => !v)} className="text-xs text-gray-400 hover:text-gray-600 mt-1 font-semibold transition-colors">
              {expanded ? 'Lebih sedikit ↑' : 'Selengkapnya ↓'}
            </button>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
          {t.foto ? (
            <img src={t.foto} alt={t.nama} className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"/>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-extrabold text-base shrink-0">
              {t.nama?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">{t.nama}</div>
            <div className="text-xs text-gray-400 truncate">{t.jabatan}{t.perusahaan && ` · ${t.perusahaan}`}</div>
          </div>
        </div>

        {t.proyek && (
          <div className="mt-3">
            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">{t.proyek}</span>
          </div>
        )}

        {t.tampil === false && (
          <div className="mt-3 text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full w-fit">Disembunyikan</div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Review Modal ───────────────────────────────────────────────────────
function ReviewModal({ open, onClose, onSave, isEditing, form, setForm }) {
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
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">{isEditing ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"><FiX size={18}/></button>
          </div>

          {/* Live preview strip */}
          {(form.nama || form.isi) && (
            <div className="mx-6 mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="flex gap-1 mb-2"><StarRating value={form.rating} readonly size={12}/></div>
              <p className="text-xs text-gray-600 italic line-clamp-2">"{form.isi || '...'}"</p>
              <p className="text-xs font-bold text-gray-700 mt-1.5">{form.nama || 'Nama Klien'}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[65vh]">
            <div className="p-6 space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rating Bintang</label>
                <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))}/>
              </div>

              {/* Isi */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Isi Testimoni *</label>
                <textarea className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 focus:bg-white outline-none text-sm transition-all resize-none"
                  rows={4} value={form.isi} onChange={e => setForm(f => ({ ...f, isi: e.target.value }))} required
                  placeholder="Cerita pengalaman klien berbelanja properti di AFKAR LAND..." />
              </div>

              {/* Nama & Jabatan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Nama *</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                    value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} required placeholder="Bapak Ahmad"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Jabatan</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                    value={form.jabatan} onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))} placeholder="Pemilik Unit"/>
                </div>
              </div>

              {/* Perusahaan & Proyek */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Perusahaan</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                    value={form.perusahaan} onChange={e => setForm(f => ({ ...f, perusahaan: e.target.value }))} placeholder="Opsional"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Proyek</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                    value={form.proyek} onChange={e => setForm(f => ({ ...f, proyek: e.target.value }))}>
                    <option value="">-- Pilih Proyek --</option>
                    {PROYEK_LIST.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Foto */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">URL Foto Profil</label>
                <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                  value={form.foto} onChange={e => setForm(f => ({ ...f, foto: e.target.value }))} placeholder="https://... (opsional)"/>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'tampil', label: '👁 Tampil Publik', sub: 'Tampil di halaman website' },
                  { key: 'featured', label: '⭐ Unggulan', sub: 'Tampil di posisi teratas' },
                ].map(({ key, label, sub }) => (
                  <button type="button" key={key} onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                    className={`p-3 rounded-xl border-2 text-left transition-all
                      ${form[key] ? 'border-gray-900 bg-gray-900/5' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                    <div className={`text-xs font-bold ${form[key] ? 'text-gray-900' : 'text-gray-500'}`}>{label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">Batal</button>
              <button type="submit" disabled={saving}
                className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Menyimpan...</>
                  : <><FiSave size={14}/> {isEditing ? 'Simpan' : 'Tambah'}</>}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ────────────────────────────────────────────────────
export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [isModal, setIsModal]           = useState(false);
  const [isEditing, setIsEditing]       = useState(false);
  const [editId, setEditId]             = useState(null);
  const [form, setForm]                 = useState(INITIAL_FORM);
  const [modalHapus, setModalHapus]     = useState(null);
  const [search, setSearch]             = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [filterProyek, setFilterProyek] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      snap => { setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      () => {
        const u2 = onSnapshot(collection(db, 'testimonials'), snap => {
          setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false);
        });
        return u2;
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return testimonials
      .filter(t => !search || t.nama?.toLowerCase().includes(search.toLowerCase()) || t.isi?.toLowerCase().includes(search.toLowerCase()))
      .filter(t => filterRating === 0 || t.rating === filterRating)
      .filter(t => !filterProyek || t.proyek === filterProyek);
  }, [testimonials, search, filterRating, filterProyek]);

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length).toFixed(1) : '-';

  const openAdd  = () => { setForm(INITIAL_FORM); setIsEditing(false); setIsModal(true); };
  const openEdit = (t) => { setForm(t); setEditId(t.id); setIsEditing(true); setIsModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...form, rating: Number(form.rating), updatedAt: serverTimestamp() };
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'testimonials', editId), payload);
        toast.success('Testimoni diperbarui!');
      } else {
        await addDoc(collection(db, 'testimonials'), { ...payload, createdAt: serverTimestamp() });
        toast.success('Testimoni ditambahkan!');
      }
      setIsModal(false);
    } catch { toast.error('Gagal menyimpan.'); }
  };

  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'testimonials', modalHapus));
      toast.success('Dihapus.'); setModalHapus(null);
    } catch { toast.error('Gagal.'); }
  };

  const handleToggle = async (t) => {
    try {
      await updateDoc(doc(db, 'testimonials', t.id), { tampil: t.tampil === false });
      toast.success(t.tampil !== false ? 'Disembunyikan' : 'Ditampilkan');
    } catch { toast.error('Gagal.'); }
  };

  const handleFeatured = async (t) => {
    try {
      await updateDoc(doc(db, 'testimonials', t.id), { featured: !t.featured });
      toast.success(t.featured ? 'Dicopot dari unggulan' : 'Dijadikan unggulan!');
    } catch { toast.error('Gagal.'); }
  };

  return (
    <div className="space-y-7 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Sync</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Testimoni Klien</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola ulasan dan kepuasan klien AFKAR LAND.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-sm transition-colors shadow-sm">
          <FiPlus size={16}/> Tambah Testimoni
        </motion.button>
      </div>

      {/* ── Analytics ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Average rating */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl">⭐</div>
          <div>
            <div className="text-3xl font-black text-amber-500">{avgRating}</div>
            <div className="text-xs text-gray-500">Rating rata-rata</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:col-span-2">
          {[
            { label: 'Total', value: testimonials.length, color: 'text-gray-900', bg: 'bg-gray-50' },
            { label: 'Tampil', value: testimonials.filter(t => t.tampil !== false).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Unggulan', value: testimonials.filter(t => t.featured).length, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-4`}>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rating distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Distribusi Rating</h3>
        <div className="space-y-2.5">
          {[5,4,3,2,1].map(r => (
            <RatingBar key={r} rating={r} count={testimonials.filter(t => t.rating === r).length} total={testimonials.length}/>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-gray-400 focus:outline-none"
            placeholder="Cari nama atau isi testimoni..."/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[0,5,4,3].map(r => (
            <button key={r} onClick={() => setFilterRating(r)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all
                ${filterRating === r ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {r === 0 ? 'Semua' : `${r}★`}
            </button>
          ))}
          <select className="px-3 py-2 bg-gray-100 border-0 rounded-xl text-xs font-bold text-gray-500 focus:outline-none"
            value={filterProyek} onChange={e => setFilterProyek(e.target.value)}>
            <option value="">Semua Proyek</option>
            {PROYEK_LIST.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i}/>)}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <EmptyState hasFilter={!!(search || filterRating || filterProyek)}/>
            ) : (
              filtered.map((t, i) => (
                <ReviewCard key={t.id} t={t} index={i}
                  onEdit={openEdit} onHapus={setModalHapus}
                  onToggle={handleToggle} onFeatured={handleFeatured}/>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Modals ── */}
      <ReviewModal open={isModal} onClose={() => setIsModal(false)} onSave={handleSave}
        isEditing={isEditing} form={form} setForm={setForm}/>

      <AnimatePresence>
        {modalHapus && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalHapus(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 28 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
              onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl">🗑️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Hapus Testimoni?</h2>
              <p className="text-sm text-gray-500 mb-6">Data ini akan dihapus permanen.</p>
              <div className="flex gap-3">
                <button onClick={() => setModalHapus(null)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">Batal</button>
                <button onClick={handleHapus}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors">Hapus</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}