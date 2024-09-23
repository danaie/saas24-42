// pages/index.js
"use client";

import Nav from '../components/Nav';
import dfile from '../../public/dfile.json';
import Link from 'next/link'
import axios from 'axios';

export default function Home({params}) {
  // Sample data for the first list (Submissions) with updated state values
  const submissions = [
    { u_id: "1123", username: "a", credits: 45 },
    { u_id: "1124", username: "b", credits: 65 },
    { u_id: "1125", username: "c", credits: 0 },
    { u_id: "1126", username: "d", credits: 4 }
  ];


  /*const [users, setUsers] = useState(null);
  const [credits, setCredits] = useState(null);
  const [mergedData, setMergedData] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null); 
  const [errorCredits, setErrorCredits] = useState(null); 
  const [loading, setLoading] = useState(true); 

  const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,  // Allow self-signed certificates
    }),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axiosInstance.get('https://localhost:8000/users'); // Replace with your API endpoint
      } catch (err) {
        setErrorUsers('Failed to fetch users'); // Set an error message
        setLoading(false); // Set loading to false even if an error occurs
      }
      try {
        const response2 = await axiosInstance.get('https://localhost:8000/credits'); // Replace with your API endpoint
      } catch (err) {
        setErrorCredits('Failed to fetch credits'); // Set an error message
        setLoading(false); // Set loading to false even if an error occurs
      }
      if(!errorUsers && !errorCredits){
        const merged = [...response1, ...response2].reduce((acc, obj) => {
            const existing = acc.find(item => item.id === obj.id);
            if (existing) {
              Object.assign(existing, obj); // Merge properties if id matches
            } else {
              acc.push({ ...obj }); // Add new object if id is not found
            }
            return acc;
          }, []);

          setUsers(response1.data); // Set the data in the state
          setCredits(response2.data); // Set the data in the state
          setMergedData(merged);
          setLoading(false);
      }

    };

    fetchData(); // Invoke the async function
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  if (errorUsers || errorCredits) {
    return <div>{error}</div>; // Display error message if fetching fails
  }*/



  return (
    <div className="flex flex-col min-h-screen">

      {/*Navbar*/}
      <Nav/>
      

      {/* Main content */}
      <main className="flex-grow p-5 bg-gray-100">
        {/* First list: Users */}
        <h2 className="text-2xl font-semibold text-center mb-5">Users</h2>
        <div className="flex flex-col gap-4 mb-10 max-h-64 overflow-y-auto">
          {submissions.map(user => (
            <div key={user.id} className="bg-white border border-gray-300 p-5 w-full shadow-lg">
              <div className="flex justify-between space-x-6">
                <p><strong>User id:</strong> {user.u_id}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Credits:</strong> {user.credits}</p>
                <Link href={`/users/analytics/${user.u_id}`}><p><button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Analytics</button></p></Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}