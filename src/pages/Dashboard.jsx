import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import SingleExerciseChart from "../components/Charts/RecentExerciseGraph";
import ProfileBox from "../components/ProfileBox";
import Footer from "../components/Footer";
import CalorieProgress from "../components/Charts/CalorieCircleProgress";
import WeightProgressChart from "../components/Charts/WeightProgressChart";

function Dashboard() {
  const [userData, setUserData] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const [editingWeight, setEditingWeight] = useState(false);
  const [editingGoalWeight, setEditingGoalWeight] = useState(false);
  const [editingHeight, setEditingHeight] = useState(false);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [goalWeight, setGoalWeight] = useState(0);
  const [weightHistory, setWeightHistory] = useState();
  const [goalWeightHistory, setGoalWeightHistory] = useState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchLoggedInData();
    const today = new Date().toISOString().split("T")[0];
    fetchDailyCalories(today);
    setTimeout(() => setMounted(true), 50);
  }, []);

  function resizeInput(e) {
    e.target.style.width = (e.target.value.length + 2) * 8 + "px";
  }

  async function handleBodyMassSubmit() {
    setEditingHeight(false);
    setEditingWeight(false);
    setEditingGoalWeight(false);
    try {
      await axios.post(
        "http://localhost:5000/api/handlebodymasschange",
        { newCurrentWeight: weight, newGoalWeight: goalWeight, newHeight: height },
        { withCredentials: true }
      );
    } catch (e) { console.error(e); }
  }

  async function fetchDailyCalories(date) {
    try {
      const data = await axios.post(
        "http://localhost:5000/api/getcalorieintake",
        { date: new Date(date) },
        { withCredentials: true }
      );
      setCalorieData(data.data);
    } catch (e) { console.error(e); }
  }

  async function fetchLoggedInData() {
    try {
      const response = await axios.get("http://localhost:5000/api/getloggedinuser", { withCredentials: true });
      const u = response.data.UserData;
      setUserData(u);
      setWeight(u.currentWeight);
      setHeight(u.height);
      setGoalWeight(u.goalWeight);
      setGoalWeightHistory({ goalWeightHistory: u.userGoalWeightHistory });
      setWeightHistory({ weightHistory: u.weightHistory });
    } catch (e) { console.error(e); }
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const weightDiff = weight && goalWeight ? (weight - goalWeight).toFixed(1) : null;
  const progressPct = weight && goalWeight
    ? Math.min(100, Math.max(0, ((weight - goalWeight) / weight) * 100))
    : 0;

  return (
    <div className="font-dm flex flex-col min-h-screen bg-backgroundcolor">
      <div className="flex flex-1 w-full">
        <Navbar currentSite="dashboard" username={userData.username} />

        <main className="flex-1 flex flex-col bg-backgroundcolor overflow-hidden">

          {/* ── Top bar ── */}
          <nav className="sticky top-0 z-30 w-full h-16 flex items-center justify-between px-8 bg-black/70 backdrop-blur-xl border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <span className="font-bebas text-[22px] tracking-[3px] text-text">DASHBOARD</span>
            </div>
            <ProfileBox nickname={userData.nickname} profilepic={userData.profilepicture} username={userData.username} />
          </nav>

          <div className="flex-1 px-8 pb-12 overflow-auto">

            {/* ── Greeting ── */}
            <div className={`mt-8 mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
              <p className="text-white/25 text-[11px] font-semibold tracking-[3px] uppercase mb-2">{today}</p>
              <div className="flex items-center gap-3">
                <h2 className="font-bebas text-[52px] text-text tracking-[2px] leading-none">
                  HEY, <span className="text-accent">{userData.username}</span>
                </h2>
                <span className="text-4xl mb-1">👋</span>
              </div>
              <p className="text-white/30 text-sm mt-2 tracking-wide">Here's your progress overview for today.</p>
            </div>

            {/* ── Metric Cards ── */}
            <div className={`grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>

              {/* Calories */}
              <div className="relative flex flex-col bg-[#0e0e0e] rounded-2xl border border-white/[0.07] overflow-hidden min-h-[220px] group hover:border-accent/30 transition-all duration-300">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2 px-5 pt-5 pb-3">
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent text-[16px]">local_fire_department</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-white/30">Calories</span>
                </div>
                <div className="relative flex-1 flex flex-col justify-center items-center px-4 pb-4">
                  <CalorieProgress
                    initialConsumedCalories={calorieData.consumedCalories}
                    initialGoalCalories={calorieData.goalCalories}
                  />
                </div>
              </div>

              {/* Height */}
              <div className="relative flex flex-col bg-[#0e0e0e] rounded-2xl border border-white/[0.07] overflow-hidden min-h-[220px] group hover:border-white/[0.14] transition-all duration-300">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="relative flex items-center gap-2 px-5 pt-5 pb-2">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/40 text-[16px]">straighten</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-white/30">Height</span>
                </div>
                <div className="relative flex-1 flex flex-col justify-center px-5">
                  <div className="flex items-end gap-2">
                    {editingHeight ? (
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => { setHeight(e.target.value); resizeInput(e); }}
                        className="font-bebas text-[56px] bg-transparent text-text outline-none w-28 border-b-2 border-accent/60 focus:border-accent leading-none pb-1"
                        autoFocus
                      />
                    ) : (
                      <span className="font-bebas text-[56px] text-text leading-none">{height}</span>
                    )}
                    <span className="text-white/25 text-sm font-medium mb-2 tracking-wide">cm</span>
                  </div>
                  <p className="text-white/20 text-xs mt-1 tracking-wide">Body height</p>
                </div>
                <div className="px-5 pb-4">
                  <EditConfirmRow
                    editing={editingHeight}
                    onEdit={() => setEditingHeight(true)}
                    onConfirm={handleBodyMassSubmit}
                    disabled={height <= 0 || height > 400}
                  />
                </div>
              </div>

              {/* Current Weight */}
              <div className="relative flex flex-col bg-[#0e0e0e] rounded-2xl border border-white/[0.07] overflow-hidden min-h-[220px] group hover:border-white/[0.14] transition-all duration-300">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="relative flex items-center gap-2 px-5 pt-5 pb-2">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white/40 text-[16px]">monitor_weight</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-white/30">Current Weight</span>
                </div>
                <div className="relative flex-1 flex flex-col justify-center px-5">
                  <div className="flex items-end gap-2">
                    {editingWeight ? (
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => { setWeight(e.target.value); resizeInput(e); }}
                        className="font-bebas text-[56px] bg-transparent text-text outline-none w-28 border-b-2 border-accent/60 focus:border-accent leading-none pb-1"
                        autoFocus
                      />
                    ) : (
                      <span className="font-bebas text-[56px] text-text leading-none">{weight}</span>
                    )}
                    <span className="text-white/25 text-sm font-medium mb-2 tracking-wide">kg</span>
                  </div>
                  <p className="text-white/20 text-xs mt-1 tracking-wide">Body mass</p>
                </div>
                <div className="px-5 pb-4">
                  <EditConfirmRow
                    editing={editingWeight}
                    onEdit={() => setEditingWeight(true)}
                    onConfirm={handleBodyMassSubmit}
                    disabled={weight <= 0 || weight > 999}
                  />
                </div>
              </div>

              {/* Goal Weight */}
              <div className="relative flex flex-col bg-[#0e0e0e] rounded-2xl border border-accent/20 overflow-hidden min-h-[220px] group hover:border-accent/40 transition-all duration-300">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] to-transparent" />
                <div className="relative flex items-center gap-2 px-5 pt-5 pb-2">
                  <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-accent text-[16px]">emoji_events</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-[2.5px] uppercase text-accent/60">Goal Weight</span>
                </div>
                <div className="relative flex-1 flex flex-col justify-center px-5">
                  <div className="flex items-end gap-2">
                    {editingGoalWeight ? (
                      <input
                        type="number"
                        value={goalWeight}
                        onChange={(e) => { setGoalWeight(e.target.value); resizeInput(e); }}
                        className="font-bebas text-[56px] bg-transparent text-text outline-none w-28 border-b-2 border-accent/60 focus:border-accent leading-none pb-1"
                        autoFocus
                      />
                    ) : (
                      <span className="font-bebas text-[56px] text-text leading-none">{goalWeight}</span>
                    )}
                    <span className="text-white/25 text-sm font-medium mb-2 tracking-wide">kg</span>
                  </div>

                  {weightDiff !== null && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-white/25 uppercase tracking-[1.5px]">Progress</span>
                        <span className="text-[10px] font-semibold text-accent/80">
                          {Math.max(0, parseFloat(weightDiff))} kg to go
                        </span>
                      </div>
                      <div className="w-full h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-[#22ff00] rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(70,182,53,0.6)]"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="px-5 pb-4">
                  <EditConfirmRow
                    editing={editingGoalWeight}
                    onEdit={() => setEditingGoalWeight(true)}
                    onConfirm={handleBodyMassSubmit}
                    disabled={goalWeight <= 0 || goalWeight > 400}
                  />
                </div>
              </div>
            </div>

            {/* ── Charts ── */}
            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-4 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>

              <ChartCard title="Recent Exercise" subtitle="Your latest session performance" icon="fitness_center">
                <SingleExerciseChart />
              </ChartCard>

              <ChartCard title="Weight Progress" subtitle="Current vs goal over time" icon="trending_down">
                {weightHistory && goalWeightHistory && (
                  <WeightProgressChart
                    WeightHistory={weightHistory}
                    GoalWeightHistory={goalWeightHistory}
                    currentWeight={weight}
                    currentGoalWeight={goalWeight}
                  />
                )}
              </ChartCard>
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;

/* ── Sub-components ── */

function EditConfirmRow({ editing, onEdit, onConfirm, disabled }) {
  return (
    <div className="flex justify-start mt-1">
      {editing ? (
        <button
          onClick={onConfirm}
          disabled={disabled}
          className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[1.5px] uppercase px-3 py-1.5 rounded-lg bg-accent/15 text-accent hover:bg-accent/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <span className="material-symbols-outlined text-[13px]">check</span>
          Save
        </button>
      ) : (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[1.5px] uppercase text-white/20 hover:text-white/50 transition-colors"
        >
          <span className="material-symbols-outlined text-[13px]">edit</span>
          Edit
        </button>
      )}
    </div>
  );
}

function ChartCard({ title, subtitle, icon, children }) {
  return (
    <div className="relative bg-[#0e0e0e] rounded-2xl border border-white/[0.07] overflow-hidden hover:border-white/[0.12] transition-all duration-300 group">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Card header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors duration-300">
            <span className="material-symbols-outlined text-accent text-[17px]">{icon}</span>
          </div>
          <div>
            <h3 className="font-bebas text-[18px] text-text tracking-[2px] leading-none">{title}</h3>
            <p className="text-[10px] text-white/25 tracking-[1.5px] uppercase mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="p-2">
        {children}
      </div>
    </div>
  );
}