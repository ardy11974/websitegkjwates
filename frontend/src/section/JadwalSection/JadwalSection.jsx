import { useEffect, useState } from 'react';
import { publicJadwal } from '../../services/api';
import './JadwalSection.css';

// Pilih ikon berdasarkan jam (pagi/siang/sore/malam)
const iconForJam = (jam) => {
  const hour = parseInt(String(jam).replace(/[^0-9]/g, '').slice(0, 2), 10) || 7;
  if (hour < 11) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    );
  }
  if (hour < 15) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    );
  }
  if (hour < 18) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
};

const JadwalSection = () => {
  const [ibadah, setIbadah] = useState([]);

  useEffect(() => {
    let active = true;
    publicJadwal()
      .then((data) => active && setIbadah(data || []))
      .catch(() => active && setIbadah([]));
    return () => { active = false; };
  }, []);

  // Hanya ibadah yang punya jadwal
  const groups = ibadah.filter((ib) => (ib.jadwalIbadah || []).length > 0);
  const showGroupTitle = groups.length > 1;

  return (
    <section id="jadwal" className="jadwal">
      <div className="jadwal__container">
        <div className="jadwal__header">
          <h2 className="jadwal__title reveal reveal--left">Jadwal Ibadah</h2>
          <p className="jadwal__subtitle reveal reveal--right reveal--delay-1">
            Temukan Waktu yang Tepat Untuk Anda Beribadah. Kami Selalu Tersedia Bagi Anda Kapanpun.
          </p>
        </div>

        {groups.length === 0 ? (
          <p className="jadwal__empty">Jadwal ibadah belum tersedia.</p>
        ) : (
          groups.map((ib) => (
            <div key={ib.id_ibadah} className="jadwal__group">
              {showGroupTitle && <h3 className="jadwal__group-title">{ib.nama_ibadah}</h3>}
              <div className="jadwal__grid">
                {ib.jadwalIbadah.map((item, idx) => (
                  <div key={item.id_jadwalIbadah} className={`jadwal__card reveal reveal--delay-${(idx % 4) + 1}`}>
                    <div className="jadwal__icon">{iconForJam(item.jam_ibadah)}</div>
                    <h3 className="jadwal__label">{item.nama_jadwal}</h3>
                    <p className="jadwal__time">{item.jam_ibadah}</p>
                    <p className="jadwal__pdt">"{item.pelayan}"</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default JadwalSection;
