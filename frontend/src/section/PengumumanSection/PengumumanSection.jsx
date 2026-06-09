import { useEffect, useState } from 'react';
import { publicPengumuman } from '../../services/api';
import './PengumumanSection.css';

const formatTanggal = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

const PengumumanSection = ({ onSelengkapnya }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    publicPengumuman()
      .then((data) => {
        if (!active) return;
        // Ambil warta jemaat terbaru, tampilkan 2 pengumuman teratas di dalamnya
        const latest = (data || [])[0];
        const konten = latest ? latest.konten_pengumuman || [] : [];
        setItems(
          konten.slice(0, 2).map((k) => ({
            id: k.id_kontenPengumuman,
            title: k.judul_pengumuman,
            tanggal: k.tanggal_pembuatan || latest.tanggal_publish,
          }))
        );
      })
      .catch(() => active && setItems([]));
    return () => { active = false; };
  }, []);

  const handleSelengkapnya = (e) => {
    e.preventDefault();
    if (onSelengkapnya) onSelengkapnya();
  };

  return (
    <section id="pengumuman" className="pengumuman">
      <div className="pengumuman__panel">
        <div className="pengumuman__container">
          <div className="pengumuman__left reveal reveal--left">
            <h2 className="pengumuman__title">Pengumuman</h2>
            <p className="pengumuman__subtitle">
              Temukan Pengumuman Terbaru dan Terupdate pada Halaman Ini.
            </p>
            <a href="#all-pengumuman" onClick={handleSelengkapnya} className="pengumuman__btn">
              Selengkapnya
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>

          <div className="pengumuman__right reveal reveal--right reveal--delay-1">
            <div className="pengumuman__card">
              {items.length === 0 ? (
                <div className="pengumuman__item">
                  <p className="pengumuman__item-date">Belum ada pengumuman.</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={item.id}>
                    <div className="pengumuman__item">
                      <h4 className="pengumuman__item-title">{item.title}</h4>
                      <p className="pengumuman__item-date">{formatTanggal(item.tanggal)}</p>
                    </div>
                    {idx < items.length - 1 && <div className="pengumuman__divider" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PengumumanSection;
