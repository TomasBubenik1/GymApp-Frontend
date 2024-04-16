import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import BarChartComponent from "../components/Charts/RecentExerciseGraph";
import SingleExerciseChart from "../components/Charts/RecentExerciseGraph";
import Avatar from "@mui/joy/Avatar";
import ProfileBox from "../components/ProfileBox";
import Footer from "../components/Footer";
import CalorieProgress from "../components/Charts/CalorieCircleProgress";
import CaloriesBarChart from "../components/Charts/CaloriesBarChart";
import WeightProgressChart from "../components/Charts/WeightProgressChart";

function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [calorieDate, setCalorieDate] = useState("");
  const [calorieData, setCalorieData] = useState([]);
  const [editingWeight, setEditingWeight] = useState(false);
  const [editingGoalWeight, setEditingGoalWeight] = useState(false);
  const [editingHeight, setEditingHeight] = useState(false);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [goalWeight, setGoalWeight] = useState(0);
  const [weightHistory, setWeightHistory] = useState();
  const [goalWeightHistory, setGoalWeightHistory] = useState();

  useEffect(() => {
    fetchLoggedInData();
    const today = new Date().toISOString().split("T")[0];
    setCalorieDate(today);
    fetchDailyCalories(today);
  }, []);

  function handleWeightInputChange(e) {
    setWeight(e.target.value);
    const input = e.target;

    input.style.width = (input.value.length + 2) * 8 + "px";
  }
  function handleGoalWeightInputChange(e) {
    setGoalWeight(e.target.value);
    const input = e.target;
    input.style.width = (input.value.length + 2) * 8 + "px";
  }

  function handleHeightInputChange(e) {
    setHeight(e.target.value);
    const input = e.target;
    input.style.width = (input.value.length + 2) * 8 + "px";
  }

  async function handleBodyMassSubmit() {
    try {
      setEditingHeight(false);
      setEditingWeight(false);
      setEditingGoalWeight(false);

      const res = await axios.post(
        "http://localhost:5000/api/handlebodymasschange",
        {
          newCurrentWeight: weight,
          newGoalWeight: goalWeight,
          newHeight: height,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("There was error changing weight:", error);
    }
  }

  async function fetchDailyCalories(date) {
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date provided:", date);
        alert("The provided date is invalid. Please select a valid date.");
        return;
      }

      const data = await axios.post(
        "http://localhost:5000/api/getcalorieintake",
        {
          date: dateObj,
        },
        { withCredentials: true }
      );
      setCalorieData(data.data);
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
      setUserData(response.data.UserData);
      setWeight(response.data.UserData.currentWeight);
      setHeight(response.data.UserData.height);
      setGoalWeight(response.data.UserData.goalWeight);
      setGoalWeightHistory({
        goalWeightHistory: response.data.UserData.userGoalWeightHistory,
      });
      setWeightHistory({
        weightHistory: response.data.UserData.weightHistory,
      });
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  return (
    <div className="flex flex-col w-full  h-full">
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
              {userData.username}!👋
            </h1>
          </div>
          <div className="lg:flex-row lg:flex 2xl:flex 2xl:flex-row xl:flex xl:flex-row grid grid-cols-2 gap-0">
            <CalorieProgress
              initialConsumedCalories={calorieData.consumedCalories}
              initialGoalCalories={calorieData.goalCalories}
            ></CalorieProgress>
            <div className="bg-foreground relative p-5 rounded-lg ml-5 flex flex-col items-center justify-center max-w-56 mt-16 w-56 shadow-lg h-[200px]">
              <p className="text-text absolute top-5 font-bold">Height:</p>
              <div className="flex flex-row">
                <span className="material-symbols-outlined pr-4 text-white mt-4">
                  straighten
                </span>
                {editingHeight ? (
                  <input
                    onChange={(e) => handleHeightInputChange(e)}
                    className=" bg-transparent w-14 border-white border text-xl mt-2 rounded-lg text-text"
                    value={height}
                  ></input>
                ) : (
                  <div className="flex flex-row">
                    <p className="text-text text-2xl mt-2">{height}</p>
                  </div>
                )}
                <p className="text-text opacity-50 mt-4 ml-1">cm</p>
              </div>
              {editingHeight ? (
                <div
                  className="absolute bottom-1 right-5 text-accentGlow opacity-75 hover:opacity-100 cursor-pointer"
                  onClick={() => handleBodyMassSubmit()}
                >
                  <button
                    disabled={0 >= height || height > 400}
                    className=" disabled:text-gray-700"
                  >
                    <span className="material-symbols-outlined text-[26px]">
                      check
                    </span>
                  </button>
                </div>
              ) : (
                <p
                  onClick={() => setEditingHeight(true)}
                  className="bottom-3 right-5 opacity-50 absolute text-text font-semibold hover:opacity-100 cursor-pointer"
                >
                  Edit
                </p>
              )}
            </div>

            <div className="bg-foreground relative p-5 rounded-lg ml-5 flex flex-col items-center justify-center max-w-56 mt-16 w-56 shadow-lg h-[200px]">
              <p className="text-text absolute top-5 font-bold">
                Current Weight:
              </p>
              <div className=" flex flex-row">
                <span className="material-symbols-outlined pr-4 text-white mt-4">
                  scale
                </span>
                {editingWeight ? (
                  <input
                    onChange={(e) => handleWeightInputChange(e)}
                    className=" bg-transparent w-14 border-white border text-xl mt-2 rounded-lg text-text"
                    value={weight}
                  ></input>
                ) : (
                  <p className="text-text text-2xl mt-2">{weight}</p>
                )}
                <p className="text-text opacity-50 mt-4 ml-1">kg</p>
              </div>
              {editingWeight ? (
                <div
                  className="absolute bottom-1 right-5 text-accentGlow opacity-75 hover:opacity-100 cursor-pointer"
                  onClick={() => handleBodyMassSubmit()}
                >
                  <button
                    disabled={0 >= weight || weight > 999}
                    className=" disabled:text-gray-700"
                  >
                    <span className="material-symbols-outlined text-[26px]">
                      check
                    </span>
                  </button>
                </div>
              ) : (
                <p
                  onClick={() => setEditingWeight(true)}
                  className=" bottom-3 right-5 opacity-50 absolute text-text font-semibold hover:opacity-100 cursor-pointer"
                >
                  Edit
                </p>
              )}
            </div>
            <div className="bg-foreground relative p-5 rounded-lg ml-5 flex flex-col items-center justify-center max-w-56 mt-16 w-56 shadow-lg h-[200px]">
              <p className="text-text absolute top-5 font-bold">Goal Weight:</p>
              <div className=" flex flex-row">
                <span className="material-symbols-outlined text-[30px] pr-3 text-white mt-3">
                  emoji_events
                </span>
                {editingGoalWeight ? (
                  <input
                    onChange={(e) => handleGoalWeightInputChange(e)}
                    className=" bg-transparent w-14 border-white border text-xl mt-2 rounded-lg text-text"
                    value={goalWeight}
                  ></input>
                ) : (
                  <p className="text-text text-2xl mt-2">{goalWeight}</p>
                )}
                <p className="text-text opacity-50 mt-4 ml-1">kg</p>
              </div>
              {editingGoalWeight ? (
                <div
                  className="absolute bottom-1 right-5 text-accentGlow opacity-75 hover:opacity-100 cursor-pointer"
                  onClick={() => handleBodyMassSubmit()}
                >
                  <button
                    disabled={0 >= goalWeight || goalWeight > 400}
                    className=" disabled:text-gray-700"
                  >
                    <span className="material-symbols-outlined text-[26px]">
                      check
                    </span>
                  </button>
                </div>
              ) : (
                <p
                  onClick={() => setEditingGoalWeight(true)}
                  className=" bottom-3 right-5 opacity-50 absolute text-text font-semibold hover:opacity-100 cursor-pointer"
                >
                  Edit
                </p>
              )}
            </div>
          </div>
          <div className="ml-5 flex flex-col xl:flex-row">
            <SingleExerciseChart></SingleExerciseChart>
            <div>
              {weightHistory && goalWeightHistory && (
                <WeightProgressChart
                  WeightHistory={weightHistory}
                  GoalWeightHistory={goalWeightHistory}
                  currentWeight={weight}
                  currentGoalWeight={goalWeight}
                ></WeightProgressChart>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Dashboard;
