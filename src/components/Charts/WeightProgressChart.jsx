import { useEffect, useState } from "react";
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
import { format } from "date-fns";

export default function WeightProgressChart({
  GoalWeightHistory,
  WeightHistory,
  currentWeight,
  currentGoalWeight,
}) {
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    console.log("data z componentu:", GoalWeightHistory, WeightHistory);
    convertData();
  }, [GoalWeightHistory, WeightHistory]);
  function convertData() {
    let lastKnownGoalWeight = currentGoalWeight;
    let lastKnownWeight = currentWeight;

    const combinedData = [
      ...GoalWeightHistory.goalWeightHistory.map((entry) => ({
        ...entry,
        type: "goalWeight",
      })),
      ...WeightHistory.weightHistory.map((entry) => ({
        ...entry,
        type: "weight",
      })),
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

      if (entry.type == "goalWeight") {
        existingEntry.goalWeight = entry.goalWeight;
        lastKnownGoalWeight = entry.goalWeight;
      } else if (entry.type == "weight") {
        existingEntry.weight = entry.weight;
        lastKnownWeight = entry.weight;
      }
    });

    const LatestEntry = {
      name: "Current",
      goalWeight: currentGoalWeight,
      weight: currentWeight,
    };

    tempMergedData.push(LatestEntry);

    setMergedData(tempMergedData);
  }

  return (
    <div className=" inline-block rounded-xl p-7 shadow-md bg-foreground mt-5 ml-5 mb-10">
      <p className="text-text text-2xl font-bold mb-2">Weight Progress:</p>
      <LineChart width={400} height={250} data={mergedData}>
        <XAxis dataKey="name" />
        <Tooltip
          formatter={(value, name, entry) => {
            if (name == "weight") {
              return [`${value}kg`, "Weight"];
            }
            if (name == "goalWeight") {
              return [`${value}kg`, "Goal Weight"];
            }
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="weight" stroke="#46B635" />
        <Line type="monotone" dataKey="goalWeight" stroke="#22521a" />
      </LineChart>
    </div>
  );
}
