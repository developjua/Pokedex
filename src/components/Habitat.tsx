import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import Loader from './Loader';
import PokemonCard from './PokemonCard';

const Habitat = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();


  useEffect(() => {
    const fetchPokemonByHabitat = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon-habitat');
        const data = await response.json();
        const habitats = data.results;

        const fetchedData = await Promise.all(
          habitats.map(async (habitat) => {
            const habitatResponse = await fetch(habitat.url);
            const habitatData = await habitatResponse.json();

            const pokemonPromises = habitatData.pokemon_species.map(async (pokemon) => {
              const pokemonResponse = await fetch(pokemon.url);
              if (!pokemonResponse.ok) {
                return null;
              }
              const pokemonData = await pokemonResponse.json();
              const typesResponse = await fetch(pokemonData.varieties[0].pokemon.url);
              const typesData = await typesResponse.json();
              const types = typesData.types?.map((type) => type.type.name) || [];
              if (!types.length) {
                return null; 
              }
              return {
                id: pokemonData.id,
                name: pokemonData.name,
                image: `https://pokeapi.co/media/sprites/pokemon/${pokemonData.id}.png`,
                types,
              };
            });

            const resolvedPokemon = await Promise.all(pokemonPromises);
            return {
              habitat: habitat.name,
              pokemon: resolvedPokemon.filter(Boolean), 
            };
          })
        );

        setPokemonData(fetchedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon by habitat:', error);
        toast.error('Failed to fetch Pokémon data. Please try again later.');
        setPokemonData([]);
        setIsLoading(false);
      }
    };

    fetchPokemonByHabitat();
  }, []);
   const handlePokemonClick = (id: string) => {
    navigate(`/pokemon/${id}`);
  };

  return (
    <div>
      {isLoading ? (
        <Loader /> 
      ) : (
        pokemonData.map((category) => (
          <div key={category.habitat}>
            <h2 className="text-xl font-bold mb-2 text-white">{category.habitat}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 h-screen w-screen overflow-y-auto">

              {category.pokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  name={pokemon.name}
                  types={pokemon.types.map((type) => type.type?.name)}
                  id={pokemon.id}
                  image={pokemon.image}
                   handlePokemonClick={handlePokemonClick}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Habitat;
