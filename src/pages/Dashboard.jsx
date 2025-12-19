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

  return (
    <div className="font-dm flex flex-col min-h-screen bg-backgroundcolor">
      <div className="flex flex-1 w-full">
        <Navbar currentSite="dashboard" username={userData.username} />

        <main className="flex-1 flex flex-col bg-backgroundcolor">

          {/* Top bar */}
          <nav className="sticky top-0 z-30 w-full h-16 flex items-center justify-between px-6 bg-backgroundcolor/80 backdrop-blur-md border-b border-white/[0.06]">
            <h1 className="font-bebas text-2xl text-text tracking-[3px]">DASHBOARD</h1>
            <ProfileBox nickname={userData.nickname} profilepic={userData.profilepicture} username={userData.username} />
          </nav>

          <div className="flex-1 px-6 pb-10">

            {/* Greeting */}
            <div className={`mt-8 mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
              <p className="text-white/35 text-sm font-medium tracking-[2px] uppercase mb-1">{today}</p>
              <div className="flex items-baseline gap-3">
                <h2 className="font-bebas text-5xl text-text tracking-[2px] leading-none">
                  HEY, <span className="text-accent">{userData.username}</span>
                </h2>
                <span className="text-3xl">👋</span>
              </div>
              <p className="text-white/35 text-sm mt-2">Here's your progress overview for today.</p>
            </div>

            {/* Metric Cards */}
            <div className={`grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>

              <MetricCard label="Calories" icon="local_fire_department">
                <div className="flex-1 flex flex-col justify-center items-center">
                  <CalorieProgress
                    initialConsumedCalories={calorieData.consumedCalories}
                    initialGoalCalories={calorieData.goalCalories}
                  />
                </div>
              </MetricCard>

              <MetricCard label="Height" icon="straighten">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-end gap-1 mt-2">
                    {editingHeight ? (
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => { setHeight(e.target.value); resizeInput(e); }}
                        className="font-bebas text-4xl bg-transparent text-text outline-none w-20 border-b border-accent/50 focus:border-accent"
                        autoFocus
                      />
                    ) : (
                      <span className="font-bebas text-5xl text-text leading-none">{height}</span>
                    )}
                    <span className="text-white/35 text-sm font-medium mb-1">cm</span>
                  </div>
                </div>
                <EditConfirmRow
                  editing={editingHeight}
                  onEdit={() => setEditingHeight(true)}
                  onConfirm={handleBodyMassSubmit}
                  disabled={height <= 0 || height > 400}
                />
              </MetricCard>

              <MetricCard label="Current Weight" icon="monitor_weight">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-end gap-1 mt-2">
                    {editingWeight ? (
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => { setWeight(e.target.value); resizeInput(e); }}
                        className="font-bebas text-4xl bg-transparent text-text outline-none w-20 border-b border-accent/50 focus:border-accent"
                        autoFocus
                      />
                    ) : (
                      <span className="font-bebas text-5xl text-text leading-none">{weight}</span>
                    )}
                    <span className="text-white/35 text-sm font-medium mb-1">kg</span>
                  </div>
                </div>
                <EditConfirmRow
                  editing={editingWeight}
                  onEdit={() => setEditingWeight(true)}
                  onConfirm={handleBodyMassSubmit}
                  disabled={weight <= 0 || weight > 999}
                />
              </MetricCard>

              <MetricCard label="Goal Weight" icon="emoji_events">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-end gap-1 mt-2">
                    {editingGoalWeight ? (
                      <input
                        type="number"
                        value={goalWeight}
                        onChange={(e) => { setGoalWeight(e.target.value); resizeInput(e); }}
                        className="font-bebas text-4xl bg-transparent text-text outline-none w-20 border-b border-accent/50 focus:border-accent"
                        autoFocus
                      />
                    ) : (
                      <span className="font-bebas text-5xl text-text leading-none">{goalWeight}</span>
                    )}
                    <span className="text-white/35 text-sm font-medium mb-1">kg</span>
                  </div>

                  {weight > 0 && goalWeight > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-white/25 uppercase tracking-[1.5px]">Progress</span>
                        <span className="text-[10px] text-accent/70">
                          {Math.max(0, weight - goalWeight).toFixed(1)} kg to go
                        </span>
                      </div>
                      <div className="w-full h-px bg-white/[0.08] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-700 shadow-[0_0_6px_rgba(70,182,53,0.5)]"
                          style={{ width: `${Math.min(100, Math.max(0, ((weight - goalWeight) / weight) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <EditConfirmRow
                  editing={editingGoalWeight}
                  onEdit={() => setEditingGoalWeight(true)}
                  onConfirm={handleBodyMassSubmit}
                  disabled={goalWeight <= 0 || goalWeight > 400}
                />
              </MetricCard>
            </div>

            {/* Charts */}
            <div className={`grid grid-cols-1 xl:grid-cols-2 gap-4 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
              <ChartCard title="Recent Exercise" subtitle="Your latest session performance">
                <SingleExerciseChart />
              </ChartCard>

              <ChartCard title="Weight Progress" subtitle="Current vs goal over time">
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

function MetricCard({ label, icon, children }) {
  return (
    <div className="relative flex flex-col bg-foreground rounded-xl p-5 border border-white/[0.06] overflow-hidden min-h-[200px] hover:border-white/[0.12] transition-colors duration-300 group">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-accent/70 group-hover:text-accent transition-colors duration-200">
          {icon}
        </span>
        <span className="text-[11px] font-semibold tracking-[2px] uppercase text-white/35">{label}</span>
      </div>
      {children}
    </div>
  );
}

function EditConfirmRow({ editing, onEdit, onConfirm, disabled }) {
  return (
    <div className="flex justify-end mt-3">
      {editing ? (
        <button
          onClick={onConfirm}
          disabled={disabled}
          className="flex items-center gap-1 text-[11px] font-semibold tracking-[1.5px] uppercase text-accent hover:text-[#52cc3f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">check</span>
          Save
        </button>
      ) : (
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-[11px] font-semibold tracking-[1.5px] uppercase text-white/25 hover:text-white/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">edit</span>
          Edit
        </button>
      )}
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="relative bg-foreground rounded-xl border border-white/[0.06] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="px-6 pt-5 pb-3 border-b border-white/[0.05]">
        <h3 className="font-bebas text-xl text-text tracking-[2px]">{title}</h3>
        <p className="text-[11px] text-white/30 tracking-[1px] uppercase mt-0.5">{subtitle}</p>
      </div>
      <div className="p-4 flex justify-center">
        {children}
      </div>
    </div>
  );
}