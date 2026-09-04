import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || '/';

  if (loading) {
    return <p className="loading">Checking your sign-in…</p>;
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  function validate() {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    }

    if (!password) {
      nextErrors.password = 'Please enter your password.';
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
      const signedIn = await login(email.trim(), password);
      navigate(signedIn.role === 'admin' ? '/admin' : redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(
        err.response?.data?.error || 'Could not sign you in. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page page-narrow">
      <h1>Sign in</h1>

      <form className="card" onSubmit={handleSubmit} noValidate>
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
              setErrors(({ email: _removed, ...rest }) => rest);
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(({ password: _removed, ...rest }) => rest);
            }}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        {submitError && <p className="field-error">{submitError}</p>}

        <button type="submit" className="btn btn-primary btn-large" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="field-hint auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
