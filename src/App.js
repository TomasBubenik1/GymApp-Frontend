import "./App.css";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Cookies from "universal-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import ExercisesPage from "./pages/ExercisePage";
import Register from "./pages/Register";
import ExerciseDetails from "./pages/Details";
import WorkoutPlans from "./pages/Workoutplans";
import SocialMain from "./pages/Social/SocialMain";
import ProfilePage from "./pages/ProfilePage";
import ProfileSettings from './pages/ProfileSettings';

function App() {
  const [userData, setUserData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const cookies = new Cookies();

  const isAuth = cookies.get("connect.sid");

  console.log(isAuth);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} exact></Route>
          <Route path="exercises" element={<ExercisesPage />} exact></Route>
          <Route path="social" element={<SocialMain />} exact></Route>
          <Route path="details/:id" element={<ExerciseDetails />} exact></Route>
          <Route path="workoutplans" element={<WorkoutPlans />} exact></Route>
          <Route path=":username" element={<ProfilePage />} exact></Route>
          <Route path="settings" element={<ProfileSettings />} exact></Route>
        </Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
