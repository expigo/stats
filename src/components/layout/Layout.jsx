import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Home, Book, ExternalLink, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Layout.css';

export const Layout = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/chapters', label: 'Chapters', icon: Book },
    { path: '/resources', label: 'Resources', icon: ExternalLink },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <BarChart3 className="logo-icon" />
            <span>Statistics for ML/DL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links desktop">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${isActive(path) ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="nav-links mobile">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${isActive(path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="main-content">{children}</main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Statistics for ML/DL. Built with React &amp; ❤️</p>
          <p>A comprehensive learning resource for aspiring ML/DL researchers</p>
        </div>
      </footer>
    </div>
  );
};
