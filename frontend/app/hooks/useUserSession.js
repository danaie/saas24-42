// hooks/useUserSession.js
import { useEffect, useState } from 'react';

const useUserSession = () => {
  const [session, setSession] = useState({
    userId: null,
    username: null,
    role: null,
  });

  useEffect(() => {
    // Retrieve values from session storage
    const userId = sessionStorage.getItem('userId');
    const username = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');

    if (userId) {
      setSession({ userId, username, role });
    } else {
      console.warn('Username not found in session storage.');
    }
  }, []);

  return session;
};

export default useUserSession;