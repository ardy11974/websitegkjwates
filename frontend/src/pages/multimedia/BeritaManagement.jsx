import { useEffect, useMemo, useState } from 'react';
import {
  getBerita,
  getKategori,
  createBerita,
  updateBerita,
  deleteBerita,
  fileUrl,
} from '../../services/api';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconEye,
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
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-';

const emptyForm = {
  judul_berita: '', isi_berita: '', penulis_berita: '', tanggal_berita: '',
  status_berita: 'DRAFT', id_kategori: '', gambar: '',
};

const BeritaManagement = () => {
  const [items, setItems] = useState([]);
  const [kategori, setKategori] = useState([]);
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
      const [b, kat] = await Promise.all([getBerita(), getKategori()]);
      setItems(b); setKategori(kat);
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
    return items.filter((b) => b.judul_berita.toLowerCase().includes(q));
  }, [items, search]);

  const revoke = (url) => { if (url && url.startsWith('blob:')) URL.revokeObjectURL(url); };

  const openCreate = () => {
    setForm({ ...emptyForm, tanggal_berita: toDateInput(new Date()), id_kategori: kategori[0] ? String(kategori[0].id_kategori) : '' });
    setFile(null); setPreview(''); setFormError('');
    setModal({ mode: 'create' });
  };
  const openEdit = (item) => {
    setForm({
      judul_berita: item.judul_berita,
      isi_berita: item.isi_berita,
      penulis_berita: item.penulis_berita,
      tanggal_berita: toDateInput(item.tanggal_berita),
      status_berita: item.status_berita,
      id_kategori: String(item.id_kategori),
      gambar: item.gambar_berita || '',
    });
    setFile(null); setPreview(fileUrl(item.gambar_berita)); setFormError('');
    setModal({ mode: 'edit', data: item });
  };
  const openView = (item) => setModal({ mode: 'view', data: item });
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
    if (!form.judul_berita.trim() || !form.isi_berita.trim() || !form.penulis_berita.trim() || !form.id_kategori) {
      setFormError('Judul, isi, penulis, dan kategori harus diisi');
      return;
    }
    const fd = new FormData();
    fd.append('judul_berita', form.judul_berita.trim());
    fd.append('isi_berita', form.isi_berita.trim());
    fd.append('penulis_berita', form.penulis_berita.trim());
    fd.append('status_berita', form.status_berita);
    fd.append('id_kategori', form.id_kategori);
    if (form.tanggal_berita) fd.append('tanggal_berita', form.tanggal_berita);
    if (file) fd.append('gambar', file);

    const isCreate = modal.mode === 'create';
    setSaving(true);
    try {
      if (isCreate) await createBerita(fd);
      else await updateBerita(modal.data.id_berita, fd);
      await loadData();
      closeModal();
      swalSuccess(isCreate ? 'Berita ditambahkan' : 'Berita diperbarui');
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!(await confirmDelete(`Hapus berita "${item.judul_berita}"?`))) return;
    try {
      await deleteBerita(item.id_berita);
      setItems((prev) => prev.filter((b) => b.id_berita !== item.id_berita));
      swalSuccess('Berita dihapus');
    } catch (err) {
      toastError(err.message || 'Gagal menghapus data');
    }
  };

  return (
    <div className="manage">
      <h1 className="manage__title">Berita</h1>
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
            <p className="manage-state__title">Belum ada berita</p>
            <p className="manage-state__text">{search ? 'Tidak ada data yang cocok.' : 'Klik "Tambah" untuk menulis berita.'}</p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>No.</th>
                <th style={{ width: '80px' }}>Foto</th>
                <th>Judul</th>
                <th style={{ width: '120px' }}>Kategori</th>
                <th style={{ width: '130px' }}>Penulis</th>
                <th style={{ width: '110px' }}>Status</th>
                <th style={{ width: '170px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id_berita}>
                  <td>{i + 1}</td>
                  <td><Thumb src={fileUrl(item.gambar_berita)} alt={item.judul_berita} /></td>
                  <td>{item.judul_berita}</td>
                  <td>{item.kategori?.nama_kategori || '-'}</td>
                  <td className="manage-table__muted">{item.penulis_berita}</td>
                  <td><span className={`manage-badge ${item.status_berita === 'PUBLISH' ? 'manage-badge--read' : 'manage-badge--unread'}`}>{item.status_berita === 'PUBLISH' ? 'Publish' : 'Draft'}</span></td>
                  <td>
                    <div className="manage-actions">
                      <button type="button" className="act-btn act-btn--edit" title="Edit" onClick={() => openEdit(item)}><IconEdit /></button>
                      <button type="button" className="act-btn act-btn--view" title="Lihat" onClick={() => openView(item)}><IconEye /></button>
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
              <h2 className="manage-modal__title">
                {modal.mode === 'create' && 'Tambah Berita'}
                {modal.mode === 'edit' && 'Edit Berita'}
                {modal.mode === 'view' && 'Detail Berita'}
              </h2>
              <button type="button" className="manage-modal__close" onClick={closeModal}><IconClose /></button>
            </div>
            {modal.mode === 'view' ? (
              <div className="manage-detail">
                {modal.data.gambar_berita && (
                  <div className="manage-detail__row">
                    <span className="manage-detail__label">Foto</span>
                    <img src={fileUrl(modal.data.gambar_berita)} alt={modal.data.judul_berita} className="manage-detail__photo" />
                  </div>
                )}
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Judul</span>
                  <span className="manage-detail__value">{modal.data.judul_berita}</span>
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Kategori</span>
                  <span className="manage-detail__value">{modal.data.kategori?.nama_kategori || '-'}</span>
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Penulis</span>
                  <span className="manage-detail__value">{modal.data.penulis_berita}</span>
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Tanggal</span>
                  <span className="manage-detail__value">{formatTanggal(modal.data.tanggal_berita)}</span>
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Status</span>
                  <span className="manage-detail__value">
                    <span className={`manage-badge ${modal.data.status_berita === 'PUBLISH' ? 'manage-badge--read' : 'manage-badge--unread'}`}>
                      {modal.data.status_berita === 'PUBLISH' ? 'Publish' : 'Draft'}
                    </span>
                  </span>
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Isi Berita</span>
                  <span className="manage-detail__value manage-detail__value--pre">{modal.data.isi_berita}</span>
                </div>
              </div>
            ) : (
            <form onSubmit={handleSave} noValidate>
              {formError && <div className="manage-error">{formError}</div>}
              <div className="manage-form__grid">
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="judul_berita">Judul</label>
                  <div className="manage-field__control">
                    <input id="judul_berita" name="judul_berita" type="text" className="manage-input" value={form.judul_berita} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="id_kategori">Kategori</label>
                  <div className="manage-field__control">
                    <select id="id_kategori" name="id_kategori" className="manage-select" value={form.id_kategori} onChange={handleChange} disabled={saving}>
                      <option value="">Pilih kategori</option>
                      {kategori.map((k) => <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>)}
                    </select>
                    <span className="manage-field__chevron"><IconChevron /></span>
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="penulis_berita">Penulis</label>
                  <div className="manage-field__control">
                    <input id="penulis_berita" name="penulis_berita" type="text" className="manage-input" value={form.penulis_berita} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="tanggal_berita">Tanggal</label>
                  <div className="manage-field__control">
                    <input id="tanggal_berita" name="tanggal_berita" type="date" className="manage-input" value={form.tanggal_berita} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="status_berita">Status</label>
                  <div className="manage-field__control">
                    <select id="status_berita" name="status_berita" className="manage-select" value={form.status_berita} onChange={handleChange} disabled={saving}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISH">Publish</option>
                    </select>
                    <span className="manage-field__chevron"><IconChevron /></span>
                  </div>
                </div>
                <div className="manage-field manage-field--full">
                  <label className="manage-field__label" htmlFor="isi_berita">Isi Berita</label>
                  <div className="manage-field__control">
                    <textarea id="isi_berita" name="isi_berita" className="manage-textarea" value={form.isi_berita} onChange={handleChange} disabled={saving} style={{ minHeight: '160px' }} />
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BeritaManagement;
