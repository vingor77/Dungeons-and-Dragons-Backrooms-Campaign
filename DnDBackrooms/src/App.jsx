import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Groups from './Pages/Groups';
import Levels from './Pages/Levels';
import Items from './Pages/Items';
import Quests from './Pages/Quests';
import Navbar from './Components/Navbar';
import GeneralInfo from './Pages/PlayerInfo';
import Entities from './Pages/Entities';
import Outposts from './Pages/Outposts';
import Functions from './Components/Functions';
import GearSets from './Pages/GearSets';
import Avatars from './Pages/Avatars';
import Gods from './Pages/Gods';
import Crafts from './Pages/Crafting';
import Updates from './Pages/Updates';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />
        <div className='content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/groups' element={<Groups />} />
            <Route path='/outposts' element={<Outposts />} />
            <Route path='/levels' element={<Levels />} />
            <Route path='/items' element={<Items />} />
            <Route path='/gearSets' element={<GearSets />} />
            <Route path='/entities' element={<Entities />} />
            <Route path='/quests' element={<Quests />} />
            <Route path='/info' element={<GeneralInfo />} />
            <Route path='/functions' element={<Functions />} />
            <Route path='/gods' element={<Gods />} />
            <Route path='/avatars' element={<Avatars />} />
            <Route path='/crafts' element={<Crafts />} />
            <Route path='edits' element={<Updates />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
