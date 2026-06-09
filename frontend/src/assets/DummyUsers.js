// Data dummy untuk login - sementara hardcoded
// Nantinya akan diganti dengan API backend
export const DUMMY_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    displayName: 'Administrasi',
  },
  {
    id: 2,
    username: 'kompa',
    password: 'kompa123',
    role: 'kompa',
    displayName: 'Admin KOMPA',
  },
  {
    id: 3,
    username: 'komnak',
    password: 'komnak123',
    role: 'komnak',
    displayName: 'Admin KOMNAK',
  },
];

// Helper untuk validasi login
export const validateLogin = (username, password) => {
  const user = DUMMY_USERS.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
};