import { useEffect } from 'react';

/**
 * useScrollReveal — Trigger animasi pada elemen ber-class "reveal"
 * saat masuk viewport. Pasang sekali di MainLayout atau App.
 *
 * Cara pakai di komponen lain:
 *   <div className="reveal reveal--delay-2">...</div>
 *
 * Saat element terlihat di viewport, akan ditambahkan class "is-visible"
 * yang memicu transisi dari initial state ke visible state.
 */
const useScrollReveal = () => {
  useEffect(() => {
    // Fallback untuk browser tanpa IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Setelah terlihat, stop observe untuk performa
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    // Observe semua elemen ber-class "reveal" yang belum visible
    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
        observer.observe(el);
      });
    };

    observeAll();

    // Re-observe saat ada element baru (mis. setelah navigasi ke page lain)
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};

export default useScrollReveal;