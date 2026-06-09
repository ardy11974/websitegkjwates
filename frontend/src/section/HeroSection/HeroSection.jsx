import { useEffect, useRef } from 'react';
import { usePengaturan } from '../../hooks/UsePengaturan';
import { fileUrl } from '../../services/api';
import SplitText from '../../components/SplitText/SplitText';
import './HeroSection.css';

const HeroSection = () => {
  const heroRef = useRef(null);
  const { pengaturan } = usePengaturan();
  const bgSrc = pengaturan?.gambar_landing ? fileUrl(pengaturan.gambar_landing) : '/gkjwates.jpg';

  // Parallax effect: foto background bergerak lebih lambat dari scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const offset = window.scrollY;
        const bg = heroRef.current.querySelector('.hero__bg-img');
        if (bg && offset < 800) {
          bg.style.transform = `translateY(${offset * 0.4}px) scale(1.05)`;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero__bg">
        <img
          src={bgSrc}
          alt="GKJ Wates"
          className="hero__bg-img"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="hero__overlay" />
        {/* Decorative floating shapes */}
        <div className="hero__deco hero__deco--1" aria-hidden="true" />
        <div className="hero__deco hero__deco--2" aria-hidden="true" />
        <div className="hero__deco hero__deco--3" aria-hidden="true" />
      </div>

      <div className="hero__container">
        <div className="hero__content">
          <SplitText
            tag="h1"
            className="hero__title"
            text="SELAMAT DATANG!"
            splitType="chars"
            delay={45}
            duration={0.9}
            ease="power3.out"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
            useScrollTrigger={false}
          />
          <p className="hero__subtitle fade-up">
            Pusat Informasi Terlengkap dan Terpercaya, Seputar Kegiatan, Layanan, dan Perkembangan GKJ Wates
          </p>
          <a href="#kontak" className="hero__cta fade-up">
            Kontak Kami
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;