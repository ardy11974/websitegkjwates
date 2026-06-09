import { useEffect, useMemo, useState } from 'react';
import { publicSorotan, fileUrl } from '../../services/api';
import CircularGallery from '../../components/CircularGallery/CircularGallery';
import SplitText from '../../components/SplitText/SplitText';
import './SorotanSection.css';

// Ukuran kartu galeri menyesuaikan lebar layar (mobile-friendly).
// Pakai breakpoint diskret agar galeri WebGL tidak dibuat ulang setiap piksel.
const getItemWidth = (w) =>
  w < 480 ? 300 : w < 700 ? 360 : w < 1000 ? 420 : 468;

const SorotanSection = () => {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [itemWidth, setItemWidth] = useState(() =>
    getItemWidth(typeof window !== 'undefined' ? window.innerWidth : 1200)
  );

  useEffect(() => {
    let active = true;
    publicSorotan()
      .then((data) => active && setItems(data || []))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoaded(true));
    return () => { active = false; };
  }, []);

  // Perbarui ukuran kartu saat layar di-resize (hanya saat lintas breakpoint)
  useEffect(() => {
    const onResize = () => setItemWidth(getItemWidth(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const itemHeight = Math.round(itemWidth / 1.6); // jaga rasio 468x292

  const galleryItems = useMemo(
    () =>
      items.map((s) => ({
        image: fileUrl(s.gambar_sorotan),
        text: s.judul_sorotan,
      })),
    [items]
  );

  // Sembunyikan section bila belum ada sorotan yang dipublish
  if (!loaded || galleryItems.length === 0) return null;

  return (
    <section id="sorotan" className="sorotan">
      <div className="sorotan__header">
        <SplitText
          tag="h2"
          className="sorotan__title"
          text="Sorotan"
          splitType="chars"
          delay={35}
          duration={0.8}
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.2}
          rootMargin="-40px"
          textAlign="center"
        />
        <p className="sorotan__subtitle reveal reveal--right reveal--delay-1">
          Momen-momen pilihan dari kehidupan jemaat GKJ Wates
        </p>
      </div>

      <div
        className="sorotan__gallery"
        style={{ height: `${itemHeight + 120}px` }}
      >
        <CircularGallery
          items={galleryItems}
          bend={0}
          textColor="#395886"
          borderRadius={0.06}
          scrollEase={0.05}
          font="bold 26px Playfair Display"
          itemWidth={itemWidth}
          itemHeight={itemHeight}
        />
      </div>
    </section>
  );
};

export default SorotanSection;
