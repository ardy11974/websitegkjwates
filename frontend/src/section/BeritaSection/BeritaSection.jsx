import { useEffect, useState } from 'react';
import { publicBerita, fileUrl } from '../../services/api';
import SplitText from '../../components/SplitText/SplitText';
import './BeritaSection.css';

const excerpt = (text, n = 110) =>
  text && text.length > n ? `${text.slice(0, n)}...` : text || '';

const BeritaSection = ({ onSelengkapnya, onSelectBerita }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    publicBerita()
      .then((data) => active && setItems((data || []).slice(0, 3)))
      .catch(() => active && setItems([]));
    return () => { active = false; };
  }, []);

  const handleSelengkapnya = (e) => {
    e.preventDefault();
    if (onSelengkapnya) onSelengkapnya();
  };

  const handleSelectBerita = (id) => (e) => {
    e.preventDefault();
    if (onSelectBerita) onSelectBerita(id);
  };

  return (
    <section id="berita" className="berita">
      <div className="berita__container">
        <div className="berita__header">
          <SplitText
            tag="h2"
            className="berita__title"
            text="Berita"
            splitType="chars"
            delay={35}
            duration={0.8}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="-40px"
            textAlign="left"
          />
          <a href="#all-berita" onClick={handleSelengkapnya} className="berita__more reveal reveal--right">
            Selengkapnya
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

        {items.length === 0 ? (
          <p className="berita__empty">Belum ada berita yang dipublikasikan.</p>
        ) : (
          <div className="berita__grid">
            {items.map((item, idx) => (
              <article
                key={item.id_berita}
                className={`berita__card reveal reveal--delay-${idx + 1}`}
                onClick={handleSelectBerita(item.id_berita)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectBerita(item.id_berita)(e);
                  }
                }}
              >
                <div className="berita__image">
                  <img
                    src={fileUrl(item.gambar_berita)}
                    alt={item.judul_berita}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('berita__image--fallback');
                    }}
                  />
                </div>
                <div className="berita__body">
                  <h3 className="berita__card-title">{item.judul_berita}</h3>
                  <p className="berita__card-text">{excerpt(item.isi_berita)}</p>
                  <a href="#detail-berita" onClick={handleSelectBerita(item.id_berita)} className="berita__link">
                    Baca Selengkapnya
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BeritaSection;
