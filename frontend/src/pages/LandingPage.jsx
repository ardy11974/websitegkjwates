import HeroSection from '../section/HeroSection/HeroSection';
import VisiMisiSection from '../section/VisiMisiSection/VisiMisiSection';
import SejarahSection from '../section/SejarahSection/SejarahSection';
import PepanthanSection from '../section/PepanthanSection/PepanthanSection';
import JadwalSection from '../section/JadwalSection/JadwalSection';
import PengumumanSection from '../section/PengumumanSection/PengumumanSection';
import BeritaSection from '../section/BeritaSection/BeritaSection';
import AktifitasSection from '../section/AktifitasSection/AktifitasSection';
import KritikSaranSection from '../section/KritikSaranSection/KritikSaranSection';
import SorotanSection from '../section/SorotanSection/SorotanSection';

const LandingPage = ({
  onNavigateBerita,
  onSelectBerita,
  onNavigatePengumuman,
  onNavigateRenungan,
  onNavigateKemajelisan,
  onNavigateKegiatan,
}) => {
  return (
    <>
      <HeroSection />
      <VisiMisiSection />
      <SejarahSection />
      <PepanthanSection />
      <JadwalSection />
      <PengumumanSection onSelengkapnya={onNavigatePengumuman} />
      <BeritaSection
        onSelengkapnya={onNavigateBerita}
        onSelectBerita={onSelectBerita}
      />
      <AktifitasSection
        onNavigateRenungan={onNavigateRenungan}
        onNavigateKemajelisan={onNavigateKemajelisan}
        onNavigateKegiatan={onNavigateKegiatan}
      />
      <KritikSaranSection />
      <SorotanSection />
    </>
  );
};

export default LandingPage;