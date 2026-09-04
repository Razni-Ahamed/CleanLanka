import { NavLink } from 'react-router-dom';

function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" end>CleanLK</NavLink>
      <NavLink to="/report">Report an Issue</NavLink>
      <NavLink to="/reports">Browse Reports</NavLink>
      <NavLink to="/admin">Admin</NavLink>
    </nav>
  );
}

export default Nav;
