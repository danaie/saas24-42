// hooks/useUserSession.js
import { useEffect, useState } from 'react';

const useUserSession = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Retrieve values from session storage
    const storedUserId = sessionStorage.getItem('userId');
    const storedUsername = sessionStorage.getItem('username');
    const storedRole = sessionStorage.getItem('role');

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error('User ID not found in session storage.');
    }

    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error('Username not found in session storage.');
    }

    if (storedRole) {
      setRole(storedRole);
    } else {
      console.error('Role not found in session storage.');
    }
  }, []);

  return { userId, username, role };
};

export default useUserSession;
