import "./App.css";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Cookies from "universal-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from './utils/PrivateRoute';
import ExercisesPage from './pages/ExercisePage'

function App() {
  const [userData, setUserData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const cookies = new Cookies();

  const isAuth = cookies.get("connect.sid");

  console.log(isAuth);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute/>}>
            <Route path='dashboard' element={<Dashboard/>} exact></Route>
            <Route path='exercises' element={<ExercisesPage/>} exact></Route>
        </Route>
        <Route path='login' element={<Login/>}></Route>
      </Routes> 
    </BrowserRouter>
  );
}

export default App;
