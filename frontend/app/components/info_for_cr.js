import { useState, useEffect } from 'react';
import axios from 'axios';
import useUserSession from '../hooks/useUserSession'; // Import the custom hook

const Info = () => {
 
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const { userId } = useUserSession();
  

  // Function to update the current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="bg-blue-600 p-2 text-center flex justify-around text-white">
      
      {/* Real-time Clock */}
      <div>
        <p><strong>System Time:</strong> {currentTime}</p>
      </div>
    </div>
  );
};

export default Info;
