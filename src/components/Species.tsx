import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from './Loader';
import PokemonCard from './PokemonCard';

const Species = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [fetchedIds, setFetchedIds] = useState([]);

  const navigate = useNavigate();

  const fetchPokemon = async (url, limit) => {
    try {
      const response = await fetch(`${url}?limit=${limit}`);
      const data = await response.json();
      const pokemonData = await Promise.all(
        data.results.map(async (pokemon) => {
          const response = await fetch(pokemon.url);
          const pokemonDetails = await response.json();
          const response2 = await fetch(pokemonDetails.varieties[0].pokemon.url);
          const pokemonDetails2 = await response2.json();
          return {
            id: pokemonDetails2.id,
            name: pokemonDetails.varieties[0].pokemon.name,
            image: `https://pokeapi.co/media/sprites/pokemon/${pokemonDetails2.id}.png`,
            types: [], // Initialize types as an empty array
          };
        })
      );
      setPokemonList(pokemonData);
      setNextUrl(data.next);
    } catch (error) {
      setError(true);
      toast.error('Failed to fetch Pokémon. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon('https://pokeapi.co/api/v2/pokemon-species', 12);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 200;
      const isNearBottom = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - scrollThreshold;

      if (isNearBottom) {
        fetchMorePokemon();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchMorePokemon = async () => {
    if (nextUrl && !isLoading) {
      setIsLoading(true);

      try {
        const response = await fetch(nextUrl);
        const data = await response.json();
        const pokemonData = await Promise.all(
          data.results.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const pokemonDetails = await response.json();
            const response2 = await fetch(pokemonDetails.varieties[0].pokemon.url);
            const pokemonDetails2 = await response2.json();
            return {
              id: pokemonDetails2.id,
              name: pokemonDetails.varieties[0].pokemon.name,
              image: `https://pokeapi.co/media/sprites/pokemon/${pokemonDetails2.id}.png`,
              types: [], // Initialize types as an empty array
            };
          })
        );
        setPokemonList((prevPokemonList) => [...prevPokemonList, ...pokemonData]);
        setNextUrl(data.next);
      } catch (error) {
        setError(true);
        toast.error('Failed to fetch Pokémon. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePokemonClick = (id) => {
    navigate(`/pokemon/${id}`);
  };

  if (error) {
    navigate('/');
  }

  return (
    <div className="h-screen">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 h-screen w-screen mt-20 overflow-y-auto">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            types={pokemon.types.map((type) => type.type.name)}
            handlePokemonClick={handlePokemonClick}
          />
        ))}
      </div>
      {isLoading && (
        <div className="flex items-center justify-center w-full h-20">
          <Loader />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Species;
