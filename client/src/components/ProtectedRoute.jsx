import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="loading">Checking your sign-in…</p>;
  }

  if (!user) {
    // `from` lets the login page send the visitor back where they were headed.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return (
      <div className="page">
        <h1>Staff access only</h1>
        <div className="card empty-state">
          <p>
            You are signed in as {user.name}, but this page is limited to
            municipal staff accounts.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
