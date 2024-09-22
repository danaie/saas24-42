"use client";

import { useState, useEffect } from 'react';
import Nav from '../../components/Nav';
import axios from 'axios';

export default function Home({params}) {
  // State to handle credit values
  const [currentBalance, setCurrentBalance] = useState(0);  // Default balance is 0, it will be updated from API
  const [newCredits, setNewCredits] = useState(0);
  //const [loading, setLoading] = useState(true); // To handle the loading state when fetching data
  const [error, setError] = useState(null); // Handle errors
  const [transactionStatus, setTransactionStatus] = useState(null); // To display success or failure messages

  const user = {
    username: "JohnDoe",
    credits: 150,
  };


  const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,  // Allow self-signed certificates
    }),
  });


  // Fetch current balance from the API when the component mounts
  /*useEffect(() => {
    axiosInstance.get('http://localhost:8000/credits')
      .then(response => {
        setCurrentBalance(response.data.balance); // Assuming the API returns the current balance in "balance" field
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch current balance.');
        setLoading(false);
      });
  }, []);*/

  // Calculate new balance when credits are updated
  const newBalance = currentBalance + newCredits;

  // Handle input changes for new credits
  const handleCreditChange = (e) => {
    setNewCredits(parseInt(e.target.value) || 0);  // Parse to ensure it's a number
  };

  // Confirm button action to update credits
  const handleConfirm = () => {
    //const updatedBalance = currentBalance + newCredits;
    if (!isNaN(newCredits) && newCredits > 0 && newCredits <= 1000) {
      const userConfirm = confirm(`Are you sure you want to add ${newCredits} credits`)
      if(userConfirm){
        const creditUpdate = newCredits; // This could be positive or negative
        const postData = {
          amount: creditUpdate,
          user_id: params.userId // Simulated for now
        };

        axiosInstance.post('http://localhost:8000/credits', postData)
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
              alert("Error upadating credits 2.")
              setTransactionStatus('Error processing transaction.');
            }
          })}}
          else {
            alert("Invalid input. You should give as input a number between 0 and 1000")
          };
  };

  // Cancel button action to reset the new credits input
  const handleCancel = () => {
    setNewCredits(0);  // Reset the new credits
    setTransactionStatus(null); // Clear any transaction messages
  };

  /*if (loading) {
    return <div>Loading...</div>; // Simple loading state
  }*/

  if (error) {
    return <div>{error}</div>; // Show error message if something went wrong
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Nav />

      {/* Main Content Area */}
      <main className="flex-grow p-5">
        {/* Header */}
        <div className="flex justify-center mb-7 ">
          <div className="ml-4">
            <p>System Info:</p>
            <p>Date/Time: {new Date().toLocaleString()}</p>
            <p>Health: OK</p>
          </div>
        </div>
        
        <div className="flex justify-center mb-10 ">
          <button className="bg-blue-500 text-white py-10 px-10 rounded">BUY CREDITS</button>
        </div>

        {/* Credit Info Fields */}
        <div className="flex justify-center mb-5">
          <div className="flex flex-col items-center">
            <label htmlFor="currentBalance">Current Balance</label>
            <input
              id="currentBalance"
              type="text"
              value={user.credits}
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
    </div>
  );
}
