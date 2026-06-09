import { useEffect, useState } from 'react';
import { publicPengumuman } from '../services/api';
import './PengumumanPage.css';

const formatTanggal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const PengumumanPage = ({ onBack }) => {
  const [sheets, setSheets] = useState([]); // tiap item = 1 kertas warta jemaat
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0); // 0 = warta terbaru

  useEffect(() => {
    let active = true;
    publicPengumuman()
      .then((data) => active && setSheets(data || []))
      .catch(() => active && setSheets([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  // Maksimal 3 kertas: 1 terbaru + maksimal 2 sebelumnya
  const pool = sheets.slice(0, 3);
  const sheet = pool[index];

  const goOlder = () => setIndex((i) => Math.min(i + 1, pool.length - 1)); // '<' -> sebelumnya
  const goNewer = () => setIndex((i) => Math.max(i - 1, 0)); // '>' -> terbaru

  return (
    <div className="pengumuman-page">
      <div className="pengumuman-page__container">
        <div className="pengumuman-page__header">
          <button onClick={onBack} className="pengumuman-page__back" aria-label="Kembali">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Kembali
          </button>
          <h1 className="pengumuman-page__title">Pengumuman</h1>
          <p className="pengumuman-page__subtitle">
            Warta jemaat GKJ Wates. Gunakan panah untuk melihat warta sebelumnya.
          </p>
        </div>

        {loading ? (
          <div className="pengumuman-page__panel">
            <p className="pengumuman-item__desc">Memuat pengumuman...</p>
          </div>
        ) : pool.length === 0 ? (
          <div className="pengumuman-page__panel">
            <p className="pengumuman-item__desc">Belum ada warta jemaat yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="warta-slider">
            {/* Tombol sebelumnya (warta lebih lama) */}
            <button
              type="button"
              className="warta-slider__nav warta-slider__nav--prev"
              onClick={goOlder}
              disabled={index >= pool.length - 1}
              aria-label="Warta sebelumnya"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <div className="warta-slider__stage">
              <div className="warta" key={sheet.id_pengumuman}>
                <div className="warta__head">
                  <span className="warta__badge">{index === 0 ? 'Warta Terbaru' : 'Warta Sebelumnya'}</span>
                  <span className="warta__date">{formatTanggal(sheet.tanggal_publish)}</span>
                </div>
                <div className="pengumuman-page__panel">
                  {(sheet.konten_pengumuman || []).length === 0 ? (
                    <p className="pengumuman-item__desc">Tidak ada isi pada warta ini.</p>
                  ) : (
                    <ul className="pengumuman-list">
                      {sheet.konten_pengumuman.map((k) => (
                        <li key={k.id_kontenPengumuman} className="pengumuman-item">
                          <h3 className="pengumuman-item__title">{k.judul_pengumuman}</h3>
                          <p className="pengumuman-item__date">{formatTanggal(k.tanggal_pembuatan)}</p>
                          <p className="pengumuman-item__desc">{k.isi_pengumuman}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Indikator posisi */}
                <div className="warta-slider__dots">
                  {pool.map((s, i) => (
                    <span
                      key={s.id_pengumuman}
                      className={`warta-slider__dot ${i === index ? 'warta-slider__dot--active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tombol berikutnya (warta lebih baru) */}
            <button
              type="button"
              className="warta-slider__nav warta-slider__nav--next"
              onClick={goNewer}
              disabled={index <= 0}
              aria-label="Warta lebih baru"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PengumumanPage;
