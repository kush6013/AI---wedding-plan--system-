// Navbar - top navigation bar visible on all pages
// Shows the app name and navigation links

import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  // useLocation tells us which page we're currently on
  // This helps us highlight the active link
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* App logo/name - links to home */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">&#128144;</span>
          AI Wedding Planner
        </Link>

        {/* Navigation links */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/create-wedding"
            className={`nav-link ${location.pathname === '/create-wedding' ? 'active' : ''}`}
          >
            Create Wedding
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
