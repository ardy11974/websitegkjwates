import { useEffect, useState } from 'react';
import {
  getPengumuman,
  getPengumumanById,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
  createKonten,
  updateKonten,
  deleteKonten,
} from '../../services/api';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
  IconChevron,
  IconInbox,
  IconEye,
  IconSearch,
} from '../admin/icons';
import { swalSuccess, confirmDelete } from '../../utils/swal';
import { toastError } from '../../utils/toast';
import '../admin/AdminManage.css';

const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconList = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 5H21M9 12H21M9 19H21M4 5H5M4 12H5M4 19H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const toDateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '');
const formatTanggal = (iso) =>
  iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

const emptyWadah = { tanggal: '', status: 'DRAFT' };
const emptyKonten = { judul: '', isi: '', tanggal: '' };

const PengumumanManagement = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [current, setCurrent] = useState(null); // wadah detail (dengan konten)
  const [detailLoading, setDetailLoading] = useState(false);

  const [modal, setModal] = useState(null); // { type: 'wadah'|'konten', mode, data }
  const [form, setForm] = useState(emptyWadah);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [listSearch, setListSearch] = useState('');
  const [kontenSearch, setKontenSearch] = useState('');
  const [viewKonten, setViewKonten] = useState(null);

  const loadList = async () => {
    setLoading(true);
    setError('');
    try {
      setList(await getPengumuman());
    } catch (err) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadList(); }, []);

  const openDetail = async (wadah) => {
    setDetailLoading(true);
    try {
      setCurrent(await getPengumumanById(wadah.id_pengumuman));
    } catch (err) {
      toastError(err.message || 'Gagal membuka detail');
    } finally {
      setDetailLoading(false);
    }
  };
  const refreshDetail = async () => {
    if (!current) return;
    setCurrent(await getPengumumanById(current.id_pengumuman));
  };
  const backToList = () => { setCurrent(null); loadList(); };

  const openWadahCreate = () => { setForm({ ...emptyWadah, tanggal: toDateInput(new Date()) }); setFormError(''); setModal({ type: 'wadah', mode: 'create' }); };
  const openWadahEdit = (w) => { setForm({ tanggal: toDateInput(w.tanggal_publish), status: w.status_pengumuman }); setFormError(''); setModal({ type: 'wadah', mode: 'edit', data: w }); };
  const openKontenCreate = () => { setForm({ ...emptyKonten, tanggal: toDateInput(new Date()) }); setFormError(''); setModal({ type: 'konten', mode: 'create' }); };
  const openKontenEdit = (k) => { setForm({ judul: k.judul_pengumuman, isi: k.isi_pengumuman, tanggal: toDateInput(k.tanggal_pembuatan) }); setFormError(''); setModal({ type: 'konten', mode: 'edit', data: k }); };
  const closeModal = () => { setModal(null); setFormError(''); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (formError) setFormError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      setSaving(true);
      if (modal.type === 'wadah') {
        const payload = { tanggal: form.tanggal || undefined, status: form.status };
        if (modal.mode === 'create') await createPengumuman(payload);
        else await updatePengumuman(modal.data.id_pengumuman, payload);
        if (current && modal.mode === 'edit') await refreshDetail();
        else await loadList();
      } else {
        if (!form.judul.trim() || !form.isi.trim()) { setFormError('Judul dan isi harus diisi'); setSaving(false); return; }
        if (modal.mode === 'create') await createKonten({ id_pengumuman: current.id_pengumuman, judul: form.judul.trim(), isi: form.isi.trim(), tanggal: form.tanggal || undefined });
        else await updateKonten(modal.data.id_kontenPengumuman, { judul: form.judul.trim(), isi: form.isi.trim(), tanggal: form.tanggal || undefined });
        await refreshDetail();
      }
      const label = modal.type === 'wadah' ? 'Pengumuman' : 'Konten';
      const verb = modal.mode === 'create' ? 'ditambahkan' : 'diperbarui';
      closeModal();
      swalSuccess(`${label} ${verb}`);
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWadah = async (w) => {
    if (!(await confirmDelete('Hapus pengumuman ini beserta seluruh kontennya?'))) return;
    try { await deletePengumuman(w.id_pengumuman); await loadList(); swalSuccess('Pengumuman dihapus'); } catch (err) { toastError(err.message || 'Gagal menghapus'); }
  };
  const handleDeleteKonten = async (k) => {
    if (!(await confirmDelete(`Hapus konten "${k.judul_pengumuman}"?`))) return;
    try { await deleteKonten(k.id_kontenPengumuman); await refreshDetail(); swalSuccess('Konten dihapus'); } catch (err) { toastError(err.message || 'Gagal menghapus'); }
  };

  // Filter pencarian
  const q1 = listSearch.trim().toLowerCase();
  const filteredList = !q1
    ? list
    : list.filter((w) => {
        const dateStr = formatTanggal(w.tanggal_publish).toLowerCase();
        const judulStr = w.konten_pengumuman.map((k) => k.judul_pengumuman).join(' ').toLowerCase();
        return dateStr.includes(q1) || judulStr.includes(q1);
      });
  const q2 = kontenSearch.trim().toLowerCase();
  const kontenAll = current ? current.konten_pengumuman : [];
  const filteredKonten = !q2 ? kontenAll : kontenAll.filter((k) => k.judul_pengumuman.toLowerCase().includes(q2));

  function renderViewKonten() {
    return (
      <div className="manage-modal-overlay" onClick={() => setViewKonten(null)}>
        <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
          <div className="manage-modal__header">
            <h2 className="manage-modal__title">Detail Konten</h2>
            <button type="button" className="manage-modal__close" onClick={() => setViewKonten(null)}><IconClose /></button>
          </div>
          <div className="manage-detail">
            <div className="manage-detail__row">
              <span className="manage-detail__label">Judul</span>
              <span className="manage-detail__value">{viewKonten.judul_pengumuman}</span>
            </div>
            <div className="manage-detail__row">
              <span className="manage-detail__label">Tanggal</span>
              <span className="manage-detail__value">{formatTanggal(viewKonten.tanggal_pembuatan)}</span>
            </div>
            <div className="manage-detail__row">
              <span className="manage-detail__label">Isi</span>
              <span className="manage-detail__value" style={{ whiteSpace: 'pre-line' }}>{viewKonten.isi_pengumuman}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderModal() {
    const isWadah = modal.type === 'wadah';
    return (
      <div className="manage-modal-overlay" onClick={closeModal}>
        <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
          <div className="manage-modal__header">
            <h2 className="manage-modal__title">
              {isWadah ? (modal.mode === 'create' ? 'Tambah Pengumuman' : 'Edit Pengumuman') : (modal.mode === 'create' ? 'Tambah Konten' : 'Edit Konten')}
            </h2>
            <button type="button" className="manage-modal__close" onClick={closeModal}><IconClose /></button>
          </div>
          <form onSubmit={handleSave} noValidate>
            {formError && <div className="manage-error">{formError}</div>}
            <div className="manage-form__grid">
              {isWadah ? (
                <>
                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="tanggal">Tanggal Publish</label>
                    <div className="manage-field__control">
                      <input id="tanggal" name="tanggal" type="date" className="manage-input" value={form.tanggal} onChange={handleChange} disabled={saving} />
                    </div>
                  </div>
                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="status">Status (tampil di website)</label>
                    <div className="manage-field__control">
                      <select id="status" name="status" className="manage-select" value={form.status} onChange={handleChange} disabled={saving}>
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISH">Publish</option>
                      </select>
                      <span className="manage-field__chevron"><IconChevron /></span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="judul">Judul</label>
                    <div className="manage-field__control">
                      <input id="judul" name="judul" type="text" className="manage-input" value={form.judul} onChange={handleChange} disabled={saving} />
                    </div>
                  </div>
                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="tanggal">Tanggal</label>
                    <div className="manage-field__control">
                      <input id="tanggal" name="tanggal" type="date" className="manage-input" value={form.tanggal} onChange={handleChange} disabled={saving} />
                    </div>
                  </div>
                  <div className="manage-field manage-field--full">
                    <label className="manage-field__label" htmlFor="isi">Isi</label>
                    <div className="manage-field__control">
                      <textarea id="isi" name="isi" className="manage-textarea" value={form.isi} onChange={handleChange} disabled={saving} />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="manage-modal__actions">
              <button type="submit" className="manage-save-btn" disabled={saving}>
                {saving ? (<><span className="manage-save-btn__spinner"></span><span>Menyimpan...</span></>) : (<><IconPlus /><span>Simpan</span></>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ====== DETAIL VIEW ======
  if (current) {
    return (
      <div className="manage">
        <div className="manage-subheader">
          <button type="button" className="manage-back-btn" onClick={backToList}><IconBack /><span>Daftar Pengumuman</span></button>
        </div>
        <div className="manage-subheader__title-row">
          <h1 className="manage__title" style={{ marginBottom: 0 }}>Pengumuman • {formatTanggal(current.tanggal_publish)}</h1>
          <span className={`manage-badge ${current.status_pengumuman === 'PUBLISH' ? 'manage-badge--read' : 'manage-badge--unread'}`}>
            {current.status_pengumuman === 'PUBLISH' ? 'Publish' : 'Draft'}
          </span>
          <button type="button" className="manage-mini-btn" onClick={() => openWadahEdit(current)}><IconEdit /><span>Edit Wadah</span></button>
        </div>
        <p className="manage-subheader__hint">Isi konten pengumuman di dalam wadah ini. Setiap judul memiliki ID tersendiri.</p>

        <div className="manage-toolbar">
          <div className="manage-search">
            <input type="text" className="manage-search__input" placeholder="Cari konten..." value={kontenSearch} onChange={(e) => setKontenSearch(e.target.value)} />
            <span className="manage-search__icon"><IconSearch /></span>
          </div>
          <button type="button" className="manage-add-btn" onClick={openKontenCreate}><IconPlus /><span>Tambah Konten</span></button>
        </div>

        <div className="manage-card">
          {detailLoading ? (
            <div className="manage-state"><div className="manage-state__icon"><IconInbox /></div><p className="manage-state__text">Memuat...</p></div>
          ) : kontenAll.length === 0 ? (
            <div className="manage-state">
              <div className="manage-state__icon"><IconInbox /></div>
              <p className="manage-state__title">Belum ada konten</p>
              <p className="manage-state__text">Klik "Tambah Konten" untuk mengisi pengumuman.</p>
            </div>
          ) : filteredKonten.length === 0 ? (
            <div className="manage-state">
              <div className="manage-state__icon"><IconInbox /></div>
              <p className="manage-state__title">Tidak ada konten yang cocok</p>
              <p className="manage-state__text">Coba kata kunci lain.</p>
            </div>
          ) : (
            <table className="manage-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No.</th>
                  <th>Judul</th>
                  <th style={{ width: '170px' }}>Tanggal</th>
                  <th style={{ width: '170px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredKonten.map((k, i) => (
                  <tr key={k.id_kontenPengumuman}>
                    <td>{i + 1}</td>
                    <td>{k.judul_pengumuman}</td>
                    <td className="manage-table__muted">{formatTanggal(k.tanggal_pembuatan)}</td>
                    <td>
                      <div className="manage-actions">
                        <button type="button" className="act-btn act-btn--edit" title="Edit" onClick={() => openKontenEdit(k)}><IconEdit /></button>
                        <button type="button" className="act-btn act-btn--view" title="Lihat detail" onClick={() => setViewKonten(k)}><IconEye /></button>
                        <button type="button" className="act-btn act-btn--delete" title="Hapus" onClick={() => handleDeleteKonten(k)}><IconTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {modal && renderModal()}
        {viewKonten && renderViewKonten()}
      </div>
    );
  }

  // ====== LIST VIEW ======
  return (
    <div className="manage">
      <h1 className="manage__title">Pengumuman</h1>
      <p className="manage-subheader__hint" style={{ marginTop: '-14px', marginBottom: '22px' }}>
        Buat wadah pengumuman (tanggal &amp; status), lalu klik untuk mengisi kontennya.
      </p>
      <div className="manage-toolbar">
        <div className="manage-search">
          <input type="text" className="manage-search__input" placeholder="Cari pengumuman..." value={listSearch} onChange={(e) => setListSearch(e.target.value)} />
          <span className="manage-search__icon"><IconSearch /></span>
        </div>
        <button type="button" className="manage-add-btn" onClick={openWadahCreate}><IconPlus /><span>Tambah Pengumuman</span></button>
      </div>

      {error && <div className="manage-error">{error}</div>}

      <div className="manage-card">
        {loading ? (
          <div className="manage-state"><div className="manage-state__icon"><IconInbox /></div><p className="manage-state__text">Memuat data...</p></div>
        ) : list.length === 0 ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconInbox /></div>
            <p className="manage-state__title">Belum ada pengumuman</p>
            <p className="manage-state__text">Klik "Tambah Pengumuman" untuk membuat wadah pengumuman.</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconInbox /></div>
            <p className="manage-state__title">Tidak ada pengumuman yang cocok</p>
            <p className="manage-state__text">Coba kata kunci lain.</p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>No.</th>
                <th style={{ width: '200px' }}>Tanggal Publish</th>
                <th>Konten</th>
                <th style={{ width: '110px' }}>Status</th>
                <th style={{ width: '240px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((w, i) => (
                <tr key={w.id_pengumuman}>
                  <td>{i + 1}</td>
                  <td>{formatTanggal(w.tanggal_publish)}</td>
                  <td className="manage-cell-left">
                    {w.konten_pengumuman.length === 0
                      ? <span className="manage-table__muted">Belum ada konten</span>
                      : `${w.konten_pengumuman.length} konten — ${w.konten_pengumuman.map((k) => k.judul_pengumuman).slice(0, 2).join(', ')}${w.konten_pengumuman.length > 2 ? '...' : ''}`}
                  </td>
                  <td><span className={`manage-badge ${w.status_pengumuman === 'PUBLISH' ? 'manage-badge--read' : 'manage-badge--unread'}`}>{w.status_pengumuman === 'PUBLISH' ? 'Publish' : 'Draft'}</span></td>
                  <td>
                    <div className="manage-actions">
                      <button type="button" className="manage-mini-btn" onClick={() => openDetail(w)}><IconList /><span>Kelola Konten</span></button>
                      <button type="button" className="act-btn act-btn--edit" title="Edit" onClick={() => openWadahEdit(w)}><IconEdit /></button>
                      <button type="button" className="act-btn act-btn--delete" title="Hapus" onClick={() => handleDeleteWadah(w)}><IconTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && renderModal()}
    </div>
  );
};

export default PengumumanManagement;
