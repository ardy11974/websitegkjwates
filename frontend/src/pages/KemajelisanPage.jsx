import { useEffect, useMemo, useState } from 'react';
import { publicKemajelisan, fileUrl } from '../services/api';
import './KemajelisanPage.css';

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MemberCard = ({ item, featured }) => {
  const [err, setErr] = useState(false);
  const src = fileUrl(item.foto_kemajelisan);
  return (
    <div className={`kmj-card ${featured ? 'kmj-card--featured' : ''}`}>
      <div className="kmj-card__photo">
        {src && !err ? (
          <img src={src} alt={item.nama_kemajelisan} loading="lazy" onError={() => setErr(true)} />
        ) : (
          <span className="kmj-card__placeholder"><PersonIcon /></span>
        )}
      </div>
      <div className="kmj-card__info">
        <span className="kmj-card__position">{item.jabatan_kemajelisan}</span>
        <span className="kmj-card__name">{item.nama_kemajelisan}</span>
      </div>
    </div>
  );
};

const KemajelisanPage = ({ onBack }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePeriode, setActivePeriode] = useState(null);

  useEffect(() => {
    let active = true;
    publicKemajelisan()
      .then((data) => active && setItems(data || []))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  // Daftar periode (terbaru dulu)
  const periodeList = useMemo(() => {
    const set = new Set(items.map((m) => m.periode_kemajelisan).filter(Boolean));
    return Array.from(set).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  }, [items]);

  // Default ke periode terbaru
  const selectedPeriode = activePeriode ?? periodeList[0] ?? null;

  // Kelompokkan per "urutan" => tiap urutan adalah satu tingkat (baris) struktur
  const tiers = useMemo(() => {
    const list = selectedPeriode
      ? items.filter((m) => m.periode_kemajelisan === selectedPeriode)
      : items;
    const map = new Map();
    for (const m of list) {
      const key = m.urutan_kemajelisan ?? 0;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(m);
    }
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([urutan, list]) => ({ urutan, list }));
  }, [items, selectedPeriode]);

  const hasMembers = tiers.length > 0;

  return (
    <div className="kemajelisan-page">
      <div className="kemajelisan-page__container">
        <div className="kemajelisan-page__header">
          <button onClick={onBack} className="kemajelisan-page__back" aria-label="Kembali">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="20" height="20">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Kembali
          </button>
          <h1 className="kemajelisan-page__title">Kemajelisan</h1>
          <p className="kemajelisan-page__subtitle">
            Individu-individu berdedikasi yang melayani jemaat dan membimbing
            perjalanan spiritual dan operasional GKJ Wates.
          </p>
        </div>

        {periodeList.length > 1 && (
          <div className="kmj-filters">
            {periodeList.map((p) => (
              <button
                key={p}
                className={`kmj-filter ${selectedPeriode === p ? 'kmj-filter--active' : ''}`}
                onClick={() => setActivePeriode(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="kemajelisan-page__panel">
          {loading ? (
            <p className="kmj-empty">Memuat data kemajelisan...</p>
          ) : !hasMembers ? (
            <p className="kmj-empty">Belum ada data kemajelisan.</p>
          ) : (
            <>
              <h2 className="kmj-panel-title">
                Struktur Kemajelisan{selectedPeriode ? ` Periode ${selectedPeriode}` : ''}
              </h2>

              <div className="kmj-structure">
                {tiers.map((tier, idx) => (
                  <div key={tier.urutan} className="kmj-tier-block">
                    <div className={`kmj-tier ${idx === 0 ? 'kmj-tier--top' : ''}`}>
                      {tier.list.map((m) => (
                        <MemberCard
                          key={m.id_kemajelisan}
                          item={m}
                          featured={idx === 0 && tier.list.length === 1}
                        />
                      ))}
                    </div>
                    {idx < tiers.length - 1 && <div className="kmj-connector" aria-hidden="true" />}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default KemajelisanPage;
