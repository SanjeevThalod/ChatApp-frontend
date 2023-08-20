import './App.css';
import {
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/Home';
import Chat from './pages/Chat';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path='/chats' element={<Chat />} />
      </Routes>


    </div>
  );
}

export default App;
