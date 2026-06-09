import { useEffect, useState } from 'react';
import { publicBeritaById, fileUrl } from '../services/api';
import './DetailBeritaPage.css';

const formatTanggal = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

const DetailBeritaPage = ({ onBack, beritaId }) => {
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!beritaId) { setLoading(false); return; }
    let active = true;
    publicBeritaById(beritaId)
      .then((data) => active && setBerita(data))
      .catch(() => active && setBerita(null))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [beritaId]);

  // Pisah isi menjadi paragraf berdasarkan baris baru
  const paragraphs = berita?.isi_berita
    ? berita.isi_berita.split(/\n+/).filter((p) => p.trim())
    : [];

  return (
    <div className="detail-berita">
      <div className="detail-berita__back-wrap">
        <button onClick={onBack} className="detail-berita__back" aria-label="Kembali">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="18" height="18">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Kembali
        </button>
      </div>

      {loading ? (
        <div className="detail-berita__body">
          <div className="detail-berita__container">
            <p className="detail-berita__paragraph">Memuat berita...</p>
          </div>
        </div>
      ) : !berita ? (
        <div className="detail-berita__body">
          <div className="detail-berita__container">
            <p className="detail-berita__paragraph">Berita tidak ditemukan.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="detail-berita__hero">
            <img
              src={fileUrl(berita.gambar_berita)}
              alt={berita.judul_berita}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('detail-berita__hero--fallback');
              }}
            />
          </div>

          <div className="detail-berita__body">
            <div className="detail-berita__container">
              <div className="detail-berita__title-card">
                <h1 className="detail-berita__title">{berita.judul_berita}</h1>

                <div className="detail-berita__meta">
                  <div className="detail-berita__author">
                    <h4 className="detail-berita__meta-label">Penulis</h4>
                    <p className="detail-berita__meta-value">{berita.penulis_berita}</p>
                  </div>
                  <div className="detail-berita__author">
                    <h4 className="detail-berita__meta-label">Tanggal</h4>
                    <p className="detail-berita__meta-value">{formatTanggal(berita.tanggal_berita)}</p>
                  </div>
                </div>
              </div>

              <div className="detail-berita__content">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className="detail-berita__paragraph">{p}</p>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailBeritaPage;
