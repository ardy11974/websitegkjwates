import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/UseAuth';
import { confirmAction } from '../utils/swal';
import './DashboardLayout.css';

// Icon components
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
  </svg>
);

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

const IconActivity = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
  </svg>
);

const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM6 4H11V12L8.5 10.5L6 12V4Z" fill="currentColor"/>
  </svg>
);

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 4V20C2 21.1 2.9 22 4 22H12V20H4V5Z" fill="currentColor"/>
  </svg>
);

const IconPersonCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
  </svg>
);

const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
  </svg>
);

const IconDocument = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor"/>
  </svg>
);

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
    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14Z" fill="currentColor"/>
  </svg>
);

const IconNewspaper = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 3L20 1.5L18 3L16 1.5L14 3L12 1.5L10 3L8 1.5L6 3L4 1.5V19C4 20.66 5.34 22 7 22H19C20.66 22 22 20.66 22 19V3ZM13 19H7V17H13V19ZM13 15H7V13H13V15ZM13 11H7V9H13V11ZM19 19H15V13H19V19ZM19 11H15V9H19V11Z" fill="currentColor"/>
  </svg>
);

// Menu configurations per role
const MENU_CONFIG = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: IconHome },
    { id: 'user', label: 'User', icon: IconUser },
    { id: 'kritik-saran', label: 'Kritik & Saran', icon: IconMail },
    { id: 'kemajelisan', label: 'Kemajelisan', icon: IconGroup },
    { id: 'komisi', label: 'Komisi', icon: IconActivity },
    { id: 'kategori', label: 'Kategori Berita', icon: IconNewspaper },
    { id: 'persyaratan', label: 'Persyaratan', icon: IconDocument },
    { id: 'pengaturan', label: 'Pengaturan Web', icon: IconSettings },
  ],
  kompa: [
    { id: 'dashboard', label: 'Dashboard', icon: IconHome },
    { id: 'kegiatan', label: 'Kegiatan', icon: IconActivity },
    { id: 'renungan', label: 'Renungan', icon: IconBook },
  ],
  komnak: [
    { id: 'dashboard', label: 'Dashboard', icon: IconHome },
    { id: 'kegiatan', label: 'Kegiatan', icon: IconActivity },
    { id: 'renungan', label: 'Renungan', icon: IconBook },
  ],
  multimedia: [
    { id: 'dashboard', label: 'Dashboard', icon: IconHome },
    { id: 'jam-pelayanan', label: 'Jam Pelayanan', icon: IconClock },
    { id: 'sorotan', label: 'Sorotan', icon: IconStar },
    { id: 'pengumuman', label: 'Pengumuman', icon: IconMegaphone },
    { id: 'kegiatan', label: 'Kegiatan', icon: IconCalendar },
    { id: 'berita', label: 'Berita', icon: IconNewspaper },
  ],
  pendeta: [
    { id: 'dashboard', label: 'Dashboard', icon: IconHome },
    { id: 'jam-pelayanan', label: 'Jam Pelayanan', icon: IconClock },
    { id: 'pengumuman', label: 'Pengumuman', icon: IconMegaphone },
    { id: 'renungan', label: 'Renungan', icon: IconBook },
  ],
};

const isMobileView = () =>
  typeof window !== 'undefined' && window.innerWidth <= 900;

const DashboardLayout = ({ children, activeMenu, onMenuChange, onLogout }) => {
  const { currentUser } = useAuth();
  // Di mobile sidebar mulai tertutup (rail) agar tidak merusak lebar konten
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobileView());

  const menus = MENU_CONFIG[currentUser?.role] || [];

  // Saat memilih menu di mobile, tutup sidebar overlay otomatis
  const handleMenuClick = (id) => {
    onMenuChange?.(id);
    if (isMobileView()) setSidebarOpen(false);
  };

  // Saat MELINTASI breakpoint (bukan tiap resize), sesuaikan keadaan sidebar:
  // tutup saat masuk mobile, buka saat kembali ke desktop.
  useEffect(() => {
    let wasMobile = isMobileView();
    const onResize = () => {
      const nowMobile = isMobileView();
      if (nowMobile !== wasMobile) {
        setSidebarOpen(!nowMobile);
        wasMobile = nowMobile;
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = async () => {
    const ok = await confirmAction({
      title: 'Keluar dari akun?',
      text: 'Anda perlu login kembali untuk mengakses dashboard.',
      confirmText: 'Ya, keluar',
      cancelText: 'Batal',
    });
    if (ok && onLogout) onLogout();
  };

  return (
    <div className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__header">
          <div className="dashboard-sidebar__brand">
            <div className="dashboard-sidebar__logo">
              <img src="/sinode.jpg" alt="Logo Sinode GKJ" />
            </div>
            <span className="dashboard-sidebar__title">GKJ Wates</span>
          </div>
          <button
            type="button"
            className="dashboard-sidebar__toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <IconMenu />
          </button>
        </div>

        <nav className="dashboard-sidebar__nav">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const isActive = activeMenu === menu.id;
            return (
              <button
                key={menu.id}
                type="button"
                className={`dashboard-menu-item ${isActive ? 'dashboard-menu-item--active' : ''}`}
                onClick={() => handleMenuClick(menu.id)}
              >
                <span className="dashboard-menu-item__icon">
                  <Icon />
                </span>
                <span className="dashboard-menu-item__label">{menu.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Backdrop (mobile): klik untuk menutup sidebar overlay */}
      <div
        className="dashboard-backdrop"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Main wrapper */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header__user">
            <div className="dashboard-header__avatar">
              <IconPersonCircle />
            </div>
            <span className="dashboard-header__name">
              {currentUser?.username || 'User'}
            </span>
          </div>
          <button
            type="button"
            className="dashboard-header__logout"
            onClick={handleLogout}
          >
            <IconLogout />
            <span>Logout</span>
          </button>
        </header>

        {/* Content */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;