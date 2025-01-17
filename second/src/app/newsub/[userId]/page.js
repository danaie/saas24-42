"use client";

import { useState } from 'react';
import { useRef } from 'react';
import Nav from '../../components/Nav';
import axios from 'axios';

export default function Home() {
  // State for dropdown selection
  const [selectedModel, setSelectedModel] = useState('Model A');
  
  // State for handling files uploaded via drag and drop
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Sample data for metadata and input data
  const metadata = [
    { id: 1, title: 'Meta Record 1', data: 'Meta Data 1' },
    { id: 2, title: 'Meta Record 2', data: 'Meta Data 2' },
    { id: 3, title: 'Meta Record 3', data: 'Meta Data 3' },
  ];

  const inputData = [
    { id: 1, title: 'Input Record 1', data: 'Input Data 1' },
    { id: 2, title: 'Input Record 2', data: 'Input Data 2' },
    { id: 3, title: 'Input Record 3', data: 'Input Data 3' },
  ];

  const fileInputRef = useRef(null);

  // Handle drag-and-drop file uploads
  const handleDrop = (e) => {
    e.preventDefault();
    // για πολλά files const files = Array.from(e.dataTransfer.files);
    const files = e.dataTransfer.files[0]; // Only accept the first file
    setUploadedFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const plusClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (e) => {
    // για πολλά files (μαζί με multiple στο input)const files = Array.from(e.target.files);
    const files = e.target.files[0]; // Only accept the first file
    setUploadedFiles(files);
  };

  const postProblem = () => {
    const formData = new FormData();
    formData.append('model', selectedModel);
    formData.append('file', uploadedFiles);
    axios.post('http://localhost:8000', formData, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('File uploaded successfully:', response.data);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  }

  return (
    <div className="flex flex-col min-h-screen">

      <Nav/>

      {/* Main Content Area */}
      <main className="flex-grow p-5">
        {/* Dropdown for solver models */}
        <div className="flex justify-center mb-5">
          <label htmlFor="machineModel" className="font-semibold mt-2">Select Solver Model: </label>
          <select
            id="machineModel"
            className="ml-3 p-2 border border-gray-400 rounded"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="Model A">Model A</option>
            <option value="Model B">Model B</option>
            <option value="Model C">Model C</option>
          </select>
        </div>


        {/* Metadata and Input Data Windows */}
        <div className="flex gap-10 mb-10">
          {/* Metadata Window */}
          <div className="w-1/2 p-4 border border-gray-300 shadow-lg bg-white h-64 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-3">Metadata</h2>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="text-left">ID</th>
                  <th className="text-left">Title</th>
                  <th className="text-left">Data</th>
                </tr>
              </thead>
              <tbody>
                {metadata.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.title}</td>
                    <td>{record.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Input Data Window */}
          <div className="w-1/2 p-4 border border-gray-300 shadow-lg bg-white h-64 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-3">Input Data</h2>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="text-left">ID</th>
                  <th className="text-left">Title</th>
                  <th className="text-left">Data</th>
                </tr>
              </thead>
              <tbody>
                {inputData.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.title}</td>
                    <td>{record.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drag and Drop Area */}

        <div
          className="p-6 border-2 border-dashed border-blue-500 rounded-lg bg-blue-100 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-lg font-semibold">
            Drag and Drop Files Here
            <svg className="w-5 inline-block ml-3 cursor-pointer" onClick={plusClick}data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
            </svg>
            <input type="file" className="hidden" ref={fileInputRef} 
            onChange={handleFileSelect} />
          </p>
          
          { //Αυτός ο κώδικας είναι για upload πολλών files
          /* uploadedFiles.length > 0 && (
            <ul className="mt-3">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="text-sm">{file.name}</li>
              ))}
            </ul>
          )*/}
          {uploadedFiles && (
          <ul className="mt-3">
            <li className="text-sm">{uploadedFiles.name}</li>
          </ul>
        )}
        </div>

        <div  className="flex justify-center p-5">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={postProblem}>Submit Problem</button>
        </div>
      </main>
    </div>
  );
}






