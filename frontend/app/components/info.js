import { useState, useEffect } from 'react';
import axios from 'axios';
import useUserSession from '../hooks/useUserSession'; // Import the custom hook

const Info = () => {
  const [credits, setCredits] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const { userId } = useUserSession();
  


  // Function to fetch user credits
  const fetchCredits = async () => {
    try {
      const response = await axios.get(`http://localhost:8042/api/getCredits/${userId}`);
      setCredits(response.data.credits_num); // Set the fetched credits
      console.log(`Now the credits: ${credits}`);
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
    if (userId) {
      fetchCredits();
    } else {
      console.log('Waiting for userId...');
    }
  }, [userId]);

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
