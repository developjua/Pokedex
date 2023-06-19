import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DetailPage from "./components/Details"
import Bookmark from "./components/Bookmark"
import AllPokemon from './components/AllPokemon';
import Abilities from './components/Abilities';
import Group from './components/Group';
import Habitat from './components/Habitat';
import Location from './components/Location';
import Species from './components/Species';
import Allfilter from "./components/Allfilter"
import SearchPage from "./components/Searchpage"





const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/pokemon/:pokemonId" element={<DetailPage />} />
        <Route path="/Bookmarks" element={<Bookmark/>}/>
        <Route path="/list" element={<Allfilter/>}/>
        <Route path="/abilities" element={<Abilities />} />
        <Route path="/group" element={<Group />} />
        <Route path="/habitat" element={<Habitat />} />
        <Route path="/species" element={<Species />} />
        <Route path="/allpokemon" element={<AllPokemon />} />
      </Routes>
    </Router>
  );
};

export default App;