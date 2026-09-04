import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Nav() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <nav className="nav">
      <NavLink to="/" end className={({ isActive }) => `nav-brand${isActive ? ' active' : ''}`}>
        CleanLK
      </NavLink>
      <NavLink to="/report">Report an Issue</NavLink>
      <NavLink to="/reports">Browse Reports</NavLink>
      {isAdmin && <NavLink to="/admin">Admin</NavLink>}

      <div className="nav-auth">
        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button type="button" className="btn btn-sm btn-secondary" onClick={handleLogout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;
