import "./App.css";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Cookies from "universal-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [userData, setUserData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const cookies = new Cookies();

  const isAuth = cookies.get("connect.sid");

  console.log(isAuth);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />}></Route>
        <Route path='dashboard' element={<Dashboard/>}></Route>
      </Routes> 
    </BrowserRouter>
  );
}

export default App;
