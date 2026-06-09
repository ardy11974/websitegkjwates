import { usePengaturan, toParagraphs } from '../../hooks/UsePengaturan';
import './VisiMisiSection.css';

const VisiMisiSection = () => {
  const { pengaturan } = usePengaturan();
  const visiParas = toParagraphs(pengaturan?.visi);
  const misiParas = toParagraphs(pengaturan?.misi);

  return (
    <section id="about" className="visimisi">
      <div className="visimisi__container">
        {/* Kolom kiri */}
        <div className="visimisi__left">
          <div className="visimisi__left-inner reveal reveal--left">
            <span className="visimisi__eyebrow">Tentang Kami</span>
            <h2 className="visimisi__heading">
              Mengenal<br />
              <span>GKJ Wates</span>
            </h2>
            <p className="visimisi__lead">
              Memahami arah dan tujuan pelayanan kami sebagai keluarga gereja yang bertumbuh dalam iman dan kasih.
            </p>

            <div className="visimisi__deco">
              <div className="visimisi__deco-circle visimisi__deco-circle--lg" />
              <div className="visimisi__deco-circle visimisi__deco-circle--md" />
              <div className="visimisi__deco-circle visimisi__deco-circle--sm" />
            </div>
          </div>
        </div>

        <div className="visimisi__right">
          <div className="visimisi__card reveal reveal--right reveal--delay-1">
            <div className="visimisi__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                <path d="M9 18h6"/>
                <path d="M10 22h4"/>
                <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18h6v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/>
              </svg>
            </div>
            <h3 className="visimisi__title">Visi</h3>
            <div className="visimisi__text">
              {visiParas.length > 0 ? (
                visiParas.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>Visi GKJ Wates akan ditampilkan di sini.</p>
              )}
            </div>
          </div>

          <div className="visimisi__card reveal reveal--right reveal--delay-2">
            <div className="visimisi__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className="visimisi__title">Misi</h3>
            <div className="visimisi__text">
              {misiParas.length > 0 ? (
                misiParas.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>Misi GKJ Wates akan ditampilkan di sini.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisiSection;