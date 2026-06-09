import Swal from 'sweetalert2';
import './swal.css';

// Instance SweetAlert2 bertema GKJ Wates (palet biru, sudut membulat, font sesuai)
const swal = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: 'gkj-swal',
    title: 'gkj-swal__title',
    htmlContainer: 'gkj-swal__text',
    actions: 'gkj-swal__actions',
    confirmButton: 'gkj-swal__confirm',
    cancelButton: 'gkj-swal__cancel',
    icon: 'gkj-swal__icon',
  },
});

// Notifikasi sukses singkat (auto close)
export const swalSuccess = (title, text) =>
  swal.fire({
    icon: 'success',
    title: title || 'Berhasil',
    text,
    timer: 1700,
    timerProgressBar: true,
    showConfirmButton: false,
  });

export const swalError = (title, text) =>
  swal.fire({
    icon: 'error',
    title: title || 'Gagal',
    text,
    confirmButtonText: 'Mengerti',
  });

// Konfirmasi hapus -> mengembalikan boolean
export const confirmDelete = async (text = 'Data yang dihapus tidak dapat dikembalikan.') => {
  const res = await swal.fire({
    icon: 'warning',
    title: 'Hapus data ini?',
    text,
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
    customClass: {
      popup: 'gkj-swal',
      title: 'gkj-swal__title',
      htmlContainer: 'gkj-swal__text',
      actions: 'gkj-swal__actions',
      confirmButton: 'gkj-swal__confirm gkj-swal__confirm--danger',
      cancelButton: 'gkj-swal__cancel',
      icon: 'gkj-swal__icon',
    },
  });
  return res.isConfirmed;
};

// Konfirmasi umum (mis. logout) -> boolean
export const confirmAction = async ({
  title = 'Konfirmasi',
  text = '',
  confirmText = 'Ya',
  cancelText = 'Batal',
  icon = 'question',
} = {}) => {
  const res = await swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
  return res.isConfirmed;
};

export default swal;
