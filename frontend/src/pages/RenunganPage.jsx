import { useEffect, useMemo, useState } from 'react';
import { publicRenungan } from '../services/api';
import './RenunganPage.css';

const formatTanggal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const excerpt = (text, n = 150) =>
  text && text.length > n ? `${text.slice(0, n)}...` : text || '';

const RenunganPage = ({ onBack, onSelectRenungan }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('SEMUA');

  useEffect(() => {
    let active = true;
    publicRenungan()
      .then((data) => active && setItems(data || []))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filterOptions = useMemo(() => {
    const set = new Set(items.map((r) => r.komisi).filter(Boolean));
    return ['SEMUA', ...Array.from(set)];
  }, [items]);

  const filtered =
    activeFilter === 'SEMUA' ? items : items.filter((r) => r.komisi === activeFilter);

  const handleSelect = (id) => (e) => {
    e.preventDefault();
    if (onSelectRenungan) onSelectRenungan(id);
  };

  return (
    <div className="renungan-list-page">
      <div className="renungan-list-page__container">
        <div className="renungan-list-page__header">
          <button onClick={onBack} className="renungan-list-page__back" aria-label="Kembali">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Kembali
          </button>
          <h1 className="renungan-list-page__title">Renungan</h1>
          <p className="renungan-list-page__subtitle">
            Refleksi dan renungan dari Komisi Pemuda dan Komisi Anak GKJ Wates.
          </p>
        </div>

        {filterOptions.length > 1 && (
          <div className="renungan-list-page__filters">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`renungan-filter ${activeFilter === opt ? 'renungan-filter--active' : ''}`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="renungan-list-page__empty">Memuat renungan...</p>
        ) : filtered.length === 0 ? (
          <p className="renungan-list-page__empty">Belum ada renungan yang dipublikasikan.</p>
        ) : (
          <div className="renungan-list-page__grid">
            {filtered.map((r) => (
              <article
                key={r.id_renungan}
                className="renungan-card"
                onClick={handleSelect(r.id_renungan)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(r.id_renungan)(e); }
                }}
              >
                <span className="renungan-card__badge">{r.komisi}</span>
                <h3 className="renungan-card__title">{r.judul_renungan}</h3>
                <p className="renungan-card__bacaan">{r.bacaan_renungan}</p>
                <p className="renungan-card__excerpt">{excerpt(r.isi_renungan)}</p>
                <div className="renungan-card__meta">
                  <span>{r.penulis_renungan}</span>
                  <span className="renungan-card__dot">•</span>
                  <span>{formatTanggal(r.tanggal_renungan)}</span>
                </div>
                <span className="renungan-card__link">
                  Baca Selengkapnya
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenunganPage;
