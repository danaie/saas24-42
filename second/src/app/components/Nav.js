import Link from 'next/link'

const Nav = () => {
    return (
        <nav className="bg-blue-500 p-3">
        <ul className="flex justify-around list-none p-0 m-0">
          <li><Link href="/submissions/1" className="text-white hover:text-gray-800 font-bold">Submissions</Link></li>
          <li><Link href="/profile/1" className="text-white hover:text-gray-800 font-bold">Profile</Link></li>
          <li><Link href="/newsub/1" className="text-white hover:text-gray-800 font-bold">Add Submission</Link></li>
          <li><Link href="/credits/1" className="text-white hover:text-gray-800 font-bold">Credits</Link></li>
        </ul>
      </nav>
    )
}

export default Nav;











