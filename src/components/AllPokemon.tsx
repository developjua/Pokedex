import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PokemonCard from './PokemonCard';
import Loader from './Loader';

interface Pokemon {
  id: number;
  name: string;
  types: string[];
}

const AllPokemon = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchPokemon = async (url: string, limit: number) => {
    try {
      const response = await fetch(`${url}?limit=${limit}`);
      const data = await response.json();
      const pokemonData = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const response = await fetch(pokemon.url);
          const pokemonDetails = await response.json();
          return {
            id: pokemonDetails.id,
            name: pokemon.name,
            types: pokemonDetails.types.map((type: any) => type.type.name),
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
    const fetchMorePokemon = async () => {
      if (nextUrl && !isLoading) {
        setIsLoading(true);

        try {
          const response = await fetch(nextUrl);
          const data = await response.json();
          const pokemonData = await Promise.all(
            data.results.map(async (pokemon: any) => {
              const response = await fetch(pokemon.url);
              const pokemonDetails = await response.json();
              return {
                id: pokemonDetails.id,
                name: pokemon.name,
                types: pokemonDetails.types.map((type: any) => type.type.name),
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

    fetchPokemon('https://pokeapi.co/api/v2/pokemon/', 20);

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

  const handlePokemonClick = (id: number) => {
    navigate(`/pokemon/${id}`);
  };

  if (error) {
    navigate('/');
  }

  return (
    <div className="h-screen w-screen bg-slate-800">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 h-screen w-screen mt-20 overflow-y-auto">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.name}
            id={pokemon.id}
            name={pokemon.name}
            types={pokemon.types}
            handlePokemonClick={handlePokemonClick}
          />
        ))}
      </div>
      {isLoading && (
        <div className="flex items-center justify-center  h-20">
          <Loader />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AllPokemon;
