import { useState } from 'react';
import { submitKritikSaran } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import SplitText from '../../components/SplitText/SplitText';
import './KritikSaranSection.css';

const KritikSaranSection = () => {
  const [formData, setFormData] = useState({ nama: '', email: '', pesan: '' });
  const [isSending, setIsSending] = useState(false);

  // Envelope state: 'closed' | 'open' (user mulai mengetik) | 'sending' (sedang submit)
  const hasInput = formData.nama || formData.email || formData.pesan;
  const envelopeState = isSending ? 'sending' : hasInput ? 'open' : 'closed';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.pesan.trim() || isSending) return;
    setIsSending(true);
    try {
      await submitKritikSaran({
        nama_pengirim: formData.nama.trim(),
        email_pengirim: formData.email.trim(),
        isi_pesan: formData.pesan.trim(),
      });
      toastSuccess('Terima kasih atas masukan Anda!');
      setFormData({ nama: '', email: '', pesan: '' });
    } catch (err) {
      toastError(err.message || 'Gagal mengirim pesan. Coba lagi.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="kontak" className="kritik">
      <div className="kritik__container">
        <div className="kritik__header">
          <SplitText
            tag="h2"
            className="kritik__title"
            text="Kritik & Saran"
            splitType="chars"
            delay={32}
            duration={0.8}
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="-40px"
            textAlign="left"
          />
          <p className="kritik__subtitle reveal reveal--right reveal--delay-1">
            Segala masukan dari anda berpengaruh untuk kemajuan dan perkembangan gereja
          </p>
        </div>

        <div className="kritik__body">
          <div className="kritik__form">
            <div className="kritik__field reveal reveal--delay-1">
              <label className="kritik__label">
                <strong>Nama</strong> <span className="kritik__optional">(opsional)</span>
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="kritik__input"
              />
            </div>

            <div className="kritik__field reveal reveal--delay-2">
              <label className="kritik__label">
                <strong>Email</strong> <span className="kritik__optional">(opsional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="kritik__input"
              />
            </div>

            <div className="kritik__field reveal reveal--delay-3">
              <label className="kritik__label">
                <strong>Kritik &amp; Saran</strong>
              </label>
              <textarea
                name="pesan"
                value={formData.pesan}
                onChange={handleChange}
                rows={7}
                className="kritik__textarea"
              />
            </div>

            <div className="kritik__submit-wrap reveal reveal--delay-4">
              <button
                onClick={handleSubmit}
                className="kritik__submit"
                disabled={isSending || !formData.pesan}
              >
                {isSending ? (
                  <>
                    <span className="kritik__submit-spinner" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                      <path d="M22 2L11 13"/>
                      <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                    Kirim
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ====== ANIMASI AMPLOP ====== */}
          <div className="kritik__visual" aria-hidden="true">
            <div className={`envelope envelope--${envelopeState}`}>
              {/* Floating particles dekorasi */}
              <div className="envelope__particle envelope__particle--1" />
              <div className="envelope__particle envelope__particle--2" />
              <div className="envelope__particle envelope__particle--3" />
              <div className="envelope__particle envelope__particle--4" />

              {/* Kertas surat — keluar dari amplop saat open */}
              <div className="envelope__paper">
                <div className="envelope__paper-line envelope__paper-line--title" />
                <div className="envelope__paper-line" />
                <div className="envelope__paper-line" />
                <div className="envelope__paper-line envelope__paper-line--short" />
                <div className="envelope__paper-line" />
                <div className="envelope__paper-line envelope__paper-line--short" />

                {/* Hati kecil di pojok */}
                <div className="envelope__paper-heart">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>

              {/* Body amplop (belakang) */}
              <div className="envelope__back" />

              {/* Body amplop (depan, dengan flap V terbalik) */}
              <div className="envelope__front" />

              {/* Flap atas — animasi membuka */}
              <div className="envelope__flap">
                {/* Stamp / seal di pojok */}
                <div className="envelope__seal">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h6"/>
                  </svg>
                </div>
              </div>

              {/* Label kecil di bawah */}
              <div className="envelope__label">
                <span className="envelope__label-text">
                  {envelopeState === 'sending'
                    ? 'Mengirim pesan Anda...'
                    : envelopeState === 'open'
                    ? 'Pesan sedang ditulis'
                    : 'Sampaikan pesan Anda'}
                </span>
                <span className="envelope__label-dots">
                  <span /><span /><span />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KritikSaranSection;