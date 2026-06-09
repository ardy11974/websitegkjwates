import { useEffect, useMemo, useState } from 'react';
import {
  getUsers,
  getRoles,
  createUser,
  updateUser,
  deleteUser,
} from '../../services/api';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconEye,
  IconTrash,
  IconClose,
  IconChevron,
  IconEyeOff,
  IconUsers,
} from './icons';
import { swalSuccess, confirmDelete } from '../../utils/swal';
import { toastError } from '../../utils/toast';
import './AdminManage.css';

const emptyForm = { username: '', email: '', password: '', id_role: '' };

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal: { mode: 'create' | 'edit' | 'view', data }
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [u, r] = await Promise.all([getUsers(), getRoles()]);
      setUsers(u);
      setRoles(r);
    } catch (err) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.username.toLowerCase().includes(q));
  }, [users, search]);

  const openCreate = () => {
    setForm(emptyForm);
    setFormError('');
    setShowPassword(false);
    setModal({ mode: 'create' });
  };

  const openEdit = (user) => {
    setForm({
      username: user.username,
      email: user.email || '',
      password: '',
      id_role: String(user.id_role),
    });
    setFormError('');
    setShowPassword(false);
    setModal({ mode: 'edit', data: user });
  };

  const openView = (user) => {
    setModal({ mode: 'view', data: user });
  };

  const closeModal = () => {
    setModal(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.username.trim() || !form.email.trim() || !form.id_role) {
      setFormError('Username, email, dan role harus diisi');
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email.trim())) {
      setFormError('Format email tidak valid');
      return;
    }
    if (modal.mode === 'create' && !form.password.trim()) {
      setFormError('Password harus diisi');
      return;
    }

    const isCreate = modal.mode === 'create';
    setSaving(true);
    try {
      if (isCreate) {
        await createUser({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          id_role: Number(form.id_role),
        });
      } else if (modal.mode === 'edit') {
        const payload = {
          username: form.username.trim(),
          email: form.email.trim(),
          id_role: Number(form.id_role),
        };
        if (form.password.trim()) payload.password = form.password;
        await updateUser(modal.data.id_user, payload);
      }
      await loadData();
      closeModal();
      swalSuccess(isCreate ? 'User ditambahkan' : 'User diperbarui');
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (!(await confirmDelete(`Hapus user "${user.username}"?`))) return;
    try {
      await deleteUser(user.id_user);
      await loadData();
      swalSuccess('User dihapus');
    } catch (err) {
      toastError(err.message || 'Gagal menghapus user');
    }
  };

  const roleLabel = (user) => user.role?.nama_role || '-';

  return (
    <div className="manage">
      <h1 className="manage__title">User</h1>

      <div className="manage-toolbar">
        <div className="manage-search">
          <input
            type="text"
            className="manage-search__input"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="manage-search__icon">
            <IconSearch />
          </span>
        </div>
        <button type="button" className="manage-add-btn" onClick={openCreate}>
          <IconPlus />
          <span>Tambah</span>
        </button>
      </div>

      {error && <div className="manage-error">{error}</div>}

      <div className="manage-card">
        {loading ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconUsers /></div>
            <p className="manage-state__text">Memuat data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="manage-state">
            <div className="manage-state__icon"><IconUsers /></div>
            <p className="manage-state__title">Belum ada user</p>
            <p className="manage-state__text">
              {search ? 'Tidak ada user yang cocok dengan pencarian.' : 'Klik "Tambah" untuk membuat user baru.'}
            </p>
          </div>
        ) : (
          <table className="manage-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>No.</th>
                <th>Username</th>
                <th>Role</th>
                <th style={{ width: '170px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id_user}>
                  <td>{i + 1}</td>
                  <td>{user.username}</td>
                  <td className={roleLabel(user) === '-' ? 'manage-table__muted' : ''}>
                    {roleLabel(user)}
                  </td>
                  <td>
                    <div className="manage-actions">
                      <button type="button" className="act-btn act-btn--edit" title="Edit" onClick={() => openEdit(user)}>
                        <IconEdit />
                      </button>
                      <button type="button" className="act-btn act-btn--view" title="Lihat" onClick={() => openView(user)}>
                        <IconEye />
                      </button>
                      <button type="button" className="act-btn act-btn--delete" title="Hapus" onClick={() => handleDelete(user)}>
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ====== MODAL ====== */}
      {modal && (
        <div className="manage-modal-overlay" onClick={closeModal}>
          <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal__header">
              <h2 className="manage-modal__title">
                {modal.mode === 'create' && 'Tambah User'}
                {modal.mode === 'edit' && 'Edit User'}
                {modal.mode === 'view' && 'Detail User'}
              </h2>
              <button type="button" className="manage-modal__close" onClick={closeModal}>
                <IconClose />
              </button>
            </div>

            {modal.mode === 'view' ? (
              <div className="manage-detail">
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Username</span>
                  <span className="manage-detail__value">{modal.data.username}</span>
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Email</span>
                  <span className="manage-detail__value">{modal.data.email}</span>
                </div>
                <div className="manage-detail__row">
                  <span className="manage-detail__label">Role</span>
                  <span className="manage-detail__value">{roleLabel(modal.data)}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSave} noValidate>
                {formError && <div className="manage-error">{formError}</div>}
                <div className="manage-form__grid">
                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="username">Username</label>
                    <div className="manage-field__control">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        className="manage-input"
                        value={form.username}
                        onChange={handleChange}
                        disabled={saving}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="email">Email</label>
                    <div className="manage-field__control">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="manage-input"
                        placeholder="nama@email.com"
                        value={form.email}
                        onChange={handleChange}
                        disabled={saving}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="password">Password</label>
                    <div className="manage-field__control">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="manage-input"
                        value={form.password}
                        onChange={handleChange}
                        disabled={saving}
                        placeholder={modal.mode === 'edit' ? 'Kosongkan jika tidak diubah' : ''}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="manage-field__toggle"
                        onClick={() => setShowPassword((s) => !s)}
                        tabIndex={-1}
                      >
                        {showPassword ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </div>
                  </div>

                  <div className="manage-field">
                    <label className="manage-field__label" htmlFor="id_role">Role</label>
                    <div className="manage-field__control">
                      <select
                        id="id_role"
                        name="id_role"
                        className="manage-select"
                        value={form.id_role}
                        onChange={handleChange}
                        disabled={saving}
                      >
                        <option value="">Pilih role</option>
                        {roles.map((r) => (
                          <option key={r.id_role} value={r.id_role}>
                            {r.nama_role}
                          </option>
                        ))}
                      </select>
                      <span className="manage-field__chevron">
                        <IconChevron />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="manage-modal__actions">
                  <button type="submit" className="manage-save-btn" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="manage-save-btn__spinner"></span>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <IconPlus />
                        <span>Simpan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
