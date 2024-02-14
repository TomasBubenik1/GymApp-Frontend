import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import BarChartComponent from "../components/Charts/TotalWeightLifted";
import SingleExerciseChart from "../components/Charts/TotalWeightLifted";
import Avatar from "@mui/joy/Avatar";
import ProfileBox from "../components/ProfileBox";
import Footer from "../components/Footer";
import CalorieProgress from "../components/Charts/CalorieCircleProgress";
import CaloriesBarChart from "../components/Charts/CaloriesBarChart";

function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);

  const [calorieDate, setCalorieDate] = useState("");
  const [calorieData, setCalorieData] = useState([]);

  useEffect(() => {
    fetchLoggedInData();
    const today = new Date().toISOString().split("T")[0];
    setCalorieDate(today);
    fetchDailyCalories(today);
  }, []);

  async function fetchDailyCalories(date) {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date provided:", date);
        alert("The provided date is invalid. Please select a valid date.");
        return;
      }

      console.log(dateObj);
      const data = await axios.post(
        "http://localhost:5000/api/getcalorieintake",
        {
          date: dateObj, // Ensuring the date is in ISO string format
        },
        { withCredentials: true }
      );
      setCalorieData(data.data); // Make sure to access the data property of the axios response
    } catch (error) {
      console.error("Error fetching daily calorie intake:", error);
      alert("Failed to fetch calorie data.");
    }
  }

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

  console.log("Calorie Data", calorieData);
  return (
    <div className="flex flex-col">
      <div className="flex bg-backgroundcolor w-full">
        <Navbar currentSite={"dashboard"} username={userData.username} />
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
          <div className="text-2xl flex items-center gap-2 mt-3 ml-5">
            <h1 className="text-stone-300">Hey,</h1>
            <h1 className=" text-accent font-bold mr-3">
              {userData.realname}!👋
            </h1>
          </div>
          <div className="ml-5 flex flex-row">
            <CalorieProgress
              initialConsumedCalories={calorieData.consumedCalories}
              initialGoalCalories={calorieData.goalCalories}
            ></CalorieProgress>
            <div className="bg-foreground relative p-5 rounded-lg ml-5 flex flex-col items-center justify-center max-w-56 mt-16 w-56 shadow-lg h-[200px]">
              <div className=" flex flex-row">
                <span className="material-symbols-outlined pr-4 text-white mt-4">
                  straighten
                </span>
                <p className="text-text text-2xl mt-2">{userData.height}</p>
                <p className="text-text opacity-50 mt-4 ml-1">cm</p>
              </div>
            </div>
            <div className="bg-foreground relative p-5 rounded-lg ml-5 flex flex-col items-center justify-center max-w-56 mt-16 w-56 shadow-lg h-[200px]">
              <div className=" flex flex-row">
                <span className="material-symbols-outlined pr-4 text-white mt-4">
                  scale
                </span>
                <p className="text-text text-2xl mt-2">
                  {userData.currentWeight}
                </p>
                <p className="text-text opacity-50 mt-4 ml-1">kg</p>
              </div>
            </div>
          </div>
          <div className="ml-5">
            <SingleExerciseChart></SingleExerciseChart>
          </div>
        </main>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Dashboard;
