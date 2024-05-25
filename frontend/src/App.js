import './App.css';
import {
  Routes,
  Route,
} from "react-router-dom"
import HomePage from './components/HomePage';
import ChatPage from './components/ChatPage';
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ChateState from './context/ChatState';

function App() {

  const navigate = useNavigate()

  useEffect(() => {

    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      navigate('/chat')
    }

  }, [navigate])


  return (
    <ChateState className="App">
      <div className="App">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/chat' element={<ChatPage />} />
        </Routes>
      </div>
    </ChateState>
  );
}

export default App;
