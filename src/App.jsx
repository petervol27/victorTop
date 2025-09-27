import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import Pricing from './pages/Pricing';
import Gallery from './pages/Gallery';

export default function App() {
  return (
    <div className="app" dir="rtl">
      <HashRouter>
        {/* Navbar */}
        <nav className="navbar-custom">
          <div className="d-flex flex-column align-items-center">
            {/* Logo */}
            <h4 className="logo">🔧</h4>

            {/* Links */}
            <div className="nav-links">
              <NavLink to="/" end className="nav-link-custom">
                בית ▼
              </NavLink>

              <NavLink to="/pricing" className="nav-link-custom">
                מחירון ▼
              </NavLink>
              <NavLink to="/gallery" className="nav-link-custom">
                גלריה ▼
              </NavLink>
              <a
                href="https://wa.me/972548841511"
                className="nav-link-custom"
                target="_blank"
                rel="noopener noreferrer"
              >
                צור קשר ▼
              </a>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>
      </HashRouter>
    </div>
  );
}
