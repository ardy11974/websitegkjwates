import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setInfoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sub-menu untuk Informasi
  const informasiSubItems = [
    { label: 'Berita', href: '#berita' },
    { label: 'Aktifitas', href: '#aktifitas' },
  ];

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Jadwal Ibadah', href: '#jadwal' },
    { label: 'Pengumuman', href: '#pengumuman' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* LOGO — slot untuk gambar logo tanpa background */}
        <a href="#home" className="navbar__logo">
          <img
            src="/sinode.jpg"
            alt="GKJ Wates"
            className="navbar__logo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = e.target.nextElementSibling;
              if (fallback) fallback.style.display = 'inline-flex';
            }}
          />
          {/* Fallback placeholder kalau logo belum diupload */}
          <span className="navbar__logo-placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h6"/>
            </svg>
          </span>
          <span className="navbar__logo-text">GKJ Wates</span>
        </a>

        <ul className="navbar__menu">
          {navItems.map((item) => (
            <li key={item.label} className="navbar__item">
              <a href={item.href} className="navbar__link">
                {item.label}
              </a>
            </li>
          ))}

          {/* Item INFORMASI dengan dropdown */}
          <li className="navbar__item navbar__item--dropdown" ref={dropdownRef}>
            <button
              className={`navbar__link navbar__link--dropdown ${infoOpen ? 'is-open' : ''}`}
              onClick={() => setInfoOpen(!infoOpen)}
              aria-expanded={infoOpen}
              aria-haspopup="true"
            >
              Informasi
              <svg
                className="navbar__chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                width="12"
                height="12"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <ul className={`navbar__dropdown ${infoOpen ? 'navbar__dropdown--open' : ''}`}>
              {informasiSubItems.map((sub) => (
                <li key={sub.label} className="navbar__dropdown-item">
                  <a
                    href={sub.href}
                    className="navbar__dropdown-link"
                    onClick={() => setInfoOpen(false)}
                  >
                    {sub.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        <button
          className="navbar__toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`navbar__toggle-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`navbar__toggle-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`navbar__toggle-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        <ul className={`navbar__mobile ${mobileMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.label} className="navbar__mobile-item">
              <a
                href={item.href}
                className="navbar__mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}

          {/* Mobile: Informasi dengan sub-items langsung di-list */}
          <li className="navbar__mobile-item navbar__mobile-item--group">
            <span className="navbar__mobile-link navbar__mobile-link--group">Informasi</span>
            <ul className="navbar__mobile-submenu">
              {informasiSubItems.map((sub) => (
                <li key={sub.label}>
                  <a
                    href={sub.href}
                    className="navbar__mobile-sublink"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {sub.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;