import { useEffect, useState } from 'react';
import { publicPersyaratan, fileUrl } from '../../services/api';
import './AktifitasSection.css';

const MATERI_LINK = 'https://lpps.or.id/wp/materi/';
const MAX_PERSYARATAN = 3; // kategori yang langsung tampil di kartu

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="13" height="13">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="12" height="12">
    <path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const AktifitasSection = ({
  onNavigateRenungan,
  onNavigateKemajelisan,
  onNavigateKegiatan,
}) => {
  const [persyaratan, setPersyaratan] = useState([]);
  const [loadingPersyaratan, setLoadingPersyaratan] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    publicPersyaratan()
      .then((data) => active && setPersyaratan(Array.isArray(data) ? data : []))
      .catch(() => active && setPersyaratan([]))
      .finally(() => active && setLoadingPersyaratan(false));
    return () => { active = false; };
  }, []);

  const handleClick = (handler) => (e) => {
    e.preventDefault();
    if (handler) handler();
  };

  const aktifitasData = [
    {
      id: 1,
      title: 'Renungan Mingguan',
      desc: 'Temukan refleksi kehidupan terbaru dan bertumbuh bersama.',
      type: 'text',
      onClick: onNavigateRenungan,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Kemajelisan',
      desc: 'Informasi mengenai struktur kemajelisan yang ada di GKJ Wates',
      type: 'text',
      onClick: onNavigateKemajelisan,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Kegiatan',
      list: ['Sekolah Minggu', 'Komisi Pemuda', 'Multimedia'],
      type: 'list',
      onClick: onNavigateKegiatan,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Persyaratan',
      type: 'persyaratan',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <rect x="8" y="2" width="12" height="16" rx="2"/>
          <path d="M16 6v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2"/>
        </svg>
      ),
    },
    {
      id: 5,
      title: 'Materi Pembinaan',
      desc: 'Temukan berbagai materi pembinaan yang diadaptasi dari LPPS',
      type: 'text',
      link: MATERI_LINK,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
  ];

  // Item link untuk satu persyaratan (kategori -> PDF)
  const PersyaratanLink = ({ item }) => (
    <li>
      <CheckIcon />
      <a href={fileUrl(item.file_pdf)} target="_blank" rel="noreferrer">
        {item.kategori_persyaratan}
        <ExternalIcon />
      </a>
    </li>
  );

  const renderPersyaratan = () => {
    if (loadingPersyaratan) {
      return <p className="aktifitas__card-text">Memuat persyaratan...</p>;
    }
    if (persyaratan.length === 0) {
      return (
        <p className="aktifitas__card-text aktifitas__empty">
          Belum ada persyaratan yang tersedia.
        </p>
      );
    }
    const shown = persyaratan.slice(0, MAX_PERSYARATAN);
    const sisa = persyaratan.length - shown.length;
    return (
      <>
        <ul className="aktifitas__list aktifitas__list--link">
          {shown.map((p) => (
            <PersyaratanLink key={p.id_persyaratan} item={p} />
          ))}
        </ul>
        {sisa > 0 && (
          <button
            type="button"
            className="aktifitas__more"
            onClick={() => setModalOpen(true)}
          >
            Lihat semua ({persyaratan.length})
            <ArrowIcon />
          </button>
        )}
      </>
    );
  };

  const renderBody = (item) => {
    if (item.type === 'persyaratan') return renderPersyaratan();
    if (item.type === 'list') {
      return (
        <ul className="aktifitas__list">
          {item.list.map((li) => (
            <li key={li}><CheckIcon /><span>{li}</span></li>
          ))}
        </ul>
      );
    }
    return <p className="aktifitas__card-text">{item.desc}</p>;
  };

  return (
    <section id="aktifitas" className="aktifitas">
      <div className="aktifitas__container">
        <div className="aktifitas__header">
          <h2 className="aktifitas__title reveal reveal--left">
            Aktifitas &amp; Layanan<br />Gereja
          </h2>
          <p className="aktifitas__subtitle reveal reveal--right reveal--delay-1">
            Jelajahi berbagai cara untuk terlibat, belajar, dan bertumbuh dalam keluarga gereja
          </p>
        </div>

        <div className="aktifitas__grid">
          {aktifitasData.map((item, idx) => (
            <div
              key={item.id}
              className={`aktifitas__card reveal reveal--delay-${(idx % 6) + 1}`}
            >
              <div className="aktifitas__icon">{item.icon}</div>
              <h3 className="aktifitas__card-title">{item.title}</h3>
              {renderBody(item)}
              {(item.type === 'text' || item.type === 'list') &&
                (item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="aktifitas__link"
                  >
                    Baca Selengkapnya
                    <ArrowIcon />
                  </a>
                ) : (
                  <a
                    href="#"
                    onClick={handleClick(item.onClick)}
                    className="aktifitas__link"
                  >
                    Baca Selengkapnya
                    <ArrowIcon />
                  </a>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* ====== MODAL SEMUA PERSYARATAN ====== */}
      {modalOpen && (
        <div className="aktifitas-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="aktifitas-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aktifitas-modal__head">
              <h3 className="aktifitas-modal__title">Persyaratan</h3>
              <button
                type="button"
                className="aktifitas-modal__close"
                onClick={() => setModalOpen(false)}
                aria-label="Tutup"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <p className="aktifitas-modal__sub">
              Pilih kategori untuk membuka berkas PDF persyaratannya.
            </p>
            <ul className="aktifitas-modal__list">
              {persyaratan.map((p) => (
                <li key={p.id_persyaratan}>
                  <a href={fileUrl(p.file_pdf)} target="_blank" rel="noreferrer">
                    <span className="aktifitas-modal__cat">{p.kategori_persyaratan}</span>
                    <ExternalIcon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default AktifitasSection;
