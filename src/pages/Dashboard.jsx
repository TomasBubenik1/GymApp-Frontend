import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import BarChartComponent from "../components/Charts/TotalWeightLifted";
import SingleExerciseChart from "../components/Charts/TotalWeightLifted";
import Avatar from "@mui/joy/Avatar";
import ProfileBox from "../components/ProfileBox";
import Footer from "../components/Footer";

function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);

  useEffect(() => {
    fetchLoggedInData();
  }, []);

  async function fetchLoggedInData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getloggedinuser",
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setUserData(response.data.UserData);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex bg-backgroundcolor w-full">
        <Navbar currentSite={"dashboard"} />
        <main className=" grow bg-backgroundcolor">
          <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
            <h1 className="text-3xl text-text font-bold ml-5">Dashboard</h1>
            <div className="">
              <ProfileBox
                nickname={userData.nickname}
                profilepic={userData.profilepicture}
                username={userData.username}
              ></ProfileBox>
            </div>
          </nav>
          <div className="ml-5"></div>
          <SingleExerciseChart></SingleExerciseChart>
        </main>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Dashboard;
