// app/page.js

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Header */}
      {/*<header className="bg-blue-500 p-4 text-white">
        <h1 className="text-center">solveMe logo area</h1>
      </header>*/}

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
            <label htmlFor="username" className="text-black">Username:</label>
            <input
              id="username"
              type="text"
              className="border p-2 text-black" // Ensure text color is explicitly set to black
              placeholder="Enter your username"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="password" className="text-black">Password:</label>
            <input
              id="password"
              type="text"
              className="border p-2 text-black" // Ensure text color is explicitly set to black
              placeholder="Enter your password"
            />
          </div>

          <div className="flex space-x-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded">Login</button>
            <button className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
          </div>

          <div>
            <a href="#" className="text-blue-500">Forgot Password?</a>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/*<footer className="bg-blue-500 p-4 text-center text-white">
        Some footer information
      </footer>*/}
    </div>
  );
}