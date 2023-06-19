import { useState } from 'react';
import AllPokemon from './AllPokemon';
import Abilities from './Abilities';
import Group from './Group';
import Habitat from './Habitat';
import Species from './Species';
import Navbar from '../section/Navbar';




const Pokelist = () => {
  const [activeComponent, setActiveComponent] = useState('AllPokemon');
    const [activeLink, setActiveLink] = useState('/list');

  const handleNavigation = (componentName: string) => {
    setActiveComponent(componentName);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'AllPokemon':
        return <AllPokemon />;
      case 'Abilities':
        return <Abilities />;
      case 'Group':
        return <Group />;
      case 'Habitat':
        return <Habitat />;
      case 'Species':
        return <Species />;
      default:
        return <AllPokemon />;
    }
  };

  return (
    <>
      <Navbar activeLink="/list" setActiveLink={setActiveLink} />
      <div className="flex flex-col items-center mt-4 bg-slate-800 h-screen w-screen">
        <div className="flex justify-center mt-20">
          <button className="mr-4 bg-blue-500 text-white py-2 px-4 rounded-md" onClick={() => handleNavigation('AllPokemon')}>
            All Pokemon
          </button>
          <button className="mr-4 bg-blue-500 text-white py-2 px-4 rounded-md" onClick={() => handleNavigation('Abilities')}>
            Abilities
          </button>
          <button className="mr-4 bg-blue-500 text-white py-2 px-4 rounded-md" onClick={() => handleNavigation('Group')}>
            Group
          </button>
          <button className="mr-4 bg-blue-500 text-white py-2 px-4 rounded-md" onClick={() => handleNavigation('Habitat')}>
            Habitat
          </button>
          <button className="mr-4 bg-blue-500 text-white py-2 px-4 rounded-md" onClick={() => handleNavigation('Species')}>
            Species
          </button>
        </div>
        <div className="mt-4 bg-slate-800">
          {renderComponent()}
        </div>
      </div>
    </>
  );
};

export default Pokelist;
