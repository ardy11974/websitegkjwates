import { useEffect, useMemo, useState } from 'react';
import {
  getKemajelisan,
  createKemajelisan,
  updateKemajelisan,
  deleteKemajelisan,
  fileUrl,
} from '../../services/api';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconEye,
  IconTrash,
  IconClose,
  IconUsers,
  IconImage,
} from './icons';
import { swalSuccess, confirmDelete } from '../../utils/swal';
import { toastError } from '../../utils/toast';
import './AdminManage.css';

// Thumbnail dengan fallback bila gambar gagal dimuat
const Thumb = ({ src, alt }) => {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <span className="manage-thumb manage-thumb--placeholder">
        <IconImage />
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="manage-thumb"
      onError={() => setErr(true)}
    />
  );
};

const emptyForm = {
  nama_kemajelisan: '',
  jabatan_kemajelisan: '',
  periode_kemajelisan: '',
  foto_kemajelisan: '', // path foto lama (saat edit)
  urutan_kemajelisan: '',
};

const KemajelisanManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState(null); // { mode, data }
  const [form, setForm] = useState(emptyForm);
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getKemajelisan();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (k) =>
        k.nama_kemajelisan.toLowerCase().includes(q) ||
        k.jabatan_kemajelisan.toLowerCase().includes(q)
    );
  }, [items, search]);

  // Bersihkan object URL preview agar tidak bocor memori
  const revokePreview = (url) => {
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
  };

  const openCreate = () => {
    setForm({ ...emptyForm, urutan_kemajelisan: '1' });
    setFotoFile(null);
    setFotoPreview('');
    setFormError('');
    setModal({ mode: 'create' });
  };

  const openEdit = (item) => {
    setForm({
      nama_kemajelisan: item.nama_kemajelisan,
      jabatan_kemajelisan: item.jabatan_kemajelisan,
      periode_kemajelisan: item.periode_kemajelisan,
      foto_kemajelisan: item.foto_kemajelisan || '',
      urutan_kemajelisan: String(item.urutan_kemajelisan ?? ''),
    });
    setFotoFile(null);
    setFotoPreview(fileUrl(item.foto_kemajelisan));
    setFormError('');
    setModal({ mode: 'edit', data: item });
  };

  const openView = (item) => setModal({ mode: 'view', data: item });

  const closeModal = () => {
    revokePreview(fotoPreview);
    setModal(null);
    setForm(emptyForm);
    setFotoFile(null);
    setFotoPreview('');
    setFormError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    revokePreview(fotoPreview);
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
    if (formError) setFormError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (
      !form.nama_kemajelisan.trim() ||
      !form.jabatan_kemajelisan.trim() ||
      !form.periode_kemajelisan.trim()
    ) {
      setFormError('Nama, jabatan, dan periode harus diisi');
      return;
    }
    // Foto wajib: harus ada file baru, atau foto lama (saat edit)
    if (!fotoFile && !form.foto_kemajelisan) {
      setFormError('Foto harus diunggah');
      return;
    }

    const fd = new FormData();
    fd.append('nama_kemajelisan', form.nama_kemajelisan.trim());
    fd.append('jabatan_kemajelisan', form.jabatan_kemajelisan.trim());
    fd.append('periode_kemajelisan', form.periode_kemajelisan.trim());
    fd.append('urutan_kemajelisan', String(Number(form.urutan_kemajelisan) || 0));
    if (fotoFile) fd.append('foto', fotoFile);

    const isCreate = modal.mode === 'create';
    setSaving(true);
    try {
      if (isCreate) {
        await createKemajelisan(fd);
      } else if (modal.mode === 'edit') {
        await updateKemajelisan(modal.data.id_kemajelisan, fd);
      }
      await loadData();
      closeModal();
      swalSuccess(isCreate ? 'Data ditambahkan' : 'Data diperbarui');
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!(await confirmDelete(`Hapus "${item.nama_kemajelisan}"?`))) return;
    try {
      await deleteKemajelisan(item.id_kemajelisan);
      setItems((prev) => prev.filter((k) => k.id_kemajelisan !== item.id_kemajelisan));
      swalSuccess('Data dihapus');
    } catch (err) {
      toastError(err.message || 'Gagal menghapus data');
    }
  };

  return (
    <div className="manage">
      <h1 className="manage__title">Kemajelisan</h1>

      <div className="manage-toolbar">
        <div className="manage-search">
          <input
            type="text"
            className="manage-search__input"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="manage-search__icon">
            <IconSearch />
          </span>
        </div>
        <button type="button" className="manage-add-btn" onClick={openCreate}>
          <IconPlus />
          <span>Tambah</span>
        </button>
      </div>

      {error && <div className="manage-error">{error}</div>}

      <div className="manage-card">
        {loading ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconUsers /></div>
            <p className="manage-state__text">Memuat data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconUsers /></div>
            <p className="manage-state__title">Belum ada data kemajelisan</p>
            <p className="manage-state__text">
              {search ? 'Tidak ada data yang cocok.' : 'Klik "Tambah" untuk menambah anggota majelis.'}
            </p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>No.</th>
                <th style={{ width: '90px' }}>Foto</th>
                <th>Nama</th>
                <th>Jabatan</th>
                <th>Periode</th>
                <th style={{ width: '90px' }}>Urutan</th>
                <th style={{ width: '170px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id_kemajelisan}>
                  <td>{i + 1}</td>
                  <td>
                    <Thumb src={fileUrl(item.foto_kemajelisan)} alt={item.nama_kemajelisan} />
                  </td>
                  <td>{item.nama_kemajelisan}</td>
                  <td>{item.jabatan_kemajelisan}</td>
                  <td>{item.periode_kemajelisan}</td>
                  <td>{item.urutan_kemajelisan}</td>
                  <td>
                    <div className="manage-actions">
                      <button type="button" className="act-btn act-btn--edit" title="Edit" onClick={() => openEdit(item)}>
                        <IconEdit />
                      </button>
                      <button type="button" className="act-btn act-btn--view" title="Lihat" onClick={() => openView(item)}>
                        <IconEye />
                      </button>
                      <button type="button" className="act-btn act-btn--delete" title="Hapus" onClick={() => handleDelete(item)}>
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ====== MODAL ====== */}
      {modal && (
        <div className="manage-modal-overlay" onClick={closeModal}>
          <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal__header">
              <h2 className="manage-modal__title">
                {modal.mode === 'create' && 'Tambah Kemajelisan'}
                {modal.mode === 'edit' && 'Edit Kemajelisan'}
                {modal.mode === 'view' && 'Detail Kemajelisan'}
              </h2>
              <button type="button" className="manage-modal__close" onClick={closeModal}>
                <IconClose />
              </button>
            </div>

            {modal.mode === 'view' ? (
              <div className="manage-detail">
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Foto</span>
                  {modal.data.foto_kemajelisan ? (
                    <img
                      src={fileUrl(modal.data.foto_kemajelisan)}
                      alt={modal.data.nama_kemajelisan}
                      className="manage-detail__photo"
                    />
                  ) : (
                    <span className="manage-detail__value">-</span>
                  )}
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Nama</span>
                  <span className="manage-detail__value">{modal.data.nama_kemajelisan}</span>
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Jabatan</span>
                  <span className="manage-detail__value">{modal.data.jabatan_kemajelisan}</span>
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Periode</span>
                  <span className="manage-detail__value">{modal.data.periode_kemajelisan}</span>
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Urutan</span>
                  <span className="manage-detail__value">{modal.data.urutan_kemajelisan}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} noValidate>
                {formError && <div className="manage-error">{formError}</div>}
                <div className="manage-form__grid">
                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="nama_kemajelisan">Nama</label>
                    <div className="manage-field__control">
                      <input
                        id="nama_kemajelisan"
                        name="nama_kemajelisan"
                        type="text"
                        className="manage-input"
                        value={form.nama_kemajelisan}
                        onChange={handleChange}
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="jabatan_kemajelisan">Jabatan</label>
                    <div className="manage-field__control">
                      <input
                        id="jabatan_kemajelisan"
                        name="jabatan_kemajelisan"
                        type="text"
                        className="manage-input"
                        value={form.jabatan_kemajelisan}
                        onChange={handleChange}
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="periode_kemajelisan">Periode</label>
                    <div className="manage-field__control">
                      <input
                        id="periode_kemajelisan"
                        name="periode_kemajelisan"
                        type="text"
                        className="manage-input"
                        placeholder="cth: 2024-2027"
                        value={form.periode_kemajelisan}
                        onChange={handleChange}
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="urutan_kemajelisan">Urutan (tingkat struktur)</label>
                    <div className="manage-field__control">
                      <input
                        id="urutan_kemajelisan"
                        name="urutan_kemajelisan"
                        type="number"
                        min="1"
                        className="manage-input"
                        value={form.urutan_kemajelisan}
                        onChange={handleChange}
                        disabled={saving}
                      />
                    </div>
                    <p className="settings-hint">1 = paling atas (pimpinan). Anggota dengan urutan sama berada di baris/tingkat yang sama (mis. Sekretaris & Bendahara = 2).</p>
                  </div>

                  <div className="manage-field manage-field--full">
                    <label className="manage-field__label">Foto</label>
                    <div className="manage-upload">
                      <div className="manage-upload__preview">
                        {fotoPreview ? (
                          <img src={fotoPreview} alt="Preview foto" />
                        ) : (
                          <span className="manage-upload__placeholder">
                            <IconImage />
                          </span>
                        )}
                      </div>
                      <div className="manage-upload__body">
                        <label className="manage-upload__btn">
                          <IconImage />
                          <span>{fotoFile || form.foto_kemajelisan ? 'Ganti Foto' : 'Pilih Foto'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={saving}
                            hidden
                          />
                        </label>
                        <span className="manage-upload__hint">
                          {fotoFile ? fotoFile.name : 'Format JPG, PNG, WEBP, atau GIF. Maksimal 5 MB.'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="manage-modal__actions">
                  <button type="submit" className="manage-save-btn" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="manage-save-btn__spinner"></span>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <IconPlus />
                        <span>Simpan</span>
                      </>
                    )}
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

export default KemajelisanManagement;
