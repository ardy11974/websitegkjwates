import { useEffect, useMemo, useState } from 'react';
import {
  getSorotan,
  createSorotan,
  updateSorotan,
  deleteSorotan,
  fileUrl,
} from '../../services/api';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
  IconImage,
  IconChevron,
} from '../admin/icons';
import { swalSuccess, confirmDelete } from '../../utils/swal';
import { toastError } from '../../utils/toast';
import '../admin/AdminManage.css';

const Thumb = ({ src, alt }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return <span className="manage-thumb manage-thumb--placeholder"><IconImage /></span>;
  }
  return <img src={src} alt={alt} className="manage-thumb" onError={() => setErr(true)} />;
};

const emptyForm = { judul_sorotan: '', status_publish_sorotan: 'DRAFT', gambar: '' };

const SorotanManagement = () => {
  const [items, setItems] = useState([]);
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
      setItems(await getSorotan());
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
    return items.filter((s) => s.judul_sorotan.toLowerCase().includes(q));
  }, [items, search]);

  const revoke = (url) => { if (url && url.startsWith('blob:')) URL.revokeObjectURL(url); };

  const openCreate = () => {
    setForm(emptyForm); setFile(null); setPreview(''); setFormError('');
    setModal({ mode: 'create' });
  };
  const openEdit = (item) => {
    setForm({ judul_sorotan: item.judul_sorotan, status_publish_sorotan: item.status_publish_sorotan, gambar: item.gambar_sorotan || '' });
    setFile(null); setPreview(fileUrl(item.gambar_sorotan)); setFormError('');
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
    if (!form.judul_sorotan.trim()) { setFormError('Judul harus diisi'); return; }
    if (!file && !form.gambar) { setFormError('Gambar harus diunggah'); return; }

    const fd = new FormData();
    fd.append('judul_sorotan', form.judul_sorotan.trim());
    fd.append('status_publish_sorotan', form.status_publish_sorotan);
    if (file) fd.append('gambar', file);

    const isCreate = modal.mode === 'create';
    setSaving(true);
    try {
      if (isCreate) await createSorotan(fd);
      else await updateSorotan(modal.data.id_sorotan, fd);
      await loadData();
      closeModal();
      swalSuccess(isCreate ? 'Sorotan ditambahkan' : 'Sorotan diperbarui');
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!(await confirmDelete(`Hapus sorotan "${item.judul_sorotan}"?`))) return;
    try {
      await deleteSorotan(item.id_sorotan);
      setItems((prev) => prev.filter((s) => s.id_sorotan !== item.id_sorotan));
      swalSuccess('Sorotan dihapus');
    } catch (err) {
      toastError(err.message || 'Gagal menghapus data');
    }
  };

  return (
    <div className="manage">
      <h1 className="manage__title">Sorotan</h1>
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
            <p className="manage-state__title">Belum ada sorotan</p>
            <p className="manage-state__text">{search ? 'Tidak ada data yang cocok.' : 'Klik "Tambah" untuk mengunggah sorotan.'}</p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>No.</th>
                <th style={{ width: '90px' }}>Gambar</th>
                <th>Judul</th>
                <th style={{ width: '130px' }}>Status</th>
                <th style={{ width: '140px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id_sorotan}>
                  <td>{i + 1}</td>
                  <td><Thumb src={fileUrl(item.gambar_sorotan)} alt={item.judul_sorotan} /></td>
                  <td>{item.judul_sorotan}</td>
                  <td>
                    <span className={`manage-badge ${item.status_publish_sorotan === 'PUBLISH' ? 'manage-badge--read' : 'manage-badge--unread'}`}>
                      {item.status_publish_sorotan === 'PUBLISH' ? 'Publish' : 'Draft'}
                    </span>
                  </td>
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
              <h2 className="manage-modal__title">{modal.mode === 'create' ? 'Tambah Sorotan' : 'Edit Sorotan'}</h2>
              <button type="button" className="manage-modal__close" onClick={closeModal}><IconClose /></button>
            </div>
            <form onSubmit={handleSave} noValidate>
              {formError && <div className="manage-error">{formError}</div>}
              <div className="manage-form__grid">
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="judul_sorotan">Judul</label>
                  <div className="manage-field__control">
                    <input id="judul_sorotan" name="judul_sorotan" type="text" className="manage-input" value={form.judul_sorotan} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="status_publish_sorotan">Status</label>
                  <div className="manage-field__control">
                    <select id="status_publish_sorotan" name="status_publish_sorotan" className="manage-select" value={form.status_publish_sorotan} onChange={handleChange} disabled={saving}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISH">Publish</option>
                    </select>
                    <span className="manage-field__chevron"><IconChevron /></span>
                  </div>
                </div>
                <div className="manage-field manage-field--full">
                  <label className="manage-field__label">Gambar</label>
                  <div className="manage-upload">
                    <div className="manage-upload__preview">
                      {preview ? <img src={preview} alt="Preview" /> : <span className="manage-upload__placeholder"><IconImage /></span>}
                    </div>
                    <div className="manage-upload__body">
                      <label className="manage-upload__btn">
                        <IconImage /><span>{file || form.gambar ? 'Ganti Gambar' : 'Pilih Gambar'}</span>
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

export default SorotanManagement;
