import Link from 'next/link'

const AdminNav = () => {
    return (
        <nav className="bg-blue-500 p-3">
        <ul className="flex justify-around list-none p-0 m-0">
          <li><Link href="/submissions" className="text-white font-bold">My Submissions</Link></li>
          <li><Link href="/all_sub" className="text-white font-bold">All Submissions</Link></li>
          <li><Link href="/users/analytics" className="text-white font-bold">My Analytics</Link></li>
          <li><Link href="/users/admin" className="text-white font-bold">User Analytics</Link></li>
          <li><Link href="/new_sub" className="text-white font-bold">Add Submission</Link></li>
          <li><a href="/buy_credits" className="text-white font-bold">Credits</a></li>
        </ul>
      </nav>
    )
}

export default AdminNav;