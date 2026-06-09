import { useEffect, useMemo, useState } from 'react';
import {
  getRenungan,
  createRenungan,
  updateRenungan,
  deleteRenungan,
} from '../../services/api';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
  IconChevron,
  IconEye,
} from '../admin/icons';
import { swalSuccess, confirmDelete } from '../../utils/swal';
import { toastError } from '../../utils/toast';
import '../admin/AdminManage.css';

const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM6 4H11V12L8.5 10.5L6 12V4Z" fill="currentColor"/>
  </svg>
);

const toDateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');
const formatTanggal = (iso) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

const emptyForm = {
  judul_renungan: '',
  bacaan_renungan: '',
  nats_renungan: '',
  penulis_renungan: '',
  tanggal_renungan: '',
  status_renungan: 'DRAFT',
  isi_renungan: '',
};

const RenunganManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [viewItem, setViewItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await getRenungan());
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
    return items.filter(
      (r) => r.judul_renungan.toLowerCase().includes(q) || r.penulis_renungan.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openCreate = () => {
    setForm({ ...emptyForm, tanggal_renungan: toDateInput(new Date()) });
    setFormError('');
    setModal({ mode: 'create' });
  };
  const openEdit = (r) => {
    setForm({
      judul_renungan: r.judul_renungan,
      bacaan_renungan: r.bacaan_renungan,
      nats_renungan: r.nats_renungan,
      penulis_renungan: r.penulis_renungan,
      tanggal_renungan: toDateInput(r.tanggal_renungan),
      status_renungan: r.status_renungan === 'PUBLISH' ? 'PUBLISH' : 'DRAFT',
      isi_renungan: r.isi_renungan,
    });
    setFormError('');
    setModal({ mode: 'edit', data: r });
  };
  const closeModal = () => { setModal(null); setForm(emptyForm); setFormError(''); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (formError) setFormError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    if (
      !form.judul_renungan.trim() ||
      !form.bacaan_renungan.trim() ||
      !form.nats_renungan.trim() ||
      !form.penulis_renungan.trim() ||
      !form.isi_renungan.trim()
    ) {
      setFormError('Judul, bacaan, nats, penulis, dan isi harus diisi');
      return;
    }
    const payload = {
      judul_renungan: form.judul_renungan.trim(),
      bacaan_renungan: form.bacaan_renungan.trim(),
      nats_renungan: form.nats_renungan.trim(),
      penulis_renungan: form.penulis_renungan.trim(),
      isi_renungan: form.isi_renungan.trim(),
      status_renungan: form.status_renungan,
      tanggal_renungan: form.tanggal_renungan || undefined,
    };
    const isCreate = modal.mode === 'create';
    setSaving(true);
    try {
      if (isCreate) await createRenungan(payload);
      else await updateRenungan(modal.data.id_renungan, payload);
      await loadData();
      closeModal();
      swalSuccess(isCreate ? 'Renungan ditambahkan' : 'Renungan diperbarui');
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r) => {
    if (!(await confirmDelete(`Hapus renungan "${r.judul_renungan}"?`))) return;
    try {
      await deleteRenungan(r.id_renungan);
      setItems((prev) => prev.filter((x) => x.id_renungan !== r.id_renungan));
      swalSuccess('Renungan dihapus');
    } catch (err) {
      toastError(err.message || 'Gagal menghapus data');
    }
  };

  return (
    <div className="manage">
      <h1 className="manage__title">Renungan</h1>
      <div className="manage-toolbar">
        <div className="manage-search">
          <input type="text" className="manage-search__input" placeholder="Cari renungan..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <span className="manage-search__icon"><IconSearch /></span>
        </div>
        <button type="button" className="manage-add-btn" onClick={openCreate}><IconPlus /><span>Tambah</span></button>
      </div>

      {error && <div className="manage-error">{error}</div>}

      <div className="manage-card">
        {loading ? (
          <div className="manage-state"><div className="manage-state__icon"><IconBook /></div><p className="manage-state__text">Memuat data...</p></div>
        ) : filtered.length === 0 ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconBook /></div>
            <p className="manage-state__title">Belum ada renungan</p>
            <p className="manage-state__text">{search ? 'Tidak ada data yang cocok.' : 'Klik "Tambah" untuk menulis renungan.'}</p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>No.</th>
                <th>Judul</th>
                <th style={{ width: '150px' }}>Penulis</th>
                <th style={{ width: '130px' }}>Tanggal</th>
                <th style={{ width: '110px' }}>Status</th>
                <th style={{ width: '170px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id_renungan}>
                  <td>{i + 1}</td>
                  <td>{r.judul_renungan}</td>
                  <td className="manage-table__muted">{r.penulis_renungan}</td>
                  <td className="manage-table__muted">{formatTanggal(r.tanggal_renungan)}</td>
                  <td><span className={`manage-badge ${r.status_renungan === 'PUBLISH' ? 'manage-badge--read' : 'manage-badge--unread'}`}>{r.status_renungan === 'PUBLISH' ? 'Publish' : 'Draft'}</span></td>
                  <td>
                    <div className="manage-actions">
                      <button type="button" className="act-btn act-btn--edit" title="Edit" onClick={() => openEdit(r)}><IconEdit /></button>
                      <button type="button" className="act-btn act-btn--view" title="Lihat detail" onClick={() => setViewItem(r)}><IconEye /></button>
                      <button type="button" className="act-btn act-btn--delete" title="Hapus" onClick={() => handleDelete(r)}><IconTrash /></button>
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
              <h2 className="manage-modal__title">{modal.mode === 'create' ? 'Tambah Renungan' : 'Edit Renungan'}</h2>
              <button type="button" className="manage-modal__close" onClick={closeModal}><IconClose /></button>
            </div>
            <form onSubmit={handleSave} noValidate>
              {formError && <div className="manage-error">{formError}</div>}
              <div className="manage-form__grid">
                <div className="manage-field manage-field--full">
                  <label className="manage-field__label" htmlFor="judul_renungan">Judul</label>
                  <div className="manage-field__control">
                    <input id="judul_renungan" name="judul_renungan" type="text" className="manage-input" value={form.judul_renungan} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="bacaan_renungan">Bacaan</label>
                  <div className="manage-field__control">
                    <input id="bacaan_renungan" name="bacaan_renungan" type="text" className="manage-input" placeholder="cth: Amsal 25:16-28" value={form.bacaan_renungan} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="penulis_renungan">Penulis</label>
                  <div className="manage-field__control">
                    <input id="penulis_renungan" name="penulis_renungan" type="text" className="manage-input" placeholder="cth: Pdt. Budi" value={form.penulis_renungan} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="tanggal_renungan">Tanggal</label>
                  <div className="manage-field__control">
                    <input id="tanggal_renungan" name="tanggal_renungan" type="date" className="manage-input" value={form.tanggal_renungan} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field">
                  <label className="manage-field__label" htmlFor="status_renungan">Status</label>
                  <div className="manage-field__control">
                    <select id="status_renungan" name="status_renungan" className="manage-select" value={form.status_renungan} onChange={handleChange} disabled={saving}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISH">Publish</option>
                    </select>
                    <span className="manage-field__chevron"><IconChevron /></span>
                  </div>
                </div>
                <div className="manage-field manage-field--full">
                  <label className="manage-field__label" htmlFor="nats_renungan">Nats (kutipan ayat)</label>
                  <div className="manage-field__control">
                    <textarea id="nats_renungan" name="nats_renungan" className="manage-textarea" style={{ minHeight: '80px' }} value={form.nats_renungan} onChange={handleChange} disabled={saving} />
                  </div>
                </div>
                <div className="manage-field manage-field--full">
                  <label className="manage-field__label" htmlFor="isi_renungan">Isi Renungan</label>
                  <div className="manage-field__control">
                    <textarea id="isi_renungan" name="isi_renungan" className="manage-textarea" style={{ minHeight: '180px' }} placeholder="Pisahkan antar paragraf dengan baris baru (Enter)." value={form.isi_renungan} onChange={handleChange} disabled={saving} />
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

      {viewItem && (
        <div className="manage-modal-overlay" onClick={() => setViewItem(null)}>
          <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal__header">
              <h2 className="manage-modal__title">Detail Renungan</h2>
              <button type="button" className="manage-modal__close" onClick={() => setViewItem(null)}><IconClose /></button>
            </div>
            <div className="manage-detail">
              <div className="manage-detail__row">
                <span className="manage-detail__label">Judul</span>
                <span className="manage-detail__value">{viewItem.judul_renungan}</span>
              </div>
              <div className="manage-detail__row">
                <span className="manage-detail__label">Bacaan</span>
                <span className="manage-detail__value">{viewItem.bacaan_renungan}</span>
              </div>
              <div className="manage-detail__row">
                <span className="manage-detail__label">Nats</span>
                <span className="manage-detail__value">{viewItem.nats_renungan}</span>
              </div>
              <div className="manage-detail__row">
                <span className="manage-detail__label">Penulis</span>
                <span className="manage-detail__value">{viewItem.penulis_renungan}</span>
              </div>
              <div className="manage-detail__row">
                <span className="manage-detail__label">Tanggal</span>
                <span className="manage-detail__value">{formatTanggal(viewItem.tanggal_renungan)}</span>
              </div>
              <div className="manage-detail__row">
                <span className="manage-detail__label">Status</span>
                <span className="manage-detail__value">{viewItem.status_renungan === 'PUBLISH' ? 'Publish' : 'Draft'}</span>
              </div>
              <div className="manage-detail__row">
                <span className="manage-detail__label">Isi</span>
                <span className="manage-detail__value" style={{ whiteSpace: 'pre-line' }}>{viewItem.isi_renungan}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenunganManagement;
