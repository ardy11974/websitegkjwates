import { useState } from 'react';
import { useAuth } from '../hooks/UseAuth';
import { forgotPassword } from '../services/api';
import { toastSuccess, toastError } from '../utils/toast';
import './LoginPage.css';

const EyeIcon = ({ off }) =>
  off ? (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6.5C15.79 6.5 19.17 8.63 20.82 12C20.23 13.27 19.4 14.36 18.41 15.25L19.82 16.66C21.21 15.42 22.31 13.82 23 12C21.27 7.61 17 4.5 12 4.5C10.73 4.5 9.51 4.7 8.36 5.07L10.01 6.72C10.66 6.58 11.32 6.5 12 6.5ZM10.93 7.64L13 9.71C13.57 9.96 14.03 10.42 14.28 10.99L16.35 13.06C16.43 12.72 16.49 12.36 16.49 11.99C16.5 9.51 14.48 7.5 12 7.5C11.63 7.5 11.28 7.55 10.93 7.64ZM2.01 3.87L4.69 6.55C3.06 7.83 1.77 9.53 1 11.5C2.73 15.89 7 19 12 19C13.52 19 14.98 18.71 16.32 18.18L19.74 21.6L21.15 20.19L3.42 2.45L2.01 3.87ZM9.51 11.37L12.12 13.98L12 14C10.62 14 9.5 12.88 9.5 11.5L9.51 11.37ZM6.11 7.97L7.86 9.72C7.63 10.27 7.5 10.87 7.5 11.5C7.5 13.98 9.52 16 12 16C12.63 16 13.23 15.87 13.77 15.64L14.75 16.62C13.87 16.86 12.95 17 12 17C8.21 17 4.83 14.87 3.18 11.5C3.88 10.07 4.9 8.89 6.11 7.97Z" fill="currentColor"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
    </svg>
  );

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="currentColor"/>
  </svg>
);

const LoginPage = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [view, setView] = useState('login'); // 'login' | 'forgot'

  // ===== Login state =====
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ===== Forgot password state =====
  const [forgotData, setForgotData] = useState({
    identifier: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Username/email dan password harus diisi');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        toastSuccess(`Selamat datang, ${result.user?.displayName || 'pengguna'}!`);
        if (onLoginSuccess) onLoginSuccess(result.user);
      } else {
        setError(result.error);
        toastError(result.error);
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      toastError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData((prev) => ({ ...prev, [name]: value }));
    if (forgotError) setForgotError('');
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const { identifier, newPassword, confirmPassword } = forgotData;

    if (!identifier.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setForgotError('Semua field harus diisi');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('Password baru minimal 6 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Konfirmasi password tidak cocok');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await forgotPassword(identifier.trim(), newPassword);
      const msg = res.message || 'Password berhasil diubah. Silakan login kembali.';
      toastSuccess(msg);
      setForgotData({ identifier: '', newPassword: '', confirmPassword: '' });
      // Langsung kembali ke halaman login agar bisa masuk dengan password baru
      switchToLogin();
    } catch (err) {
      setForgotError(err.message || 'Gagal mengubah password');
      toastError(err.message || 'Gagal mengubah password');
    } finally {
      setForgotLoading(false);
    }
  };

  const switchToForgot = () => {
    setView('forgot');
    setError('');
    setForgotError('');
    setForgotSuccess('');
  };

  const switchToLogin = () => {
    setView('login');
    setForgotError('');
    setForgotSuccess('');
  };

  return (
    <div className="login-page">
      {/* Background decorations */}
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--1"></div>
        <div className="login-bg__orb login-bg__orb--2"></div>
        <div className="login-bg__orb login-bg__orb--3"></div>
        <div className="login-bg__grid"></div>
      </div>

      <div className="login-container">
        {/* Left side - Brand & Welcome */}
        <div className="login-brand">
          <div className="login-brand__content">
            <div className="login-brand__logo">
              <img src="/sinode.jpg" alt="Logo Sinode GKJ" />
            </div>
            <h1 className="login-brand__title">
              <span className="login-brand__title-line">Selamat</span>
              <span className="login-brand__title-line login-brand__title-line--accent">Datang</span>
            </h1>
            <p className="login-brand__subtitle">
              Sistem Manajemen<br/>
              <strong>GKJ Wates</strong>
            </p>
            <div className="login-brand__divider"></div>
            <p className="login-brand__quote">
              "Tetapi carilah dahulu Kerajaan Allah dan kebenarannya, maka semuanya itu akan ditambahkan kepadamu."
            </p>
            <span className="login-brand__quote-ref">— Matius 6:33</span>
          </div>
          <div className="login-brand__watermark">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 30 L100 170 M60 100 L140 100 M75 60 L125 60 M75 140 L125 140"
                    stroke="currentColor" strokeWidth="1.5" opacity="0.15"/>
              <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
            </svg>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="login-form-wrapper">
          {view === 'login' ? (
            <div className="login-form">
              <div className="login-form__header">
                <span className="login-form__badge">Login Portal</span>
                <h2 className="login-form__title">Masuk ke Akun</h2>
                <p className="login-form__subtitle">
                  Silahkan masuk menggunakan username atau email Anda
                </p>
              </div>

              <form onSubmit={handleSubmit} className="login-form__body" noValidate>
                <div className="login-field">
                  <label htmlFor="username" className="login-field__label">
                    Username atau Email
                  </label>
                  <div className="login-field__input-wrap">
                    <span className="login-field__icon">
                      <UserIcon />
                    </span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Masukkan username atau email"
                      className="login-field__input"
                      autoComplete="username"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="password" className="login-field__label">
                    Password
                  </label>
                  <div className="login-field__input-wrap">
                    <span className="login-field__icon">
                      <LockIcon />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password"
                      className="login-field__input"
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="login-field__toggle"
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      tabIndex={-1}
                    >
                      <EyeIcon off={showPassword} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="login-forgot-link"
                  onClick={switchToForgot}
                >
                  Lupa password?
                </button>

                {error && (
                  <div className="login-error" role="alert">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                            fill="currentColor"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" className="login-submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="login-submit__spinner"></span>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk</span>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>

                <div className="login-hint">
                  <span className="login-hint__label">Akun Admin:</span>
                  <div className="login-hint__list">
                    <span><strong>admin</strong> / admin123</span>
                  </div>
                </div>
              </form>

              <div className="login-form__footer">
                <button
                  type="button"
                  onClick={() => { window.location.hash = ''; }}
                  className="login-back"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Kembali ke Beranda</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="login-form">
              <div className="login-form__header">
                <span className="login-form__badge">Reset Password</span>
                <h2 className="login-form__title">Lupa Password</h2>
                <p className="login-form__subtitle">
                  Masukkan username atau email Anda, lalu buat password baru
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="login-form__body" noValidate>
                <div className="login-field">
                  <label htmlFor="identifier" className="login-field__label">
                    Username atau Email
                  </label>
                  <div className="login-field__input-wrap">
                    <span className="login-field__icon">
                      <UserIcon />
                    </span>
                    <input
                      type="text"
                      id="identifier"
                      name="identifier"
                      value={forgotData.identifier}
                      onChange={handleForgotChange}
                      placeholder="Masukkan username atau email"
                      className="login-field__input"
                      disabled={forgotLoading}
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="newPassword" className="login-field__label">
                    Password Baru
                  </label>
                  <div className="login-field__input-wrap">
                    <span className="login-field__icon">
                      <LockIcon />
                    </span>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={forgotData.newPassword}
                      onChange={handleForgotChange}
                      placeholder="Minimal 6 karakter"
                      className="login-field__input"
                      autoComplete="new-password"
                      disabled={forgotLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="login-field__toggle"
                      tabIndex={-1}
                    >
                      <EyeIcon off={showNewPassword} />
                    </button>
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="confirmPassword" className="login-field__label">
                    Konfirmasi Password Baru
                  </label>
                  <div className="login-field__input-wrap">
                    <span className="login-field__icon">
                      <LockIcon />
                    </span>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={forgotData.confirmPassword}
                      onChange={handleForgotChange}
                      placeholder="Ulangi password baru"
                      className="login-field__input"
                      autoComplete="new-password"
                      disabled={forgotLoading}
                    />
                  </div>
                </div>

                {forgotError && (
                  <div className="login-error" role="alert">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                            fill="currentColor"/>
                    </svg>
                    <span>{forgotError}</span>
                  </div>
                )}

                {forgotSuccess && (
                  <div className="login-success" role="alert">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                            fill="currentColor"/>
                    </svg>
                    <span>{forgotSuccess}</span>
                  </div>
                )}

                <button type="submit" className="login-submit" disabled={forgotLoading}>
                  {forgotLoading ? (
                    <>
                      <span className="login-submit__spinner"></span>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Ubah Password</span>
                  )}
                </button>
              </form>

              <div className="login-form__footer">
                <button type="button" onClick={switchToLogin} className="login-back">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Kembali ke Login</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
