import { useEffect, useMemo, useState } from 'react';
import {
  getPersyaratan,
  createPersyaratan,
  updatePersyaratan,
  deletePersyaratan,
  fileUrl,
} from '../../services/api';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
  IconFile,
} from './icons';
import { swalSuccess, confirmDelete } from '../../utils/swal';
import { toastError } from '../../utils/toast';
import './AdminManage.css';

const emptyForm = { kategori_persyaratan: '', file_pdf: '' };

const PersyaratanManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState(null); // { mode, data }
  const [form, setForm] = useState(emptyForm);
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getPersyaratan();
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
    return items.filter((p) =>
      p.kategori_persyaratan.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openCreate = () => {
    setForm(emptyForm);
    setPdfFile(null);
    setFormError('');
    setModal({ mode: 'create' });
  };

  const openEdit = (item) => {
    setForm({
      kategori_persyaratan: item.kategori_persyaratan,
      file_pdf: item.file_pdf || '',
    });
    setPdfFile(null);
    setFormError('');
    setModal({ mode: 'edit', data: item });
  };

  const closeModal = () => {
    setModal(null);
    setForm(emptyForm);
    setPdfFile(null);
    setFormError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      if (formError) setFormError('');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.kategori_persyaratan.trim()) {
      setFormError('Kategori harus diisi');
      return;
    }
    if (!pdfFile && !form.file_pdf) {
      setFormError('File PDF harus diunggah');
      return;
    }

    const fd = new FormData();
    fd.append('kategori_persyaratan', form.kategori_persyaratan.trim());
    if (pdfFile) fd.append('file', pdfFile);

    const isCreate = modal.mode === 'create';
    setSaving(true);
    try {
      if (isCreate) {
        await createPersyaratan(fd);
      } else if (modal.mode === 'edit') {
        await updatePersyaratan(modal.data.id_persyaratan, fd);
      }
      await loadData();
      closeModal();
      swalSuccess(isCreate ? 'Persyaratan ditambahkan' : 'Persyaratan diperbarui');
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!(await confirmDelete(`Hapus persyaratan "${item.kategori_persyaratan}"?`))) return;
    try {
      await deletePersyaratan(item.id_persyaratan);
      setItems((prev) => prev.filter((p) => p.id_persyaratan !== item.id_persyaratan));
      swalSuccess('Persyaratan dihapus');
    } catch (err) {
      toastError(err.message || 'Gagal menghapus data');
    }
  };

  return (
    <div className="manage">
      <h1 className="manage__title">Persyaratan</h1>

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
            <div className="manage-state__icon"><IconFile /></div>
            <p className="manage-state__text">Memuat data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconFile /></div>
            <p className="manage-state__title">Belum ada persyaratan</p>
            <p className="manage-state__text">
              {search ? 'Tidak ada data yang cocok.' : 'Klik "Tambah" untuk mengunggah dokumen persyaratan.'}
            </p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>No.</th>
                <th>Kategori</th>
                <th>File</th>
                <th style={{ width: '140px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id_persyaratan}>
                  <td>{i + 1}</td>
                  <td>{item.kategori_persyaratan}</td>
                  <td>
                    <a
                      className="manage-file-link"
                      href={fileUrl(item.file_pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconFile />
                      <span>Lihat PDF</span>
                    </a>
                  </td>
                  <td>
                    <div className="manage-actions">
                      <button type="button" className="act-btn act-btn--edit" title="Edit" onClick={() => openEdit(item)}>
                        <IconEdit />
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
                {modal.mode === 'create' ? 'Tambah Persyaratan' : 'Edit Persyaratan'}
              </h2>
              <button type="button" className="manage-modal__close" onClick={closeModal}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleSave} noValidate>
              {formError && <div className="manage-error">{formError}</div>}
              <div className="manage-form__grid">
                <div className="manage-field manage-field--full">
                  <label className="manage-field__label" htmlFor="kategori_persyaratan">Kategori</label>
                  <div className="manage-field__control">
                    <input
                      id="kategori_persyaratan"
                      name="kategori_persyaratan"
                      type="text"
                      className="manage-input"
                      placeholder="cth: Persyaratan Baptis"
                      value={form.kategori_persyaratan}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </div>
                </div>

                <div className="manage-field manage-field--full">
                  <label className="manage-field__label">File PDF</label>
                  <div className="manage-upload">
                    <div className="manage-upload__preview manage-upload__preview--file">
                      <IconFile />
                    </div>
                    <div className="manage-upload__body">
                      <label className="manage-upload__btn">
                        <IconFile />
                        <span>{pdfFile || form.file_pdf ? 'Ganti File' : 'Pilih File PDF'}</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          disabled={saving}
                          hidden
                        />
                      </label>
                      <span className="manage-upload__hint">
                        {pdfFile
                          ? pdfFile.name
                          : form.file_pdf
                          ? 'File saat ini akan dipertahankan jika tidak diganti.'
                          : 'Hanya file PDF. Maksimal 10 MB.'}
                      </span>
                      {!pdfFile && form.file_pdf && (
                        <a
                          className="manage-file-link"
                          href={fileUrl(form.file_pdf)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconFile />
                          <span>Lihat file saat ini</span>
                        </a>
                      )}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PersyaratanManagement;
