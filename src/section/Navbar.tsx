import React, { useState } from 'react';
import logo from '../assets/pokeball-icon.png';
import { Link } from 'react-router-dom';

interface NavbarProps {
  activeLink: string;
  setActiveLink: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ activeLink, setActiveLink }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="https://flowbite.com/" className="flex items-center">
          <img src={logo} className="h-8 mr-3" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Pokedex
          </span>
        </a>
        <div className="flex md:order-2">
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
            <Link
  to="/"
  className={`block py-2 pl-3 pr-4 text-white ${
    activeLink === '/' ? 'text-white bg-blue-700 rounded' : 'text-gray-900'
  }`}
  onClick={() => setActiveLink && setActiveLink('/')}
>
  Search
</Link>

            </li>
            <li>
            <Link
  to="/list"
  className={`block py-2 pl-3 pr-4 text-white ${
    activeLink === '/list' ? 'text-white bg-blue-700 rounded' : 'text-gray-900'
  }`}
  onClick={() => setActiveLink && setActiveLink('/list')}
>
  Pokemon List
</Link>

            </li>
            <li>
         <Link
  to="/Bookmarks"
  className={`block py-2 pl-3 pr-4 text-white ${
    activeLink === '/Bookmarks' ? 'text-white bg-blue-700 rounded' : 'text-gray-900'
  }`}
  onClick={() => setActiveLink && setActiveLink('/Bookmarks')}
>
  Bookmarks
</Link>

            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
