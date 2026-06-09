import { usePengaturan } from '../../hooks/UsePengaturan';
import './Footer.css';

const waLink = (wa) => {
  if (!wa) return null;
  const digits = wa.replace(/[^0-9]/g, '');
  if (!digits) return null;
  const intl = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
};
const igLink = (ig) => {
  if (!ig) return null;
  if (/^https?:\/\//i.test(ig)) return ig;
  return `https://instagram.com/${ig.replace(/^@/, '')}`;
};
const ytLink = (yt) => {
  if (!yt) return null;
  if (/^https?:\/\//i.test(yt)) return yt;
  return `https://www.youtube.com/${yt}`;
};

const Footer = () => {
  const { pengaturan } = usePengaturan();

  const alamat = pengaturan?.alamat || 'Jl. Bhayangkara No.3, Terbah, Wates, Kec. Wates, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta';
  const email = pengaturan?.email || 'admin@gkjwates.org';
  const ig = igLink(pengaturan?.instagram);
  const yt = ytLink(pengaturan?.youtube);
  const wa = waLink(pengaturan?.whatsapp);
  const copyright = pengaturan?.copyright_text || 'GKJ Wates. All rights reserved.';

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__col footer__col--brand">
          <div className="footer__logo">
            <img
              src="/sinode.jpg"
              alt="GKJ Wates"
              className="footer__logo-img"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback) fallback.style.display = 'inline-flex';
              }}
            />
            <span className="footer__logo-placeholder" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h6"/>
              </svg>
            </span>
            <span className="footer__logo-text">GKJ Wates</span>
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Navigasi</h4>
          <ul className="footer__list">
            <li><a href="#home">Halaman Utama</a></li>
            <li><a href="#about">Sejarah Gereja</a></li>
            <li><a href="#jadwal">Jadwal Ibadah</a></li>
            <li><a href="#pengumuman">Pengumuman</a></li>
            <li><a href="#berita">Berita</a></li>
            <li><a href="#aktifitas">Aktifitas &amp; Layanan</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Kontak &amp; Lokasi</h4>
          <ul className="footer__list">
            <li className="footer__contact">
              <span className="footer__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <span>{alamat}</span>
            </li>
            <li className="footer__contact">
              <span className="footer__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <span>{email}</span>
            </li>
          </ul>

          <h4 className="footer__heading footer__heading--social">Sosial Media</h4>
          <div className="footer__socials">
            {ig && (
              <a href={ig} target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-10.4a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/>
                </svg>
              </a>
            )}
            {yt && (
              <a href={yt} target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="footer__social" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} {copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
