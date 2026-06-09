import { useEffect, useMemo, useState } from 'react';
import {
  getKomisi,
  createKomisi,
  updateKomisi,
  deleteKomisi,
} from '../../services/api';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
  IconUsers,
} from './icons';
import { swalSuccess, confirmDelete } from '../../utils/swal';
import { toastError } from '../../utils/toast';
import './AdminManage.css';

const KomisiManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState(null); // { mode, data }
  const [nama, setNama] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getKomisi();
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
    return items.filter((k) => k.nama_komisi.toLowerCase().includes(q));
  }, [items, search]);

  const openCreate = () => {
    setNama('');
    setFormError('');
    setModal({ mode: 'create' });
  };

  const openEdit = (item) => {
    setNama(item.nama_komisi);
    setFormError('');
    setModal({ mode: 'edit', data: item });
  };

  const closeModal = () => {
    setModal(null);
    setNama('');
    setFormError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!nama.trim()) {
      setFormError('Nama komisi harus diisi');
      return;
    }

    const isCreate = modal.mode === 'create';
    setSaving(true);
    try {
      if (isCreate) {
        await createKomisi({ nama_komisi: nama.trim() });
      } else {
        await updateKomisi(modal.data.id_komisi, { nama_komisi: nama.trim() });
      }
      await loadData();
      closeModal();
      swalSuccess(isCreate ? 'Komisi ditambahkan' : 'Komisi diperbarui');
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!(await confirmDelete(`Hapus komisi "${item.nama_komisi}"?`))) return;
    try {
      await deleteKomisi(item.id_komisi);
      setItems((prev) => prev.filter((k) => k.id_komisi !== item.id_komisi));
      swalSuccess('Komisi dihapus');
    } catch (err) {
      toastError(err.message || 'Gagal menghapus data');
    }
  };

  return (
    <div className="manage">
      <h1 className="manage__title">Komisi</h1>
      <p className="manage__subtitle">
        Kelola daftar komisi yang dipakai sebagai kategori kegiatan.
      </p>

      <div className="manage-toolbar">
        <div className="manage-search">
          <input
            type="text"
            className="manage-search__input"
            placeholder="Cari komisi..."
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
            <p className="manage-state__title">Belum ada komisi</p>
            <p className="manage-state__text">
              {search ? 'Tidak ada komisi yang cocok.' : 'Klik "Tambah" untuk menambah komisi.'}
            </p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>No.</th>
                <th>Nama Komisi</th>
                <th style={{ width: '130px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id_komisi}>
                  <td>{i + 1}</td>
                  <td>{item.nama_komisi}</td>
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
          <div className="manage-modal manage-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal__header">
              <h2 className="manage-modal__title">
                {modal.mode === 'create' ? 'Tambah Komisi' : 'Edit Komisi'}
              </h2>
              <button type="button" className="manage-modal__close" onClick={closeModal}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleSave} noValidate>
              {formError && <div className="manage-error">{formError}</div>}
              <div className="manage-form__grid">
                <div className="manage-field manage-field--full">
                  <label className="manage-field__label" htmlFor="nama_komisi">Nama Komisi</label>
                  <div className="manage-field__control">
                    <input
                      id="nama_komisi"
                      name="nama_komisi"
                      type="text"
                      className="manage-input"
                      placeholder="cth: Komisi Pemuda"
                      value={nama}
                      onChange={(e) => {
                        setNama(e.target.value);
                        if (formError) setFormError('');
                      }}
                      disabled={saving}
                      autoFocus
                    />
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

export default KomisiManagement;
