import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

function CalorieProgress({ initialConsumedCalories, initialGoalCalories }) {
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [goalCalories, setGoalCalories] = useState(initialGoalCalories || 0);
  const [consumedCalories, setConsumedCalories] = useState(initialConsumedCalories || 0);
  const [goalValueInput, setGoalValueInput] = useState(0);

  useEffect(() => {
    setGoalCalories(parseInt(initialGoalCalories) || 0);
    setConsumedCalories(initialConsumedCalories || 0);
  }, [initialGoalCalories, initialConsumedCalories]);

  useEffect(() => {
    setProgress(goalCalories > 0 ? (consumedCalories / goalCalories) * 100 : 0);
  }, [consumedCalories, goalCalories]);

  async function changeCalories(delta) {
    const noveCals = consumedCalories + delta;
    setConsumedCalories(noveCals);
    try {
      await axios.post(
        "http://localhost:5000/api/modifycalorieintake",
        { date: new Date(new Date().toISOString().split("T")[0]), goalCalories: parseInt(goalCalories), consumedCalories: noveCals },
        { withCredentials: true }
      );
    } catch (e) { console.error(e); }
  }

  async function handleConfirmClick() {
    try {
      await axios.post(
        "http://localhost:5000/api/modifycalorieintake",
        { date: new Date(new Date().toISOString().split("T")[0]), goalCalories: parseInt(goalValueInput) },
        { withCredentials: true }
      );
      setGoalCalories(parseInt(goalValueInput, 10));
      setIsEditing(false);
    } catch (e) { console.error(e); }
  }

  const atGoal = consumedCalories >= goalCalories && goalCalories > 0;

  return (
    <div className="flex flex-col items-center gap-4 py-2">

      {/* Ring + +/- controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => changeCalories(-100)}
          className="w-7 h-7 rounded-full border border-white/[0.12] flex items-center justify-center text-white/40 hover:text-text hover:border-white/30 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">remove</span>
        </button>

        <div className="relative flex items-center justify-center">
          {/* Background track */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={88}
            thickness={3}
            sx={{ color: "rgba(255,255,255,0.05)", position: "absolute", top: 0, left: 0 }}
          />
          {/* Filled progress */}
          <CircularProgress
            variant="determinate"
            value={Math.min(100, progress)}
            size={88}
            thickness={3}
            sx={{ color: atGoal ? "#22ff00" : "#46B635" }}
          />
          <div className="absolute flex flex-col items-center">
            <span className="font-bebas text-xl text-text leading-none">{Math.round(consumedCalories)}</span>
            <span className="text-[9px] text-white/30 tracking-[1px] uppercase">kcal</span>
          </div>
        </div>

        <button
          onClick={() => changeCalories(100)}
          disabled={consumedCalories + 100 > goalCalories}
          className="w-7 h-7 rounded-full border border-white/[0.12] flex items-center justify-center text-white/40 hover:text-text hover:border-white/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
        </button>
      </div>

      {/* Goal row */}
      {isEditing ? (
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/35 uppercase tracking-[1px]">Goal:</span>
          <input
            type="number"
            value={goalValueInput}
            onChange={(e) => setGoalValueInput(e.target.value)}
            className="w-16 bg-transparent border-b border-accent/50 text-text text-sm outline-none text-center"
            autoFocus
          />
          <span className="text-[10px] text-white/35">kcal</span>
          <button
            onClick={handleConfirmClick}
            disabled={goalValueInput < 0 || goalValueInput > 20000}
            className="text-accent hover:text-[#52cc3f] disabled:opacity-30 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setGoalValueInput(goalCalories); setIsEditing(true); }}
          className="flex items-center gap-1 text-[10px] uppercase tracking-[1.5px] text-white/25 hover:text-white/50 transition-colors"
        >
          Goal: {goalCalories} kcal
          <span className="material-symbols-outlined text-[12px]">edit</span>
        </button>
      )}
    </div>
  );
}

export default CalorieProgress;