import React, { useState, useEffect } from 'react';

const FileUploadPreview = () => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [manipulatedImage, setManipulatedImage] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileType(e.target.files[0].type);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    // upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Image manipulation API integration (example with a placeholder API)
    if (fileType.startsWith('image/')) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('http://localhost:3000/manipulate-image', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const manipulatedImageBlob = await response.blob();
          const manipulatedImageUrl = URL.createObjectURL(manipulatedImageBlob);
          setManipulatedImage(manipulatedImageUrl);
        }
      } catch (error) {
        console.error('Error manipulating image:', error);
      }
    }

    setIsUploading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'demo' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const renderPreview = () => {
    if (!preview) return null;

    switch (true) {
      case fileType.startsWith('image/'):
        return <img src={preview} alt="Preview" className="max-w-full h-auto" />;
      case fileType.startsWith('audio/'):
        return <audio src={preview} controls className="w-full" />;
      case fileType.startsWith('video/'):
        return <video src={preview} controls className="max-w-full h-auto" />;
      case fileType === 'application/pdf':
        return <iframe src={preview} className="w-full h-64" title="PDF Preview" />;
      default:
        return <p className="text-gray-500">No preview available</p>;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">File Upload and Preview</h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
      {preview && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Preview:</h3>
          {renderPreview()}
        </div>
      )}
      {isUploading && (
        <div className="mt-4 p-2 bg-yellow-100 text-yellow-700 rounded">
          Uploading and processing file...
        </div>
      )}
      {manipulatedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Manipulated Image:</h3>
          <img src={manipulatedImage} alt="Manipulated" className="max-w-full h-auto" />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Upload and Process
      </button>
    </div>
  );
};

export default FileUploadPreview;