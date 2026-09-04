import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const WASTE_TYPES = ['Household', 'Plastic', 'Organic', 'Other'];
const DESCRIPTION_LIMIT = 300;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function ReportForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [location, setLocation] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [description, setDescription] = useState('');
  // Signed-in reporters get their name as the default byline but can clear it
  // to post anonymously, so reporting never requires an account.
  const [reportedBy, setReportedBy] = useState(user ? user.name : '');

  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const nextErrors = {};

    if (!location.trim()) {
      nextErrors.location = 'Please tell us where the problem is.';
    }

    if (!wasteType || !WASTE_TYPES.includes(wasteType)) {
      nextErrors.wasteType = 'Please choose a waste type.';
    }

    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      nextErrors.description = 'Please describe the problem.';
    } else if (trimmedDescription.length > DESCRIPTION_LIMIT) {
      nextErrors.description = `Please keep the description under ${DESCRIPTION_LIMIT} characters.`;
    }

    return nextErrors;
  }

  function clearFieldError(field) {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    setImageError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Please choose an image under 5MB.');
      e.target.value = '';
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setImageUrl('');
    setImageUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setImageUrl(data.secure_url);
    } catch {
      setImageError('Photo upload failed. You can still submit the report without a photo.');
    } finally {
      setImageUploading(false);
    }
  }

  function handleRemoveImage() {
    setImagePreview('');
    setImageUrl('');
    setImageError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      await api.post('/api/reports', {
        location: location.trim(),
        wasteType,
        description: description.trim(),
        imageUrl: imageUrl || undefined,
        reportedBy: reportedBy.trim() || undefined,
      });

      setSubmitted(true);
      setTimeout(() => navigate('/reports'), 1200);
    } catch (err) {
      setSubmitError(
        err.response?.data?.error || 'Could not submit your report. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="card">
        <p>Thanks — your report has been submitted. Taking you to the reports list…</p>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="location">
          Where is the problem?
        </label>
        <input
          id="location"
          className="form-input"
          type="text"
          placeholder="e.g. Station Road, Nugegoda"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            clearFieldError('location');
          }}
        />
        {errors.location && <p className="field-error">{errors.location}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="wasteType">
          What kind of waste is it?
        </label>
        <select
          id="wasteType"
          className="form-select"
          value={wasteType}
          onChange={(e) => {
            setWasteType(e.target.value);
            clearFieldError('wasteType');
          }}
        >
          <option value="">Select a type…</option>
          {WASTE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.wasteType && <p className="field-error">{errors.wasteType}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Describe the problem
        </label>
        <textarea
          id="description"
          className="form-textarea"
          placeholder="e.g. Bin overflowing for 3 days"
          value={description}
          maxLength={DESCRIPTION_LIMIT}
          onChange={(e) => {
            setDescription(e.target.value);
            clearFieldError('description');
          }}
        />
        <p
          className={
            description.length > DESCRIPTION_LIMIT - 30 ? 'char-counter char-counter-warn' : 'char-counter'
          }
        >
          {description.length}/{DESCRIPTION_LIMIT}
        </p>
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="photo">
          Photo (optional)
        </label>
        <input id="photo" type="file" accept="image/*" onChange={handleFileChange} />
        {imageUploading && <p className="field-hint">Uploading photo…</p>}
        {imageError && <p className="field-error">{imageError}</p>}
        {imagePreview && (
          <div className="photo-preview">
            <img src={imagePreview} alt="Preview" />
            <button type="button" className="btn btn-secondary" onClick={handleRemoveImage}>
              Remove photo
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reportedBy">
          Your name (optional)
        </label>
        <input
          id="reportedBy"
          className="form-input"
          type="text"
          placeholder="Leave blank to post as Anonymous"
          value={reportedBy}
          onChange={(e) => setReportedBy(e.target.value)}
        />
      </div>

      {submitError && <p className="field-error">{submitError}</p>}

      <button type="submit" className="btn btn-primary btn-large" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit report'}
      </button>
    </form>
  );
}

export default ReportForm;
