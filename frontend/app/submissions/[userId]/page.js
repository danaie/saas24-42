// pages/index.js
"use client";
import { useEffect, useState } from 'react';

import Nav from '../../components/Nav';
import axios from 'axios';

export default function Home({params}) {
  // Sample userId for fetching data
  const userId = "abcd";

  // State for locked submissions and pending submissions fetched from the API
  const [lockedSubmissions, setLockedSubmissions] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [finishedSubmissions, setFinishedSubmissions] = useState([]);

  // Fetch locked submissions and pending submissions when component loads
  useEffect(() => {
    const fetchLockedSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:8042/api/user_locked/${userId}`);
        setLockedSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching locked submissions:', error);
      }
    };

    const fetchPendingSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:8042/api/get_pending/${userId}`);
        setPendingSubmissions(response.data.result); // Assuming data is in the 'result' array
      } catch (error) {
        console.error('Error fetching pending submissions:', error);
      }
    };
    const fetchFinishedSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:8042/api/get_finished/${userId}`);
        setFinishedSubmissions(response.data.result); // Assuming the data is in 'result' array
      } catch (error) {
        console.error('Error fetching finished submissions:', error);
      }
    };

    fetchFinishedSubmissions();
    fetchLockedSubmissions();
    fetchPendingSubmissions(); // Fetch pending submissions from new API route
  }, [userId]);

  // Functions for handling run, delete, and unlock actions with confirmation prompts
  const RunConfirm = (subId) => {
    const run = confirm("Starting to run this Submission costs 10 credits.\nAre you sure?");
    if (run){
      const data = new URLSearchParams();
      data.append('action', 'run');
      data.append('userId', `${params.userId}`);
      data.append('subId', subId);

      axios.post('YOUR_URL', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        console.log('Data posted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
    }
  }

  const DeleteConfirm = (subId) => {
    const del = confirm("Are you sure you want to delete this process?");
    if (del) {
      //const data = new URLSearchParams();
      //data.append('subId', subId);
  
      axios.post('http://localhost:8042/api/delete_sub_pending', {
        subId: subId // Send the subId as JSON
      }, {
        headers: {
          'Content-Type': 'application/json', // Set header to JSON
        },
      })
      .then(response => {
        console.log('Submission deleted successfully:', response.data);
        // You may also want to refresh the list of submissions or show a success message
        window.location.reload();
      })
      .catch(error => {
        console.error('Error deleting submission:', error.response?.data || error.message);
      });
    }
  };
  

  const UnlockConfirm = (subId) => {
    const unlock = confirm("Unlocking the results of this process will cost 10 credits.\nAre you sure?");
    if (unlock){
      const data = new URLSearchParams();
      data.append('action', 'unlock');
      data.append('userId', `${params.userId}`);
      data.append('subId', subId);

      axios.post('YOUR_URL', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        console.log('Data posted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error posting data:', error);
      });
    }
  }

  // Helper to simulate a download
  const downloadFile = () => {
    const a = document.createElement('a');
    a.href = '/dfile.json';  // Path relative to the public folder
    a.download = 'dfile.json';        // The downloaded file will be named 'dfile.json'
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Navbar */}
      <Nav/>

      {/* Main content */}
      <main className="flex-grow p-5 bg-gray-100">
        {/* First list: Submissions (Static Sample) */}
        <h2 className="text-2xl font-semibold text-center mb-5 text-black">My Submissions</h2>

        {/* Pending Submissions */}
        <h2 className="text-2xl font-semibold text-center mb-5 text-black">Pending Submissions</h2>
        <div className="flex flex-col gap-4 mb-10 max-h-64 overflow-y-auto">
          {pendingSubmissions.length > 0 ? (
            pendingSubmissions.map(item => (
              <div key={item._id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
                <div className="flex justify-between space-x-6 text-black">
                  <p><strong>Submission Name:</strong> {item.submission_name}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Timestamp:</strong> {new Date(item.timestamp).toLocaleString()}</p>
                  <p><button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => DeleteConfirm(item._id)}>Delete</button></p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black">No pending submissions found.</p>
          )}
        </div>

        
        {/* Locked Results */}
        <h2 className="text-2xl font-semibold text-center mb-5 text-black">Locked Results</h2>
        <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
          {lockedSubmissions.length > 0 ? (
            lockedSubmissions.map(item => (
              <div key={item._id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
                <div className="flex justify-between space-x-6 text-black">
                  <p><strong>Name:</strong> {item.submission_name}</p>
                  <p><strong>Timestamp:</strong> {new Date(item.timestamp).toLocaleString()}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Extra Credits:</strong> {item.extra_credits}</p>
                  <p><button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => UnlockConfirm(item._id)}>Unlock</button></p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black">No locked submissions available.</p>
          )}
        </div>

        {/* Finished Submissions */}
        <h2 className="text-2xl font-semibold text-center mb-5 text-black">Finished Submissions</h2>
        <div className="flex flex-col gap-4 mb-10 max-h-64 overflow-y-auto">
          {finishedSubmissions.length > 0 ? (
            finishedSubmissions.map(item => (
              <div key={item._id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
                <div className="flex justify-between space-x-6 text-black">
                  <p><strong>Submission Name:</strong> {item.submission_name}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  <p><strong>Timestamp:</strong> {new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black">No finished submissions found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
