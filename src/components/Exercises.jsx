import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Popup from "./PopUpAlert";

const LEVEL_CONFIG = {
  beginner: { label: "Beginner", color: "text-emerald-400", dot: "bg-emerald-400" },
  intermediate: { label: "Intermediate", color: "text-amber-400", dot: "bg-amber-400" },
  expert: { label: "Expert", color: "text-red-400", dot: "bg-red-400" },
};

function ExerciseSkeleton() {
  return (
    <div className="rounded-2xl bg-foreground border border-white/[0.06] overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-white/[0.04]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-5 bg-white/[0.06] rounded-lg w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded-lg w-1/3" />
        <div className="flex gap-2 mt-1">
          <div className="h-9 bg-white/[0.06] rounded-lg flex-1" />
          <div className="h-9 bg-white/[0.04] rounded-lg flex-1" />
        </div>
      </div>
    </div>
  );
}

export default function Exercises({ exercises, loading, workoutPlanId, userId }) {
  const [popup, setPopup] = useState({ open: false, message: "", severity: "info" });
  const [addingId, setAddingId] = useState(null);

  const handleClose = () => setPopup(p => ({ ...p, open: false }));

  async function handleAddIntoExercisePlan(exerciseID) {
    if (!workoutPlanId) {
      setPopup({ open: true, message: "Select a workout plan first to add exercises.", severity: "warning" });
      return;
    }
    setAddingId(exerciseID);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/addexerciseintoplan",
        { workoutPlanId, exerciseId: exerciseID, userId },
        { withCredentials: true }
      );
      setPopup({ open: true, message: response.data.message || "Exercise added!", severity: "success" });
    } catch (error) {
      setPopup({
        open: true,
        message: error.response?.data?.message || "Failed to add exercise.",
        severity: "error",
      });
    } finally {
      setAddingId(null);
    }
  }

  if (loading) {
    return (
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
        {Array.from({ length: 12 }).map((_, i) => <ExerciseSkeleton key={i} />)}
      </div>
    );
  }

  if (!loading && exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px] text-white/20">search_off</span>
        </div>
        <p className="text-white/30 text-sm font-medium">No exercises found for your filters.</p>
        <p className="text-white/20 text-xs">Try adjusting or clearing the active filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
        {exercises.map((exercise, index) => {
          const formattedName = exercise.name
            .replace(/[\s/()]+/g, "_")
            .replace(/[_]+$/g, "")
            .replace(/,/g, "");

          const level = LEVEL_CONFIG[exercise.level?.toLowerCase()] || LEVEL_CONFIG.beginner;
          const isAdding = addingId === exercise.id;

          return (
            <div
              key={index}
              className="group relative flex flex-col rounded-2xl bg-foreground border border-white/[0.06] overflow-hidden hover:border-white/[0.14] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={`https://ik.imagekit.io/bubenik/exercises/${formattedName}/1.jpg`}
                  alt={exercise.name}
                  onError={e => { e.target.style.display = "none"; }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent opacity-60" />

                {/* Level badge */}
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/[0.08]">
                    <div className={`w-1.5 h-1.5 rounded-full ${level.dot}`} />
                    <span className={`text-[11px] font-semibold tracking-[1px] ${level.color}`}>
                      {level.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4 gap-3">
                <div>
                  <h3 className="text-text font-semibold text-base leading-tight line-clamp-2 group-hover:text-white transition-colors duration-200">
                    {exercise.name}
                  </h3>
                  {exercise.primaryMuscles?.length > 0 && (
                    <p className="text-[12px] text-white/30 mt-1 truncate">
                      {exercise.primaryMuscles.slice(0, 2).join(" · ")}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleAddIntoExercisePlan(exercise.id)}
                    disabled={isAdding}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                      ${workoutPlanId
                        ? "bg-accent/15 text-accent border border-accent/25 hover:bg-accent/25 hover:border-accent/50 hover:shadow-[0_0_16px_rgba(70,182,53,0.15)]"
                        : "bg-white/[0.04] text-white/35 border border-white/[0.07] hover:bg-white/[0.07] hover:text-white/55"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isAdding ? (
                      <span className="material-symbols-outlined text-[16px] animate-spin" style={{ animationDuration: "0.6s" }}>
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    )}
                    {isAdding ? "Adding…" : "Add"}
                  </button>

                  <Link
                    to={`/details/${exercise.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.04] text-white/45 border border-white/[0.07] hover:bg-white/[0.08] hover:text-text hover:border-white/[0.14] transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Popup open={popup.open} handleClose={handleClose} message={popup.message} severity={popup.severity} />
    </>
  );
}