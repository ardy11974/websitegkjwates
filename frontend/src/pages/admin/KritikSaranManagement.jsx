import { useEffect, useMemo, useState } from 'react';
import {
  getKritikSaran,
  markKritikRead,
  deleteKritikSaran,
} from '../../services/api';
import {
  IconSearch,
  IconEye,
  IconTrash,
  IconClose,
  IconInbox,
} from './icons';
import { swalSuccess, confirmDelete } from '../../utils/swal';
import { toastError } from '../../utils/toast';
import './AdminManage.css';

const formatTanggal = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const KritikSaranManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getKritikSaran();
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
        (k.nama_pengirim || '').toLowerCase().includes(q) ||
        (k.email_pengirim || '').toLowerCase().includes(q) ||
        k.isi_pesan.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openDetail = async (item) => {
    setDetail(item);
    // Tandai sebagai dibaca jika belum
    if (item.status_kritikSaran === 'BELUM_DIBACA') {
      try {
        await markKritikRead(item.id_kritik);
        setItems((prev) =>
          prev.map((k) =>
            k.id_kritik === item.id_kritik
              ? { ...k, status_kritikSaran: 'DIBACA' }
              : k
          )
        );
      } catch {
        // abaikan kegagalan menandai dibaca
      }
    }
  };

  const handleDelete = async (item) => {
    if (!(await confirmDelete('Hapus pesan ini?'))) return;
    try {
      await deleteKritikSaran(item.id_kritik);
      setItems((prev) => prev.filter((k) => k.id_kritik !== item.id_kritik));
      swalSuccess('Pesan dihapus');
    } catch (err) {
      toastError(err.message || 'Gagal menghapus pesan');
    }
  };

  return (
    <div className="manage">
      <h1 className="manage__title">Kritik &amp; Saran</h1>

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
      </div>

      {error && <div className="manage-error">{error}</div>}

      <div className="manage-card">
        {loading ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconInbox /></div>
            <p className="manage-state__text">Memuat data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconInbox /></div>
            <p className="manage-state__title">Belum ada kritik &amp; saran</p>
            <p className="manage-state__text">
              Pesan dari jemaat melalui website akan tampil di sini.
            </p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>No.</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Pesan</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ width: '160px' }}>Tanggal</th>
                <th style={{ width: '130px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id_kritik}>
                  <td>{i + 1}</td>
                  <td>{item.nama_pengirim || 'Anonim'}</td>
                  <td className={!item.email_pengirim ? 'manage-table__muted' : ''}>
                    {item.email_pengirim || '-'}
                  </td>
                  <td className="manage-cell-left">
                    {item.isi_pesan.length > 60
                      ? `${item.isi_pesan.slice(0, 60)}...`
                      : item.isi_pesan}
                  </td>
                  <td>
                    <span
                      className={`manage-badge ${
                        item.status_kritikSaran === 'DIBACA'
                          ? 'manage-badge--read'
                          : 'manage-badge--unread'
                      }`}
                    >
                      {item.status_kritikSaran === 'DIBACA' ? 'Dibaca' : 'Belum'}
                    </span>
                  </td>
                  <td className="manage-table__muted">{formatTanggal(item.created_at)}</td>
                  <td>
                    <div className="manage-actions">
                      <button type="button" className="act-btn act-btn--view" title="Lihat" onClick={() => openDetail(item)}>
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

      {/* ====== DETAIL MODAL ====== */}
      {detail && (
        <div className="manage-modal-overlay" onClick={() => setDetail(null)}>
          <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal__header">
              <h2 className="manage-modal__title">Detail Pesan</h2>
              <button type="button" className="manage-modal__close" onClick={() => setDetail(null)}>
                <IconClose />
              </button>
            </div>
            <div className="manage-detail">
              <div className="manage-detail__row">
                <span className="manage-detail__label">Nama Pengirim</span>
                <span className="manage-detail__value">{detail.nama_pengirim || 'Anonim'}</span>
              </div>
              <div className="manage-detail__row">
                <span className="manage-detail__label">Email</span>
                <span className="manage-detail__value">{detail.email_pengirim || '-'}</span>
              </div>
              <div className="manage-detail__row">
                <span className="manage-detail__label">Tanggal</span>
                <span className="manage-detail__value">{formatTanggal(detail.created_at)}</span>
              </div>
              <div className="manage-detail__row">
                <span className="manage-detail__label">Pesan</span>
                <span className="manage-detail__value">{detail.isi_pesan}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KritikSaranManagement;
