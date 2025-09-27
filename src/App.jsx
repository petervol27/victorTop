import { HashRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Home</h1>;
}
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
    <HashRouter>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </HashRouter>
  );
}
