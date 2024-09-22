// app/page.js
"use client";
import { useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  useEffect(() => {
    const loadGoogleApi = () => {
      const script = document.createElement('script');
      script.src = "https://apis.google.com/js/api:client.js";
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          window.gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google client ID
          });
        });
      };
      document.body.appendChild(script);
    };
  
    loadGoogleApi();
  }, []);

  const onSignUp = async () => {
    const auth2 = window.gapi.auth2.getAuthInstance();

    try {
      const googleUser = await auth2.signIn();
      const idToken = googleUser.getAuthResponse().id_token;

      // Send ID token to the backend
      const response = await axios.get('https://localhost:8000/auth', {
        params: {
          idToken,
        },
      });

      console.log('Response from backend:', response.data);
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="flex justify-center mb-4">
          <div className="w-3/4 bg-blue-300 h-64 flex items-center justify-center text-white">
            <span>Photo Area</span>
          </div>
        </div>

        <div className="flex justify-center mt-20">
          <button
            onClick={onSignUp}
            className="flex items-center justify-center bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.8c-1.3 4.3-5.5 7.5-10.3 7.5-6.1 0-11-4.9-11-11s4.9-11 11-11c2.7 0 5.2 1 7.1 2.7l5.9-5.9C34.5 7.3 29.6 5 24 5 13.5 5 5 13.5 5 24s8.5 19 19 19c9.4 0 18-6.8 18-19 0-1.3-.1-2.7-.3-4z"/>
              <path fill="#34A853" d="M6.7 14.6l6.6 4.8C15 16.5 18.2 14.5 24 14.5c2.7 0 5.2 1 7.1 2.7l5.9-5.9C34.5 7.3 29.6 5 24 5 15.9 5 9.1 9.9 6.7 14.6z"/>
              <path fill="#FBBC05" d="M24 43c5.3 0 9.7-1.7 13-4.7l-6.2-4.8c-1.6 1.1-3.7 1.8-6.8 1.8-4.7 0-8.9-3.2-10.3-7.5l-6.5 5C9.2 37.8 15.8 43 24 43z"/>
              <path fill="#EA4335" d="M43.8 24.5c0-1.3-.1-2.7-.3-4H24v8.5h11.8c-.6 2.3-1.9 4.3-3.8 5.7l6.2 4.8C41.8 36.3 43.8 30.9 43.8 24.5z"/>
            </svg>
            Sign Up with Google
          </button>
        </div>
      </main>
      <script src="https://apis.google.com/js/api:client.js"></script>
    </div>
  );
}