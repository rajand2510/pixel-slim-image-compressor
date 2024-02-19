// ImageCompressorComponent.js

import React, { useState } from 'react';
import ImageCompression from 'browser-image-compression';
import './ImageCompressorComponent.css'; // Import your existing styles

function ImageCompressorComponent() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [targetSizeKB, setTargetSizeKB] = useState(500); // Default to 500 KB

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setOriginalSize(event.target.files[0]?.size);
  };

  const compressImage = async () => {
    if (!selectedImage) {
      alert('Please select an image before compressing.');
      return;
    }

    setIsCompressing(true);

    try {
      // Set initial compression options
      let options = {
        maxSizeMB: 1, // Maximum size in megabytes
        maxWidthOrHeight: 800, // Maximum width or height
        useWebWorker: true,
      };

      // Adjust the target file size based on the user input
      const targetSizeMB = targetSizeKB / 1024;
      options.maxSizeMB = targetSizeMB;

      const compressedFile = await ImageCompression(selectedImage, options);
      const compressedDataUrl = URL.createObjectURL(compressedFile);

      // Update state with the compressed image and size
      setCompressedImage(compressedDataUrl);
      setCompressedSize(compressedFile.size);
      setIsCompressing(false);
    } catch (error) {
      console.error('Error compressing image:', error);
      setIsCompressing(false);
    }
  };

  const downloadCompressedImage = () => {
    if (compressedImage) {
      const link = document.createElement('a');
      link.href = compressedImage;
      link.download = 'compressed_image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container">
      {/* Box 1 */}
      <div className="box">
        <div className="input-container">
          <label className="upload-btn-wrapper">
            <button className="btn">Upload a file</button>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        <div className="input-container">
          <label>
            Target Size (KB):
            <input
              type="number"
              value={targetSizeKB}
              onChange={(e) => setTargetSizeKB(parseInt(e.target.value))}
            />
          </label>
        </div>

        <div className="button-container">
          <button onClick={compressImage} disabled={isCompressing}>
            {isCompressing ? 'Compressing...' : 'Compress Image'}
          </button>
          {isCompressing && <p>Compressing image, please wait...</p>}
        </div>
      </div>
      {/* End Box 1 */}

      {/* Box 2 */}
      {selectedImage && (
        <div className="box">
          <div className="image-container">
            <div className="image-box">
              <h2 className="original-image">Original Image</h2>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Original"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              {originalSize && (
                <p>Original Size: {Math.round(originalSize / 1024)} KB</p>
              )}
            </div>

            {compressedImage && (
              <div className="image-box">
                <h2 className="compressed-image">Compressed Image</h2>
                <img
                  src={compressedImage}
                  alt="Compressed"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                {compressedSize && (
                  <p>Compressed Size: {Math.round(compressedSize / 1024)} KB</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* End Box 2 */}

      {/* Box 3 */}
      {compressedImage && (
        <div className="box">
          <div className="download-link-container">
            <button onClick={downloadCompressedImage} className="download-button">
              Download Compressed Image
            </button>
          </div>
        </div>
      )}
      {/* End Box 3 */}
    </div>
  );
}

export default ImageCompressorComponent;
