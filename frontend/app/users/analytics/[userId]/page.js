"use client";

import AdminNav from '../../../components/AdminNav';
import axios from 'axios';
import { useState } from 'react';

export default function ProfilePage({params}) {
    const analytics = {
        user_id: "13",
        username: "JohnDoe",
        average_execution_time: 15.4,
        average_extra_credits: 25.3,
        average_requests_per_day: 3.6,
        average_requests_per_month: 108,
        number_of_locked_entries: 10,
        number_of_pending_entries: 5,
        number_of_finished_entries: 8,
        average_waiting_time: 120.5
    };

    /*const [analytics, setAnalytics] = useState(null); // To store the fetched data
    const [loading, setLoading] = useState(true); // To manage the loading state
    const [error, setError] = useState(null); // To handle errors

    const axiosInstance = axios.create({
        httpsAgent: new https.Agent({
        rejectUnauthorized: false,  // Allow self-signed certificates
        }),
    });


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axiosInstance.get(`https://localhost:8000/analytics/${params.userId}`); // Replace with your API endpoint
            setAnalytics(response.data); // Set the data in the state
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

   
  
    return (
      <div className="min-h-screen flex flex-col">

        <AdminNav/>
  
        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-8">
          <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-black">{analytics.username}'s Analytics</h2>
            
            {/* User Info */}
            <div className="space-y-4">
            <p className="text-lg font-medium text-black">User ID: <span className="font-normal">{params.userId}</span></p>
                <p className="text-lg font-medium text-black">Username: <span className="font-normal">{analytics.username}</span></p>
                <p className="text-lg font-medium text-black">Average execution time: <span className="font-normal">{analytics.average_execution_time}</span></p>
                <p className="text-lg font-medium text-black">Average extra credits: <span className="font-normal">{analytics.average_extra_credits}</span></p>
                <p className="text-lg font-medium text-black">Average requests per day: <span className="font-normal">{analytics.average_requests_per_day}</span></p>
                <p className="text-lg font-medium text-black">Average request per month: <span className="font-normal">{analytics.average_requests_per_month}</span></p>
                <p className="text-lg font-medium text-black">Number of locked entries: <span className="font-normal">{analytics.number_of_locked_entries}</span></p>
                <p className="text-lg font-medium text-black">Number of pending entries: <span className="font-normal">{analytics.number_of_pending_entries}</span></p>
                <p className="text-lg font-medium text-black">Number of finished entries: <span className="font-normal">{analytics.number_of_finished_entries}</span></p>
                <p className="text-lg font-medium text-black">Average waiting time: <span className="font-normal">{analytics.average_waiting_time}</span></p>

            </div>
          </div>
        </main>
      </div>
    );
  }