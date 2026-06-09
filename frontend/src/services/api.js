// Base URL backend. Bisa di-override lewat VITE_API_URL di file .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Origin backend (tanpa /api) untuk mengakses file upload di /uploads/...
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');
export const fileUrl = (filePath) => (filePath ? `${API_ORIGIN}${filePath}` : '');

const TOKEN_KEY = 'gkj_token';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

// Wrapper fetch sederhana yang otomatis menyisipkan token & parsing JSON
const request = async (path, { method = 'GET', body, auth = false } = {}) => {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;

  // Untuk FormData, biarkan browser menetapkan Content-Type (multipart boundary)
  const headers = isForm ? {} : { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Pastikan backend berjalan.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // response tanpa body JSON
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Terjadi kesalahan pada server');
  }

  return data;
};

// ====== AUTH ======
export const loginRequest = (username, password) =>
  request('/auth/login', { method: 'POST', body: { username, password } });

export const fetchMe = () => request('/auth/me', { auth: true });

export const forgotPassword = (identifier, newPassword) =>
  request('/auth/forgot-password', {
    method: 'POST',
    body: { identifier, newPassword },
  });

// ====== USERS ======
export const getUsers = () => request('/users', { auth: true });
export const createUser = (payload) =>
  request('/users', { method: 'POST', body: payload, auth: true });
export const updateUser = (id, payload) =>
  request(`/users/${id}`, { method: 'PUT', body: payload, auth: true });
export const deleteUser = (id) =>
  request(`/users/${id}`, { method: 'DELETE', auth: true });

// ====== ROLES ======
export const getRoles = () => request('/roles', { auth: true });

// ====== KRITIK & SARAN ======
export const getKritikSaran = () => request('/kritik-saran', { auth: true });
export const markKritikRead = (id) =>
  request(`/kritik-saran/${id}/read`, { method: 'PATCH', auth: true });
export const deleteKritikSaran = (id) =>
  request(`/kritik-saran/${id}`, { method: 'DELETE', auth: true });

// ====== KEMAJELISAN ======
export const getKemajelisan = () => request('/kemajelisan', { auth: true });
export const createKemajelisan = (payload) =>
  request('/kemajelisan', { method: 'POST', body: payload, auth: true });
export const updateKemajelisan = (id, payload) =>
  request(`/kemajelisan/${id}`, { method: 'PUT', body: payload, auth: true });
export const deleteKemajelisan = (id) =>
  request(`/kemajelisan/${id}`, { method: 'DELETE', auth: true });

// ====== PENGATURAN WEB ======
export const getPengaturan = () => request('/pengaturan');
export const savePengaturan = (payload) =>
  request('/pengaturan', { method: 'PUT', body: payload, auth: true });

// ====== PERSYARATAN ======
export const getPersyaratan = () => request('/persyaratan', { auth: true });
export const createPersyaratan = (formData) =>
  request('/persyaratan', { method: 'POST', body: formData, auth: true });
export const updatePersyaratan = (id, formData) =>
  request(`/persyaratan/${id}`, { method: 'PUT', body: formData, auth: true });
export const deletePersyaratan = (id) =>
  request(`/persyaratan/${id}`, { method: 'DELETE', auth: true });

// ====== JAM PELAYANAN (ibadah + jadwal) ======
export const getIbadah = () => request('/jam-pelayanan/ibadah', { auth: true });
export const getIbadahById = (id) =>
  request(`/jam-pelayanan/ibadah/${id}`, { auth: true });
export const createIbadah = (payload) =>
  request('/jam-pelayanan/ibadah', { method: 'POST', body: payload, auth: true });
export const updateIbadah = (id, payload) =>
  request(`/jam-pelayanan/ibadah/${id}`, { method: 'PUT', body: payload, auth: true });
export const deleteIbadah = (id) =>
  request(`/jam-pelayanan/ibadah/${id}`, { method: 'DELETE', auth: true });

export const createJadwal = (payload) =>
  request('/jam-pelayanan/jadwal', { method: 'POST', body: payload, auth: true });
export const updateJadwal = (id, payload) =>
  request(`/jam-pelayanan/jadwal/${id}`, { method: 'PUT', body: payload, auth: true });
export const deleteJadwal = (id) =>
  request(`/jam-pelayanan/jadwal/${id}`, { method: 'DELETE', auth: true });

// ====== SOROTAN ======
export const getSorotan = () => request('/sorotan', { auth: true });
export const createSorotan = (formData) =>
  request('/sorotan', { method: 'POST', body: formData, auth: true });
export const updateSorotan = (id, formData) =>
  request(`/sorotan/${id}`, { method: 'PUT', body: formData, auth: true });
export const deleteSorotan = (id) =>
  request(`/sorotan/${id}`, { method: 'DELETE', auth: true });

// ====== PENGUMUMAN (wadah) ======
export const getPengumuman = () => request('/pengumuman', { auth: true });
export const getPengumumanById = (id) =>
  request(`/pengumuman/${id}`, { auth: true });
export const createPengumuman = (payload) =>
  request('/pengumuman', { method: 'POST', body: payload, auth: true });
export const updatePengumuman = (id, payload) =>
  request(`/pengumuman/${id}`, { method: 'PUT', body: payload, auth: true });
export const deletePengumuman = (id) =>
  request(`/pengumuman/${id}`, { method: 'DELETE', auth: true });

// Konten pengumuman (di dalam wadah)
export const createKonten = (payload) =>
  request('/pengumuman/konten', { method: 'POST', body: payload, auth: true });
export const updateKonten = (id, payload) =>
  request(`/pengumuman/konten/${id}`, { method: 'PUT', body: payload, auth: true });
export const deleteKonten = (id) =>
  request(`/pengumuman/konten/${id}`, { method: 'DELETE', auth: true });

// ====== KEGIATAN ======
export const getKegiatan = () => request('/kegiatan', { auth: true });
export const getKomisi = () => request('/kegiatan/komisi', { auth: true });
export const createKomisi = (payload) =>
  request('/kegiatan/komisi', { method: 'POST', body: payload, auth: true });
export const updateKomisi = (id, payload) =>
  request(`/kegiatan/komisi/${id}`, { method: 'PUT', body: payload, auth: true });
export const deleteKomisi = (id) =>
  request(`/kegiatan/komisi/${id}`, { method: 'DELETE', auth: true });
export const createKegiatan = (formData) =>
  request('/kegiatan', { method: 'POST', body: formData, auth: true });
export const updateKegiatan = (id, formData) =>
  request(`/kegiatan/${id}`, { method: 'PUT', body: formData, auth: true });
export const deleteKegiatan = (id) =>
  request(`/kegiatan/${id}`, { method: 'DELETE', auth: true });

// ====== BERITA ======
export const getBerita = () => request('/berita', { auth: true });
export const getKategori = () => request('/berita/kategori', { auth: true });
export const createKategori = (payload) =>
  request('/berita/kategori', { method: 'POST', body: payload, auth: true });
export const updateKategori = (id, payload) =>
  request(`/berita/kategori/${id}`, { method: 'PUT', body: payload, auth: true });
export const deleteKategori = (id) =>
  request(`/berita/kategori/${id}`, { method: 'DELETE', auth: true });
export const createBerita = (formData) =>
  request('/berita', { method: 'POST', body: formData, auth: true });
export const updateBerita = (id, formData) =>
  request(`/berita/${id}`, { method: 'PUT', body: formData, auth: true });
export const deleteBerita = (id) =>
  request(`/berita/${id}`, { method: 'DELETE', auth: true });

// ====== RENUNGAN (kompa/komnak) ======
export const getRenungan = () => request('/renungan', { auth: true });
export const createRenungan = (payload) =>
  request('/renungan', { method: 'POST', body: payload, auth: true });
export const updateRenungan = (id, payload) =>
  request(`/renungan/${id}`, { method: 'PUT', body: payload, auth: true });
export const deleteRenungan = (id) =>
  request(`/renungan/${id}`, { method: 'DELETE', auth: true });

// ====== PUBLIC (halaman depan) ======
export const publicJadwal = () => request('/public/jadwal');
export const publicSorotan = () => request('/public/sorotan');
export const publicPengumuman = () => request('/public/pengumuman');
export const publicKegiatan = () => request('/public/kegiatan');
export const publicBerita = () => request('/public/berita');
export const publicBeritaById = (id) => request(`/public/berita/${id}`);
export const publicKomisi = () => request('/public/komisi');
export const publicKemajelisan = () => request('/public/kemajelisan');
export const publicRenungan = () => request('/public/renungan');
export const publicRenunganById = (id) => request(`/public/renungan/${id}`);
export const publicPersyaratan = () => request('/public/persyaratan');
export const submitKritikSaran = (payload) =>
  request('/public/kritik-saran', { method: 'POST', body: payload });

export default request;
