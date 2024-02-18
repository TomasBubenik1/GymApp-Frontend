import React, { useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";

function CalorieProgress({ initialConsumedCalories, initialGoalCalories }) {
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [goalCalories, setGoalCalories] = useState(initialGoalCalories || 0);
  const [consumedCalories, setConsumedCalories] = useState(
    initialConsumedCalories || 0
  );

  function calculateProgress() {
    const progressCalc =
      goalCalories > 0 ? (consumedCalories / goalCalories) * 100 : 0;
    setProgress(progressCalc);
  }
  useEffect(() => {
    setGoalCalories(parseInt(initialGoalCalories));
    setConsumedCalories(initialConsumedCalories);
  }, [initialGoalCalories, initialConsumedCalories]);

  useEffect(() => {
    calculateProgress();
  }, [consumedCalories, goalCalories]);

  console.log({ initialGoalCalories, initialConsumedCalories });

  const [goalValueInput, setGoalValueInput] = useState(consumedCalories);

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleGoalInputChange(e) {
    setGoalValueInput(e.target.value);
    const input = e.target;
    input.style.width = (input.value.length + 2) * 8 + "px";
  }

  async function changeCalories(cals) {
    try {
      const date = new Date().toISOString().split("T")[0];
      const dateObj = new Date(date);
      var noveCals = consumedCalories + cals;
      setConsumedCalories(noveCals);
      const rets = await axios.post(
        "http://localhost:5000/api/modifycalorieintake",
        {
          date: dateObj,
          goalCalories: parseInt(goalCalories),
          consumedCalories: noveCals,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("There was error adding calories:", error);
    }
  }
  async function removeCalories() {
    try {
      const date = new Date().toISOString().split("T")[0];
      const dateObj = new Date(date);
      var noveCals = consumedCalories - 100;
      setConsumedCalories(noveCals);
      const rets = await axios.post(
        "http://localhost:5000/api/modifycalorieintake",
        {
          date: dateObj,
          goalCalories: parseInt(goalCalories),
          consumedCalories: noveCals,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("There was error adding calories:", error);
    }
  }

  async function handleConfirmClick() {
    try {
      const date = new Date().toISOString().split("T")[0];
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date provided:", date);
        alert("The provided date is invalid. Please select a valid date.");
        return;
      }
      await axios.post(
        "http://localhost:5000/api/modifycalorieintake",
        {
          date: dateObj,
          goalCalories: parseInt(goalValueInput),
        },
        { withCredentials: true }
      );
      setGoalCalories(parseInt(goalValueInput, 10));

      setIsEditing(false);
    } catch (error) {
      console.error("There was error modifiyng goal weight", error);
    }
  }
  return (
    <div
      className="bg-foreground p-5 rounded-lg ml-5 flex flex-col items-center justify-center max-w-56 w-56 mt-16"
      style={{ height: "200px" }}
    >
      <div className=" flex flex-row">
        <div
          onClick={() => changeCalories(-100)}
          className="flex justify-center items-center rounded-full h-[30px] w-[30px] p-2 mt-8 border mr-2 cursor-pointer    "
        >
          <p className="text-[28px] text-text font-semibold mb-[5px]">-</p>
        </div>
        <div className="relative flex justify-center items-center">
          <CircularProgress
            variant="determinate"
            value={progress}
            size={100}
            sx={{
              color: "#46B635",
            }}
          />

          <div className="absolute">
            <p className="text-center text-base text-text font-semibold">{`${Math.round(
              consumedCalories
            )}/${Math.round(goalCalories)}`}</p>
          </div>
        </div>
        <div
          className="flex justify-center items-center rounded-full h-[30px] w-[30px] p-2 mt-8 border ml-2 cursor-pointe"
          onClick={() => changeCalories(100)}
        >
          <p className="text-[28px] text-text font-semibold mb-[5px]">+</p>
        </div>
      </div>
      {isEditing ? (
        <div className="mt-2 flex items-center text-text font-semibold  ml-4">
          <p className="mr-1">Goal:</p>
          <input
            type="number"
            value={goalValueInput}
            onChange={(e) => handleGoalInputChange(e)}
            className="text-base text-text bg-transparent w-full font-semibold mr-2 p-1"
          />
          <p>kcal</p>
          <button
            className=" disabled:opacity-30"
            onClick={handleConfirmClick}
            disabled={goalValueInput < 0 || goalValueInput > 20000}
          >
            <span className="material-symbols-outlined text-[20px]">check</span>
          </button>
        </div>
      ) : (
        <p className="mt-2 text-base text-text font-semibold ml-4">
          Goal: {goalCalories} kcal
          <span
            onClick={handleEditClick}
            className="material-symbols-outlined ml-1 text-[20px] cursor-pointer"
          >
            edit
          </span>
        </p>
      )}
      <p className="text-base text-text font-semibold">
        Consumed: {consumedCalories} kcal
      </p>
    </div>
  );
}

export default CalorieProgress;
