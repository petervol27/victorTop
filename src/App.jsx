import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

function About() {
  return <h1>About</h1>;
}
function Pricing() {
  return <h1>Pricing</h1>;
}
function Gallery() {
  return <h1>Gallery</h1>;
}

export default function App() {
  return (
    <div className="app">
      <HashRouter>
        {/* Navbar */}
        <nav className="navbar-custom">
          <div className="d-flex flex-column align-items-center">
            {/* Logo */}
            <h4 className="logo">🔧</h4>

            {/* Links */}
            <div className="nav-links">
              <NavLink to="/" end className="nav-link-custom">
                Home ▼
              </NavLink>
              <NavLink to="/about" className="nav-link-custom">
                About ▼
              </NavLink>
              <NavLink to="/pricing" className="nav-link-custom">
                Pricing ▼
              </NavLink>
              <NavLink to="/gallery" className="nav-link-custom">
                Gallery ▼
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>
      </HashRouter>
    </div>
  );
}
