import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/UseAuth';
import UserManagement from './admin/UserManagement';
import KritikSaranManagement from './admin/KritikSaranManagement';
import KemajelisanManagement from './admin/KemajelisanManagement';
import KomisiManagement from './admin/KomisiManagement';
import KategoriManagement from './admin/KategoriManagement';
import PersyaratanManagement from './admin/PersyaratanManagement';
import PengaturanWeb from './admin/PengaturanWeb';
import './AdminDashboardPage.css';

// ====== Icons ======
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
  </svg>
);

const IconGroup = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor"/>
  </svg>
);

const IconCog = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
  </svg>
);

const IconActivity = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
  </svg>
);

const IconNews = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 3L20 1.5L18 3L16 1.5L14 3L12 1.5L10 3L8 1.5L6 3L4 1.5V19C4 20.66 5.34 22 7 22H19C20.66 22 22 20.66 22 19V3ZM13 19H7V17H13V19ZM13 15H7V13H13V15ZM13 11H7V9H13V11ZM19 19H15V13H19V19ZM19 11H15V9H19V11Z" fill="currentColor"/>
  </svg>
);

const QUICK_LINKS = [
  {
    id: 'user',
    label: 'Manajemen User',
    desc: 'Kelola akun & hak akses pengguna',
    icon: IconUser,
  },
  {
    id: 'kritik-saran',
    label: 'Kritik & Saran',
    desc: 'Baca pesan masuk dari jemaat',
    icon: IconMail,
  },
  {
    id: 'kemajelisan',
    label: 'Kemajelisan',
    desc: 'Atur data & struktur kemajelisan',
    icon: IconGroup,
  },
  {
    id: 'komisi',
    label: 'Komisi',
    desc: 'Kelola komisi untuk kategori kegiatan',
    icon: IconActivity,
  },
  {
    id: 'kategori',
    label: 'Kategori Berita',
    desc: 'Kelola kategori untuk berita',
    icon: IconNews,
  },
  {
    id: 'persyaratan',
    label: 'Persyaratan',
    desc: 'Kelola dokumen PDF persyaratan',
    icon: IconDoc,
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan Web',
    desc: 'Profil gereja, kontak & media sosial',
    icon: IconCog,
  },
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
      {/* Welcome hero */}
      <section className="admin-hero">
        <div className="admin-hero__content">
          <span className="admin-hero__date">{formatTanggal()}</span>
          <h1 className="admin-hero__greeting">
            Selamat Datang, {currentUser?.displayName || 'Admin'}!
          </h1>
          <p className="admin-hero__subtitle">
            Kelola konten dan data website GKJ Wates dari satu tempat.
          </p>
        </div>
        <div className="admin-hero__decor" aria-hidden="true">
          <img src="/sinode.jpg" alt="" />
        </div>
      </section>

      {/* Quick access */}
      <section className="admin-quick">
        <h2 className="admin-quick__title">Akses Cepat</h2>
        <div className="admin-quick__grid">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className="admin-quick-card"
                onClick={() => onMenuChange?.(item.id)}
              >
                <span className="admin-quick-card__icon">
                  <Icon />
                </span>
                <span className="admin-quick-card__body">
                  <span className="admin-quick-card__label">{item.label}</span>
                  <span className="admin-quick-card__desc">{item.desc}</span>
                </span>
                <span className="admin-quick-card__arrow">
                  <IconArrow />
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const AdminDashboardPage = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardHome onMenuChange={setActiveMenu} />;
      case 'user':
        return <UserManagement />;
      case 'kritik-saran':
        return <KritikSaranManagement />;
      case 'kemajelisan':
        return <KemajelisanManagement />;
      case 'komisi':
        return <KomisiManagement />;
      case 'kategori':
        return <KategoriManagement />;
      case 'persyaratan':
        return <PersyaratanManagement />;
      case 'pengaturan':
        return <PengaturanWeb />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      activeMenu={activeMenu}
      onMenuChange={setActiveMenu}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
