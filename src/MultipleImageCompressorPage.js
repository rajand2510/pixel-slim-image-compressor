// MultipleImageCompressorPage.js

import React, { useState } from 'react';
import ImageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from './MultipleImageCompressorPage.module.css'; // Import CSS module

function MultipleImageCompressorPage() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [targetSizeKB, setTargetSizeKB] = useState(1000); // Default to 200 KB

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
  };

  const compressImages = async () => {
    if (selectedImages.length === 0) {
      alert('Please select images before compressing.');
      return;
    }

    setIsCompressing(true);

    try {
      const targetSizeMB = (targetSizeKB / 1024) * 1;

      const compressionPromises = selectedImages.map(async (image) => {
        const options = {
          maxSizeMB: targetSizeMB,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };

        const originalSize = image.size;

        const compressedFile = await ImageCompression(image, options);

        const compressedSize = compressedFile.size;

        return {
          compressed: { file: compressedFile, size: compressedSize },
        };
      });

      const compressedResults = await Promise.all(compressionPromises);

      setCompressedImages(compressedResults);
      setIsCompressing(false);
    } catch (error) {
      console.error('Error compressing images:', error);
      setIsCompressing(false);
    }
  };

  const downloadCompressedImages = () => {
    if (compressedImages.length > 0) {
      const zip = new JSZip();

      compressedImages.forEach(({ compressed }, index) => {
        const fileName = `compressed_image_${index + 1}.jpg`;
        zip.file(fileName, compressed.file);
      });

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'compressed_images.zip');
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.inputContainer}>
          <label className={styles.uploadBtnWrapper}>
            <button className={styles.btn}>Upload images</button>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          </label>
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.uploadBtnWrapper}>
            Max Size Require(KB):
            <input
              type="number"
              value={targetSizeKB}
              onChange={(e) => setTargetSizeKB(parseInt(e.target.value))}
            />
          </label>
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={compressImages} disabled={isCompressing}>
            {isCompressing ? 'Compressing...' : 'Compress Images'}
          </button>
          {isCompressing && <div className={styles.loader}></div>}
        </div>
      </div>

      {compressedImages.length > 0 && (
        <div className={styles.box}>
          <div className={styles.imageContainer}>
            {compressedImages.map(({ compressed }, index) => (
              <div className={styles.imageBox} key={index}>
                <img src={URL.createObjectURL(compressed.file)} alt={`Image ${index + 1}`} /> 
                <p>Compressed Size: {Math.round(compressed.size / 1024)} KB</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {compressedImages.length > 0 && (
        <div className={styles.downloadLinkContainer}>
          <button onClick={downloadCompressedImages} className={styles.downloadButton}>
            Download Compressed Images
          </button>
        </div>
      )}
    </div>
  );
}

export default MultipleImageCompressorPage;
