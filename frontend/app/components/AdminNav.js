import Link from 'next/link'

const AdminNav = () => {
    return (
        <nav className="bg-blue-500 p-3">
        <ul className="flex justify-around list-none p-0 m-0">
          <li><Link href="/submissions/1" className="text-white font-bold">My Submissions</Link></li>
          <li><Link href="/allsubs" className="text-white font-bold">All Submissions</Link></li>
          <li><Link href="/users" className="text-white font-bold">Users</Link></li>
          <li><Link href="/newsub" className="text-white font-bold">Add Submission</Link></li>
          <li><a href="#" className="text-white font-bold">Credits</a></li>
        </ul>
      </nav>
    )
}

export default AdminNav;