import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PokemonCard from './PokemonCard';
import Loader from './Loader';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

const Abilities: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [abilityNames, setAbilityNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const abilityResponse = await axios.get('https://pokeapi.co/api/v2/ability');
        const abilities = abilityResponse.data.results.map((ability: any) => ability.name);
        setAbilityNames(abilities);
      } catch (error) {
        console.error('Error retrieving Pokémon data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const namesfetch = async () => {
      const pokemonData: Pokemon[] = [];
      try {
        const abilityResponses = await Promise.all(
          abilityNames.map((abilityName) =>
            axios.get(`https://pokeapi.co/api/v2/ability/${abilityName}`)
          )
        );
        const abilityDataList: Pokemon[][] = abilityResponses.map((response) =>
          response.data.pokemon.map((poke: any) => poke.pokemon)
        );
        const pokemonResponses = await Promise.all(
          abilityDataList.flat().map((pokemonData) => axios.get(pokemonData.url))
        );
        pokemonResponses.forEach((response) => {
          const pokemon: Pokemon = response.data;
          pokemonData.push(pokemon);
        });
        setPokemonList(pokemonData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error retrieving Pokémon data:', error);
      }
    };

    namesfetch();
  }, [abilityNames]);

  const handlePokemonClick = (id: string | number) => {
    navigate(`/pokemon/${id}`);
  };

  const renderSections = () => {
    const sections: { [key: string]: Pokemon[] } = {};
    pokemonList.forEach((pokemon: Pokemon) => {
      const abilityName = pokemon.types[0].type.name;

      if (sections[abilityName]) {
        sections[abilityName].push(pokemon);
      } else {
        sections[abilityName] = [pokemon];
      }
    });

    return Object.entries(sections).map(([abilityName, pokemonData]) => (
      <div key={abilityName} className="bg-slate-800">
        <h2 className="text-xl font-bold mb-2 text-white">{abilityName}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 h-screen w-screen overflow-y-auto">
          {pokemonData.map((pokemon: Pokemon) => (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              types={pokemon.types.map((type) => type.type.name)}
              handlePokemonClick={handlePokemonClick}
            />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div>
      {isLoading ? (
          <Loader />
        
      ) : (
        renderSections()
      )}
    </div>
  );
};

export default Abilities;
