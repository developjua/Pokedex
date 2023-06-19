import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../section/Navbar';
import Loader from './Loader';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface PokemonData {
  pokemonId: number;
  name: string;
  imageUrl: string;
  type: string;
}

const BookmarkPage: React.FC = () => {
  const [bookmarkedPokemons, setBookmarkedPokemons] = useState<string[]>([]);
  const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLink, setActiveLink] = useState('/Bookmarks');


  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedPokemons'));
    if (storedBookmarks) {
      setBookmarkedPokemons(storedBookmarks);
    }
    setIsLoading(false);
  }, []);

  const removeBookmark = (pokemonId: string) => {
    const updatedBookmarks = bookmarkedPokemons.filter((id) => id !== pokemonId);
    setBookmarkedPokemons(updatedBookmarks);
    localStorage.setItem('bookmarkedPokemons', JSON.stringify(updatedBookmarks));
    toast.success('Bookmark removed successfully!');
  };

  const fetchPokemonData = async (pokemonId: string): Promise<PokemonData | null> => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const pokemon = response.data;
      const pokemonData: PokemonData = {
        pokemonId: pokemon.id,
        name: pokemon.name,
        imageUrl: pokemon.sprites.front_default,
        type: pokemon.types.map((type: any) => type.type.name).join(' - '),
      };
      return pokemonData;
    } catch (error) {
      console.log('Error fetching Pokemon data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchBookmarkedPokemonData = async () => {
      const bookmarkedData = await Promise.all(
        bookmarkedPokemons.map((pokemonId) => fetchPokemonData(pokemonId))
      );
      const filteredData = bookmarkedData.filter((pokemon) => pokemon !== null) as PokemonData[];
      setPokemonData(filteredData);
      setIsLoading(false);
    };
    fetchBookmarkedPokemonData();
  }, [bookmarkedPokemons]);

  return (
    <div className="bg-slate-800 h-screen mt-16">
      <Navbar activeLink="/Bookmarks" setActiveLink={setActiveLink} />

     <div className="mt-10 m-10"> <h1 className="text-4xl font-bold my-8 text-center text-zinc-100 ">Bookmarked Pokemon</h1></div>
      {isLoading ? (
        <div className="flex items-center justify-center w-full">
          <Loader />
        </div>
      ) : pokemonData.length === 0 ? (
        <p className="text-center text-5xl my-8">No bookmarked Pokemon found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ml-4 mt-6">
          {pokemonData.map((pokemon) => (
            <Link to={`/pokemon/${pokemon.pokemonId}`} key={pokemon.pokemonId}>
              <div className="bg-white bg-opacity-40 rounded-lg shadow-md p-4 backdrop-filter backdrop-blur-lg">
                <img src={pokemon.imageUrl} alt={pokemon.name} className="w-24 h-24 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-center mb-2">Name: {pokemon.name}</h3>
                <p className="text-sm text-center">Type: {pokemon.type}</p>
                <button
                  className="bookmark-button mt-4 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md ml-8"
                  onClick={() => removeBookmark(String(pokemon.pokemonId))}
                >
                  <FaRegBookmark className="mr-2" />
                  Remove Bookmark
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default BookmarkPage;
