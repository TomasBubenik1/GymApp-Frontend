import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111] border border-white/[0.1] rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-[11px] text-white/40 uppercase tracking-[1.5px] mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-medium">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.stroke }} />
            <span className="text-white/60">{entry.name === "weight" ? "Weight" : "Goal"}:</span>
            <span style={{ color: entry.stroke }}>{entry.value}kg</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function WeightProgressChart({
  GoalWeightHistory,
  WeightHistory,
  currentWeight,
  currentGoalWeight,
}) {
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    convertData();
  }, [GoalWeightHistory, WeightHistory]);

  function convertData() {
    let lastKnownGoalWeight = currentGoalWeight;
    let lastKnownWeight = currentWeight;

    const combinedData = [
      ...GoalWeightHistory.goalWeightHistory.map((entry) => ({ ...entry, type: "goalWeight" })),
      ...WeightHistory.weightHistory.map((entry) => ({ ...entry, type: "weight" })),
    ];

    combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    let tempMergedData = [];

    combinedData.forEach((entry) => {
      const formattedDate = format(new Date(entry.date), "dd/MM");
      let existingEntry = tempMergedData.find((e) => e.date === entry.date);
      if (!existingEntry) {
        existingEntry = {
          date: entry.date,
          name: formattedDate,
          goalWeight: lastKnownGoalWeight,
          weight: lastKnownWeight,
        };
        tempMergedData.push(existingEntry);
      } else {
        existingEntry.name = formattedDate;
      }
      if (entry.type === "goalWeight") {
        existingEntry.goalWeight = entry.goalWeight;
        lastKnownGoalWeight = entry.goalWeight;
      } else if (entry.type === "weight") {
        existingEntry.weight = entry.weight;
        lastKnownWeight = entry.weight;
      }
    });

    tempMergedData.push({ name: "Current", goalWeight: currentGoalWeight, weight: currentWeight });
    setMergedData(tempMergedData);
  }

  const hasData = mergedData.length > 1;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-52 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center">
          <span className="material-symbols-outlined text-white/20 text-[24px]">trending_down</span>
        </div>
        <p className="text-white/25 text-sm tracking-wide">No weight history yet</p>
        <p className="text-white/15 text-xs">Update your weight to track progress</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      {/* Summary pills */}
      <div className="flex items-center gap-3 mb-5 mt-2 px-2">
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-[2px] font-semibold">Progress Tracking</p>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-[2px] bg-accent rounded-full inline-block" />
              <span className="text-[11px] text-white/40">Weight</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-[2px] bg-[#28671E] rounded-full inline-block" style={{ borderStyle: "dashed" }} />
              <span className="text-[11px] text-white/40">Goal</span>
            </div>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <StatPill label="Current" value={`${currentWeight}kg`} color="accent" />
          <StatPill label="Goal" value={`${currentGoalWeight}kg`} />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={mergedData}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#46B635" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#46B635" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            width={36}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#46B635"
            strokeWidth={2}
            dot={{ fill: "#46B635", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#46B635", strokeWidth: 2, stroke: "#000" }}
          />
          <Line
            type="monotone"
            dataKey="goalWeight"
            stroke="#28671E"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={{ fill: "#28671E", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: "#28671E", strokeWidth: 2, stroke: "#000" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center px-3 py-1.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
      <span className="text-[9px] text-white/25 uppercase tracking-[1.5px]">{label}</span>
      <span className={`text-sm font-semibold mt-0.5 ${color === "accent" ? "text-accent" : "text-text"}`}>{value}</span>
    </div>
  );
}