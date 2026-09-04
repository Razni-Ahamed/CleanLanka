import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MIN_PASSWORD_LENGTH = 8;

function RegisterPage() {
  const navigate = useNavigate();
  const { register, user, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <p className="loading">Checking your sign-in…</p>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  function clearFieldError(field) {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate() {
    const nextErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'Please tell us your name.';
    }

    if (!email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Please use a password of at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'The two passwords do not match.';
    }

    return nextErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      await register(name.trim(), email.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setSubmitError(
        err.response?.data?.error || 'Could not create your account. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page page-narrow">
      <h1>Create an account</h1>

      <p className="field-hint">
        An account lets your reports carry your name. You can still report an
        issue without signing in.
      </p>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            className="form-input"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearFieldError('name');
            }}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            className="form-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError('email');
            }}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="form-input"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError('password');
            }}
          />
          <p className="field-hint">At least {MIN_PASSWORD_LENGTH} characters.</p>
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            className="form-input"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearFieldError('confirmPassword');
            }}
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
        </div>

        {submitError && <p className="field-error">{submitError}</p>}

        <button type="submit" className="btn btn-primary btn-large" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="field-hint auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
