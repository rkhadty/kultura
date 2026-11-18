import React, { useState, useEffect } from 'react';

const AUDIO_EXTENSIONS = ['mp3', 'wav'];

export default function RuangBudayaModal({ showModal, setShowModal, editingItem, onSave, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'seni rupa',
    description: '',
    image_url: '',
    audio_url: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const isMusicCategory = (formData.category || '').toLowerCase().includes('musik');

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || editingItem.judul || '',
        category: editingItem.category || editingItem.kategori || 'seni rupa',
        description: editingItem.description || editingItem.deskripsi || '',
        image_url: editingItem.image_url || editingItem.gambar || '',
        audio_url: editingItem.audio_url || editingItem.audio || ''
      });
      setPreviewUrl(editingItem.image_url || editingItem.gambar || '');
    } else {
      setFormData({ title: '', category: 'seni rupa', description: '', image_url: '', audio_url: '' });
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setAudioFile(null);
  }, [editingItem, showModal]);

  useEffect(() => {
    if (!isMusicCategory) setAudioFile(null);
  }, [isMusicCategory]);

  if (!showModal) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    const fileExt = (file.name.split('.').pop() || '').toLowerCase();
    if (!AUDIO_EXTENSIONS.includes(fileExt)) {
      alert('Format file audio harus .mp3 atau .wav!');
      return;
    }

    setAudioFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedFile && !formData.image_url) {
        alert('Harap pilih gambar terlebih dahulu!');
        setLoading(false);
        return;
      }

      await onSave({
        formData,
        imageFile: selectedFile,
        currentImageUrl: formData.image_url,
        audioFile: isMusicCategory ? audioFile : null,
        editingItem
      });

      setShowModal(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving culture item:', error.message);
      alert('Gagal menyimpan data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Klik overlay untuk menutupi popup */
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      {/* stopPropagation agar klik di dalam form tidak ikut menutup popup */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">
          {editingItem ? 'Edit Karya Seni' : 'Tambah Karya Seni Baru'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Judul / Nama Karya</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Contoh: Motif Batik Megamendung"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select
              className="form-control"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="seni rupa">Seni Rupa</option>
              <option value="seni tari">Seni Tari</option>
              <option value="seni musik">Seni Musik</option>
              <option value="seni teater/pertunjukan">Seni Teater/Pertunjukan</option>
              <option value="seni tradisional & budaya">Seni Tradisional & Budaya</option>
              <option value="seni kriya">Seni Kriya</option>
              <option value="sastra & seni bahasa">Sastra & Seni Bahasa</option>
              <option value="seni modern & digital">Seni Modern & Digital</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Unggah Gambar Karya</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
              required={!editingItem && !formData.image_url}
            />

            {previewUrl && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Pratinjau Gambar:</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: '160px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
            )}
          </div>

          {isMusicCategory && (
            <div className="form-group">
              <label className="form-label">Unggah File Audio Karya (.mp3 / .wav)</label>
              <input
                type="file"
                accept="audio/*,.mp3,.wav"
                className="form-control"
                onChange={handleAudioChange}
              />

              {audioFile ? (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Audio baru dipilih:</p>
                  <audio controls src={URL.createObjectURL(audioFile)} style={{ width: '100%' }} />
                </div>
              ) : formData.audio_url ? (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '5px' }}>Audio saat ini:</p>
                  <audio controls src={formData.audio_url} style={{ width: '100%' }} />
                </div>
              ) : null}
            </div>
          )}

          <div className="form-group form-group--last">
            <label className="form-label">Deskripsi Karya</label>
            <textarea
              required
              rows={3}
              className="form-control"
              placeholder="Jelaskan sejarah, filosofi, atau keunikan karya seni ini..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={loading}
            >
              {loading ? 'Mengunggah...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}