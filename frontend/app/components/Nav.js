import Link from 'next/link'

const Nav = () => {
    return (
        <nav className="bg-blue-800 p-3">
        <ul className="flex justify-around list-none p-0 m-0">
          <li><Link href="/submissions/1" className="text-white font-bold">Submissions</Link></li>
          <li><a href="/users/analytics" className="text-white font-bold">Analytics</a></li>
          <li><Link href="/new_sub" className="text-white font-bold">Add Submission</Link></li>
          <li><Link href="/buy_credits" className="text-white font-bold">Credits</Link></li>
          
        </ul>
      </nav>
    )
}

export default Nav;