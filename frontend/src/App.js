import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from "./userContext";
import Header from "./components/Header";
import Sessions from "./components/Sessions";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import AddSession from "./components/AddSession";
import NotFound from "./components/NotFound";
import Homepage from './components/Homepage';
import Leaderboard from './components/Leaderboard';
import LandingPage from './components/LandingPage';

function App() {
 
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{
        user: user,
        setUserContext: updateUserData
      }}>
        <div className="App">
          <Header title="My application"></Header>
          <Routes>
            <Route path="/" exact element={<LandingPage/>}></Route>
            <Route path="/login" exact element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/upload" element={<AddSession />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/logout" element={<Logout />}></Route>
            <Route path="/sessions" element={<Sessions />}></Route>
            <Route path="/leaderboard" element={<Leaderboard />}></Route>
            <Route path ="*"element={<NotFound />}></Route>
          </Routes>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
