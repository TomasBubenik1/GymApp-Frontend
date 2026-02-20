import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Exercises from "../../components/Exercises";
import ProfileBox from "../../components/ProfileBox";
import { useLocation } from "react-router-dom";
import Footer from "../../components/Footer";

/* ── Compact inline dropdown ── */
function FilterPill({ label, icon, selectedOption, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const active = selectedOption !== null && selectedOption !== undefined && selectedOption !== "";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200
          ${active
            ? "bg-accent/15 border-accent/50 text-accent shadow-[0_0_12px_rgba(70,182,53,0.12)]"
            : "bg-white/[0.03] border-white/[0.1] text-white/50 hover:border-white/20 hover:text-white/75"
          }`}
      >
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
        <span>{active ? selectedOption : label}</span>
        <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+8px)] left-0 z-20 min-w-[160px] bg-[#111] border border-white/[0.1] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden">
            {active && (
              <button
                onClick={() => { onSelect(null); setOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[12px] font-semibold tracking-[1.5px] uppercase text-accent/70 hover:bg-white/[0.04] border-b border-white/[0.06] transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
                Clear
              </button>
            )}
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => { onSelect(option === selectedOption ? null : option); setOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150
                    ${option === selectedOption
                      ? "text-accent font-semibold bg-accent/[0.08]"
                      : "text-white/60 hover:text-text hover:bg-white/[0.04]"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Workout plan pill ── */
function WorkoutPlanPill({ selectedWorkoutPlan, workoutPlans, onSelect, onCreateNew }) {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const active = !!selectedWorkoutPlan;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200
          ${active
            ? "bg-accent/15 border-accent/50 text-accent shadow-[0_0_12px_rgba(70,182,53,0.12)]"
            : "bg-white/[0.03] border-white/[0.1] text-white/50 hover:border-white/20 hover:text-white/75"
          }`}
      >
        <span className="material-symbols-outlined text-[16px]">list_alt</span>
        <span className="max-w-[120px] truncate">{active ? selectedWorkoutPlan : "Workout Plan"}</span>
        <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>expand_more</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+8px)] left-0 z-20 w-52 bg-[#111] border border-white/[0.1] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden">
            {active && (
              <button
                onClick={() => { onSelect(null, null); setOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-[12px] font-semibold tracking-[1.5px] uppercase text-accent/70 hover:bg-white/[0.04] border-b border-white/[0.06] transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
                Clear
              </button>
            )}
            <div className="max-h-52 overflow-y-auto py-1">
              {workoutPlans.map((wp, i) => (
                <button
                  key={i}
                  onClick={() => { onSelect(wp.title, wp.id); setOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm truncate transition-colors duration-150
                    ${wp.title === selectedWorkoutPlan
                      ? "text-accent font-semibold bg-accent/[0.08]"
                      : "text-white/60 hover:text-text hover:bg-white/[0.04]"
                    }`}
                >
                  {wp.title}
                </button>
              ))}
            </div>
            <div className="border-t border-white/[0.06] p-2">
              <button
                onClick={() => { setCreateOpen(true); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-accent/80 hover:text-accent hover:bg-accent/[0.06] rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Create new plan
              </button>
            </div>
          </div>
        </>
      )}

      {/* Inline create dialog */}
      {createOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
          <div className="w-[420px] bg-[#0d0d0d] border border-white/[0.09] rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <h2 className="font-bebas text-xl text-text tracking-[2px]">CREATE WORKOUT PLAN</h2>
              <button onClick={() => setCreateOpen(false)} className="text-white/30 hover:text-white/60 transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold tracking-[2px] uppercase text-white/40">Title</label>
                <input
                  maxLength={35}
                  type="text"
                  placeholder="My workout plan"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-text text-sm outline-none focus:border-accent/50 focus:shadow-[0_0_0_3px_rgba(70,182,53,0.07)] transition-all placeholder:text-white/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-semibold tracking-[2px] uppercase text-white/40">Description</label>
                <textarea
                  maxLength={255}
                  placeholder="Optional description..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-text text-sm outline-none focus:border-accent/50 focus:shadow-[0_0_0_3px_rgba(70,182,53,0.07)] transition-all placeholder:text-white/20 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setCreateOpen(false)}
                  className="flex-1 py-3 rounded-lg border border-white/[0.08] text-white/50 text-sm font-semibold hover:border-white/20 hover:text-white/70 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={title.length < 3}
                  onClick={() => { onCreateNew(title, desc); setCreateOpen(false); setTitle(""); setDesc(""); }}
                  className="flex-1 py-3 rounded-lg bg-accent text-black text-sm font-bold tracking-[1px] disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#52cc3f] transition-all"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main page ── */
export default function ExercisePage() {
  const location = useLocation();

  const [selectedOptions, setSelectedOptions] = useState({
    selectedSkillLevel: null,
    selectedForce: null,
    selectedEquipment: null,
    selectedPrimaryMuscle: [],
    selectedCategory: null,
  });

  const [selectedWorkoutPlan, selectWorkoutPlan] = useState(null);
  const [selectedWorkoutPlanId, selectWorkoutPlanId] = useState(null);
  const [workoutPlanTitle, setWorkoutTitle] = useState("");
  const [workoutPlanDescription, setWorkoutDescription] = useState("");
  const [searchBarText, setSearchbarText] = useState(undefined);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(30);
  const [userData, setUserData] = useState("user");
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [mounted, setMounted] = useState(false);

  const skillLevels = ["Beginner", "Intermediate", "Expert"];
  const forces = ["Push", "Pull", "Static"];
  const categories = ["Strength", "Streching", "Plyometrics", "Strongman", "Powerlifting", "Cardio", "Crossfit", "Olympic Weightlifting", "Weighted Bodyweight", "Assisted bodyweight"];
  const muscles = ["Abdominals", "Hamstrings", "Calves", "Shoulders", "Adductors", "Glutes", "Quadriceps", "Biceps", "Forearms", "Abductors", "Triceps", "Chest", "Lower back", "Traps", "Middle back", "Lats", "Neck"];
  const equipments = ["Body only", "Machine", "Kettlebells", "Dumbbell", "Cable", "Barbell", "Bands", "Medicine ball", "Exercise ball", "E-z curl bar", "Foam roll"];

  const activeFiltersCount = [
    selectedOptions.selectedSkillLevel,
    selectedOptions.selectedForce,
    selectedOptions.selectedEquipment,
    selectedOptions.selectedPrimaryMuscle?.length > 0 ? selectedOptions.selectedPrimaryMuscle : null,
    selectedOptions.selectedCategory,
  ].filter(Boolean).length;

  function clearAllFilters() {
    setSelectedOptions({ selectedSkillLevel: null, selectedForce: null, selectedEquipment: null, selectedPrimaryMuscle: [], selectedCategory: null });
  }

  async function fetchSelectedExercises() {
    setLoading(true);
    const payload = {};
    payload.page = currentPage;
    payload.searchText = searchBarText;
    if (selectedOptions.selectedSkillLevel) payload.selectedSkillLevel = selectedOptions.selectedSkillLevel.toLowerCase();
    if (selectedOptions.selectedForce) payload.selectedForce = selectedOptions.selectedForce.toLowerCase();
    if (selectedOptions.selectedEquipment) payload.selectedEquipment = selectedOptions.selectedEquipment.toLowerCase();
    payload.selectedPrimaryMuscle = selectedOptions.selectedPrimaryMuscle || [];
    if (selectedOptions.selectedCategory) payload.selectedCategory = selectedOptions.selectedCategory.toLowerCase();
    const response = await axios.post("http://localhost:5000/api/getfilteredexercises", payload);
    setExercises(response.data.filteredExercises);
    setLoading(false);
  }

  async function fetchLoggedInData() {
    try {
      const response = await axios.get("http://localhost:5000/api/getloggedinuser", { withCredentials: true });
      setUserData(response.data.UserData);
      setWorkoutPlans(response.data.UserData.workoutPlans);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  async function handleCreateWorkoutPlan(title, desc) {
    try {
      await axios.post("http://localhost:5000/api/createworkoutplan", { title, description: desc, userId: userData.id });
      fetchLoggedInData();
    } catch (error) {
      console.error("Error while creating workout plan", error);
    }
  }

  useEffect(() => {
    fetchLoggedInData();
    if (location.state?.workoutplantitle && location.state?.workoutplanid) {
      selectWorkoutPlan(location.state.workoutplantitle);
      selectWorkoutPlanId(location.state.workoutplanid);
    }
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => { fetchSelectedExercises(); }, [searchBarText, currentPage]);
  useEffect(() => { fetchSelectedExercises(); }, [selectedOptions, currentPage]);

  const totalPages = Math.ceil(880 / exercisesPerPage);
  const canGoBack = currentPage > 1;
  const canGoForward = currentPage * exercisesPerPage < 880;

  return (
    <div className="font-dm flex flex-col min-h-screen bg-backgroundcolor">
      <div className="flex flex-1 w-full">
        <Navbar currentSite="exercises" username={userData.username} />

        <main className="flex-1 flex flex-col bg-backgroundcolor">

          {/* ── Top bar ── */}
          <nav className="sticky top-0 z-30 w-full h-16 flex items-center justify-between px-6 bg-backgroundcolor/80 backdrop-blur-md border-b border-white/[0.06]">
            <h1 className="font-bebas text-2xl text-text tracking-[3px]">EXERCISES</h1>
            <ProfileBox nickname={userData.nickname} profilepic={userData.profilepicture} username={userData.username} />
          </nav>

          <div className={`flex-1 px-6 pb-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>

            {/* ── Page heading ── */}
            <div className="mt-8 mb-6">
              <p className="text-white/35 text-sm font-medium tracking-[2px] uppercase mb-1">Library</p>
              <div className="flex items-baseline gap-3">
                <h2 className="font-bebas text-5xl text-text tracking-[2px] leading-none">
                  FIND YOUR <span className="text-accent">EXERCISE</span>
                </h2>
              </div>
              <p className="text-white/35 text-sm mt-2">880+ exercises with detailed instructions and filters.</p>
            </div>

            {/* ── Search + pagination row ── */}
            <div className="flex items-center gap-3 mb-5">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-white/25">
                  search
                </span>
                <input
                  onChange={e => setSearchbarText(e.target.value)}
                  placeholder="Search exercises…"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-text text-sm outline-none focus:border-accent/50 focus:shadow-[0_0_0_3px_rgba(70,182,53,0.07)] transition-all placeholder:text-white/25"
                />
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Pagination */}
              <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2">
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={!canGoBack}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:text-text hover:bg-white/[0.06] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <div className="flex items-center gap-1 px-2">
                  <span className="text-sm font-semibold text-text">{currentPage}</span>
                  <span className="text-white/30 text-sm">/</span>
                  <span className="text-white/30 text-sm">{totalPages}</span>
                </div>
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!canGoForward}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:text-text hover:bg-white/[0.06] disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* ── Filter pills row ── */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[11px] font-semibold tracking-[2px] uppercase text-white/25 mr-1">Filters</span>

              <FilterPill
                label="Level"
                icon="signal_cellular_alt"
                selectedOption={selectedOptions.selectedSkillLevel}
                options={skillLevels}
                onSelect={v => setSelectedOptions(p => ({ ...p, selectedSkillLevel: v }))}
              />
              <FilterPill
                label="Force"
                icon="bolt"
                selectedOption={selectedOptions.selectedForce}
                options={forces}
                onSelect={v => setSelectedOptions(p => ({ ...p, selectedForce: v }))}
              />
              <FilterPill
                label="Equipment"
                icon="fitness_center"
                selectedOption={selectedOptions.selectedEquipment}
                options={equipments}
                onSelect={v => setSelectedOptions(p => ({ ...p, selectedEquipment: v }))}
              />
              <FilterPill
                label="Primary Muscle"
                icon="sports_gymnastics"
                selectedOption={selectedOptions.selectedPrimaryMuscle?.length > 0 ? selectedOptions.selectedPrimaryMuscle : null}
                options={muscles}
                onSelect={v => setSelectedOptions(p => ({ ...p, selectedPrimaryMuscle: v ? [v] : [] }))}
              />
              <FilterPill
                label="Category"
                icon="category"
                selectedOption={selectedOptions.selectedCategory}
                options={categories}
                onSelect={v => setSelectedOptions(p => ({ ...p, selectedCategory: v }))}
              />

              {/* Divider */}
              <div className="w-px h-6 bg-white/[0.08] mx-1" />

              <WorkoutPlanPill
                selectedWorkoutPlan={selectedWorkoutPlan}
                workoutPlans={workoutPlans}
                onSelect={(title, id) => { selectWorkoutPlan(title); selectWorkoutPlanId(id); }}
                onCreateNew={handleCreateWorkoutPlan}
              />

              {/* Clear all */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] text-white/35 hover:text-white/60 hover:bg-white/[0.04] border border-white/[0.06] transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
                  Clear ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* ── Active plan banner ── */}
            {selectedWorkoutPlan && (
              <div className="relative flex items-center gap-3 px-5 py-3.5 mb-5 bg-accent/[0.07] border border-accent/20 rounded-xl overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                <span className="material-symbols-outlined text-[18px] text-accent">list_alt</span>
                <span className="text-sm text-text">
                  Adding exercises to <span className="font-semibold text-accent">{selectedWorkoutPlan}</span>
                </span>
                <button
                  onClick={() => { selectWorkoutPlan(null); selectWorkoutPlanId(null); }}
                  className="ml-auto text-white/30 hover:text-white/60 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            {/* ── Results count ── */}
            {!loading && exercises.length > 0 && (
              <p className="text-[11px] text-white/25 tracking-[1.5px] uppercase mb-4">
                {exercises.length} exercises found
              </p>
            )}

            {/* ── Exercise grid ── */}
            <Exercises
              exercises={exercises}
              loading={loading}
              workoutPlanId={selectedWorkoutPlanId}
              userId={userData.id}
            />

            {/* ── Bottom pagination ── */}
            {exercises.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={!canGoBack}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-text hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Previous
                </button>
                <span className="text-sm text-white/30 font-medium px-4">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={!canGoForward}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white/50 hover:text-text hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}