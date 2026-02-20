import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import axios from "axios";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-white/[0.1] rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-[11px] text-white/40 uppercase tracking-[1.5px] mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-medium" style={{ color: entry.fill }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
            <span className="text-white/60">{entry.name}:</span>
            <span>{entry.value}{entry.name === "Weight" ? "kg" : ""}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function SingleExerciseChart() {
  const [exerciseData, setExerciseData] = useState([]);
  const [latestEditedExerciseId, setLatestEditedExerciseId] = useState(null);
  const [latestEditedExerciseName, setLatestEditedExerciseName] = useState(null);

  async function getLatestExercise() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getlatesteditedexercise",
        { withCredentials: true }
      );
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
        { exerciseId },
        { withCredentials: true }
      );
      setExerciseData(response.data);
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  }

  useEffect(() => { getLatestExercise(); }, []);
  useEffect(() => {
    if (latestEditedExerciseId != null) GetExerciseData(latestEditedExerciseId);
  }, [latestEditedExerciseId]);

  const latestEntry = {
    name: "Latest",
    Weight: exerciseData.currentExerciseData?.weight,
    Reps: exerciseData.currentExerciseData?.reps,
  };

  const historyEntries = exerciseData.historyExerciseData
    ? exerciseData.historyExerciseData.map((data) => ({
      name: format(new Date(data.createdAt), "dd/MM"),
      Weight: data.weight,
      Reps: data.reps,
    }))
    : [];

  const chartData = [...historyEntries, latestEntry];
  const hasData = chartData.some((d) => d.Weight || d.Reps);

  if (!latestEditedExerciseName) {
    return (
      <div className="flex flex-col items-center justify-center h-52 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
          <span className="material-symbols-outlined text-white/20 text-[24px]">fitness_center</span>
        </div>
        <p className="text-white/25 text-sm tracking-wide">No exercise data yet</p>
        <p className="text-white/15 text-xs">Log your first workout to see progress</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      {/* Exercise name */}
      <div className="flex items-center gap-3 mb-5 mt-2 px-2">
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-[2px] font-semibold">Latest Exercise</p>
          <p className="font-bebas text-[22px] text-text tracking-[1px] leading-tight mt-0.5">{latestEditedExerciseName}</p>
        </div>
        {exerciseData.currentExerciseData && (
          <div className="ml-auto flex gap-3">
            <StatPill label="Weight" value={`${exerciseData.currentExerciseData.weight}kg`} />
            <StatPill label="Reps" value={exerciseData.currentExerciseData.reps} />
            <StatPill label="Sets" value={exerciseData.currentExerciseData.sets} />
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barGap={4} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11, fontFamily: "DM Sans" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "DM Sans" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend
            wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", paddingTop: "12px" }}
            iconType="circle"
            iconSize={7}
          />
          <Bar dataKey="Weight" fill="#46B635" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="Reps" fill="#28671E" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="flex flex-col items-center px-3 py-1.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
      <span className="text-[9px] text-white/25 uppercase tracking-[1.5px]">{label}</span>
      <span className="text-sm font-semibold text-text mt-0.5">{value}</span>
    </div>
  );
}

export default SingleExerciseChart;