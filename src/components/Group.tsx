import { useEffect, useState } from 'react';
import Loader from './Loader';
import PokemonCard from './PokemonCard';
import { useNavigate } from 'react-router-dom';

const Group = () => {
  const [pokemonData, setPokemonData] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPokemonByEggGroup = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/egg-group/');
        const data = await response.json();
        const eggGroups = data.results;

        const fetchedData = await Promise.all(
          eggGroups.map(async (eggGroup: { name: string; url: string }) => {
            const speciesResponse = await fetch(eggGroup.url);
            const speciesData = await speciesResponse.json();

            const pokemonPromises = speciesData.pokemon_species.map(async (pokemon: { url: string }) => {
              const pokemonResponse = await fetch(pokemon.url);
              if (!pokemonResponse.ok) {
                return null;
              }
              const pokemonData = await pokemonResponse.json();
              const typesResponse = await fetch(pokemonData.varieties[0].pokemon.url);
              const typesData = await typesResponse.json();
              const types = typesData.types?.map((type: { type: { name: string } }) => type.type.name) || [];
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
              eggGroup: eggGroup.name,
              pokemon: resolvedPokemon.filter(Boolean),
            };
          })
        );

        setPokemonData(fetchedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching Pokémon by egg group:', error);
        setPokemonData([]);
        setIsLoading(false);
      }
    };

    fetchPokemonByEggGroup();
  }, []);

  const handlePokemonClick = (id:number) => {
    navigate(`/pokemon/${id}`);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        pokemonData.map((category) => (
          <div key={category.eggGroup}>
            <h2 className="text-xl font-bold mb-2 text-white">{category.eggGroup}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 h-screen w-screen overflow-y-auto">
              {category.pokemon.map((pokemon: { id: string | number; name: string; types: { type: { name: string } }[] }) => (
                <PokemonCard
                  key={pokemon.id}
                  name={pokemon.name}
                  types={pokemon.types.map((type) => type.type?.name)}
                  id={pokemon.id}
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

export default Group;
