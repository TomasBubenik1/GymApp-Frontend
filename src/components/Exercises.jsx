import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function Exercises({
  exercises,
  loading,
  workoutPlanId,
  userId,
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [popup, setPopup] = useState({
    open: false,
    message: "",
    severity: "info", // Can be 'error', 'warning', 'info', 'success'
    title: null,
  });

  const handleClose = () => {
    setPopup({ ...popup, open: false });
  };

  function Popup({ open, handleClose, message, severity }) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          variant="filled"
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    );
  }

  if (loading) {
    return <h2>Loading</h2>;
  }
  async function handleAddIntoExercisePlan(exerciseID) {
    if (!workoutPlanId) {
      setPopup({
        open: true,
        message: "You must select a workout plan in order to add an exercise!",
        severity: "error",
      });
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/addexerciseintoplan",
        {
          workoutPlanId: workoutPlanId,
          exerciseId: exerciseID,
          userId: userId,
        },
        { withCredentials: true }
      );
      setPopup({
        open: true,
        message: response.data.message || "Exercise added successfully!",
        severity: "success",
        title: "Success",
      });
    } catch (error) {
      setPopup({
        open: true,
        message:
          error.response?.data?.message ||
          "An error occurred while adding the exercise.",
        severity: "error",
        title: "Error",
      });
    }
  }

  return (
    <div className="grid row-auto xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 p-3 gap-5 ">
      {exercises.map((exercise, index) => {
        const formattedName = exercise.name
          .replace(/[\s/()]+/g, "_")
          .replace(/[_]+$/g, "")
          .replace(/,/g, "");
        return (
          <div
            key={index}
            className="rounded-lg border border-accent border-opacity-20 p-2"
          >
            <div>
              <img
                className="rounded-lg rounded-b-none aspect-square"
                style={{ width: "100%", height: "auto", maxHeight: "200px" }} // Ensure image scales down and maintains aspect ratio
                src={`https://ik.imagekit.io/bubenik/exercises/${formattedName}/1.jpg`}
                alt={exercise.name}
              />
            </div>
            <h1 className="text-2xl text-text text-left font-semibold">
              {exercise.name}
            </h1>
            <p className="text-text text-lg">
              {exercise.level.charAt(0).toUpperCase() + exercise.level.slice(1)}
            </p>
            <div className="flex gap-3">
              <button className="text-center font-semibold bg-accent bg-opacity-30 text-accentGlow hover:bg-accentGlow hover:bg-opacity-40 p-2 self-center w-full rounded-md cursor-pointer">
                Add
              </button>
              <Link
                className="text-center font-semibold bg-[#18181B] p-2 self-center w-full rounded-md text-text hover:bg-foregroundhover"
                to={`/details/${exercise.id}`}
              >
                Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
