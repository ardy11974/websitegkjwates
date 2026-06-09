import { createContext, useContext, useEffect, useState } from 'react';
import { getPengaturan } from '../services/api';

const PengaturanContext = createContext({ pengaturan: null, loading: true });

export const PengaturanProvider = ({ children }) => {
  const [pengaturan, setPengaturan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getPengaturan()
      .then((data) => active && setPengaturan(data || null))
      .catch(() => active && setPengaturan(null))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <PengaturanContext.Provider value={{ pengaturan, loading }}>
      {children}
    </PengaturanContext.Provider>
  );
};

export const usePengaturan = () => useContext(PengaturanContext);

// Helper: pecah teks panjang menjadi paragraf (fleksibel untuk konten banyak/sedikit)
export const toParagraphs = (text) =>
  (text || '')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
