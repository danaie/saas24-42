// pages/index.js
"use client";

import Nav from '../components/Nav';
import dfile from '../../../public/dfile.json';
import Link from 'next/link'
import axios from 'axios';

export default function Home({params}) {
  // Sample data for the first list (Submissions) with updated state values
  const submissions = [
    { p_id: "1", u_id: "1123", username: "a", name: 'Problem 1', Runtime: 3.25, subTime: '2024-09-21T03:35:07', resTime: '2024-09-21T06:35:07', Result: dfile },
    { p_id: "2", u_id: "1124", username: "b", name: 'Problem 2', Runtime: 1.3, subTime: '2024-09-21T02:35:07', resTime: '2024-09-21T06:37:07', Result: dfile },
    { p_id: "3", u_id: "1125", username: "c", name: 'Problem 3', Runtime: 3, subTime: '2024-09-21T03:33:07', resTime: '2024-09-21T05:35:07', Result: dfile },
    { p_id: "4", u_id: "1125", username: "c", name: 'Problem 4', Runtime: 4.6, subTime: '2024-09-21T01:35:07', resTime: '2024-09-21T04:35:07', Result: dfile }
  ];

  // Sample data for the second list (Pending Submissions)
  const pend_subs = [
    { p_id: "1", u_id: "1123", username: "a", status: "pending", name: "Pending Problem 1",  pTimestamp: '2024-06-01', pScript: dfile },
    { p_id: "2", u_id: "1124", username: "b", status: "pending", name: "Pending Problem 2",  pTimestamp: '2024-06-15', pScript: dfile },
    { p_id: "3", u_id: "1125", username: "c", status: "running", name: "Pending Problem 3",  pTimestamp: '2024-07-05', pScript: dfile }
  ];

  // Sample data for the third list (Locked Results) with the 'cost' field
  const locked = [
    { p_id: "1", u_id: "1123", username: "a", name: 'Problem A', Runtime: 44.5, Timestamp: '2024-05-01 10:00', ResultTime: '2024-05-01 10:30', maxD: 72, depot: 23, numV: 7, Locations: dfile },
    { p_id: "2", u_id: "1124", username: "b", name: 'Problem B', Runtime: 5.5, Timestamp: '2024-05-02 11:00', ResultTime: '2024-05-02 11:45', maxD: 72, depot: 23, numV: 7, Locations: dfile },
    { p_id: "3", u_id: "1124", username: "b", name: 'Problem C', Runtime: 5.5, Timestamp: '2024-05-03 12:00', ResultTime: '2024-05-03 12:20', maxD: 72, depot: 23, numV: 7, Locations: dfile },
    { p_id: "4", u_id: "1125", username: "c", name: 'Problem D', Runtime: 5.5, Timestamp: '2024-05-04 13:00', ResultTime: '2024-05-04 13:45', maxD: 72, depot: 23, numV: 7, Locations: dfile }
  ];



  /*const [submissions, setSubmissions] = useState(null); // To store the fetched data
  const [pend_subs, setPendSubs] = useState(null); // To store the fetched data
  const [locked, setLocked] = useState(null); // To store the fetched data
  const [loading, setLoading] = useState(true); // To manage the loading state
  const [errorSubmissions, setErrorSubmissions] = useState(null); // To handle errors
  const [errorPendSubs, setErrorPendSubs] = useState(null); // To handle errors
  const [errorLocked, setErrorLocked] = useState(null); // To handle errors

  const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,  // Allow self-signed certificates
    }),
  });


  useEffect(() => {
      const fetchData = async () => {
        try {
          const response1 = await axiosInstance.get('https://localhost:8000/finished'); // Replace with your API endpoint
          setSubmissions(response1.data); // Set the data in the state
          //setLoading(false); // Set loading to false once the data is fetched
        } catch (err) {
          setErrorSubmissions('Failed to fetch data'); // Set an error message
          setLoading(false); // Set loading to false even if an error occurs
        }
        try {
          const response2 = await axiosInstance.get('https://localhost:8000/pending'); // Replace with your API endpoint
          setPendSubs(response2.data); // Set the data in the state
          //setLoading(false); // Set loading to false once the data is fetched
        } catch (err) {
          setErrorPendSubs('Failed to fetch data'); // Set an error message
          setLoading(false); // Set loading to false even if an error occurs
        }
        try {
          const response3 = await axiosInstance.get('https://localhost:8000/locked'); // Replace with your API endpoint
          setLocked(response3.data); // Set the data in the state
          setLoading(false); // Set loading to false once the data is fetched
        } catch (err) {
          setErrorLocked('Failed to fetch data'); // Set an error message
          setLoading(false); // Set loading to false even if an error occurs
        }
      };
    
      fetchData(); // Invoke the async function
    }, []);

    if (loading) {
      return <div>Loading...</div>; // Show loading indicator
    }
    
    if (errorSubmissions || errorPendSubs || errorLocked) {
      return <div>{error}</div>; // Display error message if fetching fails
    }*/



  const downloadFile = (file, fileName) => {
    // Convert JSON object to a string (for JSON files)
    const fileContent = JSON.stringify(file, null, 2);
    
    // Create a Blob object from the content (MIME type as 'application/json')
    const blob = new Blob([fileContent], { type: 'application/json' });
    
    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    
    // Set the download attribute with a custom file name
    a.download = fileName;
    
    // Append the anchor to the body
    document.body.appendChild(a);
    
    // Programmatically trigger the click event on the anchor
    a.click();
    
    // Clean up: remove the anchor and revoke the URL
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };


  return (
    <div className="flex flex-col min-h-screen">

      {/*Navbar*/}
      <Nav/>
      

      {/* Main content */}
      <main className="flex-grow p-5 bg-gray-100">
        {/* First list: Submissions */}
        <h2 className="text-2xl font-semibold text-center mb-5">Submissions {params.userId}</h2>
        <div className="flex flex-col gap-4 mb-10 max-h-64 overflow-y-auto">
          {submissions.map(item => (
            <div key={item.id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
              <div className="flex justify-between space-x-6">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Username:</strong> {item.username}</p>
                <p><strong>Runtime:</strong> {item.Runtime}</p>
                <p><strong>Submission Time:</strong> {item.subTime}</p>
                <p><strong>Result Time:</strong> {item.resTime}</p>
                <p><strong>Status:</strong> Finished</p>
                <p> <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => downloadFile(item.Result, `result_${item.u_id}.json`)}>Get Results</button></p>
              </div>
            </div>
          ))}
          {pend_subs.map(item => (
            item.status === "pending" ? <div key={item.id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
              <div className="flex justify-between space-x-6">
                <p><strong>Username:</strong> {item.username}</p>
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Timestamp:</strong> {item.pTimestamp}</p>
                <p><strong>Status:</strong> Pending</p>
                <p><button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => downloadFile(item.pScript, `script_${item.u_id}.json`)}>Get Script</button></p>
              </div>
            </div> : <div></div>
          ))}
        </div>

        {/* Second list: Running Submissions */}
        <h2 className="text-2xl font-semibold text-center mb-5">Running Submissions</h2>
        <div className="flex flex-col gap-4 mb-10 max-h-64 overflow-y-auto">
          {pend_subs.map(item => (
            item.status === "running" ? <div key={item.id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
              <div className="flex justify-between space-x-6">
                <p><strong>Username:</strong> {item.username}</p>
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Timestamp:</strong> {item.pTimestamp}</p>
                <p><button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => downloadFile(item.pScript, `script_${item.u_id}.json`)}>Get Script</button></p>
              </div>
            </div> : <div></div>
          ))}
        </div>

        {/* Third list: Locked Results */}
        <h2 className="text-2xl font-semibold text-center mb-5">Locked Results</h2>
        <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
          {locked.map(item => (
            <div key={item.id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
              <div className="flex justify-between space-x-6">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Runtime:</strong> {item.Runtime}</p>
                <p><strong>Timestamp:</strong> {item.Timestamp}</p>
                <p><strong>Result Time:</strong> {item.ResultTime}</p>
                <p><strong>Username:</strong> {item.username} credits</p>
                <p><strong>Max Distance:</strong> {item.maxD} credits</p>
                <p><strong>Depot:</strong> {item.depot} credits</p>
                <p><strong>Vehicles Number:</strong> {item.numV} credits</p>
                <p><button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" onClick={() => downloadFile(item.Locations, `locations_${item.u_id}.json`)}>Get Results</button></p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}