"use client";

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import axios from 'axios';

export default function Home() {
  // State to handle credit values
  const [currentBalance, setCurrentBalance] = useState(0);  // Default balance is 0, it will be updated from API
  const [newCredits, setNewCredits] = useState(0);
  const [loading, setLoading] = useState(true); // To handle the loading state when fetching data
  const [error, setError] = useState(null); // Handle errors
  const [transactionStatus, setTransactionStatus] = useState(null); // To display success or failure messages


  // Simulate a random user ID for now
  const userId = Math.floor(Math.random() * 10000);

  // Fetch current balance from the API when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8000/credits')
      .then(response => {
        setCurrentBalance(response.data.balance); // Assuming the API returns the current balance in "balance" field
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch current balance.');
        setLoading(false);
      });
  }, []);

  // Calculate new balance when credits are updated
  const newBalance = currentBalance + newCredits;

  // Handle input changes for new credits
  const handleCreditChange = (e) => {
    setNewCredits(parseInt(e.target.value) || 0);  // Parse to ensure it's a number
  };

  // Confirm button action to update credits
  const handleConfirm = () => {
    //const updatedBalance = currentBalance + newCredits;
    const creditUpdate = newCredits; // This could be positive or negative
    const postData = {
      amount: creditUpdate,
      user_id: userId // Simulated for now
    };

    axios.post('http://localhost:8000/credits', { balance: updatedBalance })
    .then(response => {
        if (response.status === 200) {
          console.log("Transaction successful:", response.data);
          setCurrentBalance(newBalance); // Update balance in UI
          setNewCredits(0); // Reset new credits input
          setTransactionStatus('Transaction successful.');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 406) {
          console.error("Not enough credits:", error.response.data);
          setTransactionStatus('Not enough credits.');
        } else {
          console.error("Error updating balance:", error);
          setTransactionStatus('Error processing transaction.');
        }
      });
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
      <Nav />

      {/* Main Content Area */}
      <main className="flex-grow p-5">
        {/* Header */}
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

        {/* Big solveME Photo Area */}
        <div className="bg-gray-200 h-64 flex items-center justify-center mb-5">
          <h2 className="text-xl font-semibold">Big solveME Photo</h2>
        </div>

        {/* Credit Info Fields */}
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