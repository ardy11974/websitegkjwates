import { usePengaturan, toParagraphs } from '../../hooks/UsePengaturan';
import './SejarahSection.css';

const SejarahSection = () => {
  const { pengaturan } = usePengaturan();
  const sejarahParas = toParagraphs(pengaturan?.sejarah);
  const motto = pengaturan?.motto || 'In Faith, We Grow. In Love, We Serve';

  return (
    <section className="sejarah">
      <div className="sejarah__bg-logo" aria-hidden="true">
        <img
          src="/sinode.jpg"
          alt=""
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      <div className="sejarah__container">
        <h2 className="sejarah__title reveal">Sejarah</h2>

        <div className="sejarah__body reveal reveal--delay-1">
          {sejarahParas.length > 0 ? (
            sejarahParas.map((p, i) => (
              <p key={i} className="sejarah__text">{p}</p>
            ))
          ) : (
            <p className="sejarah__text">Sejarah GKJ Wates akan ditampilkan di sini.</p>
          )}
        </div>

        <div className="sejarah__quote-card reveal reveal--scale reveal--delay-2">
          <span className="sejarah__quote-mark">"</span>
          <p className="sejarah__quote">{motto}</p>
          <span className="sejarah__quote-mark sejarah__quote-mark--end">"</span>
        </div>
      </div>
    </section>
  );
};

export default SejarahSection;
