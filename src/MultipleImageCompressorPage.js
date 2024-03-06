import React, { useState } from 'react';
import ImageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from './MultipleImageCompressorPage.module.css'; // Import CSS module

function MultipleImageCompressorPage() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [targetSizeKB, setTargetSizeKB] = useState(1000); // Default to 1000 KB

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
    setCompressedImages([]); // Reset compressed images when new images are selected
  };

  const compressImages = async () => {
    if (selectedImages.length === 0) {
      alert('Please select images before compressing.');
      return;
    }

    setIsCompressing(true);

    try {
      const targetSizeMB = targetSizeKB / 1024;

      const compressionPromises = selectedImages.map(async (image) => {
        const options = {
          maxSizeMB: targetSizeMB,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };

        const compressedFile = await ImageCompression(image, options);

        return { file: compressedFile, originalSize: image.size, compressedSize: compressedFile.size };
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
      if (compressedImages.length === 1) {
        // If only one image is compressed, download it directly
        const imageBlob = compressedImages[0].file;
        saveAs(imageBlob, 'compressed_image.jpg');
      } else {
        // If multiple images are compressed, create a zip file
        const zip = new JSZip();
  
        compressedImages.forEach(({ file }, index) => {
          const fileName = `compressed_image_${index + 1}.jpg`;
          zip.file(fileName, file);
        });
  
        zip.generateAsync({ type: 'blob' }).then((content) => {
          saveAs(content, 'compressed_images.zip');
        });
      }
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
        <div className={styles.downloadLinkContainer}>
          <button onClick={downloadCompressedImages} className={styles.downloadButton}>
            Download Compressed Images
          </button>
        </div>
      )}

      <div className={styles.imageContainer}>
        <div className={styles.imageBox}>
          <p>Original Images</p>
          {selectedImages.map((originalImage, index) => (
            <div key={index}>
              <img src={URL.createObjectURL(originalImage)} alt={`Original Image ${index + 1}`} />
              <p>Original Size: {Math.round(originalImage.size / 1024)} KB</p>
            </div>
          ))}
        </div>
        <div className={styles.imageBox}>
          <p>Compressed Images</p>
          {compressedImages.map(({ file, compressedSize }, index) => (
            <div key={index}>
              <img src={URL.createObjectURL(file)} alt={`Compressed Image ${index + 1}`} />
              <p>Compressed Size: {Math.round(compressedSize / 1024)} KB</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default MultipleImageCompressorPage;
