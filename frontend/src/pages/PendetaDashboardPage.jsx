import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/UseAuth';
import JamPelayananManagement from './multimedia/JamPelayananManagement';
import PengumumanManagement from './multimedia/PengumumanManagement';
import RenunganManagement from './komisi/RenunganManagement';
import './AdminDashboardPage.css';

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
  </svg>
);
const IconMegaphone = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 11V13H22V11H18ZM16 17.61C16.96 18.32 18.21 19.26 19.2 20C19.6 19.47 20 18.93 20.4 18.4C19.41 17.66 18.16 16.72 17.2 16C16.8 16.54 16.4 17.08 16 17.61ZM20.4 5.6C20 5.07 19.6 4.53 19.2 4C18.21 4.74 16.96 5.68 16 6.39C16.4 6.92 16.8 7.46 17.2 8C18.16 7.28 19.41 6.35 20.4 5.6ZM4 9C2.9 9 2 9.9 2 11V13C2 14.1 2.9 15 4 15H5V19H7V15H8L13 18V6L8 9H4ZM15.5 12C15.5 10.67 14.92 9.47 14 8.65V15.34C14.92 14.53 15.5 13.33 15.5 12Z" fill="currentColor"/>
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

const QUICK_LINKS = [
  { id: 'jam-pelayanan', label: 'Jam Pelayanan', desc: 'Atur jadwal ibadah & pelayan', icon: IconClock },
  { id: 'pengumuman', label: 'Pengumuman', desc: 'Publikasikan warta jemaat', icon: IconMegaphone },
  { id: 'renungan', label: 'Renungan', desc: 'Tulis & terbitkan renungan', icon: IconBook },
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
            Selamat Datang, {currentUser?.displayName || 'Pendeta'}!
          </h1>
          <p className="admin-hero__subtitle">
            Kelola jam pelayanan, pengumuman, dan renungan GKJ Wates dari satu tempat.
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

const PendetaDashboardPage = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardHome onMenuChange={setActiveMenu} />;
      case 'jam-pelayanan':
        return <JamPelayananManagement />;
      case 'pengumuman':
        return <PengumumanManagement />;
      case 'renungan':
        return <RenunganManagement />;
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

export default PendetaDashboardPage;
