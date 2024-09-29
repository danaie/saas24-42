"use client";

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Info_cr from '../components/info_for_cr';
import AdminNav from '../components/AdminNav';
import axios from 'axios';
import useUserSession from '../hooks/useUserSession'; // Import the custom hook


export default function Home() {
  // State to handle credit values
  const [currentBalance, setCurrentBalance] = useState(0);  // Default balance is 0, it will be updated from API
  const [newCredits, setNewCredits] = useState(0);
  const [loading, setLoading] = useState(true); // To handle the loading state when fetching data
  const [error, setError] = useState(null); // Handle errors
  const [transactionStatus, setTransactionStatus] = useState(null); // To display success or failure messages


  // Simulate a random user ID for now
  const { userId, role } = useUserSession();

  /*
  const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,  // Allow self-signed certificates
    }),
  });
*/
  // Fetch current balance from the API when the component mounts
  useEffect(() => {
    // Only proceed if userId is available
    
    if (!userId) {
      console.log("User ID is not available yet, skipping fetch.");
      return; // Exit the effect early if userId is null/undefined
    }
    console.log(`Now the user_id: ${userId}`);
  
    // If userId is available, fetch the user's credits
    const fetchUserCredits = async () => {
      try {
        const response = await axios.get(`http://localhost:8042/api/getCredits/${userId}`);
        setCurrentBalance(response.data.credits_num); // Assuming the response contains credits_num
      } catch (error) {
        console.error('Error fetching credits:', error);
        setError('Failed to fetch current balance.');
      } finally {
        setLoading(false); // Make sure loading is set to false in any case
      }
    };
  
    // Call the fetch function when userId is available
    fetchUserCredits();
    
  }, [userId]); 


  // Calculate new balance when credits are updated
  const newBalance = currentBalance + newCredits;

  // Handle input changes for new credits
  const handleCreditChange = (e) => {
    setNewCredits(parseInt(e.target.value) || 0);  // Parse to ensure it's a number
  };

  // Confirm button action to update credits
  const handleConfirm = () => {
    //const updatedBalance = currentBalance + newCredits;
    if (!isNaN(newCredits) && newCredits > 0){
      const userConfirm = confirm(`Are you sure you want to add ${newCredits} credits`)
      if(userConfirm){
        const creditUpdate = newCredits; // This could be positive or negative
        const postData = {
          amount: creditUpdate,
          user_id: userId // Simulated for now
        };

        axios.post('http://localhost:8042/api/addCredits', postData)
          .then(response => {
            if (response.status === 200) {
              setCurrentBalance(newBalance);
              setNewCredits(0);
              setTransactionStatus('Transaction successful.');
            }
          })
          .catch(error => {
            if (error.response && error.response.status === 406) {
              console.error("Not enough credits:", error.response.data);
              setTransactionStatus('Not enough credits.');
            } else {
              console.error("Error updating balance:", error);
              alert("Error upadating credits 2.")
              setTransactionStatus('Error processing transaction.');
            }
          })}}
          else{
            alert("Invalid input. You should give as input a number above 0")
          };
  };

  // Cancel button action to reset the new credits input
  const handleCancel = () => {
    setNewCredits(0);  // Reset the new credits
    setTransactionStatus(null); // Clear any transaction messages
  };

  if (loading) {
    return <div>Loading...</div>; // Simple loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error message if something went wrong
  }

  return (
    <div className="flex flex-col min-h-screen">
      {role === 'admin' ? <AdminNav /> : <Nav />}
      <Info_cr/>

      {/* Main Content Area */}
      <main className="flex-grow p-5 bg-gray-100">
        {/* Header */}
        {/* <div className="flex justify-center mb-7 ">
          <div className="ml-4">
            <p>System Info:</p>
            <p>Date/Time: {new Date().toLocaleString()}</p>
            <p>Health: OK</p>
          </div>
        </div> */}

        <div className="flex justify-center mb-10 ">
          <button className="bg-blue-500 text-white py-10 px-10 rounded">BUY CREDITS</button>
        </div>

        {/* Credit Info Fields */}
        <div className="flex justify-between mb-5 text-black">
          <div className="flex flex-col items-center">
            <label htmlFor="currentBalance">Current Balance</label>
            <input
              id="currentBalance"
              type="text"
              value={currentBalance}
              disabled
              className="border rounded p-2 text-center bg-white"
            />
          </div>

          <div className="flex flex-col items-center text-black">
            <label htmlFor="newCredits">New Credits</label>
            <input
              id="newCredits"
              type="number"
              value={newCredits}
              onChange={handleCreditChange}
              className="border rounded p-2 text-center text-black"
              min="0"
            />
          </div>

          <div className="flex flex-col items-center text-black">
            <label htmlFor="newBalance">New Balance</label>
            <input
              id="newBalance"
              type="text"
              value={newBalance}
              disabled
              className="border rounded p-2 text-center bg-white"
            />
          </div>
        </div>

        {/* Confirm and Cancel Buttons */}
        <div className="flex justify-center gap-4">
          <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={handleConfirm}>Confirm</button>
          <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={handleCancel}>Cancel</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-300 p-4 mt-5 text-center">
        <p>Footer: solveME stuff (legal, etc)</p>
      </footer>
    </div>
  );
}


/*
"use client";

import { useState } from 'react';
import Nav from '../components/Nav';
import axios from 'axios';

export default function Home() {
  // State to handle credit values
  const [currentBalance, setCurrentBalance] = useState(1000);  // Example balance
  const [newCredits, setNewCredits] = useState(0);

  // Calculate new balance when credits are updated
  const newBalance = currentBalance + newCredits;

  const handleCreditChange = (e) => {
    setNewCredits(parseInt(e.target.value) || 0);  // Parse to ensure it's a number
  };

  const handleConfirm = () => {
    console.log("Confirming transaction...");
    // Here you would send the transaction details (balance, credits) to the server
  };

  const handleCancel = () => {
    setNewCredits(0);  // Reset the new credits
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      
      <main className="flex-grow p-5">
        
        <div className="flex justify-between mb-5">
          <div className="w-2/3">
            <div className="bg-gray-300 h-24 flex items-center justify-center">
              <h1 className="text-3xl font-bold">solveME Logo Area</h1>
            </div>
          </div>
          <div className="flex justify-between w-1/3">
            <button className="bg-blue-500 text-white py-2 px-4 rounded">BUY CREDITS</button>
            <div className="ml-4">
              <p>System Info:</p>
              <p>Date/Time: {new Date().toLocaleString()}</p>
              <p>Health: OK</p>
            </div>
          </div>
        </div>

        //{ Big solveME Photo Area }
        <div className="bg-gray-200 h-64 flex items-center justify-center mb-5">
          <h2 className="text-xl font-semibold">Big solveME Photo</h2>
        </div>

        //{ Credit Info Fields }
        <div className="flex justify-between mb-5">
          <div className="flex flex-col items-center">
            <label htmlFor="currentBalance">Current Balance</label>
            <input
              id="currentBalance"
              type="text"
              value={currentBalance}
              disabled
              className="border rounded p-2 text-center"
            />
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="newCredits">New Credits</label>
            <input
              id="newCredits"
              type="number"
              value={newCredits}
              onChange={handleCreditChange}
              className="border rounded p-2 text-center"
            />
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="newBalance">New Balance</label>
            <input
              id="newBalance"
              type="text"
              value={newBalance}
              disabled
              className="border rounded p-2 text-center"
            />
          </div>
        </div>

        //{ Confirm and Cancel Buttons }
        <div className="flex justify-center gap-4">
          <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={handleConfirm}>Confirm</button>
          <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={handleCancel}>Cancel</button>
        </div>
      </main>

      //{ Footer }
      <footer className="bg-gray-300 p-4 mt-5 text-center">
        <p>Footer: solveME stuff (legal, etc)</p>
      </footer>
    </div>
  );
}*/