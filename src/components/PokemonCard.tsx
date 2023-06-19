import { useNavigate } from 'react-router-dom';

const PokemonCard = ({ name, types, id, handlePokemonClick }: { name: string, types: string[], id: number, handlePokemonClick: (id: number|string) => void }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    handlePokemonClick(id);
    navigate(`/pokemon/${name}`);
  };

  return (
   <div className="bg-white rounded-md shadow-md p-4 cursor-pointer backdrop-filter backdrop-blur-lg backdrop-opacity-50" onClick={handleClick}>
  <img
    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
    alt={name}
    className="w-24 h-24 mx-auto mb-2"
  />
  <h3 className="text-xl font-semibold text-center capitalize">{name}</h3>
  <div className="text-center">
    {types.map((type) => (
      <span
        key={type}
        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
      >
        {type}
      </span>
    ))}
  </div>
</div>

  );
};

export default PokemonCard;
