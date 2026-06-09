import toast from 'react-hot-toast';

// Opsi default tema GKJ Wates untuk Toaster ada di App (komponen <Toaster/>)
export const toastSuccess = (message) => toast.success(message);
export const toastError = (message) => toast.error(message || 'Terjadi kesalahan');
export const toastInfo = (message) =>
  toast(message, { icon: 'ℹ️' });

export default toast;
