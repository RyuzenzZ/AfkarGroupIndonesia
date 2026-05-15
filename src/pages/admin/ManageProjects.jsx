import React, { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiX, FiHome, FiMapPin, FiTag } from 'react-icons/fi';
import { MdApartment } from 'react-icons/md';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Segera Hadir', 'Tersedia', 'Terjual Habis'];
const TIPE_OPTIONS   = ['Rumah Subsidi', 'Rumah Komersil', 'Kavling', 'Ruko', 'Apartemen'];

const emptyForm = {
  nama: '', slug: '', lokasi: '', tipe: TIPE_OPTIONS[0],
  hargaMulai: '', luasTanah: '', luasBangunan: '',
  deskripsi: '', fasilitas: '', status: STATUS_OPTIONS[0],
  gambarUrl: '', isPublished: true,
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* ======================== MODAL FORM ======================== */
function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project ? { ...project } : { ...emptyForm });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'nama' && !project ? { slug: slugify(value) } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.lokasi) return toast.error('Nama dan lokasi wajib diisi');
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 transition";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header modal */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <h2 className="text-xl font-heading font-bold text-gray-900">
            {project ? 'Edit Proyek' : 'Tambah Proyek Baru'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <FiX size={16} />
          </button>
        </div>

        {/* Body modal */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-7 py-6 space-y-5 flex-1">
          {/* Nama & Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nama Proyek *</label>
              <input name="nama" value={form.nama} onChange={handleChange} placeholder="Masagena Green Hills" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Slug URL</label>
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="masagena-green-hills" className={inputClass} />
              <p className="text-xs text-gray-400 mt-1">/proyek/{form.slug || '...'}</p>
            </div>
          </div>

          {/* Lokasi & Tipe */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Lokasi *</label>
              <input name="lokasi" value={form.lokasi} onChange={handleChange} placeholder="Makassar, Sulawesi Selatan" className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Tipe Properti</label>
              <select name="tipe" value={form.tipe} onChange={handleChange} className={inputClass}>
                {TIPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Harga & Luas */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Harga Mulai</label>
              <input name="hargaMulai" value={form.hargaMulai} onChange={handleChange} placeholder="300 Juta" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Luas Tanah (m²)</label>
              <input name="luasTanah" value={form.luasTanah} onChange={handleChange} placeholder="72" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Luas Bangunan (m²)</label>
              <input name="luasBangunan" value={form.luasBangunan} onChange={handleChange} placeholder="36" className={inputClass} />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className={labelClass}>Deskripsi Singkat</label>
            <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} rows={3}
              placeholder="Hunian nyaman di pusat kota dengan fasilitas lengkap..."
              className={inputClass + ' resize-none'} />
          </div>

          {/* Fasilitas */}
          <div>
            <label className={labelClass}>Fasilitas (pisahkan dengan koma)</label>
            <input name="fasilitas" value={form.fasilitas} onChange={handleChange}
              placeholder="Kolam Renang, Taman Bermain, CCTV, Masjid"
              className={inputClass} />
          </div>

          {/* Gambar URL */}
          <div>
            <label className={labelClass}>URL Gambar Utama</label>
            <input name="gambarUrl" value={form.gambarUrl} onChange={handleChange}
              placeholder="https://..." className={inputClass} />
          </div>

          {/* Status & Published */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className={labelClass}>Status Proyek</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 pb-2.5">
              <input type="checkbox" name="isPublished" id="published" checked={form.isPublished}
                onChange={handleChange} className="w-4 h-4 accent-red-600" />
              <label htmlFor="published" className="text-sm font-semibold text-gray-700">
                Tampilkan di website
              </label>
            </div>
          </div>
        </form>

        {/* Footer modal */}
        <div className="px-7 py-5 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold transition-colors">
            {saving ? 'Menyimpan...' : project ? 'Simpan Perubahan' : 'Tambah Proyek'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================== MODAL DETAIL ======================== */
function DetailModal({ project, onClose }) {
  const fasilitasList = project.fasilitas?.split(',').map(f => f.trim()).filter(Boolean) || [];
  const statusColor = {
    'Tersedia': 'bg-emerald-50 text-emerald-700',
    'Segera Hadir': 'bg-amber-50 text-amber-700',
    'Terjual Habis': 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Gambar header */}
        {project.gambarUrl ? (
          <div className="h-52 rounded-t-3xl overflow-hidden">
            <img src={project.gambarUrl} alt={project.nama} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
          </div>
        ) : (
          <div className="h-52 rounded-t-3xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
            <MdApartment size={64} className="text-white/30" />
          </div>
        )}

        <div className="p-7">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900">{project.nama}</h2>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                <FiMapPin size={13} /> {project.lokasi}
              </div>
            </div>
            <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${statusColor[project.status] || 'bg-gray-100 text-gray-500'}`}>
              {project.status}
            </span>
          </div>

          {project.deskripsi && (
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{project.deskripsi}</p>
          )}

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Harga Mulai', value: project.hargaMulai || '-' },
              { label: 'Luas Tanah', value: project.luasTanah ? `${project.luasTanah} m²` : '-' },
              { label: 'Luas Bangunan', value: project.luasBangunan ? `${project.luasBangunan} m²` : '-' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                <div className="text-sm font-bold text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>

          {fasilitasList.length > 0 && (
            <div className="mb-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fasilitas</div>
              <div className="flex flex-wrap gap-2">
                {fasilitasList.map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">{f}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <FiTag size={13} className="text-gray-400" />
              <span className="text-gray-500">{project.tipe}</span>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${project.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
              {project.isPublished ? 'Dipublikasikan' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="px-7 pb-7">
          <button onClick={onClose} className="w-full py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================== HALAMAN UTAMA ======================== */
export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalForm, setModalForm] = useState(null);   // null | 'add' | project-object
  const [modalDetail, setModalDetail] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => {
      // Jika index belum dibuat, fallback tanpa orderBy
      const unsub2 = onSnapshot(collection(db, 'projects'), (snap) => {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
      return unsub2;
    });
    return () => unsub();
  }, []);

  const handleSave = async (form) => {
    if (form.id) {
      // Edit
      const { id, ...data } = form;
      await updateDoc(doc(db, 'projects', id), { ...data, updatedAt: serverTimestamp() });
      toast.success('Proyek berhasil diperbarui');
    } else {
      // Tambah baru
      await addDoc(collection(db, 'projects'), { ...form, createdAt: serverTimestamp() });
      toast.success('Proyek baru berhasil ditambahkan');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'projects', deleteTarget.id));
      toast.success('Proyek berhasil dihapus');
      setDeleteTarget(null);
    } catch {
      toast.error('Gagal menghapus proyek');
    }
  };

  const statusColor = {
    'Tersedia':     'bg-emerald-50 text-emerald-700',
    'Segera Hadir': 'bg-amber-50 text-amber-700',
    'Terjual Habis':'bg-gray-100 text-gray-500',
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Kelola Proyek</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Memuat...' : `${projects.length} proyek terdaftar`}
          </p>
        </div>
        <button
          onClick={() => setModalForm('add')}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-red-200"
        >
          <FiPlus size={16} /> Tambah Proyek
        </button>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold">Proyek</th>
                <th className="p-4 font-bold">Lokasi</th>
                <th className="p-4 font-bold">Tipe</th>
                <th className="p-4 font-bold">Harga Mulai</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-center">Publik</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-400">Memuat data proyek...</td></tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-14 text-center">
                    <MdApartment size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">Belum ada proyek.</p>
                    <p className="text-gray-400 text-sm">Klik "Tambah Proyek" untuk memulai.</p>
                  </td>
                </tr>
              ) : (
                projects.map(proj => (
                  <tr key={proj.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {proj.gambarUrl ? (
                          <img src={proj.gambarUrl} alt={proj.nama}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                            <FiHome size={16} className="text-red-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{proj.nama}</div>
                          <div className="text-xs text-gray-400">/proyek/{proj.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{proj.lokasi}</td>
                    <td className="p-4 text-sm text-gray-600">{proj.tipe}</td>
                    <td className="p-4 text-sm font-semibold text-gray-800">{proj.hargaMulai || '-'}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusColor[proj.status] || 'bg-gray-100 text-gray-500'}`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${proj.isPublished ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setModalDetail(proj)}
                          className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors" title="Lihat Detail">
                          <FiEye size={14} />
                        </button>
                        <button onClick={() => setModalForm(proj)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Edit">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(proj)}
                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Hapus">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && projects.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <span>{projects.filter(p => p.isPublished).length} dipublikasikan</span>
            <span>{projects.filter(p => p.status === 'Tersedia').length} tersedia</span>
            <span>{projects.filter(p => p.status === 'Terjual Habis').length} terjual habis</span>
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      {modalForm && (
        <ProjectModal
          project={modalForm === 'add' ? null : modalForm}
          onClose={() => setModalForm(null)}
          onSave={handleSave}
        />
      )}

      {/* MODAL DETAIL */}
      {modalDetail && (
        <DetailModal project={modalDetail} onClose={() => setModalDetail(null)} />
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-7 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={22} className="text-red-500" />
            </div>
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">Hapus Proyek?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Proyek <span className="font-bold text-gray-800">"{deleteTarget.nama}"</span> akan dihapus permanen dari database.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}