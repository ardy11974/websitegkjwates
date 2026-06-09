import { useEffect, useState } from 'react';
import { publicRenunganById } from '../services/api';
import './RenunganPage.css';

const formatTanggal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const DetailRenunganPage = ({ onBack, renunganId }) => {
  const [renungan, setRenungan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!renunganId) { setLoading(false); return; }
    let active = true;
    publicRenunganById(renunganId)
      .then((data) => active && setRenungan(data))
      .catch(() => active && setRenungan(null))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [renunganId]);

  const paragraphs = renungan?.isi_renungan
    ? renungan.isi_renungan.split(/\n+/).filter((p) => p.trim())
    : [];

  return (
    <div className="renungan-page">
      <div className="renungan-page__back-wrap">
        <button onClick={onBack} className="renungan-page__back" aria-label="Kembali">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Kembali
        </button>
      </div>

      <div className="renungan-page__container">
        {loading ? (
          <article className="renungan-page__panel">
            <p className="renungan-page__paragraph">Memuat renungan...</p>
          </article>
        ) : !renungan ? (
          <article className="renungan-page__panel">
            <p className="renungan-page__paragraph">Renungan tidak ditemukan.</p>
          </article>
        ) : (
          <article className="renungan-page__panel">
            <span className="renungan-page__eyebrow">RENUNGAN • {(renungan.komisi || '').toUpperCase()}</span>
            <h1 className="renungan-page__title">{renungan.judul_renungan}</h1>

            <div className="renungan-page__divider" />

            <div className="renungan-page__meta">
              <span className="renungan-page__author">Oleh {renungan.penulis_renungan}</span>
              <span className="renungan-page__dot">•</span>
              <span className="renungan-page__date">{formatTanggal(renungan.tanggal_renungan)}</span>
            </div>

            <p className="renungan-page__bacaan">Bacaan: {renungan.bacaan_renungan}</p>

            <p className="renungan-page__quote">"{renungan.nats_renungan}"</p>

            <div className="renungan-page__content">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="renungan-page__paragraph">{p}</p>
              ))}
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default DetailRenunganPage;
