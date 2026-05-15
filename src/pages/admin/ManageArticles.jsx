import React, { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const KATEGORI_OPTIONS = ['Edukasi', 'Finansial', 'Investasi', 'Properti Syariah', 'Berita'];
const STATUS_OPTIONS   = ['Draft', 'Published'];

const EMPTY_FORM = {
  judul: '', slug: '', kategori: KATEGORI_OPTIONS[0],
  status: 'Draft', konten: '', thumbnail: '',
};

const statusStyle = {
  Published: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  Draft:     'bg-gray-100 text-gray-500 border border-gray-200',
};

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);

  const [modalTambah,  setModalTambah]  = useState(false);
  const [modalEdit,    setModalEdit]    = useState(null);
  const [modalPreview, setModalPreview] = useState(null);
  const [modalHapus,   setModalHapus]   = useState(null);

  // LOGIKA: Real-time listener dari Firebase
  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q,
      (snap) => {
        setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => {
        const unsub2 = onSnapshot(collection(db, 'articles'), (snap) => {
          setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
        });
        return unsub2;
      }
    );
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'judul' && !modalEdit ? { slug: slugify(value) } : {}),
    }));
  };

  // LOGIKA: Tambah artikel baru ke Firebase
  const handleTambah = async () => {
    if (!form.judul) return toast.error('Judul artikel wajib diisi!');
    setSaving(true);
    try {
      await addDoc(collection(db, 'articles'), {
        ...form,
        createdAt: serverTimestamp(),
      });
      toast.success('Artikel berhasil ditambahkan');
      setModalTambah(false);
      setForm(EMPTY_FORM);
    } catch {
      toast.error('Gagal menyimpan artikel');
    } finally {
      setSaving(false);
    }
  };

  // LOGIKA: Simpan edit ke Firebase
  const handleEdit = async () => {
    if (!form.judul) return toast.error('Judul artikel wajib diisi!');
    setSaving(true);
    try {
      const { id, ...data } = form;
      await updateDoc(doc(db, 'articles', modalEdit.id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      toast.success('Artikel berhasil diperbarui');
      setModalEdit(null);
      setForm(EMPTY_FORM);
    } catch {
      toast.error('Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  // LOGIKA: Toggle status Published/Draft di Firebase
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    try {
      await updateDoc(doc(db, 'articles', id), { status: newStatus });
      toast.success(`Diubah ke "${newStatus}"`);
    } catch {
      toast.error('Gagal mengubah status');
    }
  };

  // LOGIKA: Hapus artikel dari Firebase
  const handleHapus = async () => {
    try {
      await deleteDoc(doc(db, 'articles', modalHapus));
      toast.success('Artikel dihapus');
      setModalHapus(null);
    } catch {
      toast.error('Gagal menghapus artikel');
    }
  };

  const formatTanggal = (ts) => {
    if (!ts) return '-';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const bukaEdit = (article) => {
    setForm({ ...article });
    setModalEdit(article);
  };

  // KOMPONEN: Form Input Artikel
  const FormInput = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 block">Judul Artikel *</label>
        <input name="judul" value={form.judul} onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Masukkan judul artikel..." />
      </div>
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 block">Slug URL</label>
        <input name="slug" value={form.slug} onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="judul-artikel-url" />
        <p className="text-xs text-gray-400 mt-1">/artikel/{form.slug || '...'}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">Kategori</label>
          <select name="kategori" value={form.kategori} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white">
            {KATEGORI_OPTIONS.map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">Status</label>
          <select name="status" value={form.status} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white">
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 block">URL Thumbnail (Opsional)</label>
        <input name="thumbnail" value={form.thumbnail} onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="https://..." />
      </div>
      <div>
        <label className="text-sm font-bold text-gray-700 mb-1 block">Konten / Isi Artikel</label>
        <textarea name="konten" value={form.konten} onChange={handleChange} rows={6}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          placeholder="Tulis isi artikel di sini..." />
      </div>
    </div>
  );

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Kelola Artikel</h1>
          <p className="text-gray-500 mt-1">Buat dan kelola konten blog untuk edukasi klien Anda.</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setModalTambah(true); }}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors font-bold text-sm shadow-sm">
          <FiPlus size={16}/> Tulis Artikel Baru
        </button>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold">Judul Artikel</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Tanggal</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400">Memuat data artikel...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400">Belum ada artikel.</td></tr>
              ) : articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900 max-w-xs">
                    <div className="truncate">{article.judul}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">{article.kategori}</span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{formatTanggal(article.createdAt)}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => toggleStatus(article.id, article.status)}
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${statusStyle[article.status] || 'bg-gray-100 text-gray-500'}`}
                      title="Klik untuk toggle status">
                      {article.status}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => setModalPreview(article)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Preview"><FiEye size={15}/></button>
                      <button onClick={() => bukaEdit(article)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit"><FiEdit2 size={15}/></button>
                      <button onClick={() => setModalHapus(article.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Hapus"><FiTrash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-400">
            Total {articles.length} artikel · {articles.filter(a => a.status === 'Published').length} Published · {articles.filter(a => a.status === 'Draft').length} Draft
          </div>
        )}
      </div>

      {/* MODAL TAMBAH */}
      {modalTambah && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold">Artikel Baru</h2>
              <button onClick={() => setModalTambah(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6">
              <FormInput />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalTambah(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">Batal</button>
                <button onClick={handleTambah} disabled={saving} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 text-sm disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan Artikel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {modalEdit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold">Edit Artikel</h2>
              <button onClick={() => setModalEdit(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6">
              <FormInput />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalEdit(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">Batal</button>
                <button onClick={handleEdit} disabled={saving} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-sm disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW */}
      {modalPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-heading font-bold">Preview Artikel</h2>
              <button onClick={() => setModalPreview(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><FiX/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {modalPreview.thumbnail && (
                <img src={modalPreview.thumbnail} alt={modalPreview.judul}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={e => { e.target.style.display = 'none'; }} />
              )}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">{modalPreview.kategori}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle[modalPreview.status]}`}>{modalPreview.status}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 leading-snug">{modalPreview.judul}</h3>
              <p className="text-xs text-gray-400">{formatTanggal(modalPreview.createdAt)}</p>
              <hr className="border-gray-100"/>
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{modalPreview.konten || 'Belum ada konten.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {modalHapus && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiTrash2 className="text-red-500" size={24}/></div>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">Hapus Artikel?</h2>
            <p className="text-gray-500 text-sm mb-6">Artikel ini akan dihapus permanen dan tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalHapus(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={handleHapus} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 text-sm">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}