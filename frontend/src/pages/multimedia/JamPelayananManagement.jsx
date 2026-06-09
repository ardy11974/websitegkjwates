import { useEffect, useMemo, useState } from 'react';
import {
  getIbadah,
  getIbadahById,
  createIbadah,
  updateIbadah,
  deleteIbadah,
  createJadwal,
  updateJadwal,
  deleteJadwal,
} from '../../services/api';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
  IconChevron,
} from '../admin/icons';
import { swalSuccess, confirmDelete } from '../../utils/swal';
import { toastError } from '../../utils/toast';
import '../admin/AdminManage.css';

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
  </svg>
);
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

const emptyIbadah = { nama_ibadah: '', status_publish_ibadah: 'DRAFT' };
const emptyJadwal = { nama_jadwal: '', jam_ibadah: '', pelayan: '' };

const JamPelayananManagement = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Drill-in
  const [current, setCurrent] = useState(null); // ibadah detail (dengan jadwalIbadah)
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal terpadu: { type: 'ibadah'|'jadwal', mode, data }
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyIbadah);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadList = async () => {
    setLoading(true);
    setError('');
    try {
      setList(await getIbadah());
    } catch (err) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadList(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((ib) => ib.nama_ibadah.toLowerCase().includes(q));
  }, [list, search]);

  const openDetail = async (ibadah) => {
    setDetailLoading(true);
    try {
      const data = await getIbadahById(ibadah.id_ibadah);
      setCurrent(data);
    } catch (err) {
      toastError(err.message || 'Gagal membuka detail');
    } finally {
      setDetailLoading(false);
    }
  };
  const refreshDetail = async () => {
    if (!current) return;
    const data = await getIbadahById(current.id_ibadah);
    setCurrent(data);
  };
  const backToList = () => { setCurrent(null); loadList(); };

  // ===== Modal handlers =====
  const openIbadahCreate = () => { setForm(emptyIbadah); setFormError(''); setModal({ type: 'ibadah', mode: 'create' }); };
  const openIbadahEdit = (ib) => { setForm({ nama_ibadah: ib.nama_ibadah, status_publish_ibadah: ib.status_publish_ibadah }); setFormError(''); setModal({ type: 'ibadah', mode: 'edit', data: ib }); };
  const openJadwalCreate = () => { setForm(emptyJadwal); setFormError(''); setModal({ type: 'jadwal', mode: 'create' }); };
  const openJadwalEdit = (jd) => { setForm({ nama_jadwal: jd.nama_jadwal, jam_ibadah: jd.jam_ibadah, pelayan: jd.pelayan }); setFormError(''); setModal({ type: 'jadwal', mode: 'edit', data: jd }); };
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
      if (modal.type === 'ibadah') {
        if (!form.nama_ibadah.trim()) { setFormError('Nama ibadah harus diisi'); setSaving(false); return; }
        if (modal.mode === 'create') await createIbadah({ nama_ibadah: form.nama_ibadah.trim(), status_publish_ibadah: form.status_publish_ibadah });
        else await updateIbadah(modal.data.id_ibadah, { nama_ibadah: form.nama_ibadah.trim(), status_publish_ibadah: form.status_publish_ibadah });
        if (current && modal.mode === 'edit') await refreshDetail();
        else await loadList();
      } else {
        if (!form.nama_jadwal.trim() || !form.jam_ibadah.trim() || !form.pelayan.trim()) { setFormError('Semua field harus diisi'); setSaving(false); return; }
        if (modal.mode === 'create') await createJadwal({ ...form, nama_jadwal: form.nama_jadwal.trim(), jam_ibadah: form.jam_ibadah.trim(), pelayan: form.pelayan.trim(), id_ibadah: current.id_ibadah });
        else await updateJadwal(modal.data.id_jadwalIbadah, { nama_jadwal: form.nama_jadwal.trim(), jam_ibadah: form.jam_ibadah.trim(), pelayan: form.pelayan.trim() });
        await refreshDetail();
      }
      const label = modal.type === 'ibadah' ? 'Ibadah' : 'Jadwal';
      const verb = modal.mode === 'create' ? 'ditambahkan' : 'diperbarui';
      closeModal();
      swalSuccess(`${label} ${verb}`);
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteIbadah = async (ib) => {
    if (!(await confirmDelete(`Hapus "${ib.nama_ibadah}" beserta seluruh jadwalnya?`))) return;
    try { await deleteIbadah(ib.id_ibadah); await loadList(); swalSuccess('Ibadah dihapus'); } catch (err) { toastError(err.message || 'Gagal menghapus'); }
  };
  const handleDeleteJadwal = async (jd) => {
    if (!(await confirmDelete(`Hapus jadwal "${jd.nama_jadwal}"?`))) return;
    try { await deleteJadwal(jd.id_jadwalIbadah); await refreshDetail(); swalSuccess('Jadwal dihapus'); } catch (err) { toastError(err.message || 'Gagal menghapus'); }
  };

  // ====== DETAIL VIEW ======
  if (current) {
    return (
      <div className="manage">
        <div className="manage-subheader">
          <button type="button" className="manage-back-btn" onClick={backToList}><IconBack /><span>Daftar Ibadah</span></button>
        </div>
        <div className="manage-subheader__title-row">
          <h1 className="manage__title" style={{ marginBottom: 0 }}>{current.nama_ibadah}</h1>
          <span className={`manage-badge ${current.status_publish_ibadah === 'PUBLISH' ? 'manage-badge--read' : 'manage-badge--unread'}`}>
            {current.status_publish_ibadah === 'PUBLISH' ? 'Publish' : 'Draft'}
          </span>
          <button type="button" className="manage-mini-btn" onClick={() => openIbadahEdit(current)}><IconEdit /><span>Edit Ibadah</span></button>
        </div>
        <p className="manage-subheader__hint">Kelola jadwal pelayanan yang ada di dalam ibadah ini.</p>

        <div className="manage-toolbar">
          <div />
          <button type="button" className="manage-add-btn" onClick={openJadwalCreate}><IconPlus /><span>Tambah Jadwal</span></button>
        </div>

        <div className="manage-card">
          {detailLoading ? (
            <div className="manage-state"><div className="manage-state__icon"><IconClock /></div><p className="manage-state__text">Memuat...</p></div>
          ) : current.jadwalIbadah.length === 0 ? (
            <div className="manage-state">
              <div className="manage-state__icon"><IconClock /></div>
              <p className="manage-state__title">Belum ada jadwal</p>
              <p className="manage-state__text">Klik "Tambah Jadwal" untuk menambah ibadah pagi, siang, dst.</p>
            </div>
          ) : (
            <table className="manage-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No.</th>
                  <th>Nama Jadwal</th>
                  <th style={{ width: '120px' }}>Jam</th>
                  <th>Pelayan</th>
                  <th style={{ width: '130px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {current.jadwalIbadah.map((jd, i) => (
                  <tr key={jd.id_jadwalIbadah}>
                    <td>{i + 1}</td>
                    <td>{jd.nama_jadwal}</td>
                    <td>{jd.jam_ibadah}</td>
                    <td>{jd.pelayan}</td>
                    <td>
                      <div className="manage-actions">
                        <button type="button" className="act-btn act-btn--edit" title="Edit" onClick={() => openJadwalEdit(jd)}><IconEdit /></button>
                        <button type="button" className="act-btn act-btn--delete" title="Hapus" onClick={() => handleDeleteJadwal(jd)}><IconTrash /></button>
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
  }

  // ====== LIST VIEW ======
  function renderModal() {
    const isIbadah = modal.type === 'ibadah';
    return (
      <div className="manage-modal-overlay" onClick={closeModal}>
        <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
          <div className="manage-modal__header">
            <h2 className="manage-modal__title">
              {isIbadah ? (modal.mode === 'create' ? 'Tambah Ibadah' : 'Edit Ibadah') : (modal.mode === 'create' ? 'Tambah Jadwal' : 'Edit Jadwal')}
            </h2>
            <button type="button" className="manage-modal__close" onClick={closeModal}><IconClose /></button>
          </div>
          <form onSubmit={handleSave} noValidate>
            {formError && <div className="manage-error">{formError}</div>}
            <div className="manage-form__grid">
              {isIbadah ? (
                <>
                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="nama_ibadah">Nama Ibadah</label>
                    <div className="manage-field__control">
                      <input id="nama_ibadah" name="nama_ibadah" type="text" className="manage-input" placeholder="cth: Ibadah Minggu" value={form.nama_ibadah} onChange={handleChange} disabled={saving} />
                    </div>
                  </div>
                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="status_publish_ibadah">Status (tampil di website)</label>
                    <div className="manage-field__control">
                      <select id="status_publish_ibadah" name="status_publish_ibadah" className="manage-select" value={form.status_publish_ibadah} onChange={handleChange} disabled={saving}>
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
                    <label className="manage-field__label" htmlFor="nama_jadwal">Nama Jadwal</label>
                    <div className="manage-field__control">
                      <input id="nama_jadwal" name="nama_jadwal" type="text" className="manage-input" placeholder="cth: Ibadah Pagi" value={form.nama_jadwal} onChange={handleChange} disabled={saving} />
                    </div>
                  </div>
                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="jam_ibadah">Jam</label>
                    <div className="manage-field__control">
                      <input id="jam_ibadah" name="jam_ibadah" type="text" className="manage-input" placeholder="cth: 07.00" value={form.jam_ibadah} onChange={handleChange} disabled={saving} />
                    </div>
                  </div>
                  <div className="manage-field manage-field--full">
                    <label className="manage-field__label" htmlFor="pelayan">Pelayan</label>
                    <div className="manage-field__control">
                      <input id="pelayan" name="pelayan" type="text" className="manage-input" placeholder="cth: Pdt. Andreas" value={form.pelayan} onChange={handleChange} disabled={saving} />
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

  return (
    <div className="manage">
      <h1 className="manage__title">Jam Pelayanan</h1>
      <p className="manage-subheader__hint" style={{ marginTop: '-14px', marginBottom: '22px' }}>
        Tambah nama ibadah, lalu klik untuk mengelola jadwal pelayanan di dalamnya.
      </p>
      <div className="manage-toolbar">
        <div className="manage-search">
          <input type="text" className="manage-search__input" placeholder="Cari ibadah..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <span className="manage-search__icon"><IconSearch /></span>
        </div>
        <button type="button" className="manage-add-btn" onClick={openIbadahCreate}><IconPlus /><span>Tambah Ibadah</span></button>
      </div>

      {error && <div className="manage-error">{error}</div>}

      <div className="manage-card">
        {loading ? (
          <div className="manage-state"><div className="manage-state__icon"><IconClock /></div><p className="manage-state__text">Memuat data...</p></div>
        ) : filtered.length === 0 ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconClock /></div>
            <p className="manage-state__title">Belum ada ibadah</p>
            <p className="manage-state__text">{search ? 'Tidak ada data yang cocok.' : 'Klik "Tambah Ibadah" untuk memulai.'}</p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>No.</th>
                <th>Nama Ibadah</th>
                <th style={{ width: '120px' }}>Jml Jadwal</th>
                <th style={{ width: '110px' }}>Status</th>
                <th style={{ width: '230px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ib, i) => (
                <tr key={ib.id_ibadah}>
                  <td>{i + 1}</td>
                  <td>{ib.nama_ibadah}</td>
                  <td>{ib._count?.jadwalIbadah ?? 0}</td>
                  <td><span className={`manage-badge ${ib.status_publish_ibadah === 'PUBLISH' ? 'manage-badge--read' : 'manage-badge--unread'}`}>{ib.status_publish_ibadah === 'PUBLISH' ? 'Publish' : 'Draft'}</span></td>
                  <td>
                    <div className="manage-actions">
                      <button type="button" className="manage-mini-btn" onClick={() => openDetail(ib)}><IconList /><span>Kelola Jadwal</span></button>
                      <button type="button" className="act-btn act-btn--edit" title="Edit" onClick={() => openIbadahEdit(ib)}><IconEdit /></button>
                      <button type="button" className="act-btn act-btn--delete" title="Hapus" onClick={() => handleDeleteIbadah(ib)}><IconTrash /></button>
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

export default JamPelayananManagement;
