import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, X, Save, Image as ImageIcon,
  List, Users, HelpCircle, Upload, ExternalLink,
  Home, DollarSign, Link as LinkIcon, Package
} from 'lucide-react';

import { db } from '../../config/firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────
// CLOUDINARY CONFIG — hanya untuk upload gambar (bukan PDF)
// ─────────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';

// ── KONSTANTA MARKETING (Sinkron dengan ProjectDetail.jsx) ──
const AVAILABLE_MARKETING = [
  { id: 'damar', name: 'Damar Mahendra' },
  { id: 'fila',  name: 'Fila Amelia' },
  { id: 'hazfira', name: 'Hazfira' },
  { id: 'erni',  name: 'Erni' },
  { id: 'ayu',   name: 'Ayu' }
];

// ── INITIAL FORM STATE ──
// tipeUnit: sesuai struktur ProjectDetail.jsx (t.tipe, t.lantai, t.kamar, t.normal, t.cashKeras, t.cashLunak)
const INITIAL_TIPE_UNIT = { tipe: '', lantai: '', kamar: '', normal: '', cashKeras: '', cashLunak: '' };

const INITIAL_FORM_STATE = {
  slug: '', name: '', tagline: '', desc: '', location: '',
  status: 'Tersedia', badge: 'NEW PROJECT', harga: '',
  image: '',
  // Brosur: cukup isi link manual (tidak lagi upload ke Cloudinary)
  brosurUrl: '', brosurFileName: '', brosurSize: '',
  websiteUrl: '',
  order: 1, isFeatured: false,
  features: [''], gallery: [''], marketingIds: [],
  about: '', aboutExtra: '',
  // Tipe unit: array sesuai struktur ProjectDetail.jsx
  tipeUnit: [],
  progress: [{ fase: '', label: '', persen: 0, status: 'rencana', tgl: '', ket: '' }],
  faq: [{ q: '', a: '' }]
};

// ─────────────────────────────────────────────────────────────
// KOMPONEN BANTU: Label Section dalam form
// ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon, children, action }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gray-50/70">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
          {icon}
          {title}
        </h3>
        {action && action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// Komponen input field yang bersih
function FormField({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
        {hint && <span className="font-normal text-gray-400 ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 outline-none text-sm transition-all";
const selectClass = "w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#C9A84C] outline-none text-sm bg-white";

// ─────────────────────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────────────────────
export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [activeTab, setActiveTab] = useState('umum');

  // ── Load Cloudinary widget script (untuk gambar saja) ──
  useEffect(() => {
    if (document.getElementById('cloudinary-widget-script')) return;
    const script = document.createElement('script');
    script.id = 'cloudinary-widget-script';
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ── Cloudinary: Upload gambar ──
  const openCloudinaryWidget = useCallback((onSuccess) => {
    if (!window.cloudinary) {
      toast.error('Widget Cloudinary belum siap, coba lagi sebentar.');
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxFileSize: 5000000,
        cropping: false,
        styles: {
          palette: {
            window: '#FFFFFF', windowBorder: '#E5E7EB', tabIcon: '#C9A84C',
            link: '#C9A84C', action: '#C9A84C', complete: '#10B981',
            inProgress: '#C9A84C', error: '#EF4444', sourceBg: '#F9FAFB',
            textDark: '#000000', textLight: '#FFFFFF', menuIcons: '#5A616A', inactiveTabIcon: '#9CA3AF'
          }
        },
      },
      (error, result) => {
        if (error) { toast.error('Upload gagal: ' + (error.message || 'Unknown error')); return; }
        if (result.event === 'success') {
          onSuccess(result.info.secure_url);
          widget.close();
          toast.success('✅ Gambar berhasil diupload!');
        }
      }
    );
    widget.open();
  }, []);

  // ── Cloudinary: Upload galeri ──
  const openGalleryWidget = useCallback((index) => {
    if (!window.cloudinary) { toast.error('Widget Cloudinary belum siap.'); return; }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: index === -1,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxFileSize: 5000000,
        styles: {
          palette: { window: '#FFFFFF', windowBorder: '#E5E7EB', tabIcon: '#C9A84C', link: '#C9A84C', action: '#C9A84C', complete: '#10B981', inProgress: '#C9A84C', error: '#EF4444', sourceBg: '#F9FAFB', textDark: '#000000', textLight: '#FFFFFF', menuIcons: '#5A616A', inactiveTabIcon: '#9CA3AF' },
        },
      },
      (error, result) => {
        if (error) { toast.error('Upload gagal'); return; }
        if (result.event === 'success') {
          const url = result.info.secure_url;
          if (index === -1) {
            setFormData(prev => ({ ...prev, gallery: [...prev.gallery.filter(g => g), url] }));
          } else {
            handleArrayChange(index, 'gallery', url);
          }
          toast.success('✅ Foto berhasil diupload!');
        }
      }
    );
    widget.open();
  }, []);

  // ── FETCH REALTIME FIREBASE ──
  useEffect(() => {
    if (!db) { setLoading(false); return; }
    try {
      const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => (a.order || 0) - (b.order || 0));
        setProjects(data);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.warn('Jalankan di environment Firebase yang valid', error);
      setLoading(false);
    }
  }, []);

  // ── HANDLERS ──
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleArrayChange = (index, field, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };
  const addArrayItem = (field) => setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  const removeArrayItem = (index, field) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleObjectArrayChange = (index, field, subField, value) => {
    const newArray = [...formData[field]];
    newArray[index] = { ...newArray[index], [subField]: value };
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };
  const removeObjectArrayItem = (index, field) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const addProgress = () => {
    setFormData(prev => ({ ...prev, progress: [...prev.progress, { fase: '', label: '', persen: 0, status: 'rencana', tgl: '', ket: '' }] }));
  };
  const addFAQ = () => {
    setFormData(prev => ({ ...prev, faq: [...prev.faq, { q: '', a: '' }] }));
  };

  // ── HANDLERS TIPE UNIT ──
  const addTipeUnit = () => {
    setFormData(prev => ({ ...prev, tipeUnit: [...prev.tipeUnit, { ...INITIAL_TIPE_UNIT }] }));
  };
  const handleTipeUnitChange = (index, field, value) => {
    const newArray = [...formData.tipeUnit];
    newArray[index] = { ...newArray[index], [field]: value };
    setFormData(prev => ({ ...prev, tipeUnit: newArray }));
  };
  const removeTipeUnit = (index) => {
    setFormData(prev => ({ ...prev, tipeUnit: prev.tipeUnit.filter((_, i) => i !== index) }));
  };

  const handleMarketingChange = (id) => {
    setFormData(prev => {
      const isSelected = prev.marketingIds.includes(id);
      return isSelected
        ? { ...prev, marketingIds: prev.marketingIds.filter(m => m !== id) }
        : { ...prev, marketingIds: [...prev.marketingIds, id] };
    });
  };

  // ── CRUD ──
  const openAddModal = () => {
    setFormData(INITIAL_FORM_STATE);
    setIsEditing(false);
    setEditId(null);
    setActiveTab('umum');
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setFormData({
      ...INITIAL_FORM_STATE,
      ...project,
      features:    project.features    || [''],
      gallery:     project.gallery     || [''],
      marketingIds: project.marketingIds || [],
      tipeUnit:    project.tipeUnit    || [],
      progress:    project.progress    || INITIAL_FORM_STATE.progress,
      faq:         project.faq         || INITIAL_FORM_STATE.faq,
    });
    setIsEditing(true);
    setEditId(project.id);
    setActiveTab('umum');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!db) { toast.error('Database belum siap.'); return; }
    if (window.confirm('Yakin ingin menghapus proyek ini secara permanen?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        toast.success('Proyek berhasil dihapus');
      } catch {
        toast.error('Gagal menghapus proyek');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) { toast.error('Database belum siap.'); return; }
    setIsSaving(true);
    const cleanedData = {
      ...formData,
      features:  formData.features.filter(f => f.trim() !== ''),
      gallery:   formData.gallery.filter(g => g.trim() !== ''),
      tipeUnit:  formData.tipeUnit.filter(t => t.tipe.trim() !== ''),
      order:     Number(formData.order)
    };
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'projects', editId), { ...cleanedData, updatedAt: serverTimestamp() });
        toast.success('✅ Data proyek berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'projects'), { ...cleanedData, createdAt: serverTimestamp() });
        toast.success('✅ Proyek baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── TABS DEFINISI ──
  const TABS = [
    { id: 'umum',      label: 'Data Umum',        icon: <List size={14} /> },
    { id: 'media',     label: 'Media & Brosur',   icon: <ImageIcon size={14} /> },
    { id: 'detail',    label: 'Detail & Fitur',   icon: <Home size={14} /> },
    { id: 'tipeunit',  label: 'Tipe Unit',        icon: <Package size={14} /> },
    { id: 'marketing', label: 'Marketing',         icon: <Users size={14} /> },
    { id: 'progress',  label: 'Progress',          icon: <List size={14} /> },
    { id: 'faq',       label: 'FAQ',              icon: <HelpCircle size={14} /> },
  ];

  // ──────────────────────────────────────────────────────────
  return (
    <div className="relative">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Kelola Project AFKAR LAND</h1>
          <p className="text-gray-500 mt-1 text-sm">Atur data project yang tampil di website secara real-time.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b09240] text-black px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-[#C9A84C]/20 text-sm"
        >
          <Plus size={18} /> Tambah Project Baru
        </button>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="p-5 w-16 text-center">Urutan</th>
                <th className="p-5">Nama Project & Lokasi</th>
                <th className="p-5">Status & Badge</th>
                <th className="p-5 text-center">Harga</th>
                <th className="p-5 text-center">Tipe Unit</th>
                <th className="p-5 text-center">Marketing</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-400 animate-pulse text-sm">Menghubungkan ke database...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-400 text-sm">Belum ada project terdaftar.</td></tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-5 text-center font-bold text-gray-300 text-sm">{proj.order}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <img src={proj.image || 'https://via.placeholder.com/150'} alt={proj.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{proj.name} {proj.isFeatured && <span className="text-yellow-500">⭐</span>}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{proj.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${proj.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {proj.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600">{proj.badge}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center font-bold text-gray-700 text-sm">{proj.harga}</td>
                    <td className="p-5 text-center text-sm text-gray-400">{proj.tipeUnit?.length || 0} Tipe</td>
                    <td className="p-5 text-center text-sm text-gray-400">{proj.marketingIds?.length || 0} Orang</td>
                    <td className="p-5">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openEditModal(proj)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(proj.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          MODAL FORM
      ════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                  {isEditing ? <Edit2 size={16} className="text-[#C9A84C]" /> : <Plus size={16} className="text-[#C9A84C]" />}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base leading-none">
                    {isEditing ? 'Edit Data Project' : 'Tambah Project Baru'}
                  </h2>
                  {isEditing && <p className="text-xs text-gray-400 mt-0.5">ID: {editId}</p>}
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={18} /></button>
            </div>

            {/* Modal Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50/50 shrink-0 px-4 no-scrollbar">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'border-[#C9A84C] text-[#C9A84C] bg-white'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Form Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/40">
              <form id="projectForm" onSubmit={handleSubmit} className="space-y-5">

                {/* ══════════════════════════════════════════
                    TAB 1: DATA UMUM
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'umum' ? 'block space-y-5' : 'hidden'}>

                  {/* Identitas Project */}
                  <SectionCard title="Identitas Project" icon={<Home size={14} className="text-[#C9A84C]" />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Nama Project" required>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange}
                          className={inputClass} placeholder="Contoh: Masagena Green Hills" />
                      </FormField>
                      <FormField label="Slug URL" required hint="Tanpa spasi, huruf kecil">
                        <input type="text" name="slug" required value={formData.slug} onChange={handleChange}
                          className={inputClass} placeholder="masagena-green-hills" />
                      </FormField>
                      <FormField label="Tagline">
                        <input type="text" name="tagline" value={formData.tagline} onChange={handleChange}
                          className={inputClass} placeholder="Hunian Asri Bernuansa Hijau" />
                      </FormField>
                      <FormField label="Lokasi">
                        <input type="text" name="location" value={formData.location} onChange={handleChange}
                          className={inputClass} placeholder="Makassar, Sul-Sel" />
                      </FormField>
                      <FormField label="Harga Mulai">
                        <input type="text" name="harga" value={formData.harga} onChange={handleChange}
                          className={inputClass} placeholder="Mulai Rp 350 Juta" />
                      </FormField>
                      <FormField label="Website URL Khusus" hint="Opsional">
                        <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange}
                          className={inputClass} placeholder="https://masagena.afkarland.id" />
                      </FormField>
                      <div className="md:col-span-2">
                        <FormField label="Deskripsi Singkat" hint="Muncul di kartu grid halaman project">
                          <textarea name="desc" rows="2" value={formData.desc} onChange={handleChange}
                            className={`${inputClass} resize-none`} placeholder="Kawasan hunian syariah modern dengan lingkungan strategis..." />
                        </FormField>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Pengaturan Tampilan */}
                  <SectionCard title="Pengaturan Tampilan" icon={<List size={14} className="text-blue-500" />}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField label="Status Ketersediaan">
                        <select name="status" value={formData.status} onChange={handleChange} className={selectClass}>
                          <option value="Tersedia">🟢 Tersedia</option>
                          <option value="Sisa Sedikit">🔴 Sisa Sedikit</option>
                          <option value="Coming Soon">⏳ Coming Soon</option>
                        </select>
                      </FormField>
                      <FormField label="Badge Spesial">
                        <select name="badge" value={formData.badge} onChange={handleChange} className={selectClass}>
                          <option value="PROPERTY SYARIAH">PROPERTY SYARIAH</option>
                          <option value="NEW PROJECT">NEW PROJECT</option>
                          <option value="BEST SELLER">BEST SELLER</option>
                          <option value="COMING SOON">COMING SOON</option>
                          <option value="BEST PREMIUM LOCATION">BEST PREMIUM LOCATION</option>
                          <option value="LAUNCHING JUNI">LAUNCHING JUNI</option>
                        </select>
                      </FormField>
                      <FormField label="Urutan Tampil">
                        <input type="number" name="order" min="1" value={formData.order} onChange={handleChange} className={selectClass} />
                      </FormField>
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Featured? ⭐</label>
                        <div className="flex items-center gap-3 mt-1">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="sr-only peer" />
                            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                          </label>
                          <span className="text-xs text-gray-500">{formData.isFeatured ? 'Ya' : 'Tidak'}</span>
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 2: MEDIA & BROSUR
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'media' ? 'block space-y-5' : 'hidden'}>

                  {/* Gambar Cover */}
                  <SectionCard title="Gambar Utama (Cover)" icon={<ImageIcon size={14} className="text-[#C9A84C]" />}>
                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      <div className="w-full md:w-44 h-32 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
                        {formData.image
                          ? <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                          : <div className="text-center text-gray-300"><ImageIcon size={24} className="mx-auto mb-1" /><p className="text-xs">Preview</p></div>
                        }
                      </div>
                      <div className="flex-1 space-y-3">
                        <button type="button"
                          onClick={() => openCloudinaryWidget((url) => setFormData(prev => ({ ...prev, image: url })))}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#C9A84C] hover:bg-[#b09240] text-black font-bold text-sm rounded-xl transition-all"
                        >
                          <Upload size={15} /> Upload Gambar Cover
                        </button>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-px bg-gray-100" />
                          <span className="text-xs text-gray-400">atau isi URL manual</span>
                          <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        <input type="url" name="image" value={formData.image} onChange={handleChange}
                          className={inputClass} placeholder="https://res.cloudinary.com/..." />
                        {formData.image && (
                          <a href={formData.image} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline">
                            <ExternalLink size={11} /> Buka di tab baru
                          </a>
                        )}
                        <p className="text-[10px] text-gray-400">JPG, PNG, WEBP · Maks. 5 MB · Rasio ideal 4:3</p>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Galeri Foto */}
                  <SectionCard
                    title="Galeri Foto Slider"
                    icon={<ImageIcon size={14} className="text-blue-500" />}
                    action={
                      <button type="button" onClick={() => openGalleryWidget(-1)}
                        className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors">
                        <Upload size={12} /> Tambah Foto
                      </button>
                    }
                  >
                    {formData.gallery.filter(u => u).length > 0 ? (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 mb-4">
                        {formData.gallery.map((url, i) => url && (
                          <div key={i} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                            <img src={url} alt={`Galeri ${i + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button type="button" onClick={() => openGalleryWidget(i)}
                                className="p-1.5 bg-white/90 rounded-lg text-blue-600 hover:bg-white" title="Ganti">
                                <Upload size={12} />
                              </button>
                              <button type="button" onClick={() => removeArrayItem(i, 'gallery')}
                                className="p-1.5 bg-white/90 rounded-lg text-red-500 hover:bg-white" title="Hapus">
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">{i + 1}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div onClick={() => openGalleryWidget(-1)}
                        className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/3 transition-all mb-4">
                        <Upload size={22} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-sm text-gray-400">Klik untuk upload foto galeri</p>
                        <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP · Maks. 5 MB per foto</p>
                      </div>
                    )}
                    {/* URL manual galeri */}
                    <details className="mt-1">
                      <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">▸ Tambah via URL manual</summary>
                      <div className="space-y-2 mt-3">
                        {formData.gallery.map((url, i) => (
                          <div key={i} className="flex gap-2">
                            <input type="url" value={url} onChange={(e) => handleArrayChange(i, 'gallery', e.target.value)}
                              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 outline-none text-xs" placeholder="https://res.cloudinary.com/..." />
                            <button type="button" onClick={() => removeArrayItem(i, 'gallery')} className="p-2 text-red-400 bg-red-50 rounded-xl"><Trash2 size={13} /></button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('gallery')} className="text-xs text-blue-500 hover:text-blue-700 font-medium">+ Tambah baris URL</button>
                      </div>
                    </details>
                  </SectionCard>

                  {/* ── BROSUR: Link Manual Saja ── */}
                  <SectionCard title="Brosur Project" icon={<LinkIcon size={14} className="text-red-500" />}>
                    <div className="space-y-4">
                      {/* Info */}
                      <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <span className="text-amber-500 text-sm mt-0.5">📌</span>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          Isi link brosur secara manual. Bisa berupa link Google Drive, Dropbox, atau URL file PDF yang sudah diupload.
                          Link ini akan muncul sebagai tombol <strong>"Download Brosur"</strong> di halaman detail project.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <FormField label="URL Brosur (Link Langsung)" hint="PDF / Google Drive / Dropbox">
                            <div className="flex gap-2">
                              <input type="url" name="brosurUrl" value={formData.brosurUrl} onChange={handleChange}
                                className={inputClass} placeholder="https://drive.google.com/file/d/.../view" />
                              {formData.brosurUrl && (
                                <a href={formData.brosurUrl} target="_blank" rel="noopener noreferrer"
                                  className="shrink-0 p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors" title="Buka link">
                                  <ExternalLink size={16} />
                                </a>
                              )}
                            </div>
                          </FormField>
                        </div>
                        <FormField label="Nama File Brosur" hint="Tampil di halaman detail">
                          <input type="text" name="brosurFileName" value={formData.brosurFileName} onChange={handleChange}
                            className={inputClass} placeholder="Brosur Masagena Green Hills 2024" />
                        </FormField>
                        <FormField label="Ukuran File" hint="Info saja, misal 2.4 MB">
                          <input type="text" name="brosurSize" value={formData.brosurSize} onChange={handleChange}
                            className={inputClass} placeholder="2.4 MB" />
                        </FormField>
                      </div>

                      {/* Preview status */}
                      {formData.brosurUrl && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                          <span className="text-green-500">✅</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-green-700">{formData.brosurFileName || 'Brosur'}</p>
                            <p className="text-[10px] text-green-600 truncate">{formData.brosurUrl}</p>
                          </div>
                          <button type="button" onClick={() => setFormData(prev => ({ ...prev, brosurUrl: '', brosurFileName: '', brosurSize: '' }))}
                            className="shrink-0 p-1 text-red-400 hover:text-red-600">
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 3: DETAIL & FITUR
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'detail' ? 'block space-y-5' : 'hidden'}>

                  <SectionCard title='Copywriting "Tentang Project"' icon={<List size={14} className="text-purple-500" />}>
                    <div className="space-y-4">
                      <FormField label="Paragraf 1">
                        <textarea name="about" rows="3" value={formData.about} onChange={handleChange}
                          className={`${inputClass} resize-none`} placeholder="Deskripsi utama tentang project ini..." />
                      </FormField>
                      <FormField label="Paragraf 2" hint="Opsional">
                        <textarea name="aboutExtra" rows="3" value={formData.aboutExtra} onChange={handleChange}
                          className={`${inputClass} resize-none`} placeholder="Paragraf tambahan, keunggulan, atau informasi penting lainnya..." />
                      </FormField>
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Label Fitur (2×2 Grid pada Kartu)"
                    icon={<Home size={14} className="text-green-500" />}
                    action={
                      <button type="button" onClick={() => addArrayItem('features')}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100">
                        + Tambah Fitur
                      </button>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {formData.features.map((feat, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" value={feat} onChange={(e) => handleArrayChange(i, 'features', e.target.value)}
                            className={inputClass} placeholder="Contoh: Area Berkembang" />
                          <button type="button" onClick={() => removeArrayItem(i, 'features')}
                            className="p-2 text-red-400 bg-red-50 rounded-xl hover:bg-red-100"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3">Maksimal 4 fitur yang akan tampil di kartu grid halaman project.</p>
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 4: TIPE UNIT
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'tipeunit' ? 'block space-y-5' : 'hidden'}>

                  <SectionCard
                    title="Pricelist & Tipe Unit"
                    icon={<Package size={14} className="text-[#C9A84C]" />}
                    action={
                      <button type="button" onClick={addTipeUnit}
                        className="flex items-center gap-1.5 text-xs bg-[#C9A84C]/10 text-[#C9A84C] px-3 py-1.5 rounded-lg font-bold hover:bg-[#C9A84C]/20 transition-colors">
                        <Plus size={12} /> Tambah Tipe Unit
                      </button>
                    }
                  >
                    {/* Info */}
                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-5">
                      <span className="text-amber-500 mt-0.5">💡</span>
                      <div className="text-xs text-amber-700 leading-relaxed">
                        Data ini akan tampil sebagai <strong>tabel pricelist</strong> di halaman detail project.
                        Kolom: <strong>Tipe Unit · Lantai/Kamar · Harga Normal · Promo Cash Keras · Cash Lunak</strong>.
                        Kosongkan tabel ini jika project berstatus <em>Coming Soon</em>.
                      </div>
                    </div>

                    {formData.tipeUnit.length === 0 ? (
                      <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                        <Package size={28} className="mx-auto mb-3 text-gray-300" />
                        <p className="text-sm text-gray-400 font-medium">Belum ada tipe unit</p>
                        <p className="text-xs text-gray-300 mt-1 mb-4">Klik tombol "Tambah Tipe Unit" untuk mulai mengisi pricelist</p>
                        <button type="button" onClick={addTipeUnit}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#b09240] text-black font-bold text-sm rounded-xl transition-all">
                          <Plus size={14} /> Tambah Tipe Unit Pertama
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.tipeUnit.map((unit, i) => (
                          <div key={i} className="relative p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            {/* Header baris */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">
                                Tipe Unit #{i + 1}
                              </span>
                              <button type="button" onClick={() => removeTipeUnit(i)}
                                className="p-1.5 text-red-400 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </div>

                            {/* Fields grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                              <FormField label="Nama Tipe Unit" required>
                                <input type="text" value={unit.tipe}
                                  onChange={e => handleTipeUnitChange(i, 'tipe', e.target.value)}
                                  className={inputClass} placeholder="Cth: Tipe 36/72" />
                              </FormField>
                              <FormField label="Lantai">
                                <input type="text" value={unit.lantai}
                                  onChange={e => handleTipeUnitChange(i, 'lantai', e.target.value)}
                                  className={inputClass} placeholder="Cth: 1 Lantai" />
                              </FormField>
                              <FormField label="Kamar" hint="atau - jika kavling">
                                <input type="text" value={unit.kamar}
                                  onChange={e => handleTipeUnitChange(i, 'kamar', e.target.value)}
                                  className={inputClass} placeholder="Cth: 3 KT · 2 KM" />
                              </FormField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <FormField label="Harga Normal">
                                <input type="text" value={unit.normal}
                                  onChange={e => handleTipeUnitChange(i, 'normal', e.target.value)}
                                  className={inputClass} placeholder="Rp 450.000.000" />
                              </FormField>
                              <div>
                                <label className="block text-xs font-bold text-[#C9A84C] mb-1.5">💥 Promo Cash Keras</label>
                                <input type="text" value={unit.cashKeras}
                                  onChange={e => handleTipeUnitChange(i, 'cashKeras', e.target.value)}
                                  className="w-full px-4 py-2.5 rounded-xl border border-[#C9A84C]/40 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 outline-none text-sm transition-all"
                                  placeholder="Rp 390.000.000" />
                              </div>
                              <FormField label="Cash Lunak" hint="Opsional">
                                <input type="text" value={unit.cashLunak}
                                  onChange={e => handleTipeUnitChange(i, 'cashLunak', e.target.value)}
                                  className={inputClass} placeholder="Rp 420.000.000" />
                              </FormField>
                            </div>
                          </div>
                        ))}

                        {/* Tambah lagi */}
                        <button type="button" onClick={addTipeUnit}
                          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all font-medium">
                          <Plus size={15} /> Tambah Tipe Unit Lainnya
                        </button>
                      </div>
                    )}
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 5: MARKETING
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'marketing' ? 'block space-y-5' : 'hidden'}>

                  <SectionCard title="Tim Marketing yang Ditugaskan" icon={<Users size={14} className="text-blue-500" />}>
                    <p className="text-sm text-gray-500 mb-4">Pilih marketing siapa saja yang akan muncul di halaman detail project ini.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {AVAILABLE_MARKETING.map(mk => (
                        <label key={mk.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.marketingIds.includes(mk.id)
                              ? 'border-[#C9A84C] bg-[#C9A84C]/5'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}>
                          <input type="checkbox" checked={formData.marketingIds.includes(mk.id)}
                            onChange={() => handleMarketingChange(mk.id)}
                            className="w-4 h-4 text-[#C9A84C] rounded border-gray-300 focus:ring-[#C9A84C]"
                          />
                          <span className="text-sm font-bold text-gray-700">{mk.name}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3">
                      {formData.marketingIds.length === 0
                        ? 'Jika tidak ada yang dipilih, semua marketing akan ditampilkan.'
                        : `${formData.marketingIds.length} marketing dipilih.`}
                    </p>
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 6: PROGRESS
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'progress' ? 'block space-y-5' : 'hidden'}>

                  <SectionCard
                    title="Timeline Progress Pembangunan"
                    icon={<List size={14} className="text-orange-500" />}
                    action={
                      <button type="button" onClick={addProgress}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100">
                        + Tambah Fase
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      {formData.progress.map((prog, i) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative">
                          <button type="button" onClick={() => removeObjectArrayItem(i, 'progress')}
                            className="absolute top-3 right-3 p-1 text-red-400 bg-white border border-red-100 rounded-lg hover:bg-red-50">
                            <Trash2 size={13} />
                          </button>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-2.5 pr-8">
                            <input type="text" value={prog.fase}
                              onChange={e => handleObjectArrayChange(i, 'progress', 'fase', e.target.value)}
                              placeholder="Fase 1" className="px-3 py-2 rounded-lg border outline-none text-sm bg-white" />
                            <input type="text" value={prog.label}
                              onChange={e => handleObjectArrayChange(i, 'progress', 'label', e.target.value)}
                              placeholder="Land Clearing" className="px-3 py-2 rounded-lg border outline-none text-sm bg-white" />
                            <input type="number" value={prog.persen} min="0" max="100"
                              onChange={e => handleObjectArrayChange(i, 'progress', 'persen', Number(e.target.value))}
                              placeholder="% Selesai" className="px-3 py-2 rounded-lg border outline-none text-sm bg-white" />
                            <input type="text" value={prog.tgl}
                              onChange={e => handleObjectArrayChange(i, 'progress', 'tgl', e.target.value)}
                              placeholder="Jan 2024" className="px-3 py-2 rounded-lg border outline-none text-sm bg-white" />
                          </div>
                          <div className="flex gap-2.5">
                            <select value={prog.status}
                              onChange={e => handleObjectArrayChange(i, 'progress', 'status', e.target.value)}
                              className="px-3 py-2 rounded-lg border outline-none text-sm bg-white w-1/3">
                              <option value="selesai">✅ Selesai</option>
                              <option value="berjalan">🔄 Berjalan</option>
                              <option value="rencana">📅 Rencana</option>
                            </select>
                            <input type="text" value={prog.ket}
                              onChange={e => handleObjectArrayChange(i, 'progress', 'ket', e.target.value)}
                              placeholder="Keterangan detail progress..." className="flex-1 px-3 py-2 rounded-lg border outline-none text-sm bg-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                </div>

                {/* ══════════════════════════════════════════
                    TAB 7: FAQ
                ══════════════════════════════════════════ */}
                <div className={activeTab === 'faq' ? 'block space-y-5' : 'hidden'}>

                  <SectionCard
                    title="Frequently Asked Questions (FAQ)"
                    icon={<HelpCircle size={14} className="text-indigo-500" />}
                    action={
                      <button type="button" onClick={addFAQ}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100">
                        + Tambah Pertanyaan
                      </button>
                    }
                  >
                    <div className="space-y-3">
                      {formData.faq.map((item, i) => (
                        <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex-1 space-y-2">
                            <input type="text" value={item.q}
                              onChange={e => handleObjectArrayChange(i, 'faq', 'q', e.target.value)}
                              placeholder="Pertanyaan..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm font-bold bg-white focus:border-[#C9A84C]" />
                            <textarea rows="2" value={item.a}
                              onChange={e => handleObjectArrayChange(i, 'faq', 'a', e.target.value)}
                              placeholder="Jawaban lengkap..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm resize-none bg-white focus:border-[#C9A84C]" />
                          </div>
                          <button type="button" onClick={() => removeObjectArrayItem(i, 'faq')}
                            className="p-2.5 text-red-400 bg-white border border-red-100 rounded-xl hover:bg-red-50 h-fit mt-0.5">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between gap-4">
              <button type="button" onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
                Batal
              </button>
              <button type="submit" form="projectForm" disabled={isSaving}
                className="flex-1 max-w-xs py-3 bg-black text-[#C9A84C] hover:bg-gray-900 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {isSaving
                  ? <><span className="w-4 h-4 border-2 border-[#C9A84C]/30 border-t-[#C9A84C] rounded-full animate-spin" /> Menyimpan...</>
                  : <><Save size={16} /> Simpan Data Project</>
                }
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}