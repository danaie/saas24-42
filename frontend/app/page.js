"use client";
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Load the Google Identity Services script
    const loadGoogleApi = () => {
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client"; // Google Identity Services library
      script.onload = () => {
        const script = document.createElement('script');
        try {
          window.google.accounts.id.initialize({
            client_id: '1084072222930-nnrj4ldk6o2euc0e9itf76g0irgjm3im.apps.googleusercontent.com', // Replace with your Google Client ID
            callback: handleCredentialResponse
          });
          window.google.accounts.id.renderButton(
            document.getElementById('googleSignInButton'), // DOM element for button
            { theme: "outline", size: "large" } // Customization options
          );
        } catch (error) {
          console.error("Error initializing Google Identity Services:", error);
        }
      };
      script.onerror = () => {
        console.error("Failed to load the Google Identity Services script");
      };

      document.body.appendChild(script);
    };

    // Function to handle the response from Google Identity Services
    const handleCredentialResponse = async (response) => { 
      try {
        const idToken = response.credential; // Get ID token from response

        // Send the ID token to your API Gateway
        const backendResponse = await axios.post('http://localhost:8042/api/login', {
          idToken // Send the ID token as part of the request body
        });

        console.log('Response from backend:', backendResponse.data);

        // Assuming the response contains user ID, redirect to the specified URL
        const userId = backendResponse.data.userId; // Extract the userId from the response
        //router.push(`/submissions/${userId}`); // Redirect to /submissions/userId
        sessionStorage.setItem('userId', userId); // Store userId in session storage

        // Redirect to the submissions page without userId in the URL
        router.push('/submissions'); // Redirect to /submissions

      } catch (error) {
        console.error('Error during Google Sign-In or backend request:', error);
      }
    };

    try {
      loadGoogleApi();
    } catch (error) {
      console.error("Error loading Google API:", error);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      <main className="flex-grow p-4">
        <div className="flex justify-center mb-4">
          <div className="w-3/4 bg-blue-300 h-64 flex items-center justify-center text-white">
            <span>Photo Area</span>
          </div>
        </div>

        <div className="flex justify-center mt-20">
          <div id="googleSignInButton"></div> {/* Google Sign-In button will render here */}
        </div>
      </main>
    </div>
  );
}