import { useEffect, useState } from 'react';
import { publicBerita, fileUrl } from '../services/api';
import './BeritaPage.css';

const formatTanggal = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

const excerpt = (text, n = 150) =>
  text && text.length > n ? `${text.slice(0, n)}...` : text || '';

const BeritaPage = ({ onBack, onSelectBerita }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    publicBerita()
      .then((data) => active && setItems(data || []))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const handleSelect = (id) => (e) => {
    e.preventDefault();
    if (onSelectBerita) onSelectBerita(id);
  };

  const featured = items[0];
  const lainnya = items.slice(1);

  return (
    <div className="berita-page">
      <div className="berita-page__container">
        <div className="berita-page__header">
          <button onClick={onBack} className="berita-page__back" aria-label="Kembali">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Kembali
          </button>
          <h1 className="berita-page__title">Berita</h1>
          <p className="berita-page__subtitle">
            Temukan berita terbaru seputar GKJ Wates pada halaman ini
          </p>
        </div>

        {loading ? (
          <p className="berita-page__empty">Memuat berita...</p>
        ) : !featured ? (
          <p className="berita-page__empty">Belum ada berita yang dipublikasikan.</p>
        ) : (
          <>
            <article
              className="berita-feat"
              onClick={handleSelect(featured.id_berita)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(featured.id_berita)(e); }
              }}
            >
              <div className="berita-feat__image">
                <img
                  src={fileUrl(featured.gambar_berita)}
                  alt={featured.judul_berita}
                  onError={(e) => { e.target.style.display = 'none'; const fb = e.target.nextElementSibling; if (fb) fb.style.display = 'flex'; }}
                />
                <div className="berita-feat__placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              </div>

              <div className="berita-feat__body">
                <h2 className="berita-feat__title">{featured.judul_berita}</h2>
                <p className="berita-feat__desc">{excerpt(featured.isi_berita, 220)}</p>

                <div className="berita-feat__date">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{formatTanggal(featured.tanggal_berita)}</span>
                </div>

                <a href="#detail-berita" onClick={handleSelect(featured.id_berita)} className="berita-feat__link">
                  Baca Selengkapnya
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </article>

            {lainnya.length > 0 && (
              <section className="berita-others">
                <h2 className="berita-others__title">Berita Lainnya</h2>
                <div className="berita-others__grid">
                  {lainnya.map((item) => (
                    <article
                      key={item.id_berita}
                      className="berita-card"
                      onClick={handleSelect(item.id_berita)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSelect(item.id_berita)(e); }
                      }}
                    >
                      <div className="berita-card__image">
                        <img
                          src={fileUrl(item.gambar_berita)}
                          alt={item.judul_berita}
                          onError={(e) => { e.target.style.display = 'none'; const fb = e.target.nextElementSibling; if (fb) fb.style.display = 'flex'; }}
                        />
                        <div className="berita-card__placeholder">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      </div>

                      <div className="berita-card__body">
                        <h3 className="berita-card__title">{item.judul_berita}</h3>
                        <p className="berita-card__excerpt">{excerpt(item.isi_berita)}</p>
                        <p className="berita-card__date">{formatTanggal(item.tanggal_berita)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BeritaPage;
