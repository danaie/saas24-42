import { useState, useEffect } from 'react';
import axios from 'axios';

const Info = () => {
  const [credits, setCredits] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const userId = 'abcd'; // Static user ID for now

  // Function to fetch user credits
  const fetchCredits = async () => {
    try {
      const response = await axios.get(`http://localhost:8042/api/getCredits/${userId}`);
      setCredits(response.data.credits_num); // Set the fetched credits
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  };

  // Function to update the current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Fetch credits when the component mounts
  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <div className="bg-blue-600 p-2 text-center flex justify-around text-white">
      {/* Credits Information */}
      <div>
        <p><strong>User Credits:</strong> {credits}</p>
      </div>

      {/* Real-time Clock */}
      <div>
        <p><strong>System Time:</strong> {currentTime}</p>
      </div>
    </div>
  );
};

export default Info;
