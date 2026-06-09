import { useAuth } from '../../hooks/UseAuth';
import '../AdminDashboardPage.css';

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="currentColor"/>
  </svg>
);
const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM6 4H11V12L8.5 10.5L6 12V4Z" fill="currentColor"/>
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const formatTanggal = () =>
  new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const KomisiDashboardHome = ({ komisiName, onMenuChange }) => {
  const { currentUser } = useAuth();

  const quickLinks = [
    { id: 'kegiatan', label: 'Kegiatan', desc: `Kelola kegiatan & dokumentasi ${komisiName}`, icon: IconCalendar },
    { id: 'renungan', label: 'Renungan', desc: `Tulis & terbitkan renungan ${komisiName}`, icon: IconBook },
  ];

  return (
    <div className="dashboard-page admin-home">
      <section className="admin-hero">
        <div className="admin-hero__content">
          <span className="admin-hero__date">{formatTanggal()}</span>
          <h1 className="admin-hero__greeting">
            Selamat Datang, {currentUser?.displayName || komisiName}!
          </h1>
          <p className="admin-hero__subtitle">
            Kelola kegiatan dan renungan {komisiName} GKJ Wates dari satu tempat.
          </p>
        </div>
        <div className="admin-hero__decor" aria-hidden="true">
          <img src="/sinode.jpg" alt="" />
        </div>
      </section>

      <section className="admin-quick">
        <h2 className="admin-quick__title">Akses Cepat</h2>
        <div className="admin-quick__grid">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} type="button" className="admin-quick-card" onClick={() => onMenuChange?.(item.id)}>
                <span className="admin-quick-card__icon"><Icon /></span>
                <span className="admin-quick-card__body">
                  <span className="admin-quick-card__label">{item.label}</span>
                  <span className="admin-quick-card__desc">{item.desc}</span>
                </span>
                <span className="admin-quick-card__arrow"><IconArrow /></span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default KomisiDashboardHome;
