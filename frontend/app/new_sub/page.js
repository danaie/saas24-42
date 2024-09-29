"use client";

import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import Nav from '../components/Nav';
import Info from '../components/info';
import axios from 'axios';
import AdminNav from '../components/AdminNav';
import useUserSession from '../hooks/useUserSession'; // Import the custom hook

export default function Home() {
  // State for dropdown selection
  const { userId, username, role } = useUserSession();
  const [selectedModel, setSelectedModel] = useState('Model A');
  
  // State for handling files uploaded via drag and drop
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submissionName, setSubmissionName] = useState('');
  //const username = 'testtt'; // Hardcoded for now
  const [successMessage, setSuccessMessage] = useState('');
  
  // Add this state to handle error messages (for completeness)
  const [errorMessage, setErrorMessage] = useState('');
  

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
    if (selectedModel !== 'Model A') {
        alert('Only Model A works. The others will come soon.');
        return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
        let jsonData;
        try {
            jsonData = JSON.parse(event.target.result);
        } catch (error) {
            setErrorMessage('Invalid JSON format in file.');
            return;
        }

        // Add required fields
        jsonData.user_id = userId;
        jsonData.username = username;
        jsonData.submission_name = submissionName;
        jsonData.timestamp = new Date().toISOString(); // Current timestamp

        // Now make the API call
        axios.post('http://localhost:8042/api/submitProblem', jsonData, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
          if (response && response.data) {
              console.log('File uploaded successfully:', response.data);
              setSuccessMessage('Submission successful!');
              setErrorMessage(''); // Clear any previous error messages
              setTimeout(() => {
                  window.location.reload(); // Reload page after a short delay
              }, 2000); // Reload after 2 seconds
          } else {
              console.error('Response data is missing or undefined.');
          }
      })
      .catch((error) => {
          if (error.response) {
              // Use the error message from the backend
              setErrorMessage(error.response.data.message || 'An unexpected error occurred.');
          } else {
              console.error('Error uploading file:', error.message || 'Unknown error occurred');
              setErrorMessage('Submission failed. ' + (error.message || 'Unknown error occurred.'));
          }
      });
  };

  if (uploadedFiles) {
      reader.readAsText(uploadedFiles); // Read the uploaded file as text
  } else {
      setErrorMessage('No file uploaded.');
  }
};

  return (
    <div className="flex flex-col min-h-screen">

      {role === 'admin' ? <AdminNav /> : <Nav />}
      <Info/>

      {/* Main Content Area */}
      <main className="flex-grow p-5 bg-gray-100">
        {/* Dropdown for solver models */}
        <div className="flex justify-center mb-5">
          <label htmlFor="machineModel" className="font-semibold mt-2 text-black">Select Solver Model: </label>
          <select
            id="machineModel"
            className="ml-3 p-2 border border-gray-400 rounded text-black"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="Model A">Model A</option>
            <option value="Model B">Model B</option>
            <option value="Model C">Model C</option>
          </select>
        </div>

        <div className="flex justify-center mb-5">
          <label htmlFor="submissionName" className="font-semibold mt-2 text-black">Submission Name: </label>
          <input
            type="text"
            id="submissionName"
            className="ml-3 p-2 border border-gray-400 rounded text-black"
            value={submissionName}
            onChange={(e) => setSubmissionName(e.target.value)}
          />
        </div>


        {/* Metadata and Input Data Windows */}
        <div className="flex justify-center mb-10">
        {/* Input Data Window */}
          <div className="w-1/3 p-6 border border-gray-300 shadow-lg bg-white h-96 overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-black">Input Data</h2>
              <div>
                <p className='text-black'>
                  The input should be a JSON file. It should contain an array with the
                  coordinates (latitude and longitude) of 20 or 200 or 1000 locations as
                  float numbers. Also it should contain the following:
                  number of vehicles (num_vehicles), depot, and max_distance, all as integers.
                </p>
                <div className="flex justify-left">
                </div>
              </div>
            </div>
          </div>


        {/* Drag and Drop Area */}

        <div
          className="p-6 border-2 border-dashed border-blue-500 rounded-lg bg-blue-100 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p className="text-lg font-semibold text-black">
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
            <li className="text-sm text-black">{uploadedFiles.name}</li>
          </ul>
        )}
        </div>
        {/* Success or Error Messages */}
        {successMessage && (
          <div className="text-green-500 text-center mt-3">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="text-red-500 text-center mt-3">
            {errorMessage}
          </div>
        )}


        <div  className="flex justify-center p-5">
          <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={postProblem}>Submit Problem</button>
        </div>
      </main>
    </div>
  );
}
