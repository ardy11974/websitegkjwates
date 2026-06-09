import { useEffect, useState } from 'react';
import { getPengaturan, savePengaturan, fileUrl } from '../../services/api';
import { IconPlus, IconImage } from './icons';
import { swalSuccess } from '../../utils/swal';
import './AdminManage.css';

const emptyForm = {
  visi: '',
  misi: '',
  sejarah: '',
  motto: '',
  alamat: '',
  email: '',
  instagram: '',
  youtube: '',
  whatsapp: '',
  copyright_text: '',
  gambar_landing: '',
};

const PengaturanWeb = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getPengaturan();
        if (data) {
          setForm({
            visi: data.visi || '',
            misi: data.misi || '',
            sejarah: data.sejarah || '',
            motto: data.motto || '',
            alamat: data.alamat || '',
            email: data.email || '',
            instagram: data.instagram || '',
            youtube: data.youtube || '',
            whatsapp: data.whatsapp || '',
            copyright_text: data.copyright_text || '',
            gambar_landing: data.gambar_landing || '',
          });
          if (data.gambar_landing) setPreview(fileUrl(data.gambar_landing));
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat pengaturan');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const revoke = (url) => { if (url && url.startsWith('blob:')) URL.revokeObjectURL(url); };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    revoke(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Tidak ada field yang wajib — boleh menyimpan walau hanya sebagian yang diubah
    const fd = new FormData();
    fd.append('visi', form.visi);
    fd.append('misi', form.misi);
    fd.append('sejarah', form.sejarah);
    fd.append('motto', form.motto);
    fd.append('alamat', form.alamat);
    fd.append('email', form.email);
    fd.append('instagram', form.instagram);
    fd.append('youtube', form.youtube);
    fd.append('whatsapp', form.whatsapp);
    fd.append('copyright_text', form.copyright_text);
    if (file) fd.append('gambar_landing', file);

    setSaving(true);
    try {
      const res = await savePengaturan(fd);
      swalSuccess('Pengaturan disimpan', res.message);
      if (res.data?.gambar_landing) {
        setForm((prev) => ({ ...prev, gambar_landing: res.data.gambar_landing }));
      }
      setFile(null);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="manage">
      <h1 className="manage__title">Pengaturan Web</h1>

      {loading ? (
        <div className="manage-card">
          <div className="manage-state">
            <p className="manage-state__text">Memuat pengaturan...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="manage-error">{error}</div>}
          {success && <div className="manage-success">{success}</div>}

          {/* Profil Gereja */}
          <div className="settings-card">
            <h2 className="settings-card__title">Profil Gereja</h2>
            <div className="settings-grid">
              <div className="manage-field manage-field--full">
                <label className="manage-field__label" htmlFor="visi">Visi</label>
                <textarea id="visi" name="visi" className="manage-textarea" value={form.visi} onChange={handleChange} disabled={saving} />
              </div>
              <div className="manage-field manage-field--full">
                <label className="manage-field__label" htmlFor="misi">Misi</label>
                <textarea id="misi" name="misi" className="manage-textarea" value={form.misi} onChange={handleChange} disabled={saving} />
              </div>
              <div className="manage-field manage-field--full">
                <label className="manage-field__label" htmlFor="sejarah">Sejarah</label>
                <textarea id="sejarah" name="sejarah" className="manage-textarea" style={{ minHeight: '160px' }} value={form.sejarah} onChange={handleChange} disabled={saving} />
              </div>
              <div className="manage-field manage-field--full">
                <label className="manage-field__label" htmlFor="motto">Motto</label>
                <input id="motto" name="motto" type="text" className="manage-input" value={form.motto} onChange={handleChange} disabled={saving} />
              </div>
            </div>
            <p className="settings-hint">Tip: pisahkan paragraf dengan menekan Enter (baris baru) agar tampilan di website rapi.</p>
          </div>

          {/* Tampilan Website */}
          <div className="settings-card">
            <h2 className="settings-card__title">Tampilan Website</h2>
            <div className="settings-grid">
              <div className="manage-field manage-field--full">
                <label className="manage-field__label">Gambar Landing Page</label>
                <div className="manage-upload">
                  <div className="manage-upload__preview manage-upload__preview--wide">
                    {preview ? <img src={preview} alt="Preview landing" /> : <span className="manage-upload__placeholder"><IconImage /></span>}
                  </div>
                  <div className="manage-upload__body">
                    <label className="manage-upload__btn">
                      <IconImage /><span>{file || form.gambar_landing ? 'Ganti Gambar' : 'Pilih Gambar'}</span>
                      <input type="file" accept="image/*" onChange={handleFile} disabled={saving} hidden />
                    </label>
                    <span className="manage-upload__hint">{file ? file.name : 'Gambar latar hero di halaman utama. JPG/PNG/WEBP, maks 5 MB.'}</span>
                  </div>
                </div>
              </div>
              <div className="manage-field manage-field--full">
                <label className="manage-field__label" htmlFor="copyright_text">Teks Copyright (Footer)</label>
                <input id="copyright_text" name="copyright_text" type="text" className="manage-input" placeholder="cth: GKJ Wates. All rights reserved." value={form.copyright_text} onChange={handleChange} disabled={saving} />
                <p className="settings-hint">Tahun akan ditambahkan otomatis di depan teks.</p>
              </div>
            </div>
          </div>

          {/* Kontak & Media Sosial */}
          <div className="settings-card">
            <h2 className="settings-card__title">Kontak &amp; Media Sosial</h2>
            <div className="settings-grid">
              <div className="manage-field manage-field--full">
                <label className="manage-field__label" htmlFor="alamat">Alamat</label>
                <textarea id="alamat" name="alamat" className="manage-textarea" value={form.alamat} onChange={handleChange} disabled={saving} />
              </div>
              <div className="manage-field">
                <label className="manage-field__label" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" className="manage-input" placeholder="gereja@email.com" value={form.email} onChange={handleChange} disabled={saving} />
              </div>
              <div className="manage-field">
                <label className="manage-field__label" htmlFor="whatsapp">WhatsApp</label>
                <input id="whatsapp" name="whatsapp" type="text" className="manage-input" placeholder="08xxxxxxxxxx" value={form.whatsapp} onChange={handleChange} disabled={saving} />
              </div>
              <div className="manage-field">
                <label className="manage-field__label" htmlFor="instagram">Instagram</label>
                <input id="instagram" name="instagram" type="text" className="manage-input" placeholder="@username / URL" value={form.instagram} onChange={handleChange} disabled={saving} />
              </div>
              <div className="manage-field">
                <label className="manage-field__label" htmlFor="youtube">YouTube</label>
                <input id="youtube" name="youtube" type="text" className="manage-input" placeholder="Nama channel / URL" value={form.youtube} onChange={handleChange} disabled={saving} />
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button type="submit" className="manage-save-btn" disabled={saving}>
              {saving ? (
                <>
                  <span className="manage-save-btn__spinner"></span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <IconPlus />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PengaturanWeb;
