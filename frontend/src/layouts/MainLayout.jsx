import { useState, useEffect } from 'react';
import PillNav from '../components/PillNav/PillNav';
import Footer from '../components/footer/Footer';
import useScrollReveal from '../hooks/useScrollReveal';
import './MainLayout.css';

// Item navigasi (tautan hash ke section di landing page)
const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Jadwal Ibadah', href: '#jadwal' },
  { label: 'Pengumuman', href: '#pengumuman' },
  { label: 'Berita', href: '#berita' },
  { label: 'Aktifitas', href: '#aktifitas' },
];

const MainLayout = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Aktifkan scroll reveal observer
  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <PillNav
        logo="/sinode.jpg"
        logoAlt="GKJ Wates"
        brand="GKJ Wates"
        items={NAV_ITEMS}
        baseColor="#395886"
        pillColor="transparent"
        pillTextColor="#395886"
        hoveredPillTextColor="#ffffff"
      />
      <main>{children}</main>
      <Footer />

      {/* Floating Scroll-to-Top Button */}
      <button
        className={`scroll-top ${showScrollTop ? 'scroll-top--visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll ke atas"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </>
  );
};

export default MainLayout;