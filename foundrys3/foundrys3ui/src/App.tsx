import React, { useState } from 'react'
import axios from 'axios';
import './App.css';

const App = () => {
  const [status, setStatus] = useState("Select a file to upload");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    setStatus("Getting presigned URL...");
    
    try {
      const response = await axios.post("http://localhost:4000/get-presigned-url", {
        fileName: file?.name,
        fileType: file?.type,
      });

      const { uploadUrl } = response.data;
      console.log('Received presigned URL:', uploadUrl);

      setStatus("Uploading file directly to S3...");

      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file?.type,
        },
      });

      setStatus('✅ Upload successful!');
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('❌ Upload failed.');
    }
  };

  return (
    <div className='App'>
      <h1>S3 Direct Upload with Presigned URL</h1>
      <input type='file' onChange={handleFileChange} />
      <p>Status: {status}</p>
    </div>
  )
}

export default App;
