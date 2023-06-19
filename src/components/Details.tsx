import React, { useState, useEffect } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../section/Navbar';
import Loader from './Loader';

interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface Pokemon {
  name: string;
  types: {
    type: {
      name: string;
    };
  }[];
  species: {
    name: string;
  };
  stats: Stat[];
  sprites: {
    front_default: string;
  };
}

const DetailPage: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { pokemonId } = useParams<{ pokemonId?: string }>();
    const [activeLink, setActiveLink] = useState('/details');

  useEffect(() => {
    if (pokemonId) {
      const fetchPokemon = async () => {
        try {
          const response = await axios.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
          const data = response.data;
          setPokemon(data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching Pokemon details:', error);
        }
      };

      fetchPokemon();
    }
  }, [pokemonId]);

  useEffect(() => {
    const bookmarkedPokemons = localStorage.getItem('bookmarkedPokemons');
    if (bookmarkedPokemons && pokemonId) {
      const bookmarkedPokemonIds = JSON.parse(bookmarkedPokemons) as string[];
      setIsBookmarked(bookmarkedPokemonIds.includes(pokemonId.toString()));
    } else {
      setIsBookmarked(false);
    }
  }, [pokemonId]);

  const toggleBookmark = () => {
    const bookmarkedPokemons = localStorage.getItem('bookmarkedPokemons');
    let bookmarkedPokemonIds: string[] = [];
    if (bookmarkedPokemons) {
      bookmarkedPokemonIds = JSON.parse(bookmarkedPokemons);
    }

    if (isBookmarked && pokemonId) {
      // Remove from bookmarks
      const updatedBookmarkedPokemons = bookmarkedPokemonIds.filter((id) => id !== pokemonId);
      localStorage.setItem('bookmarkedPokemons', JSON.stringify(updatedBookmarkedPokemons));
      toast.success('Bookmark removed');
    } else if (pokemonId) {
      // Add to bookmarks
      bookmarkedPokemonIds.push(pokemonId);
      localStorage.setItem('bookmarkedPokemons', JSON.stringify(bookmarkedPokemonIds));
      toast.success('Bookmark added');
    }

    setIsBookmarked((prevValue) => !prevValue);
  };

  return (
    <div className="details bg-gray-100 p-8 rounded-lg shadow-lg bg-slate-800 h-screen">
      <div className="navbar-container mb-4">
        <Navbar activeLink="/details" setActiveLink={setActiveLink}/>
      </div>
      <div className="flex flex-col md:flex-row relative">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-screen">
            <Loader />
          </div>
        ) : (
          <>
            <div className="stats flex-shrink-0 order-2 md:order-1 md:w-64 mt-20">
              <div className="rounded-lg p-4 bg-slate-600">
                <h4 className="text-2xl font-semibold mb-4 ">Stats:</h4>
                <ul className="space-y-2">
                  {pokemon?.stats.map((stat: Stat) => (
                    <li key={stat.stat.name} className="flex items-center">
                      <span className="mr-2 w-24">{stat.stat.name}:</span>
                      <span className="mr-2 text-lg font-semibold">{stat.base_stat}</span>
                      <div className="flex items-center w-full bg-gray-300 h-4 rounded-lg">
                        <div
                          className="h-full bg-blue-500 rounded-lg"
                          style={{ width: `${stat.base_stat}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="details-info flex flex-col justify-center items-center md:order-2 md:flex-1 mt-20">
              <div className="glass-card bg-white bg-opacity-40 rounded-lg shadow-md p-6 backdrop-filter backdrop-blur-lg w-96 flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold mb-4">{pokemon?.name}</h1>
                <div className="image-container mb-6">
                  <img
                    src={pokemon?.sprites.front_default}
                    alt={pokemon?.name}
                    className="pokemon-image rounded-md"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Type: {pokemon?.types.map((type) => type.type.name).join(' - ')}
                </h3>
                <h3 className="text-xl font-semibold mb-4">Evolution: {pokemon?.species.name}</h3>
              </div>
            </div>

            <button
              className="bookmark-button absolute right-0 top-0 mt-20 mr-4 flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              onClick={toggleBookmark}
            >
              {isBookmarked ? <FaBookmark className="mr-2" /> : <FaRegBookmark className="mr-2" />}
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default DetailPage;
