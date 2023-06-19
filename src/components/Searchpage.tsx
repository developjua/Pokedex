import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../section/Navbar";
import Loader from "./Loader.tsx";
import Logo from "../assets/pokeball-icon.png";
import { Link } from 'react-router-dom';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

interface ErrorResponse {
  message: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<Pokemon | null>(null);
    const [activeLink, setActiveLink] = useState('/');

  const handleSearch = async () => {
    setLoading(true);
    setSearchResult(null);

    try {
      const response = await axios.get<Pokemon>(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm}`
      );
      setSearchResult(response.data);
    } catch (error) {
      const errorMessage = (error as ErrorResponse).message || "Failed to fetch data";
      toast.error(errorMessage);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-800">
      <div className="w-full">
       <Navbar activeLink="/" setActiveLink={setActiveLink} />
      </div>
      <div className="py-8 px-4">
        <img src={Logo} className="h-28 mx-auto" alt="Pokemon Logo" />
      </div>
      <div className="w-full max-w-md px-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Enter Pokemon name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white py-2 px-4 rounded-r-md ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>
      <div className="w-full max-w-md">
        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8">
              <Loader />
            </div>
          </div>
        )}
      </div>
      {searchResult && (
        
   <Link to={`/pokemon/${searchResult.id}`} className="w-1/5">
  <div className="max-w-sm mx-auto my-4">
    <div className="relative overflow-hidden rounded-md shadow-lg">
      <div className="relative">
        <img
          src={searchResult.sprites.front_default}
          alt={searchResult.name}
          className="w-full h-auto"
        />
        <div className="absolute inset-0 bg-white bg-opacity-20"></div>
      </div>
      <div className="px-6 py-4 absolute bottom-0 left-0 w-full">
        <div className="text-center bg-opacity-75 backdrop-filter backdrop-blur-md">
          <div className="font-bold text-xl mb-2">{searchResult.name}</div>
       
        </div>
      </div>
    </div>
  </div>
</Link>



      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default SearchPage;