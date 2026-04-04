import React, { useState } from 'react';

/**
 * SyllabiXtract Starter Template
 * This component handles:
 * 1. File selection (PDF only)
 * 2. Uploading to the FastAPI backend on local host for testing
 * 3. Displaying the raw JSON response from local host
 */
function App() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  // 1. Capture the file from the input
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  // 2. Ship the file to the backend
  const handleUpload = async () => {
    if (!file) {
      alert("Select a syllabus first!");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // NOTE: Replace this URL with the actual Render backend URL once deployed
      const response = await fetch('https://syllabixtract-api.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Backend upload failed');

      const data = await response.json();
      setExtractedData(data); // This is where Gemini's JSON will live
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to reach the backend. Is your Render server awake?");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>SyllabiXtract</h1>
        <p>Convert your messy syllabus into an organized calendar in seconds.</p>
      </header>

      <main style={styles.uploadCard}>
        <div style={styles.dropZone}>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange} 
            style={styles.fileInput}
          />
          <p style={styles.fileHint}>
            {file ? `Selected: ${file.name}` : "Click to select your syllabus PDF"}
          </p>
        </div>

        <button 
          onClick={handleUpload} 
          disabled={isUploading}
          style={{
            ...styles.button,
            backgroundColor: isUploading ? '#ccc' : '#007bff'
          }}
        >
          {isUploading ? 'Processing with Gemini...' : 'Extract Schedule'}
        </button>
      </main>

      {/* Preview Section: This is where we'll later build the visual calendar */}
      {extractedData && (
        <section style={styles.resultsSection}>
          <h3>Extracted Schedule Data</h3>
          <pre style={styles.jsonPreview}>
            {JSON.stringify(extractedData, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}

// Some basic Styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: 'system-ui, sans-serif',
    color: '#333'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '2.5rem',
    color: '#007bff',
    marginBottom: '10px'
  },
  uploadCard: {
    background: '#f9f9f9',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  dropZone: {
    border: '2px dashed #007bff',
    padding: '40px',
    borderRadius: '8px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  fileInput: {
    marginBottom: '10px'
  },
  fileHint: {
    fontSize: '0.9rem',
    color: '#666'
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  resultsSection: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px'
  },
  jsonPreview: {
    fontSize: '0.85rem',
    backgroundColor: '#2d2d2d',
    color: '#f8f8f2',
    padding: '15px',
    borderRadius: '6px',
    overflowX: 'auto'
  }
};

export default App;