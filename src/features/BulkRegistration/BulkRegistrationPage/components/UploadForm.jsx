import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-paragon-topaz';

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (f && f.name.endsWith('.csv')) { setFile(f); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleZoneClick = () => inputRef.current.click();
  const handleZoneKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { inputRef.current.click(); }
  };

  return (
    <div className="upload-card">
      <div className="required-columns">
        <span className="label">Required columns:</span>
        {['First name', 'Last name', 'Full name', 'Email', 'Password'].map((col) => (
          <span key={col} className="column-chip">{col}</span>
        ))}
      </div>

      <button
        type="button"
        className={`drop-zone ${dragging ? 'drop-zone--active' : ''} ${file ? 'drop-zone--has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleZoneClick}
        onKeyDown={handleZoneKeyDown}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <>
            <i className="fa-sharp fa-thin fa-file-spreadsheet drop-zone__icon" />
            <span className="drop-zone__filename">{file.name}</span>
            <span className="drop-zone__hint">Click to change file</span>
          </>
        ) : (
          <>
            <i className="fa-sharp fa-thin fa-file-spreadsheet drop-zone__icon" />
            <span className="drop-zone__text">Choose CSV File</span>
            <span className="drop-zone__hint">or drag and drop it here</span>
          </>
        )}
      </button>

      <div className="upload-actions">
        <Button
          variant="primary"
          disabled={!file}
          onClick={() => file && onUpload(file)}
        >
          <i className="fa-light fa-upload" />
          Upload &amp; Process
        </Button>
      </div>
    </div>
  );
};

UploadForm.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default UploadForm;
