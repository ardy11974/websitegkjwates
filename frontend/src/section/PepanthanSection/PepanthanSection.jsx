import { useState } from 'react';
import SplitText from '../../components/SplitText/SplitText';
import './PepanthanSection.css';

// Data pepanthan: koordinat (untuk peta) + tautan Google Maps (share link untuk tombol)
const pepanthanData = [
  {
    id: 1,
    name: 'Pepanthan Kalinongko',
    location: 'Kalinongko, Kedungsari, Kec. Pengasih, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta',
    sundayService: 'Ibadah Raya Minggu : 07.00',
    lat: -7.870688136869883,
    lng: 110.17520705444522,
    mapLink: 'https://maps.app.goo.gl/kro83NQg2ywMemro6',
  },
  {
    id: 2,
    name: 'Pepanthan Cumethuk',
    location: 'Cumetuk, Kedungsari, Kec. Pengasih, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta',
    sundayService: 'Ibadah Raya Minggu : 07.00',
    lat: -7.858778878193929,
    lng: 110.18559891211784,
    mapLink: 'https://maps.app.goo.gl/wTStmwtL7LTgDiJ58',
  },
  {
    id: 3,
    name: 'Pepanthan Sidomulyo',
    location: 'Parakan, Sidomulyo, Kec. Pengasih, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta',
    sundayService: 'Ibadah Raya Minggu : 07.00',
    lat: -7.78835317320451,
    lng: 110.15138599854116,
    mapLink: 'https://maps.app.goo.gl/V4SZYGuXw3YJnSKy5',
  },
  {
    id: 4,
    name: 'Pepanthan Butuh',
    location: 'Bumirejo, Kec. Lendah, Kabupaaten Kulon Progo, Daerah Istimewa Yogyakarta',
    sundayService: 'Ibadah Raya Minggu : 07.00',
    lat: -7.9034385171782775,
    lng: 110.20012871355094,
    mapLink: 'https://maps.app.goo.gl/SEbMEF6eNXAgae7N7',
  },
];

const PepanthanSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  // Arah slide: 'next' (geser ke kiri), 'prev' (geser ke kanan), null (no anim)
  const [slideDir, setSlideDir] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const total = pepanthanData.length;
  const active = pepanthanData[activeIdx];

  // Peta embed (tanpa API key) dari koordinat; tombol memakai share link & rute
  const mapEmbedUrl = `https://maps.google.com/maps?q=${active.lat},${active.lng}&z=16&hl=id&output=embed`;
  const mapLink = active.mapLink;
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${active.lat},${active.lng}`;

  const triggerSlide = (direction, newIdx) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSlideDir(direction);

    // Setelah animasi keluar selesai (300ms), ganti index & reset
    setTimeout(() => {
      setActiveIdx(newIdx);
      setSlideDir(null);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    const newIdx = activeIdx === 0 ? total - 1 : activeIdx - 1;
    triggerSlide('prev', newIdx);
  };

  const handleNext = () => {
    const newIdx = activeIdx === total - 1 ? 0 : activeIdx + 1;
    triggerSlide('next', newIdx);
  };

  const handleDot = (idx) => {
    if (idx === activeIdx || isAnimating) return;
    const direction = idx > activeIdx ? 'next' : 'prev';
    triggerSlide(direction, idx);
  };

  const slideClass = slideDir
    ? `pep-slide pep-slide--out-${slideDir}`
    : 'pep-slide';

  return (
    <section className="pepanthan">
      <div className="pepanthan__container">
        <div style={{ textAlign: 'center' }}>
          <SplitText
            tag="h2"
            className="pepanthan__title"
            text="Pepanthan GKJ Wates"
            splitType="chars"
            delay={28}
            duration={0.8}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="-40px"
            textAlign="center"
          />
        </div>

        <div className="pepanthan__layout">
          {/* ====== KIRI: INFO ====== */}
          <div className="pep-info">
            <div className={slideClass}>
              <h3 className="pep-info__name">{active.name}</h3>
              <div className="pep-info__divider" />

              <div className="pep-info__block">
                <h4 className="pep-info__label">Lokasi</h4>
                <p className="pep-info__text">{active.location}</p>
              </div>

              <div className="pep-info__block">
                <h4 className="pep-info__label">Jadwal Ibadah</h4>
                <p className="pep-info__text">{active.sundayService}</p>
              </div>
            </div>

            <a
              className="pep-info__cta"
              href={mapLink}
              target="_blank"
              rel="noreferrer"
            >
              GO TO LOCATIONS
            </a>
          </div>

          {/* ====== KANAN: PETA GOOGLE MAPS + KARTU INFO ====== */}
          <div className="pep-map">
            {/* Peta embed asli berdasarkan koordinat */}
            <iframe
              key={active.id}
              title={`Peta ${active.name}`}
              className="pep-map__frame"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* Kartu info mengambang di kiri atas */}
            <div className={`pep-map__card ${slideDir ? `pep-slide--out-${slideDir}` : ''}`}>
              <div className="pep-map__card-head">
                <h4 className="pep-map__card-title">{active.name}</h4>
                <div className="pep-map__card-actions">
                  <a className="pep-map__card-btn" href={mapLink} target="_blank" rel="noreferrer" aria-label="Buka di Google Maps">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                  <a className="pep-map__card-btn pep-map__card-btn--primary" href={directionsLink} target="_blank" rel="noreferrer" aria-label="Petunjuk arah">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <p className="pep-map__card-addr">{active.location}</p>
            </div>
          </div>
        </div>

        {/* ====== TOMBOL NAV (di luar map) ====== */}
        <div className="pepanthan__nav-row">
          <button
            className="pepanthan__nav pepanthan__nav--prev"
            onClick={handlePrev}
            disabled={isAnimating}
            aria-label="Pepanthan sebelumnya"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="pepanthan__dots">
            {pepanthanData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDot(idx)}
                className={`pepanthan__dot ${idx === activeIdx ? 'pepanthan__dot--active' : ''}`}
                aria-label={`Pepanthan ${idx + 1}`}
              />
            ))}
          </div>

          <button
            className="pepanthan__nav pepanthan__nav--next"
            onClick={handleNext}
            disabled={isAnimating}
            aria-label="Pepanthan berikutnya"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PepanthanSection;