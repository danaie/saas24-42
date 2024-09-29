import Link from 'next/link'

const AdminNav = () => {
  const handleLogOut = (e) => {
    e.preventDefault(); // Prevent the default link behavior
    sessionStorage.clear();
    window.location.href = '/'; // Redirect to the homepage manually
  }
    return (
        <nav className="bg-blue-500 p-3">
        <ul className="flex justify-around list-none p-0 m-0">
          <li><Link href="/submissions" className="text-white font-bold">My Submissions</Link></li>
          <li><Link href="/all_sub" className="text-white font-bold">All Submissions</Link></li>
          <li><Link href="/users/analytics" className="text-white font-bold">My Analytics
              <svg className="w-5 inline-block ml-1 mb-1" data-slot="icon" fill="none" stroke-width="2.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"></path>
              </svg>
            </Link>
          </li>
          <li><Link href="/users/admin" className="text-white font-bold">Total Analytics
              <svg className="w-5 inline-block ml-1 mb-1 " data-slot="icon" fill="none" stroke-width="2.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"></path>
              </svg>
            </Link>
          </li>
          <li><Link href="/new_sub" className="text-white font-bold">Add Submission
              <svg className="w-5 inline-block ml-1 mb-1 " data-slot="icon" fill="none" stroke-width="2.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"></path>
              </svg>
            </Link>
          </li>
          <li><Link href="/buy_credits" className="text-white font-bold">Credits
              <svg className="w-5 inline-block ml-1 mb-1 " data-slot="icon" fill="none" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"></path>
              </svg>
            </Link>
          </li>
          <li><Link href="/" onClick={handleLogOut} className="text-white font-bold">Log out
              <svg className="w-5 inline-block ml-1 mb-1 " data-slot="icon" fill="none" stroke-width="3" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"></path>
              </svg>
            </Link>
          </li>
        </ul>
      </nav>
    )
}

export default AdminNav;