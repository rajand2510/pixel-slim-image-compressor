import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ImageCompressorComponent from './ImageCompressorComponent';
import MultipleImageCompressorPage from './MultipleImageCompressorPage';
import './App.css'; 
// Placeholder for logo
const LogoWithName = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src="logo.png" alt="PixelSlim Logo" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
    <h1 style={{ color: '#3498db', marginBottom: '0', fontSize: '24px' }}>PixelSlim</h1>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <LogoWithName />
        </header>

        {/* Navigation links */}
        <nav className="navbar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Single Image Compression
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/multiple" className="nav-link">
                Multiple Image Compression
              </Link>
            </li>
          </ul>
        </nav>

        {/* Routing */}
        <Routes>
          <Route path="/" element={<ImageCompressorComponent />} />
          <Route path="/multiple" element={<MultipleImageCompressorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
