"use client";

import Nav from '../../components/Nav';
import axios from 'axios';
import { useState } from 'react';

export default function ProfilePage({params}) {
    const user = {
      username: "JohnDoe",
      credits: 150,
    };

    const [uname, setUname] = useState(user.username);
    const [cred, setCred] = useState(user.credits);

    /*const axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,  // Allow self-signed certificates
      }),
    });
  


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(`https://localhost:8000/user/${params.userId}`); // Replace with your API endpoint
          setUname(response.data.username); // Set the data in the state
          setCred(response.data.credits);
          setLoading(false); // Set loading to false once the data is fetched
        } catch (err) {
          setError('Failed to fetch data'); // Set an error message
          setLoading(false); // Set loading to false even if an error occurs
        }
      };
  
      fetchData(); // Invoke the async function
    }, []);

    if (loading) {
      return <div>Loading...</div>; // Show loading indicator
    }
  
    if (error) {
      return <div>{error}</div>; // Display error message if fetching fails
    }*/
  
    const handleEdit = async () => {
      const newUsername = prompt("Enter new username:", uname);
      if (newUsername) {
        setUname(newUsername); user.username = newUsername;//********Να αφαιρεθεί */
        try {
          // Send a POST request to your backend
          const response = await axios.post('https://localhost:8000/update-username', {
            userId: params.userId,
            newUsername: newUsername,  // Send the new username as a payload
          });
  
          // Assuming the backend updates the username successfully
          if (response.status === 200) {
            // Update the username locally
            user.username = newUsername;
            setUname(newUsername);
            alert(`Username changed to: ${newUsername}`);
          } else {
            alert('Error: Unable to update username.');
          }
        } catch (error) {
          console.error('Error updating username:', error);
          alert('Error: Unable to update username.');
        }
      }
    };

    const addCredits = async () => {
      const input = prompt("Enter credits to add (up to 1000):", "0");
  
      if (input) {
        const creditsToAdd = parseInt(input, 10);
  
        // Validate if the input is a number and within the specified range
        if (!isNaN(creditsToAdd) && creditsToAdd > 0 && creditsToAdd <= 1000) {
          const newCredits = creditsToAdd;
          user.credits += newCredits;
          setCred(newCredits+cred);//***********Να αφαιρεθεί */

          try {
            // Send a POST request to your backend
            const response = await axios.post('https://localhost:8000/update-credits', {
              userId: params.userId,
              newCredits: newCredits,  // Send the new username as a payload
            });
    
            // Assuming the backend updates the username successfully
            if (response.status === 200) {
              // Update the username locally
              user.username = newUsername;
              setCred(newCredits);
              alert(`You have added ${newCredits} credits.`);
            } else {
              alert('Error: Unable to add credits1.');
            }
          } catch (error) {
            console.error('Error adding credits:', error);
            alert('Error: Unable to add credits2.');
          }       
        } else {
          alert("Invalid input. Please enter a number between 1 and 1000.");
        }
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col">

        <Nav/>
  
        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-8">
          <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            
            {/* User Info */}
            <div className="space-y-4">
              <div>
                <p className="text-lg font-medium">Username: <span className="font-normal">{uname}
                    <svg className="w-5 hover:text-blue-500  inline-block mb-1 ml-1 cursor-pointer" onClick={handleEdit} data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
                    </svg>
                  </span></p>
              </div>
              <div>
                <p className="text-lg font-medium">Credits: <span className="font-normal">{cred}
                  <svg className="w-5 hover:text-blue-500 inline-block mb-1 cursor-pointer" onClick={addCredits} data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                  </svg>
                </span></p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }