import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MultipleImageCompressorPage from './MultipleImageCompressorPage';
import { FaTachometerAlt, FaImage, FaThumbsUp } from 'react-icons/fa'; // Import icons from Font Awesome
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

        {/* Render only the MultipleImageCompressorPage */}
        <Routes>
          <Route path="/" element={<MultipleImageCompressorPage />} />
        </Routes>

        {/* Feature Blocks */}
        <div className="feature-blocks-container">
  <div className="feature-block">
    <FaTachometerAlt size={32} />
    <p>Lightning-fast compression, zero wait time</p>
  </div>
  <div className="feature-block">
    <FaImage size={32} />
    <p>Pixel-perfect compression, no loss in brilliance</p>
  </div>
  <div className="feature-block">
    <FaThumbsUp size={32} />
    <p>Effortless compression, just a click away.</p>
  </div>
</div>
      </div>
    </Router>
  );
}

export default App;
