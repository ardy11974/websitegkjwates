import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/UseAuth';
import JamPelayananManagement from './multimedia/JamPelayananManagement';
import SorotanManagement from './multimedia/SorotanManagement';
import PengumumanManagement from './multimedia/PengumumanManagement';
import KegiatanManagement from './multimedia/KegiatanManagement';
import BeritaManagement from './multimedia/BeritaManagement';
import './AdminDashboardPage.css';

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor"/>
  </svg>
);
const IconMegaphone = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 11V13H22V11H18ZM16 17.61C16.96 18.32 18.21 19.26 19.2 20C19.6 19.47 20 18.93 20.4 18.4C19.41 17.66 18.16 16.72 17.2 16C16.8 16.54 16.4 17.08 16 17.61ZM20.4 5.6C20 5.07 19.6 4.53 19.2 4C18.21 4.74 16.96 5.68 16 6.39C16.4 6.92 16.8 7.46 17.2 8C18.16 7.28 19.41 6.35 20.4 5.6ZM4 9C2.9 9 2 9.9 2 11V13C2 14.1 2.9 15 4 15H5V19H7V15H8L13 18V6L8 9H4ZM15.5 12C15.5 10.67 14.92 9.47 14 8.65V15.34C14.92 14.53 15.5 13.33 15.5 12Z" fill="currentColor"/>
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="currentColor"/>
  </svg>
);
const IconNewspaper = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 3L20 1.5L18 3L16 1.5L14 3L12 1.5L10 3L8 1.5L6 3L4 1.5V19C4 20.66 5.34 22 7 22H19C20.66 22 22 20.66 22 19V3ZM13 19H7V17H13V19ZM13 15H7V13H13V15ZM13 11H7V9H13V11ZM19 19H15V13H19V19ZM19 11H15V9H19V11Z" fill="currentColor"/>
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const QUICK_LINKS = [
  { id: 'jam-pelayanan', label: 'Jam Pelayanan', desc: 'Atur jadwal ibadah & pelayan', icon: IconClock },
  { id: 'sorotan', label: 'Sorotan', desc: 'Kelola galeri sorotan gambar', icon: IconStar },
  { id: 'pengumuman', label: 'Pengumuman', desc: 'Publikasikan pengumuman jemaat', icon: IconMegaphone },
  { id: 'kegiatan', label: 'Kegiatan', desc: 'Kelola kegiatan & dokumentasi', icon: IconCalendar },
  { id: 'berita', label: 'Berita', desc: 'Tulis & terbitkan berita gereja', icon: IconNewspaper },
];

const formatTanggal = () =>
  new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const DashboardHome = ({ onMenuChange }) => {
  const { currentUser } = useAuth();
  return (
    <div className="dashboard-page admin-home">
      <section className="admin-hero">
        <div className="admin-hero__content">
          <span className="admin-hero__date">{formatTanggal()}</span>
          <h1 className="admin-hero__greeting">
            Selamat Datang, {currentUser?.displayName || 'Multimedia'}!
          </h1>
          <p className="admin-hero__subtitle">
            Kelola konten yang tampil di website GKJ Wates dari satu tempat.
          </p>
        </div>
        <div className="admin-hero__decor" aria-hidden="true">
          <img src="/sinode.jpg" alt="" />
        </div>
      </section>

      <section className="admin-quick">
        <h2 className="admin-quick__title">Akses Cepat</h2>
        <div className="admin-quick__grid">
          {QUICK_LINKS.map((item) => {
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

const MultimediaDashboardPage = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardHome onMenuChange={setActiveMenu} />;
      case 'jam-pelayanan':
        return <JamPelayananManagement />;
      case 'sorotan':
        return <SorotanManagement />;
      case 'pengumuman':
        return <PengumumanManagement />;
      case 'kegiatan':
        return <KegiatanManagement />;
      case 'berita':
        return <BeritaManagement />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout activeMenu={activeMenu} onMenuChange={setActiveMenu} onLogout={onLogout}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default MultimediaDashboardPage;
