import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import KegiatanManagement from './multimedia/KegiatanManagement';
import RenunganManagement from './komisi/RenunganManagement';
import KomisiDashboardHome from './komisi/KomisiDashboardHome';

const KomnakDashboardPage = ({ onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <KomisiDashboardHome komisiName="Komisi Anak" onMenuChange={setActiveMenu} />;
      case 'kegiatan':
        return <KegiatanManagement />;
      case 'renungan':
        return <RenunganManagement />;
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

export default KomnakDashboardPage;
