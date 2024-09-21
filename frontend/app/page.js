// app/page.js

"use client";

export default function Home() {
  const handleSignUp = async () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('User signed up successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      alert('Failed to sign up. Please try again.');
    }
  };

  const handleSignIn = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('User signed in successfully!');
        // Store user information or token if needed
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      alert('Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Header */}
      <header className="bg-blue-500 p-4 text-white">
        <h1 className="text-center">solveMe logo area</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-300 p-4 text-center text-white">login</div>
          <div className="bg-blue-300 p-4 text-center text-white">
            {new Date().toLocaleString()}
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-3/4 bg-blue-300 h-64 flex items-center justify-center text-white">
            {/* Placeholder for future image */}
            <span>Photo Area</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="name" className="text-black">Name:</label>
            <input
              id="name"
              type="text"
              className="border p-2 text-black"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="email" className="text-black">Email:</label>
            <input
              id="email"
              type="text"
              className="border p-2 text-black"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="password" className="text-black">Password:</label>
            <input
              id="password"
              type="password"
              className="border p-2 text-black"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex space-x-4">
            <button onClick={handleSignIn} className="bg-blue-500 text-white py-2 px-4 rounded">Login</button>
            <button onClick={handleSignUp} className="bg-blue-500 text-white py-2 px-4 rounded">Sign Up</button>
            <button className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
          </div>

          <div>
            <a href="#" className="text-blue-500">Forgot Password?</a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-500 p-4 text-center text-white">
        Some footer information
      </footer>
    </div>
  );
}