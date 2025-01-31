import React, { useRef } from "react";
import '../../public/attachement_img.png';

const ImageUpload = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click(); // Open file input when image is clicked
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file); // Pass the file to the parent component
    }
  };

  return (
    <div>
      {/* Clickable Image */}
      <img
        src="../../public/attachement_img.png" // Replace with your own image
        alt="Upload"
        style={{ cursor: "pointer", width: "30px", height: "30px" }}
        onClick={handleImageClick}
      />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".pdf,.mp3,.mov,.mp4" // Only accept these file types
      />
    </div>
  );
};

export default ImageUpload;
