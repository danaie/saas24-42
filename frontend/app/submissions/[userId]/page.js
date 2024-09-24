// pages/index.js
"use client";
import { useEffect, useState } from 'react';

import Nav from '../../components/Nav';
import Link from 'next/link'
import axios from 'axios';

export default function Home({params}) {
  // Sample data for the first list (Submissions) with updated state values
  const submissions = [
    { id: 1, name: 'Item 1', creationDate: '2024-01-01', state: 'Unfinished' },
    { id: 2, name: 'Item 2', creationDate: '2024-02-15', state: 'Finished' },
    { id: 3, name: 'Item 3', creationDate: '2024-03-05', state: 'Locked' },
    { id: 4, name: 'Item 4', creationDate: '2024-04-10', state: 'Unfinished' },
  ];

  // Sample data for the second list (Pending Submissions)
  const pend_subs = [
    { id: 1, name: 'Pending Item 1', creationDate: '2024-06-01' },
    { id: 2, name: 'Pending Item 2', creationDate: '2024-06-15' },
    { id: 3, name: 'Pending Item 3', creationDate: '2024-07-05' },
  ];

  // Sample data for the third list (Locked Results) with the 'cost' field
  /*const locked = [
    { id: 1, name: 'Item A', runtime: '30s', submissionTime: '2024-05-01 10:00', resultTime: '2024-05-01 10:30', cost: '5' },
    { id: 2, name: 'Item B', runtime: '45s', submissionTime: '2024-05-02 11:00', resultTime: '2024-05-02 11:45', cost: '7' },
    { id: 3, name: 'Item C', runtime: '20s', submissionTime: '2024-05-03 12:00', resultTime: '2024-05-03 12:20', cost: '3' },
    { id: 4, name: 'Item D', runtime: '60s', submissionTime: '2024-05-04 13:00', resultTime: '2024-05-04 13:45', cost: '10' },
  ];
  */
  const [lockedSubmissions, setLockedSubmissions] = useState([]);

  useEffect(() => {
    const fetchLockedSubmissions = async () => {
      try {
        const response = await axios.get(`/api/user_locked/100000`);
        setLockedSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching locked submissions:', error);
      }
    };

    fetchLockedSubmissions();
  }, []);

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
    const del = confirm("Are you sure, you want to delete this process?");
    if (del){
      const data = new URLSearchParams();
      data.append('action', 'delete');
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

      {/*Navbar*/}
      <Nav/>
      

      {/* Main content */}
      <main className="flex-grow p-5 bg-gray-100">
        {/* First list: Submissions */}
        <h2 className="text-2xl font-semibold text-center mb-5">My Submissions {params.userId}</h2>
        <div className="flex flex-col gap-4 mb-10 max-h-64 overflow-y-auto">
          {submissions.map(item => (
            <div key={item.id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
              <div className="flex justify-between space-x-6">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Creation Date:</strong> {item.creationDate}</p>
                <p><strong>State:</strong> {item.state}</p>
                <p>{item.state==="Unfinished" ? <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => RunConfirm(item.id)}>Run</button> : <button className="bg-blue-200 text-white py-2 px-4 rounded" disabled>Run</button>}</p>
                <p>{item.state==="Finished" ? <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={downloadFile}>Get Results</button> : <button className="bg-blue-200 text-white py-2 px-4 rounded" disabled>Get Results</button>}</p>
                <p><button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => DeleteConfirm(item.id)}>Delete</button></p>
              </div>
            </div>
          ))}
        </div>

        {/* Second list: Pending Submissions */}
        <h2 className="text-2xl font-semibold text-center mb-5">Pending Submissions</h2>
        <div className="flex flex-col gap-4 mb-10 max-h-64 overflow-y-auto">
          {pend_subs.map(item => (
            <div key={item.id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
              <div className="flex justify-between space-x-6">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Creation Date:</strong> {item.creationDate}</p>
                <p><button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={DeleteConfirm}>Delete</button></p>
              </div>
            </div>
          ))}
        </div>

        {/* Third list: Locked Results */}
        <h2 className="text-2xl font-semibold text-center mb-5 text-black">Locked Results</h2>
        <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
          {lockedSubmissions.map(item => (
            <div key={item._id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
              <div className="flex justify-between space-x-6">
                <p><strong>Name:</strong> {item.submission_name}</p>
                <p><strong>Timestamp:</strong> {item.timestamp}</p>
                <p><strong>Status:</strong> {item.status}</p>
                <p><strong>Extra Credits:</strong> {item.extra_credits}</p>
                <p><button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={() => UnlockConfirm(item._id)}>Unlock</button></p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}