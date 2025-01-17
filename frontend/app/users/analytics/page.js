"use client";

import Nav from '../../components/Nav';
import AdminNav from '../../components/AdminNav';
import Info from '../../components/info';
import axios from 'axios';
import { useState, useEffect } from 'react';
import useUserSession from '../../hooks/useUserSession';

export default function ProfilePage({ params }) {
    const [analytics, setAnalytics] = useState(null);  // To store the fetched data
    const [loading, setLoading] = useState(true);      // To manage the loading state
    const [error, setError] = useState(null);          // To handle errors

    const { userId, username, role } = useUserSession();

    useEffect(() => {
        const fetchAnalytics = async () => {
          if (!userId) {
            // If userId is still null or undefined, do nothing
            return;
          }
            try {
                console.log({ userId, username });
              console.log(`http://localhost:8042/api/my_analytics/${userId}`);
                const response = await axios.get(`http://localhost:8042/api/my_analytics/${userId}`); // Use API Gateway endpoint
                setAnalytics(response.data); // Set the fetched analytics data
                setLoading(false);           // Set loading to false once the data is fetched
            } catch (err) {
              if (err.response && err.response.status === 404) {
                // Handle the 404 error case with a custom message
                setError('No submissions have been made yet');
              }
              else{
                setError('Failed to fetch data');  // Set an error message
              }
              setLoading(false);                 // Stop loading even on error
            }
        };

        fetchAnalytics(); // Invoke the async function
    }, [userId]); // Dependency array ensures the function runs when userId changes

    // Display loading indicator while data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display error message if fetching fails
    if (error) {
        return <div>{error}</div>;
    }

    return (
      <div className="min-h-screen flex flex-col">
        {role === 'admin' ? <AdminNav /> : <Nav />}
        <Info/>

        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-8">
          <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-black">{analytics?.username || 'User'} Analytics</h2>

            {/* User Info */}
            <div className="space-y-4">
              <p className="text-lg font-medium text-black">Username: <span className="font-normal">{username}</span></p>
              <p className="text-lg font-medium text-black">Average execution time: <span className="font-normal">{analytics.average_execution_time.toFixed(2)}</span> seconds</p>
              <p className="text-lg font-medium text-black">Average extra credits: <span className="font-normal">{analytics.average_extra_credits.toFixed(2)}</span></p>
              <p className="text-lg font-medium text-black">Average requests per day: <span className="font-normal">{analytics.average_requests_per_day.toFixed(2)}</span></p>
              <p className="text-lg font-medium text-black">Average requests per month: <span className="font-normal">{analytics.average_requests_per_month.toFixed(2)}</span></p>
              <p className="text-lg font-medium text-black">Number of locked entries: <span className="font-normal">{analytics.number_locked}</span></p>
              <p className="text-lg font-medium text-black">Number of pending entries: <span className="font-normal">{analytics.number_pending}</span></p>
              <p className="text-lg font-medium text-black">Number of finished entries: <span className="font-normal">{analytics.number_finished}</span></p>
              <p className="text-lg font-medium text-black">Average waiting time: <span className="font-normal">{analytics.average_waiting_time.toFixed(2)}</span> seconds</p>
            </div>
          </div>
        </main>
      </div>
    );
}
