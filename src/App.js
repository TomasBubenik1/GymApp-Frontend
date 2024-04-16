import "./App.css";
import Login from "./pages/Auth/Login";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Cookies from "universal-cookie";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import ExercisesPage from "./pages/Exercise/ExercisePage";
import Register from "./pages/Auth/Register";
import ExerciseDetails from "./pages/Exercise/Details";
import WorkoutPlans from "./pages/Workoutplan/WorkoutPlanSelection";
import SocialMain from "./pages/Social/SocialMain";
import ProfilePage from "./pages/Social/ProfilePage";
import { ProfileSettings } from "./pages/Settings";
import PostDetails from "./pages/Social/PostDetails";
import WorkoutPlanDetails from "./pages/Workoutplan/workoutplandetails";
import NotificationPage from "./pages/Social/NotificationPage";

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
          <Route
            path="postdetail/:postId"
            element={<PostDetails />}
            exact
          ></Route>
          <Route
            path="workoutplanselection"
            element={<WorkoutPlans />}
            exact
          ></Route>
          <Route
            path="/workoutdetails/:workoutPlanId"
            element={<WorkoutPlanDetails />}
            exact
          ></Route>
          <Route path=":username" element={<ProfilePage />} exact></Route>
          <Route path="settings" element={<ProfileSettings />} exact></Route>
          <Route
            path="notifications"
            element={<NotificationPage />}
            exact
          ></Route>
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="login" element={<Login />}></Route>
        <Route path="register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
