const Header = () => {
    return (
      <header className="bg-gray-800 text-white p-5 text-center">
        <h1 className="text-4xl font-bold">solveMe</h1>
        <div className=" p-4 text-center text-white">
            {new Date().toLocaleString()}
        </div>
      </header>
    )
}

export default Header;