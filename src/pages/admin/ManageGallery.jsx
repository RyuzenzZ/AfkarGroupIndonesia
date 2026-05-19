// ManageGallery.jsx — AFKAR LAND Admin Panel (PREMIUM UPGRADE)
// Upload & kelola galeri foto proyek — cinematic media management

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection, onSnapshot, addDoc, deleteDoc, doc,
  serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import {
  FiUpload, FiTrash2, FiX, FiImage, FiSearch,
  FiChevronLeft, FiChevronRight, FiCopy, FiCheck,
  FiExternalLink, FiGrid, FiList,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// ─── Constants ────────────────────────────────────────────────────────
const KATEGORI = ['Semua', 'Eksterior', 'Interior', 'Siteplan', 'Progres Pembangunan', 'Event', 'Lainnya'];
const PROYEK_LIST = ['Masagena Green Hills', 'Wotu Islamic Village', 'The Hasanah Panakkukang', 'Afkar Madani Estate'];
const INITIAL_FORM = { judul: '', kategori: 'Eksterior', url: '', proyek: '', altText: '' };

// ─── Helpers ──────────────────────────────────────────────────────────
function useCopyText() {
  const [copied, setCopied] = useState(null);
  const copy = useCallback((text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      toast.success('URL disalin!');
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);
  return { copied, copy };
}

// ─── Skeleton ─────────────────────────────────────────────────────────
const SkeletonPhoto = () => (
  <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
);

// ─── Empty State ──────────────────────────────────────────────────────
const EmptyState = ({ hasFilter }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    className="col-span-full flex flex-col items-center justify-center py-24 text-center">
    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-4xl mb-5 border border-gray-100">
      {hasFilter ? '🔍' : '🖼️'}
    </div>
    <h3 className="font-bold text-gray-700 text-lg mb-1">{hasFilter ? 'Tidak ada foto' : 'Galeri kosong'}</h3>
    <p className="text-sm text-gray-400">{hasFilter ? 'Coba ganti filter atau kata kunci.' : 'Mulai upload foto proyek pertama.'}</p>
  </motion.div>
);

// ─── Lightbox ─────────────────────────────────────────────────────────
function LightboxViewer({ photo, photos, onClose }) {
  const idx = photos.findIndex(p => p.id === photo.id);
  const [current, setCurrent] = useState(idx);
  const cur = photos[current];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent(i => Math.min(i + 1, photos.length - 1));
      if (e.key === 'ArrowLeft') setCurrent(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, photos.length]);

  if (!cur) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close */}
        <button className="absolute top-5 right-5 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors z-10"
          onClick={onClose}>
          <FiX size={20} />
        </button>

        {/* Nav buttons */}
        {current > 0 && (
          <button className="absolute left-5 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors z-10"
            onClick={e => { e.stopPropagation(); setCurrent(i => i - 1); }}>
            <FiChevronLeft size={24} />
          </button>
        )}
        {current < photos.length - 1 && (
          <button className="absolute right-5 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-colors z-10"
            onClick={e => { e.stopPropagation(); setCurrent(i => i + 1); }}>
            <FiChevronRight size={24} />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={cur.id}
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-4xl w-full px-16"
          onClick={e => e.stopPropagation()}
        >
          <img src={cur.url} alt={cur.altText || cur.judul}
            className="w-full max-h-[75vh] object-contain rounded-2xl"
            onError={e => { e.target.src = `https://placehold.co/800x600/1a1a1a/555?text=Error`; }}
          />
          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-white font-bold text-lg">{cur.judul}</div>
              <div className="text-white/50 text-sm mt-1">
                {cur.kategori}
                {cur.proyek && <span className="ml-2 text-white/30">· {cur.proyek}</span>}
              </div>
            </div>
            <div className="text-white/40 text-sm font-medium">{current + 1} / {photos.length}</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Upload Modal ─────────────────────────────────────────────────────
function UploadModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.url) return toast.error('URL gambar tidak boleh kosong.');
    setSaving(true);
    await onSave(form);
    setForm(INITIAL_FORM);
    setSaving(false);
    onClose();
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
          className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Upload Foto Baru</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"><FiX size={18}/></button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[75vh]">
            <div className="p-6 space-y-4">
              {/* URL Input with drag hint */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">URL Foto *</label>
                <div className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all
                  ${isDragging ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}>
                  <input
                    className="w-full text-sm bg-transparent outline-none text-center text-gray-700 placeholder-gray-400"
                    value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                    placeholder="Paste URL gambar di sini..." required
                  />
                  <p className="text-xs text-gray-400 mt-1">Firebase Storage, Cloudinary, atau URL publik lainnya</p>
                </div>
              </div>

              {/* Preview */}
              <AnimatePresence>
                {form.url && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <img src={form.url} alt="preview"
                      className="w-full h-40 object-cover rounded-2xl border border-gray-100"
                      onError={e => { e.target.style.display = 'none'; }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Judul */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Judul *</label>
                <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                  value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} required placeholder="Eksterior Type 36/72" />
              </div>

              {/* Kategori & Proyek */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kategori</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                    value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}>
                    {KATEGORI.filter(k => k !== 'Semua').map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Proyek</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                    value={form.proyek} onChange={e => setForm(f => ({ ...f, proyek: e.target.value }))}>
                    <option value="">Umum</option>
                    {PROYEK_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Alt Text (SEO)</label>
                <input className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-400 outline-none text-sm transition-all"
                  value={form.altText} onChange={e => setForm(f => ({ ...f, altText: e.target.value }))} placeholder="Deskripsi untuk mesin pencari" />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">Batal</button>
              <button type="submit" disabled={saving}
                className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Mengupload...</>
                ) : (
                  <><FiUpload size={14}/> Upload Foto</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Gallery Card ─────────────────────────────────────────────────────
function GalleryCard({ photo, onDelete, onLightbox, selected, onSelect, selectMode }) {
  const [loaded, setLoaded] = useState(false);
  const { copied, copy } = useCopyText();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer border-2 transition-all
        ${selected ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-transparent'}`}
      onClick={() => selectMode ? onSelect(photo.id) : onLightbox(photo)}
    >
      {/* Blur placeholder */}
      {!loaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}

      <img
        src={photo.url} alt={photo.altText || photo.judul}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={e => {
          e.target.src = `https://placehold.co/400x400/f3f4f6/9ca3af?text=${encodeURIComponent(photo.judul || 'Foto')}`;
          setLoaded(true);
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
        <div className="text-white text-xs font-bold truncate">{photo.judul}</div>
        <div className="text-white/60 text-[10px]">{photo.kategori}</div>
      </div>

      {/* Hover actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={e => { e.stopPropagation(); copy(photo.url, photo.id); }}
          className="p-1.5 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition-colors shadow-sm">
          {copied === photo.id ? <FiCheck size={12} className="text-emerald-600"/> : <FiCopy size={12}/>}
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(photo.id); }}
          className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">
          <FiTrash2 size={12}/>
        </button>
      </div>

      {/* Category badge */}
      <span className="absolute top-2 left-2 text-[9px] font-bold bg-black/60 text-white px-2 py-1 rounded-lg backdrop-blur-sm">
        {photo.kategori}
      </span>

      {/* Select checkbox */}
      {selectMode && (
        <div className={`absolute inset-0 border-2 rounded-2xl transition-all
          ${selected ? 'border-gray-900 bg-gray-900/20' : 'border-transparent'}`}>
          <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${selected ? 'bg-gray-900 border-gray-900' : 'border-white/80 bg-black/30'}`}>
            {selected && <FiCheck size={10} className="text-white"/>}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function ManageGallery() {
  const [photos, setPhotos]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('Semua');
  const [filterProyek, setFilterP]  = useState('');
  const [search, setSearch]         = useState('');
  const [isModal, setIsModal]       = useState(false);
  const [modalHapus, setModalHapus] = useState(null);
  const [lightbox, setLightbox]     = useState(null);
  const [selected, setSelected]     = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [sortNewest, setSort]       = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      snap => { setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false); },
      () => {
        const u2 = onSnapshot(collection(db, 'gallery'), snap => {
          setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false);
        });
        return u2;
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let arr = [...photos];
    if (filter !== 'Semua') arr = arr.filter(p => p.kategori === filter);
    if (filterProyek) arr = arr.filter(p => p.proyek === filterProyek);
    if (search) arr = arr.filter(p => p.judul?.toLowerCase().includes(search.toLowerCase()));
    if (!sortNewest) arr.reverse();
    return arr;
  }, [photos, filter, filterProyek, search, sortNewest]);

  const handleSave = async (form) => {
    try {
      await addDoc(collection(db, 'gallery'), { ...form, createdAt: serverTimestamp() });
      toast.success('Foto berhasil ditambahkan!');
    } catch { toast.error('Gagal menyimpan.'); }
  };

  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'gallery', modalHapus));
      toast.success('Foto dihapus.'); setModalHapus(null);
    } catch { toast.error('Gagal menghapus.'); }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selected.map(id => deleteDoc(doc(db, 'gallery', id))));
      toast.success(`${selected.length} foto dihapus.`);
      setSelected([]); setSelectMode(false);
    } catch { toast.error('Gagal menghapus.'); }
  };

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const lightboxFiltered = lightbox ? filtered : [];

  return (
    <div className="space-y-7 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Sync</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Galeri Media</h1>
          <p className="text-gray-500 text-sm mt-1">{photos.length} foto · Kelola media visual semua proyek.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setIsModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-sm transition-colors shadow-sm">
          <FiUpload size={16}/> Upload Foto
        </motion.button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KATEGORI.filter(k => k !== 'Semua').slice(0, 4).map((k, i) => {
          const count = photos.filter(p => p.kategori === k).length;
          return (
            <motion.button key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => setFilter(k)}
              className={`p-4 rounded-2xl border text-left transition-all
                ${filter === k ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
              <div className={`text-2xl font-black ${filter === k ? 'text-white' : 'text-gray-900'}`}>{count}</div>
              <div className={`text-xs font-medium mt-1 ${filter === k ? 'text-white/70' : 'text-gray-500'}`}>{k}</div>
            </motion.button>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-gray-400 focus:outline-none"
            placeholder="Cari foto..."/>
        </div>

        {/* Filter kategori */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {KATEGORI.map(k => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                ${filter === k ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {k}
            </button>
          ))}
        </div>

        {/* Sort & select mode */}
        <div className="flex gap-2">
          <button onClick={() => setSort(v => !v)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
            {sortNewest ? '↓ Terbaru' : '↑ Terlama'}
          </button>
          <button onClick={() => { setSelectMode(v => !v); setSelected([]); }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all
              ${selectMode ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {selectMode ? 'Selesai' : 'Pilih'}
          </button>
        </div>
      </div>

      {/* ── Bulk action bar ── */}
      <AnimatePresence>
        {selectMode && selected.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="flex items-center justify-between bg-gray-900 text-white rounded-2xl px-5 py-3.5">
            <span className="text-sm font-bold">{selected.length} foto dipilih</span>
            <button onClick={handleBulkDelete}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
              <FiTrash2 size={13}/> Hapus Dipilih
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array(10).fill(0).map((_, i) => <SkeletonPhoto key={i}/>)}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.length === 0 ? (
              <EmptyState hasFilter={filter !== 'Semua' || !!search || !!filterProyek}/>
            ) : (
              filtered.map(photo => (
                <GalleryCard key={photo.id} photo={photo}
                  onDelete={setModalHapus} onLightbox={setLightbox}
                  selected={selected.includes(photo.id)} onSelect={toggleSelect}
                  selectMode={selectMode}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Modals ── */}
      <UploadModal open={isModal} onClose={() => setIsModal(false)} onSave={handleSave}/>

      {lightbox && (
        <LightboxViewer photo={lightbox} photos={filtered} onClose={() => setLightbox(null)}/>
      )}

      {/* Delete dialog */}
      <AnimatePresence>
        {modalHapus && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalHapus(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center"
              onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl">🗑️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Hapus Foto?</h2>
              <p className="text-sm text-gray-500 mb-6">Foto ini akan dihapus permanen.</p>
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