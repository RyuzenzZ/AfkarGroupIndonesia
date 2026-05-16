import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, X, Save, Search, 
  Home, MapPin, CheckCircle, Clock, AlertCircle 
} from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

// INISIALISASI FIREBASE (Fallback Mode)
let db = null;
try {
  const { initializeApp } = require('firebase/app');
  const { getFirestore } = require('firebase/firestore');
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : { apiKey: "demo", projectId: "demo" };
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {}

const STATUS_COLORS = {
  'Available': 'bg-green-100 text-green-700 border-green-200',
  'Booked': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Reserved': 'bg-blue-100 text-blue-700 border-blue-200',
  'Sold': 'bg-red-100 text-red-700 border-red-200'
};

const INITIAL_FORM = {
  project: 'Masagena Green Hills',
  blok: '', nomor: '',
  tipeRumah: '36/72', luasTanah: '', luasBangunan: '',
  harga: '', status: 'Available',
  progress: 'Inden (0%)'
};

export default function ManageUnits() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProject, setFilterProject] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const unsubscribe = onSnapshot(collection(db, 'units'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Urutkan berdasarkan blok dan nomor
      data.sort((a, b) => a.blok.localeCompare(b.blok) || a.nomor - b.nomor);
      setUnits(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) return toast.error("Database offline");
    try {
      if (isEditing) {
        await updateDoc(doc(db, 'units', editId), { ...formData, updatedAt: serverTimestamp() });
        toast.success('Unit berhasil diupdate!');
      } else {
        await addDoc(collection(db, 'units'), { ...formData, createdAt: serverTimestamp() });
        toast.success('Unit baru berhasil ditambahkan!');
      }
      setIsModalOpen(false);
    } catch (err) { toast.error('Gagal menyimpan data'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus data unit ini?')) {
      try {
        await deleteDoc(doc(db, 'units', id));
        toast.success('Unit dihapus');
      } catch (err) { toast.error('Gagal menghapus'); }
    }
  };

  const openAdd = () => { setFormData(INITIAL_FORM); setIsEditing(false); setIsModalOpen(true); };
  const openEdit = (u) => { setFormData(u); setEditId(u.id); setIsEditing(true); setIsModalOpen(true); };

  // Filtering Logic
  const filteredUnits = units.filter(u => {
    const matchProject = filterProject === 'Semua' || u.project === filterProject;
    const matchSearch = u.blok.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        u.nomor.includes(searchQuery);
    return matchProject && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Unit Management</h1>
          <p className="text-gray-500 mt-1">Kelola ketersediaan blok/kavling di seluruh project.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b09240] text-black px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#C9A84C]/20 transition-all">
          <Plus size={20} /> Tambah Unit
        </button>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Available', count: units.filter(u=>u.status==='Available').length, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Booked', count: units.filter(u=>u.status==='Booked').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Reserved', count: units.filter(u=>u.status==='Reserved').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Sold', count: units.filter(u=>u.status==='Sold').length, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-5 rounded-2xl border border-white`}>
            <p className="text-gray-500 text-xs font-bold uppercase mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.count} <span className="text-sm font-medium">Unit</span></p>
          </div>
        ))}
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Cari Blok / Nomor Kavling..." 
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#C9A84C] outline-none text-sm"
          />
        </div>
        <select 
          value={filterProject} onChange={e => setFilterProject(e.target.value)}
          className="w-full md:w-64 px-4 py-3 rounded-xl border border-gray-200 outline-none text-sm font-bold text-gray-700"
        >
          <option value="Semua">Semua Project</option>
          <option value="Masagena Green Hills">Masagena Green Hills</option>
          <option value="Wotu Islamic Village">Wotu Islamic Village</option>
          <option value="The Hasanah Panakkukang">The Hasanah</option>
          <option value="Afkar Madani Estate">Afkar Madani</option>
        </select>
      </div>

      {/* GRID DATA UNIT */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse">Memuat data unit...</div>
      ) : filteredUnits.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">Belum ada data unit ditemukan.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUnits.map((u) => (
            <div key={u.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
              
              {/* Floating Action */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(u)} className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"><Edit2 size={14}/></button>
                <button onClick={() => handleDelete(u.id)} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"><Trash2 size={14}/></button>
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-none mb-1">Blok {u.blok}-{u.nomor}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{u.project}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-0.5">Tipe</p>
                  <p className="text-xs font-bold text-gray-800">{u.tipeRumah}</p>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-0.5">LT / LB</p>
                  <p className="text-xs font-bold text-gray-800">{u.luasTanah} / {u.luasBangunan} m²</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold">Harga</p>
                  <p className="text-sm font-black text-[#C9A84C]">{u.harga || '-'}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${STATUS_COLORS[u.status]}`}>
                  {u.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL TAMBAH/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">{isEditing ? 'Edit Unit' : 'Tambah Unit Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Pilih Project *</label>
                <select name="project" value={formData.project} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#C9A84C] bg-gray-50">
                  <option value="Masagena Green Hills">Masagena Green Hills</option>
                  <option value="Wotu Islamic Village">Wotu Islamic Village</option>
                  <option value="The Hasanah Panakkukang">The Hasanah Panakkukang</option>
                  <option value="Afkar Madani Estate">Afkar Madani Estate</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Blok *</label>
                  <input type="text" name="blok" value={formData.blok} onChange={handleChange} required placeholder="Cth: A" className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#C9A84C] bg-gray-50 uppercase" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nomor Kavling *</label>
                  <input type="text" name="nomor" value={formData.nomor} onChange={handleChange} required placeholder="Cth: 12" className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#C9A84C] bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Tipe Rumah</label>
                  <input type="text" name="tipeRumah" value={formData.tipeRumah} onChange={handleChange} placeholder="Cth: 36/72" className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#C9A84C] bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Luas Tanah (m²)</label>
                  <input type="number" name="luasTanah" value={formData.luasTanah} onChange={handleChange} placeholder="72" className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#C9A84C] bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Luas Bgn (m²)</label>
                  <input type="number" name="luasBangunan" value={formData.luasBangunan} onChange={handleChange} placeholder="36" className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#C9A84C] bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Harga Unit</label>
                  <input type="text" name="harga" value={formData.harga} onChange={handleChange} placeholder="Cth: Rp 350.000.000" className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#C9A84C] bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Status Ketersediaan</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#C9A84C] font-bold bg-gray-50">
                    <option value="Available">🟢 Available</option>
                    <option value="Booked">🟡 Booked</option>
                    <option value="Reserved">🔵 Reserved</option>
                    <option value="Sold">🔴 Sold</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t">
                <button type="submit" className="w-full py-3.5 bg-black text-[#C9A84C] rounded-xl font-bold hover:bg-gray-900 transition-colors flex justify-center items-center gap-2">
                  <Save size={18} /> Simpan Data Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}