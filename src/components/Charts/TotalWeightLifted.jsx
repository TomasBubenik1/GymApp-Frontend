import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Text,
} from "recharts";
import { LineChart, Line, ResponsiveContainer } from "recharts";

import { useState } from "react";
import { format } from "date-fns";
import axios from "axios";

function SingleExerciseChart() {
  const [exerciseData, setExerciseData] = useState([]);
  const [latestEditedExerciseId, setLatestEditedExerciseId] = useState(null);
  const [latestEditedExerciseName, setLatestEditedExerciseName] = useState(
    "no latest edited exercise"
  );
  const [latestEditedExercise, setLatestEditedExercisee] = useState([]);
  async function getLatestExercise() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getlatesteditedexercise",
        {
          withCredentials: true,
        }
      );
      console.log("Laetst Exercise:", response);

      setLatestEditedExerciseId(response.data.latestExerciseId.exerciseId);
      setLatestEditedExerciseName(response.data.latestExerciseId.exercise.name);
    } catch (error) {
      console.error("There was error getting latest edited exercise", error);
    }
  }

  async function GetExerciseData(exerciseId) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/getsingleexercisedata",
        {
          exerciseId: exerciseId,
        },
        { withCredentials: true }
      );
      setExerciseData(response.data);
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  }

  useEffect(() => {
    getLatestExercise();
  }, []);
  useEffect(() => {
    if (latestEditedExerciseId != null) {
      GetExerciseData(latestEditedExerciseId);
    }
  }, [latestEditedExerciseId]);

  const latestEntry = {
    name: "Latest",
    Weight: exerciseData.currentExerciseData?.weight,
    Reps: exerciseData.currentExerciseData?.reps,
    Sets: exerciseData.currentExerciseData?.sets,
  };
  const historyEntries = exerciseData.historyExerciseData
    ? exerciseData.historyExerciseData.map((data, i) => ({
        name: format(new Date(data.createdAt), "dd/MM"),
        Weight: data.weight,
        Reps: data.reps,
        Sets: data.sets,
      }))
    : [];

  const chartData = [...historyEntries, latestEntry];

  console.log(exerciseData);
  return (
    <div className=" inline-block rounded-xl p-7 shadow-md bg-foreground mt-5">
      <p className="text-text font-semibold mb-3 text-lg">Recent Exercise</p>
      <p className="text-text text-3xl font-semibold">
        {latestEditedExerciseName}
      </p>
      <BarChart width={400} height={200} data={chartData}>
        <XAxis dataKey="name" />
        <Tooltip
          formatter={(value, name, entry) => {
            if (name === "weight") {
              return [`${value}kg`, "Weight"];
            } else if (name === "reps") {
              return [value, "Reps"];
            } else if (name === "sets") {
              return [value, "Sets"];
            }
            return value;
          }}
        />
        <Legend />
        <Bar dataKey="Weight" fill="#46B635" />
        <Bar dataKey="Reps" fill="#28671E" />
        <Bar dataKey="Sets" fill="#071815" />
      </BarChart>
    </div>
  );
}

export default SingleExerciseChart;
