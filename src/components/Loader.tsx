
import pokeballLoader from "../assets/pokeball-loader.gif";
const Loader:React.FC=()=> {
  return (
    <div className="flex justify-center items-center h-full">
      <img src={pokeballLoader} alt="" />
    </div>
  );
}

export default Loader;
