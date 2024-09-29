// pages/index.js
"use client";
import { useEffect, useState } from 'react';

import Nav from '../components/Nav';
import AdminNav from '../components/AdminNav';
import Info from '../components/info';
import axios from 'axios';
import useUserSession from '../hooks/useUserSession'; // Import the custom hook


export default function Submissions() {
  // Sample userId for fetching data
  const { userId, role } = useUserSession(); // Use the hook to get userId
  //const { userId } = "abcd";
  console.log(`user_id: ${userId}`);

  // State for locked submissions and pending submissions fetched from the API
  const [lockedSubmissions, setLockedSubmissions] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [finishedSubmissions, setFinishedSubmissions] = useState([]);
  const [unlockError, setUnlockError] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch locked submissions and pending submissions when component loads
  useEffect(() => {
    const fetchLockedSubmissions = async () => {

      if (!userId) {
        console.error('No user ID available for fetching submissions.');
        setLoading(false);
        return; // Exit early if userId is not available
      }

      try {
        const response = await axios.get(`http://localhost:8042/api/user_locked/${userId}`);
        const sortedLocked = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setLockedSubmissions(sortedLocked);
      } catch (error) {
        console.error('Error fetching locked submissions:', error);
      }
    };

    const fetchPendingSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:8042/api/get_pending/${userId}`);
        const sortedPending = response.data.result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setPendingSubmissions(sortedPending); // Assuming data is in the 'result' array
      } catch (error) {
        console.error('Error fetching pending submissions:', error);
      }
    };
    const fetchFinishedSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:8042/api/get_finished/${userId}`);
        const sortedFinished = response.data.result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setFinishedSubmissions(sortedFinished); // Assuming the data is in 'result' array
      } catch (error) {
        console.error('Error fetching finished submissions:', error);
      }
    };

    fetchFinishedSubmissions();
    fetchLockedSubmissions();
    fetchPendingSubmissions(); // Fetch pending submissions from new API route
  }, [userId]);

  // Show loading message while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

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

  const DeleteConfirm = (subId, status) => {
    if (status === 'running') {
      alert("The submission is currently running and cannot be deleted.");
      return; // Exit the function without deleting
    }
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
  

  const UnlockConfirm = (subId, extraCredits) => {
    const unlock = confirm(`Unlocking the results of this process will cost ${extraCredits} credits.\nAre you sure?`);
    if (unlock) {
        // Call the API Gateway to unlock the submission
        axios.post('http://localhost:8042/api/unlock_submission', {
            subId: subId // Send the subId in the request body
        })
        .then(response => {
            console.log('Submission unlocked successfully:', response.data);
            // Optionally, you can refresh the list of locked submissions or show a success message
            window.location.reload(); // Reload the page to reflect the unlocked submission
        })
        .catch(error => {
            if (error.response && error.response.status === 406) {
                setUnlockError('Not enough credits to unlock this submission.'); // Set error message
            } else {
                console.error('Error unlocking submission:', error.response?.data || error.message);
            }
        });
    }
};


  // Helper to simulate a download
  const downloadFile = (submissionData) => {
    const blob = new Blob([JSON.stringify(submissionData, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${submissionData.submission_name}_details.json`;  // Name of the downloaded file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Navbar */}
      {role === 'admin' ? <AdminNav /> : <Nav />}
      <Info/>
      {/* Show unlock error message if it exists */}
      {unlockError && <div className="bg-red-500 text-white p-2 mb-4">{unlockError}</div>}

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
                  <p><button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => DeleteConfirm(item._id, item.status)}>Delete</button></p>
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
                  <p><button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => UnlockConfirm(item._id, item.extra_credits)}>Unlock</button></p>
                  <p><button className="bg-red-500 text-white py-2 px-4 rounded" onClick={() => DeleteConfirm(item._id, item.status)}>Delete</button></p>
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
                  <p><button className="bg-green-500 text-white py-2 px-4 rounded" onClick={() => downloadFile(item)}>Download</button></p>
                  <p><button className="bg-red-500 text-white py-2 px-4 rounded" onClick={() => DeleteConfirm(item._id, item.status)}>Delete</button></p>
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
