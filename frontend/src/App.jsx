import { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { toastInfo } from './utils/toast';
import { AuthProvider, useAuth } from './hooks/UseAuth';
import { PengaturanProvider } from './hooks/UsePengaturan';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import BeritaPage from './pages/BeritaPage';
import DetailBeritaPage from './pages/DetailBeritaPage';
import PengumumanPage from './pages/PengumumanPage';
import RenunganPage from './pages/RenunganPage';
import DetailRenunganPage from './pages/DetailRenunganPage';
import KemajelisanPage from './pages/KemajelisanPage';
import KegiatanPage from './pages/KegiatanPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import KompaDashboardPage from './pages/KompaDashboardPage';
import KomnakDashboardPage from './pages/KomnakDashboardPage';
import MultimediaDashboardPage from './pages/MultimediaDashboardPage';
import PendetaDashboardPage from './pages/PendetaDashboardPage';

function AppContent() {
  const { currentUser, logout, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [detailFrom, setDetailFrom] = useState('home');
  const [selectedBeritaId, setSelectedBeritaId] = useState(null);
  const [selectedRenunganId, setSelectedRenunganId] = useState(null);

  // Manajemen scroll terpusat: simpan posisi tiap halaman, agar saat menekan
  // "Kembali" posisi scroll dipulihkan (bukan loncat ke atas), sementara saat
  // membuka halaman baru selalu mulai dari atas.
  const scrollPositions = useRef({});
  const pendingRestore = useRef(false);

  useEffect(() => {
    const saved = scrollPositions.current[currentPage];
    if (pendingRestore.current && typeof saved === 'number') {
      // Tunggu konten ter-render dulu sebelum memulihkan posisi
      requestAnimationFrame(() =>
        requestAnimationFrame(() => window.scrollTo(0, saved))
      );
    } else {
      window.scrollTo(0, 0);
    }
    pendingRestore.current = false;
  }, [currentPage]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'login') setCurrentPage('login');
      else if (hash === 'dashboard') setCurrentPage('dashboard');
      else if (hash === 'all-berita') setCurrentPage('berita');
      else if (hash.startsWith('detail-berita')) setCurrentPage('detail-berita');
      else if (hash === 'all-pengumuman') setCurrentPage('pengumuman');
      else if (hash.startsWith('detail-renungan')) setCurrentPage('detail-renungan');
      else if (hash === 'renungan') setCurrentPage('renungan');
      else if (hash === 'kemajelisan') setCurrentPage('kemajelisan');
      else if (hash === 'kegiatan') setCurrentPage('kegiatan');
      else setCurrentPage('home');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page, { restore = false } = {}) => {
    // Simpan posisi scroll halaman yang ditinggalkan
    scrollPositions.current[currentPage] = window.scrollY;
    pendingRestore.current = restore;

    const hashMap = {
      login: 'login',
      dashboard: 'dashboard',
      berita: 'all-berita',
      'detail-berita': 'detail-berita',
      pengumuman: 'all-pengumuman',
      renungan: 'renungan',
      'detail-renungan': 'detail-renungan',
      kemajelisan: 'kemajelisan',
      kegiatan: 'kegiatan',
    };
    window.location.hash = hashMap[page] || '';
    setCurrentPage(page);
  };

  const openDetailBerita = (from, id) => {
    setDetailFrom(from);
    if (id != null) setSelectedBeritaId(id);
    handleNavigate('detail-berita');
  };

  const openDetailRenungan = (from, id) => {
    setDetailFrom(from);
    if (id != null) setSelectedRenunganId(id);
    handleNavigate('detail-renungan');
  };

  const backFromDetail = () => handleNavigate(detailFrom, { restore: true });
  const backToHome = () => handleNavigate('home', { restore: true });

  const handleLoginSuccess = () => {
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    logout();
    handleNavigate('login');
    toastInfo('Anda telah keluar dari akun');
  };

  // Tunggu sampai session selesai di-cek
  if (isLoading) {
    return null;
  }

  // ====== LOGIN PAGE ======
  if (currentPage === 'login' && !currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // ====== DASHBOARD ======
  // Belum login tapi mencoba akses dashboard → redirect ke login
  if (currentPage === 'dashboard' && !currentUser) {
    handleNavigate('login');
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Sudah login → render dashboard sesuai role
  if (currentPage === 'dashboard' && currentUser) {
    if (currentUser.role === 'admin') {
      return <AdminDashboardPage onLogout={handleLogout} />;
    }
    if (currentUser.role === 'kompa') {
      return <KompaDashboardPage onLogout={handleLogout} />;
    }
    if (currentUser.role === 'komnak') {
      return <KomnakDashboardPage onLogout={handleLogout} />;
    }
    if (currentUser.role === 'multimedia') {
      return <MultimediaDashboardPage onLogout={handleLogout} />;
    }
    if (currentUser.role === 'pendeta') {
      return <PendetaDashboardPage onLogout={handleLogout} />;
    }
  }

  // ====== PUBLIC PAGES ======
  const renderPage = () => {
    if (currentPage === 'detail-berita')
      return <DetailBeritaPage onBack={backFromDetail} beritaId={selectedBeritaId} />;
    if (currentPage === 'berita')
      return (
        <BeritaPage
          onBack={backToHome}
          onSelectBerita={(id) => openDetailBerita('berita', id)}
        />
      );
    if (currentPage === 'pengumuman')
      return <PengumumanPage onBack={backToHome} />;
    if (currentPage === 'detail-renungan')
      return <DetailRenunganPage onBack={backFromDetail} renunganId={selectedRenunganId} />;
    if (currentPage === 'renungan')
      return (
        <RenunganPage
          onBack={backToHome}
          onSelectRenungan={(id) => openDetailRenungan('renungan', id)}
        />
      );
    if (currentPage === 'kemajelisan')
      return <KemajelisanPage onBack={backToHome} />;
    if (currentPage === 'kegiatan')
      return <KegiatanPage onBack={backToHome} />;

    return (
      <LandingPage
        onNavigateBerita={() => handleNavigate('berita')}
        onSelectBerita={(id) => openDetailBerita('home', id)}
        onNavigatePengumuman={() => handleNavigate('pengumuman')}
        onNavigateRenungan={() => handleNavigate('renungan')}
        onNavigateKemajelisan={() => handleNavigate('kemajelisan')}
        onNavigateKegiatan={() => handleNavigate('kegiatan')}
        onNavigateLogin={() => handleNavigate('login')}
      />
    );
  };

  return <MainLayout onNavigateLogin={() => handleNavigate('login')}>{renderPage()}</MainLayout>;
}

function App() {
  return (
    <AuthProvider>
      <PengaturanProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '14px',
              background: '#ffffff',
              color: '#1e293b',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              boxShadow: '0 12px 32px -12px rgba(57, 88, 134, 0.45)',
              border: '1px solid #D5DEEF',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </PengaturanProvider>
    </AuthProvider>
  );
}

export default App;