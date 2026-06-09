import { useState, useEffect, useMemo } from 'react';
import { publicKegiatan, publicKomisi, fileUrl } from '../services/api';
import './KegiatanPage.css';

const formatTanggal = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

const KegiatanPage = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [komisiList, setKomisiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('SEMUA');

  useEffect(() => {
    let active = true;
    Promise.all([publicKegiatan(), publicKomisi()])
      .then(([keg, kom]) => {
        if (!active) return;
        setItems(keg || []);
        setKomisiList(kom || []);
      })
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  // Filter dari seluruh komisi (tetap tampil walau kegiatannya kosong)
  const filterOptions = useMemo(() => {
    const names = komisiList.map((k) => k.nama_komisi);
    // sertakan komisi yang muncul di data kegiatan walau belum ada di daftar
    items.forEach((k) => {
      const n = k.komisi?.nama_komisi;
      if (n && !names.includes(n)) names.push(n);
    });
    return ['SEMUA', ...names];
  }, [komisiList, items]);

  const filtered =
    activeFilter === 'SEMUA'
      ? items
      : items.filter((k) => k.komisi?.nama_komisi === activeFilter);

  return (
    <div className="kegiatan-page">
      <div className="kegiatan-page__container">
        <div className="kegiatan-page__header">
          <button onClick={onBack} className="kegiatan-page__back" aria-label="Kembali">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Kembali
          </button>
          <h1 className="kegiatan-page__title">Kegiatan</h1>
          <p className="kegiatan-page__subtitle">
            Temukan berbagai cara kita berkumpul, bertumbuh, dan melayani bersama. Jelajahi sesi-sesi mendatang kami dan temukan tempat untuk terhubung dalam komunitas GKJ Wates.
          </p>
        </div>

        {filterOptions.length > 1 && (
          <div className="kegiatan-page__filters">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`kegiatan-filter ${activeFilter === opt ? 'kegiatan-filter--active' : ''}`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <div className="kegiatan-page__grid">
          {filtered.map((item) => (
            <article key={item.id_kegiatan} className="kegiatan-card">
              <div className="kegiatan-card__image">
                <img
                  src={fileUrl(item.gambar_kegiatan)}
                  alt={item.judul_kegiatan}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fb = e.target.nextElementSibling;
                    if (fb) fb.style.display = 'flex';
                  }}
                />
                <div className="kegiatan-card__placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="42" height="42">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <span className="kegiatan-card__badge">{item.komisi?.nama_komisi || 'Umum'}</span>
              </div>

              <div className="kegiatan-card__body">
                <h3 className="kegiatan-card__title">{item.judul_kegiatan}</h3>
                <p className="kegiatan-card__desc">{item.deskripsi_kegiatan}</p>

                <div className="kegiatan-card__meta">
                  <span className="kegiatan-card__meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {formatTanggal(item.tanggal_kegiatan)}
                  </span>
                  <span className="kegiatan-card__meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {item.lokasi_kegiatan}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p className="kegiatan-page__empty">Belum ada kegiatan untuk kategori ini.</p>
        )}
      </div>
    </div>
  );
};

export default KegiatanPage;
