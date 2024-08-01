import react, { useEffect } from "react";
import Signup from "./components/Signup";
import Question from "./components/Question";
import Quiz from "./components/Quiz";
import Lobby from "./components/Lobby"
import Login from "./components/Login";
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Userprofile from './components/Userprofile'
import Navbar from './components/Navbar'
import Mcqlist from "./components/Mcqlist";
import Gameroom from "./components/Gameroom";
import { jwtDecode } from "jwt-decode";
import { setusername } from "./components/reducer";
import Result from "./components/Result";

function App() {

  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
    if(token){
      const decoded = jwtDecode(token);
      const tokenusername = decoded.username
      // const user = useSelector((state) => state.user)
      dispatch(setusername(tokenusername))
    }

  return (

      <Router>
        <Routes>
          <Route path="/" element={
            <div>
              <Navbar /> 
              <h1>Welcome to MCQ App</h1>
              <EnterLobbyButton />
              <EnterLoginButton />
            </div>
          } />
          <Route path="/Signup" element={<Signup />} />
          <Route 
            path="/Lobby" 
            element={<ProtectedRoute><Lobby /></ProtectedRoute>} 
          />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/Userprofile" element={<Userprofile />}></Route>
          <Route path="/mcqlist/:id" element={<Mcqlist />}></Route>
          <Route path="/game/:id" element={<Gameroom />}></Route>
          <Route path="/results" element={<Result />}></Route>
        </Routes>
      </Router>
    
  );
}

function EnterLoginButton(){
  const navigate = useNavigate();
  return <button onClick={(e) => navigate('/login')}>Login</button>
}

function EnterLobbyButton() {
  const navigate = useNavigate();
  // const username = useSelector(state => state.user.username);
  const token = localStorage.getItem("token");
  // const token = "";
  const handleEnterLobby = () => {
    if (token) {
      navigate('/lobby');
    } else {
      navigate('/Login');
    }
  };

  return <button onClick={handleEnterLobby}>Enter Lobby</button>;
}

function ProtectedRoute({ children }) {
  // const username = useSelector(state => state.user.username);
  const token = localStorage.getItem("token");
  // const token = "";
  return token ? children : <Navigate to="/Login" />;
}

export default App;
