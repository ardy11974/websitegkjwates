import { useEffect, useMemo, useState } from 'react';
import {
  getKegiatan,
  getKomisi,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan,
  fileUrl,
} from '../../services/api';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
  IconChevron,
  IconImage,
} from '../admin/icons';
import { swalSuccess, confirmDelete } from '../../utils/swal';
import { toastError } from '../../utils/toast';
import '../admin/AdminManage.css';

const Thumb = ({ src, alt }) => {
  const [err, setErr] = useState(false);
  if (!src || err) return <span className="manage-thumb manage-thumb--placeholder"><IconImage /></span>;
  return <img src={src} alt={alt} className="manage-thumb" onError={() => setErr(true)} />;
};

const toDateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');
const formatTanggal = (iso) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

const STATUS_LABEL = { DRAFT: 'Draft', PUBLISH: 'Publish', SELESAI: 'Selesai' };

const emptyForm = {
  judul_kegiatan: '', deskripsi_kegiatan: '', tanggal_kegiatan: '',
  lokasi_kegiatan: '', status_kegiatan: 'DRAFT', id_komisi: '', gambar: '',
};

const KegiatanManagement = () => {
  const [items, setItems] = useState([]);
  const [komisi, setKomisi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [k, kom] = await Promise.all([getKegiatan(), getKomisi()]);
      setItems(k); setKomisi(kom);
    } catch (err) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((k) => k.judul_kegiatan.toLowerCase().includes(q));
  }, [items, search]);

  const revoke = (url) => { if (url && url.startsWith('blob:')) URL.revokeObjectURL(url); };

  const openCreate = () => {
    setForm({ ...emptyForm, tanggal_kegiatan: toDateInput(new Date()), id_komisi: komisi[0] ? String(komisi[0].id_komisi) : '' });
    setFile(null); setPreview(''); setFormError('');
    setModal({ mode: 'create' });
  };
  const openEdit = (item) => {
    setForm({
      judul_kegiatan: item.judul_kegiatan,
      deskripsi_kegiatan: item.deskripsi_kegiatan,
      tanggal_kegiatan: toDateInput(item.tanggal_kegiatan),
      lokasi_kegiatan: item.lokasi_kegiatan,
      status_kegiatan: item.status_kegiatan,
      id_komisi: String(item.id_komisi),
      gambar: item.gambar_kegiatan || '',
    });
    setFile(null); setPreview(fileUrl(item.gambar_kegiatan)); setFormError('');
    setModal({ mode: 'edit', data: item });
  };
  const closeModal = () => { revoke(preview); setModal(null); setForm(emptyForm); setFile(null); setPreview(''); setFormError(''); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (formError) setFormError('');
  };
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    revoke(preview); setFile(f); setPreview(URL.createObjectURL(f));
    if (formError) setFormError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.judul_kegiatan.trim() || !form.deskripsi_kegiatan.trim() || !form.lokasi_kegiatan.trim() || !form.id_komisi) {
      setFormError('Judul, deskripsi, lokasi, dan komisi harus diisi');
      return;
    }
    const fd = new FormData();
    fd.append('judul_kegiatan', form.judul_kegiatan.trim());
    fd.append('deskripsi_kegiatan', form.deskripsi_kegiatan.trim());
    fd.append('lokasi_kegiatan', form.lokasi_kegiatan.trim());
    fd.append('status_kegiatan', form.status_kegiatan);
    fd.append('id_komisi', form.id_komisi);
    if (form.tanggal_kegiatan) fd.append('tanggal_kegiatan', form.tanggal_kegiatan);
    if (file) fd.append('gambar', file);

    const isCreate = modal.mode === 'create';
    setSaving(true);
    try {
      if (isCreate) await createKegiatan(fd);
      else await updateKegiatan(modal.data.id_kegiatan, fd);
      await loadData();
      closeModal();
      swalSuccess(isCreate ? 'Kegiatan ditambahkan' : 'Kegiatan diperbarui');
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!(await confirmDelete(`Hapus kegiatan "${item.judul_kegiatan}"?`))) return;
    try {
      await deleteKegiatan(item.id_kegiatan);
      setItems((prev) => prev.filter((k) => k.id_kegiatan !== item.id_kegiatan));
      swalSuccess('Kegiatan dihapus');
    } catch (err) {
      toastError(err.message || 'Gagal menghapus data');
    }
  };

  return (
    <div className="manage">
      <h1 className="manage__title">Kegiatan</h1>
      <div className="manage-toolbar">
        <div className="manage-search">
          <input type="text" className="manage-search__input" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <span className="manage-search__icon"><IconSearch /></span>
        </div>
        <button type="button" className="manage-add-btn" onClick={openCreate}><IconPlus /><span>Tambah</span></button>
      </div>

      {error && <div className="manage-error">{error}</div>}

      <div className="manage-card">
        {loading ? (
          <div className="manage-state"><div className="manage-state__icon"><IconImage /></div><p className="manage-state__text">Memuat data...</p></div>
        ) : filtered.length === 0 ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconImage /></div>
            <p className="manage-state__title">Belum ada kegiatan</p>
            <p className="manage-state__text">{search ? 'Tidak ada data yang cocok.' : 'Klik "Tambah" untuk menambah kegiatan.'}</p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>No.</th>
                <th style={{ width: '80px' }}>Foto</th>
                <th>Judul</th>
                <th style={{ width: '120px' }}>Komisi</th>
                <th style={{ width: '120px' }}>Tanggal</th>
                <th style={{ width: '110px' }}>Status</th>
                <th style={{ width: '130px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id_kegiatan}>
                  <td>{i + 1}</td>
                  <td><Thumb src={fileUrl(item.gambar_kegiatan)} alt={item.judul_kegiatan} /></td>
                  <td>{item.judul_kegiatan}</td>
                  <td>{item.komisi?.nama_komisi || '-'}</td>
                  <td className="manage-table__muted">{formatTanggal(item.tanggal_kegiatan)}</td>
                  <td><span className={`manage-badge ${item.status_kegiatan === 'DRAFT' ? 'manage-badge--unread' : 'manage-badge--read'}`}>{STATUS_LABEL[item.status_kegiatan]}</span></td>
                  <td>
                    <div className="manage-actions">
                      <button type="button" className="act-btn act-btn--edit" title="Edit" onClick={() => openEdit(item)}><IconEdit /></button>
                      <button type="button" className="act-btn act-btn--delete" title="Hapus" onClick={() => handleDelete(item)}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="manage-modal-overlay" onClick={closeModal}>
          <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal__header">
              <h2 className="manage-modal__title">{modal.mode === 'create' ? 'Tambah Kegiatan' : 'Edit Kegiatan'}</h2>
              <button type="button" className="manage-modal__close" onClick={closeModal}><IconClose /></button>
            </div>
            <form onSubmit={handleSave} noValidate>
              {formError && <div className="manage-error">{formError}</div>}
              <div className="manage-form__grid">
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="judul_kegiatan">Judul</label>
                  <div className="manage-field__control">
                    <input id="judul_kegiatan" name="judul_kegiatan" type="text" className="manage-input" value={form.judul_kegiatan} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="id_komisi">Komisi</label>
                  <div className="manage-field__control">
                    <select id="id_komisi" name="id_komisi" className="manage-select" value={form.id_komisi} onChange={handleChange} disabled={saving}>
                      <option value="">Pilih komisi</option>
                      {komisi.map((k) => <option key={k.id_komisi} value={k.id_komisi}>{k.nama_komisi}</option>)}
                    </select>
                    <span className="manage-field__chevron"><IconChevron /></span>
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="tanggal_kegiatan">Tanggal</label>
                  <div className="manage-field__control">
                    <input id="tanggal_kegiatan" name="tanggal_kegiatan" type="date" className="manage-input" value={form.tanggal_kegiatan} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="lokasi_kegiatan">Lokasi</label>
                  <div className="manage-field__control">
                    <input id="lokasi_kegiatan" name="lokasi_kegiatan" type="text" className="manage-input" value={form.lokasi_kegiatan} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="status_kegiatan">Status</label>
                  <div className="manage-field__control">
                    <select id="status_kegiatan" name="status_kegiatan" className="manage-select" value={form.status_kegiatan} onChange={handleChange} disabled={saving}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISH">Publish</option>
                      <option value="SELESAI">Selesai</option>
                    </select>
                    <span className="manage-field__chevron"><IconChevron /></span>
                  </div>
                </div>
                <div className="manage-field manage-field--full">
                  <label className="manage-field__label" htmlFor="deskripsi_kegiatan">Deskripsi</label>
                  <div className="manage-field__control">
                    <textarea id="deskripsi_kegiatan" name="deskripsi_kegiatan" className="manage-textarea" value={form.deskripsi_kegiatan} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field manage-field--full">
                  <label className="manage-field__label">Foto (opsional)</label>
                  <div className="manage-upload">
                    <div className="manage-upload__preview">
                      {preview ? <img src={preview} alt="Preview" /> : <span className="manage-upload__placeholder"><IconImage /></span>}
                    </div>
                    <div className="manage-upload__body">
                      <label className="manage-upload__btn">
                        <IconImage /><span>{file || form.gambar ? 'Ganti Foto' : 'Pilih Foto'}</span>
                        <input type="file" accept="image/*" onChange={handleFile} disabled={saving} hidden />
                      </label>
                      <span className="manage-upload__hint">{file ? file.name : 'Format JPG, PNG, WEBP, atau GIF. Maksimal 5 MB.'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="manage-modal__actions">
                <button type="submit" className="manage-save-btn" disabled={saving}>
                  {saving ? (<><span className="manage-save-btn__spinner"></span><span>Menyimpan...</span></>) : (<><IconPlus /><span>Simpan</span></>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KegiatanManagement;
