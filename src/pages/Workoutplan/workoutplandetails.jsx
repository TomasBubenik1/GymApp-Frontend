import React from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import "../../styles/UtilStyles.css";
import ProfileBox from "../../components/ProfileBox";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

/* ── Stat Card ── */
function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`relative flex flex-col bg-[#0e0e0e] rounded-2xl border overflow-hidden p-5 transition-all duration-300 ${accent ? "border-accent/25 hover:border-accent/45" : "border-white/[0.07] hover:border-white/[0.14]"}`}>
      {accent && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-3 ${accent ? "bg-accent/15" : "bg-white/[0.05]"}`}>
        <span className={`material-symbols-outlined text-[16px] ${accent ? "text-accent" : "text-white/35"}`}>{icon}</span>
      </div>
      <p className="text-[10px] font-semibold tracking-[2.5px] uppercase text-white/30 mb-1">{label}</p>
      <p className="font-bebas text-[28px] text-text tracking-wide leading-none">{value}</p>
    </div>
  );
}

/* ── Muscle Distribution Bar ── */
function MuscleBar({ percentages }) {
  const segments = [
    { key: "upperBody", label: "Upper Body", color: "#899733" },
    { key: "lowerBody", label: "Lower Body", color: "#976333" },
    { key: "core", label: "Core", color: "#42B6CF" },
  ].filter(s => percentages[s.key] > 0);

  if (segments.length === 0) return null;

  return (
    <div className="bg-[#0e0e0e] border border-white/[0.07] rounded-2xl p-5 mb-6">
      <p className="text-[10px] font-semibold tracking-[2.5px] uppercase text-white/30 mb-4">Muscle Distribution</p>
      <div className="flex rounded-full overflow-hidden h-2 gap-0.5 mb-4">
        {segments.map(s => (
          <div
            key={s.key}
            style={{ width: `${percentages[s.key]}%`, backgroundColor: s.color }}
            className="rounded-full transition-all duration-700"
          />
        ))}
      </div>
      <div className="flex gap-5">
        {segments.map(s => (
          <div key={s.key} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[11px] text-white/40">{s.label}</span>
            <span className="text-[11px] font-semibold text-white/60">{percentages[s.key]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Exercise Row ── */
function ExerciseRow({ exercise, onWeightChange, onRepsChange, onSetsChange, onNewWeight, onNewReps, onNewSets, onRemove, getMuscleGroupColor }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hasData = exercise.userExerciseData?.length > 0;
  const dotColor = getMuscleGroupColor(exercise.primaryMuscles);

  return (
    <div className="group relative flex items-center gap-4 bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] rounded-xl px-4 py-3.5 transition-all duration-200">
      {/* Checkbox */}
      <Checkbox
        color="success"
        sx={{ color: "rgba(255,255,255,0.12)", padding: "4px", "&.Mui-checked": { color: "#46B635" } }}
      />

      {/* Muscle dot */}
      <div
        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_6px_var(--dot-color)]"
        style={{ backgroundColor: dotColor, "--dot-color": dotColor + "80" }}
      />

      {/* Exercise name */}
      <p className="text-text text-sm font-medium flex-1 min-w-0 truncate">{exercise.name}</p>

      {/* Inputs */}
      <div className="flex items-center gap-2 shrink-0">
        {hasData ? (
          <>
            <NumberInput
              value={exercise.userExerciseData[0].weight}
              onChange={e => onWeightChange(exercise.id, e)}
              suffix="kg"
            />
            <NumberInput
              value={exercise.userExerciseData[0].reps}
              onChange={e => onRepsChange(exercise.id, e)}
              suffix="reps"
            />
            <NumberInput
              value={exercise.userExerciseData[0].sets}
              onChange={e => onSetsChange(exercise.id, e)}
              suffix="sets"
            />
          </>
        ) : (
          <>
            <NumberInput onChange={e => onNewWeight(exercise.id, e)} placeholder="0" suffix="kg" />
            <NumberInput onChange={e => onNewReps(exercise.id, e)} placeholder="0" suffix="reps" />
            <NumberInput onChange={e => onNewSets(exercise.id, e)} placeholder="0" suffix="sets" />
          </>
        )}
      </div>

      {/* Options */}
      <div className="relative shrink-0">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-white/55 hover:bg-white/[0.05] transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 top-[calc(100%+4px)] z-20 w-36 bg-[#111] border border-white/[0.09] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden">
              <Link
                to={`/details/${exercise.id}`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/55 hover:bg-white/[0.04] hover:text-text transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">info</span>
                Details
              </Link>
              <div className="h-px bg-white/[0.06] mx-3" />
              <button
                onClick={() => { onRemove(exercise.id); setDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/[0.08] hover:text-red-300 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Number Input ── */
function NumberInput({ value, onChange, placeholder, suffix }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder || ""}
        className="w-14 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1.5 text-text text-sm text-right outline-none focus:border-accent/50 focus:shadow-[0_0_0_2px_rgba(70,182,53,0.07)] transition-all"
      />
      <span className="text-[11px] text-white/30 font-medium">{suffix}</span>
    </div>
  );
}

/* ── Privacy Button ── */
function PrivacySelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const options = [
    { value: "Public", icon: "public" },
    { value: "Friends", icon: "group" },
    { value: "Private", icon: "lock" },
  ];
  const current = options.find(o => o.value === value) || options[0];

  function handleOpen() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setDropdownPos({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen(prev => !prev);
  }

  return (
    <div className="">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/55 text-sm font-medium hover:border-white/20 hover:text-text transition-all"
      >
        <span className="material-symbols-outlined text-[15px]">{current.icon}</span>
        {current.value}
        <span className={`material-symbols-outlined text-[14px] transition-transform ${open ? "rotate-180" : ""}`}>expand_more</span>
      </button>

      {open && (
        <>
          <div className="relative" onClick={() => setOpen(false)} />
          <div
            className=" z-50 absolute w-36 bg-[#111] border border-white/[0.09] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden py-1"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${opt.value === value ? "text-accent font-semibold bg-accent/[0.08]" : "text-white/55 hover:text-text hover:bg-white/[0.04]"}`}
              >
                <span className="material-symbols-outlined text-[16px]">{opt.icon}</span>
                {opt.value}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Main Component ── */
export default function WorkoutPlanDetails() {
  const [userData, setUserData] = useState({});
  const [changesPayload, updateChangesPayload] = useState([]);
  const [newDatasPayload, updateNewDataPayload] = useState([]);
  const [singleWorkoutPlan, setSingleWorkoutPlanData] = useState({});
  const [estimatedLength, setEstimatedLength] = useState(0);
  const [canViewThePlan, setCanViewThePlan] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [muscleGroupPercentages, setMuscleGroupPercentages] = useState({ lowerBody: 0, upperBody: 0, core: 0 });

  let { workoutPlanId } = useParams();
  const navigate = useNavigate();

  const lowerBodyMuscles = ["quadriceps", "hamstrings", "calves", "glutes", "abductors", "adductors"];
  const upperBodyMuscles = ["biceps", "triceps", "chest", "lats", "shoulders", "traps", "forearms", "middle back"];
  const coreMuscles = ["abdominals", "lower back", "neck"];

  const muscleGroupColors = { lowerBody: "#976333", upperBody: "#899733", core: "#42B6CF" };

  const getMuscleGroupColor = (primaryMuscles) => {
    if (primaryMuscles.some(m => lowerBodyMuscles.includes(m))) return muscleGroupColors.lowerBody;
    if (primaryMuscles.some(m => upperBodyMuscles.includes(m))) return muscleGroupColors.upperBody;
    if (primaryMuscles.some(m => coreMuscles.includes(m))) return muscleGroupColors.core;
    return "#46B635";
  };

  function calculateTotalWeight() {
    let total = 0;
    singleWorkoutPlan.exercises?.forEach(ex => {
      if (ex.userExerciseData?.length > 0) {
        const { sets = 1, weight = 0, reps = 1 } = ex.userExerciseData[0];
        total += (parseInt(sets) || 1) * (parseFloat(weight) || 0) * (parseInt(reps) || 1);
      }
    });
    return total;
  }

  function calculateMuscleGroupPercentages() {
    const total = singleWorkoutPlan.exercises.length;
    if (!total) return;
    let lower = 0, upper = 0, core = 0;
    singleWorkoutPlan.exercises.forEach(ex => {
      if (ex.primaryMuscles.some(m => lowerBodyMuscles.includes(m))) lower++;
      else if (ex.primaryMuscles.some(m => upperBodyMuscles.includes(m))) upper++;
      else if (ex.primaryMuscles.some(m => coreMuscles.includes(m))) core++;
    });
    setMuscleGroupPercentages({
      lowerBody: Math.round((lower / total) * 100),
      upperBody: Math.round((upper / total) * 100),
      core: Math.round((core / total) * 100),
    });
  }

  function CalculateAverageLevel() {
    if (!singleWorkoutPlan.exercises) return "—";
    const map = { beginner: 0, intermediate: 0, expert: 0 };
    singleWorkoutPlan.exercises.forEach(ex => { map[ex.level?.toLowerCase()]++; });
    return Object.entries(map).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  function CalculateDuration() {
    let t = 0;
    singleWorkoutPlan.exercises?.forEach(ex => {
      if (ex.userExerciseData?.length > 0 && !isNaN(ex.userExerciseData[0].sets)) {
        t += (parseInt(ex.userExerciseData[0].sets) || 0) * 5;
      }
    });
    setEstimatedLength(t);
  }

  const handleWeightChange = (exerciseId, e) => {
    const val = parseFloat(e.target.value);
    updateChangesPayload(p => ({ ...p, [exerciseId]: { ...p[exerciseId], weight: val, exerciseId } }));
    setSingleWorkoutPlanData(prev => ({ ...prev, exercises: prev.exercises.map(ex => ex.id === exerciseId ? { ...ex, userExerciseData: [{ ...ex.userExerciseData[0], weight: val }] } : ex) }));
  };
  const handleRepsChange = (exerciseId, e) => {
    const val = parseInt(e.target.value);
    updateChangesPayload(p => ({ ...p, [exerciseId]: { ...p[exerciseId], reps: val, exerciseId } }));
    setSingleWorkoutPlanData(prev => ({ ...prev, exercises: prev.exercises.map(ex => ex.id === exerciseId ? { ...ex, userExerciseData: [{ ...ex.userExerciseData[0], reps: val }] } : ex) }));
  };
  const handleSetsChange = (exerciseId, e) => {
    const val = parseInt(e.target.value);
    updateChangesPayload(p => ({ ...p, [exerciseId]: { ...p[exerciseId], sets: val, exerciseId } }));
    setSingleWorkoutPlanData(prev => ({ ...prev, exercises: prev.exercises.map(ex => ex.id === exerciseId ? { ...ex, userExerciseData: [{ ...ex.userExerciseData[0], sets: val }] } : ex) }));
  };
  const handleNewWeight = (exerciseId, e) => updateNewDataPayload(p => ({ ...p, [exerciseId]: { ...p[exerciseId], weight: parseFloat(e.target.value), exerciseId } }));
  const handleNewReps = (exerciseId, e) => updateNewDataPayload(p => ({ ...p, [exerciseId]: { ...p[exerciseId], reps: parseInt(e.target.value), exerciseId } }));
  const handleNewSets = (exerciseId, e) => updateNewDataPayload(p => ({ ...p, [exerciseId]: { ...p[exerciseId], sets: parseInt(e.target.value), exerciseId } }));

  async function handleApplyChanges() {
    const changes = Object.values(changesPayload);
    const newData = Object.values(newDatasPayload);
    for (const c of changes) {
      await axios.post("http://localhost:5000/api/updateexercisedata", { exerciseId: c.exerciseId, newWeight: c.weight, newReps: c.reps, newSets: c.sets }, { withCredentials: true });
    }
    for (const d of newData) {
      if (d.weight !== undefined && d.reps !== undefined && d.sets !== undefined) {
        await axios.post("http://localhost:5000/api/addexercisedata", { exerciseId: d.exerciseId, weight: d.weight, reps: d.reps, sets: d.sets }, { withCredentials: true });
      }
    }
    updateChangesPayload({});
    updateNewDataPayload({});
  }

  async function handleVisibilityChange(newVis) {
    setSingleWorkoutPlanData(prev => ({ ...prev, visibility: newVis }));
    await axios.post("http://localhost:5000/api/changeworkoutplanvisibility", { workoutPlanId: singleWorkoutPlan.id, newVisibility: newVis }, { withCredentials: true });
  }

  async function removeExerciseFromPlan(exerciseId) {
    try {
      await axios.post("http://localhost:5000/api/removeexercisefromplan", { exerciseId, workoutPlanId: singleWorkoutPlan.id }, { withCredentials: true });
      setSingleWorkoutPlanData(prev => ({ ...prev, exercises: prev.exercises.filter(ex => ex.id !== exerciseId) }));
    } catch (e) { console.error(e); }
  }

  async function fetchSingleWorkoutPlan() {
    try {
      const response = await axios.post("http://localhost:5000/api/getoneworkoutplan", { workoutPlanId: parseInt(workoutPlanId) }, { withCredentials: true });
      setSingleWorkoutPlanData(response.data);
    } catch (error) {
      if (error.response?.status === 403) setCanViewThePlan(false);
    }
  }

  async function fetchLoggedInData() {
    try {
      const response = await axios.get("http://localhost:5000/api/getloggedinuser", { withCredentials: true });
      setUserData(response.data.UserData);
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    fetchLoggedInData();
    fetchSingleWorkoutPlan();
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    if (singleWorkoutPlan.exercises?.length > 0) {
      calculateMuscleGroupPercentages();
      CalculateDuration();
    }
  }, [singleWorkoutPlan]);

  const hasChanges = Object.keys(changesPayload).length > 0 || Object.keys(newDatasPayload).length > 0;

  return (
    <div className="font-dm flex flex-col min-h-screen bg-backgroundcolor">
      <div className="flex flex-1 w-full">
        <Navbar currentSite="workoutplans" username={userData?.username} />

        <main className="flex-1 flex flex-col bg-backgroundcolor">

          {/* ── Top bar ── */}
          <nav className="sticky top-0 z-30 w-full h-16 flex items-center justify-between px-8 bg-black/70 backdrop-blur-xl border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/workoutplanselection")}
                className="flex items-center gap-1.5 text-white/30 hover:text-white/65 text-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
              <span className="text-white/15">/</span>
              <span className="font-bebas text-[18px] tracking-[2px] text-text/70 truncate max-w-xs">
                {canViewThePlan ? singleWorkoutPlan.title || "Loading…" : "Access Denied"}
              </span>
            </div>
            <ProfileBox nickname={userData.nickname} profilepic={userData.profilepicture} username={userData.username} />
          </nav>

          {!canViewThePlan ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-red-400">lock</span>
              </div>
              <h2 className="font-bebas text-[36px] text-text tracking-[2px]">ACCESS DENIED</h2>
              <p className="text-white/35 text-sm max-w-xs">You don't have permission to view this workout plan.</p>
              <button onClick={() => navigate("/workoutplanselection")} className="mt-2 px-6 py-3 bg-white/[0.06] border border-white/[0.1] text-white/55 rounded-xl text-sm font-semibold hover:bg-white/[0.1] hover:text-text transition-all">
                Back to Plans
              </button>
            </div>
          ) : (
            <div className="flex-1 px-8 pb-12 overflow-auto">

              {/* ── Heading ── */}
              <div className={`mt-8 mb-6 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                <p className="text-white/25 text-[11px] font-semibold tracking-[3px] uppercase mb-2">Workout Plan</p>
                <div className="flex items-end justify-between gap-4">
                  <h2 className="font-bebas text-[52px] text-text tracking-[2px] leading-none">
                    {singleWorkoutPlan.title || "—"}
                  </h2>
                  {singleWorkoutPlan.visibility && (
                    <PrivacySelector value={singleWorkoutPlan.visibility} onChange={handleVisibilityChange} />
                  )}
                </div>
              </div>

              {/* ── Stats ── */}
              <div className={`grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                <StatCard label="Est. Duration" value={`${estimatedLength}–${estimatedLength + 15} min`} icon="timer" />
                <StatCard label="Weight Moved" value={`${calculateTotalWeight()} kg`} icon="monitor_weight" />
                <StatCard label="Exercises" value={singleWorkoutPlan.exercises?.length || 0} icon="fitness_center" />
                <StatCard label="Difficulty" value={CalculateAverageLevel()} icon="signal_cellular_alt" accent />
              </div>

              {/* ── Muscle distribution ── */}
              <div className={`transition-all duration-700 delay-150 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                <MuscleBar percentages={muscleGroupPercentages} />
              </div>

              {/* ── Exercise List ── */}
              <div className={`relative bg-[#0e0e0e] rounded-2xl border border-white/[0.07] overflow-hidden transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
                {/* Top accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-accent text-[15px]">list_alt</span>
                    </div>
                    <span className="font-bebas text-[16px] tracking-[2px] text-text/80">
                      EXERCISES
                    </span>
                    <span className="text-[11px] text-white/25 font-semibold">
                      {singleWorkoutPlan.exercises?.length || 0}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate("/exercises", { state: { workoutplantitle: singleWorkoutPlan.title, workoutplanid: singleWorkoutPlan.id } })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 hover:border-accent/40 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Add Exercise
                  </button>
                </div>

                {/* Exercises */}
                <div className="p-4 flex flex-col gap-2">
                  {singleWorkoutPlan.exercises?.length > 0 ? (
                    singleWorkoutPlan.exercises.map(exercise => (
                      <ExerciseRow
                        key={exercise.id}
                        exercise={exercise}
                        onWeightChange={handleWeightChange}
                        onRepsChange={handleRepsChange}
                        onSetsChange={handleSetsChange}
                        onNewWeight={handleNewWeight}
                        onNewReps={handleNewReps}
                        onNewSets={handleNewSets}
                        onRemove={removeExerciseFromPlan}
                        getMuscleGroupColor={getMuscleGroupColor}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[24px] text-white/15">fitness_center</span>
                      </div>
                      <p className="text-white/25 text-sm">No exercises yet</p>
                      <button
                        onClick={() => navigate("/exercises", { state: { workoutplantitle: singleWorkoutPlan.title, workoutplanid: singleWorkoutPlan.id } })}
                        className="flex items-center gap-1.5 text-accent/70 hover:text-accent text-sm font-medium transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Add your first exercise
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* ── Apply Changes floating button ── */}
      {hasChanges && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={handleApplyChanges}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-accent text-black font-bold text-sm tracking-[1px] uppercase rounded-2xl shadow-[0_8px_32px_rgba(70,182,53,0.4)] hover:bg-[#52cc3f] hover:shadow-[0_8px_40px_rgba(70,182,53,0.55)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            Apply Changes
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
