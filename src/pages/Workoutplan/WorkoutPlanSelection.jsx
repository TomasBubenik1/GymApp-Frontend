import React from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import ProfileBox from "../../components/ProfileBox";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import ShareComponent from "../../utils/shareComponent";

/* ── New Workout Plan Dialog ── */
function NewWorkoutPlanDialog({ onClose, onConfirm }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 10); }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/75 backdrop-blur-sm">
      <div
        className={`relative w-[480px] bg-[#0d0d0d] border border-white/[0.09] rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-accent text-[17px]">add</span>
            </div>
            <h2 className="font-bebas text-[22px] text-text tracking-[3px]">NEW WORKOUT PLAN</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.05] transition-all duration-150"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-7 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold tracking-[2.5px] uppercase text-white/35">
              Plan Title
            </label>
            <input
              maxLength={35}
              type="text"
              placeholder="e.g. Push Day, Full Body Strength…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-text text-sm outline-none focus:border-accent/50 focus:shadow-[0_0_0_3px_rgba(70,182,53,0.07)] transition-all placeholder:text-white/20"
            />
            <div className="flex justify-end">
              <span className="text-[11px] text-white/20">{title.length}/35</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold tracking-[2.5px] uppercase text-white/35">
              Description <span className="text-white/20 normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              maxLength={255}
              placeholder="Describe your workout plan…"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-text text-sm outline-none focus:border-accent/50 focus:shadow-[0_0_0_3px_rgba(70,182,53,0.07)] transition-all placeholder:text-white/20 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-white/[0.08] text-white/45 text-sm font-semibold hover:bg-white/[0.04] hover:text-white/65 hover:border-white/[0.14] transition-all duration-150"
            >
              Cancel
            </button>
            <button
              disabled={title.length < 3}
              onClick={() => { onConfirm(title, desc); onClose(); }}
              className="flex-1 py-3.5 rounded-xl bg-accent text-black text-sm font-bold tracking-[1px] uppercase hover:bg-[#52cc3f] hover:shadow-[0_4px_20px_rgba(70,182,53,0.35)] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
            >
              Create Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Workout Plan Card ── */
function WorkoutPlanCard({ workoutplan, onDelete, onCopyLink }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative flex flex-col bg-[#0e0e0e] rounded-2xl border border-white/[0.07] overflow-hidden hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(70,182,53,0.06)] transition-all duration-300">
      {/* Top accent line on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* Thumbnail */}
      <Link to={`../workoutdetails/${workoutplan.id}`}>
        <div className="relative aspect-video overflow-hidden bg-black/60">
          {!imgError && workoutplan.thumbnail ? (
            <img
              alt={workoutplan.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={workoutplan.thumbnail}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[48px] text-white/[0.07]">fitness_center</span>
            </div>
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent opacity-60" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <Link to={`../workoutdetails/${workoutplan.id}`} className="flex-1 min-w-0">
          <h3 className="text-text font-semibold text-[15px] truncate group-hover:text-white transition-colors">
            {workoutplan.title}
          </h3>
          {workoutplan.description && (
            <p className="text-white/30 text-[12px] mt-0.5 truncate">{workoutplan.description}</p>
          )}
        </Link>

        {/* Options menu */}
        <div className="relative ml-3 shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-[calc(100%+4px)] z-20 w-40 bg-[#111] border border-white/[0.09] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden">
                <button
                  onClick={() => { onCopyLink(workoutplan.id); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/55 hover:bg-white/[0.04] hover:text-text transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">ios_share</span>
                  Share
                </button>
                <div className="h-px bg-white/[0.06] mx-3" />
                <button
                  onClick={() => { onDelete(workoutplan.id); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/[0.08] hover:text-red-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function WorkoutPlans() {
  const [userData, setUserData] = useState({});
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  async function handleWorkoutPlanDelete(workoutPlanId) {
    try {
      await axios.post(
        "http://localhost:5000/api/deleteworkoutplan",
        { workoutPlanId },
        { withCredentials: true }
      );
      setWorkoutPlans(prev => prev.filter(wp => wp.id !== workoutPlanId));
    } catch (error) {
      console.error("Error deleting workout plan:", error);
    }
  }

  function handleCopyLink(workoutPlanId) {
    navigator.clipboard.writeText(`http://localhost:3000/workoutdetails/${workoutPlanId}`);
  }

  async function handleCreateWorkoutPlan(title, desc) {
    try {
      await axios.post(
        "http://localhost:5000/api/createworkoutplan",
        { title, description: desc, userId: userData.id },
        { withCredentials: true }
      );
      fetchLoggedInData();
    } catch (error) {
      console.error("Error creating workout plan:", error);
    }
  }

  async function fetchLoggedInData() {
    try {
      const response = await axios.get("http://localhost:5000/api/getloggedinuser", { withCredentials: true });
      setUserData(response.data.UserData);
      setWorkoutPlans(response.data.UserData.workoutPlans);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchLoggedInData();
    setTimeout(() => setMounted(true), 50);
  }, []);

  return (
    <div className="font-dm flex flex-col min-h-screen bg-backgroundcolor">
      <div className="flex flex-1 w-full">
        <Navbar currentSite="workoutplans" username={userData?.username} />

        <main className="flex-1 flex flex-col bg-backgroundcolor">

          {/* ── Top bar ── */}
          <nav className="sticky top-0 z-30 w-full h-16 flex items-center justify-between px-8 bg-black/70 backdrop-blur-xl border-b border-white/[0.05]">
            <span className="font-bebas text-[22px] tracking-[3px] text-text">WORKOUT PLANS</span>
            <ProfileBox nickname={userData.nickname} profilepic={userData.profilepicture} username={userData.username} />
          </nav>

          <div className="flex-1 px-8 pb-12 overflow-auto">

            {/* ── Heading ── */}
            <div className={`mt-8 mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
              <p className="text-white/25 text-[11px] font-semibold tracking-[3px] uppercase mb-2">Your Library</p>
              <h2 className="font-bebas text-[52px] text-text tracking-[2px] leading-none">
                WORKOUT <span className="text-accent">PLANS</span>
              </h2>
              <p className="text-white/30 text-sm mt-2 tracking-wide">
                {workoutPlans.length} {workoutPlans.length === 1 ? "plan" : "plans"} in your library
              </p>
            </div>

            {/* ── Create button row ── */}
            <div className={`flex items-center justify-between mb-6 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold tracking-[2.5px] uppercase text-white/20">
                  {workoutPlans.length} Plans
                </span>
              </div>
              <button
                onClick={() => setOpenCreateDialog(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent/15 border border-accent/30 text-accent text-sm font-semibold hover:bg-accent/25 hover:border-accent/50 hover:shadow-[0_0_16px_rgba(70,182,53,0.15)] transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[17px]">add</span>
                New Plan
              </button>
            </div>

            {/* ── Grid ── */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-700 delay-150 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
              {workoutPlans.map((workoutplan) => (
                <WorkoutPlanCard
                  key={workoutplan.id}
                  workoutplan={workoutplan}
                  onDelete={handleWorkoutPlanDelete}
                  onCopyLink={handleCopyLink}
                />
              ))}

              {/* Create new card */}
              <button
                onClick={() => setOpenCreateDialog(true)}
                className="group flex flex-col items-center justify-center min-h-[160px] rounded-2xl border border-dashed border-white/[0.1] hover:border-accent/40 hover:bg-accent/[0.03] text-white/20 hover:text-accent/60 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] group-hover:bg-accent/10 flex items-center justify-center mb-3 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(70,182,53,0.1)]">
                  <span className="material-symbols-outlined text-[24px]">add</span>
                </div>
                <span className="text-[12px] font-semibold tracking-[1.5px] uppercase">New Plan</span>
              </button>
            </div>

            {/* ── Empty state ── */}
            {workoutPlans.length === 0 && (
              <div className={`flex flex-col items-center justify-center py-32 gap-4 transition-all duration-700 delay-200 ${mounted ? "opacity-100" : "opacity-0"}`}>
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px] text-white/20">fitness_center</span>
                </div>
                <p className="text-white/30 text-sm font-medium">No workout plans yet</p>
                <p className="text-white/20 text-xs">Create your first plan to get started</p>
                <button
                  onClick={() => setOpenCreateDialog(true)}
                  className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-black text-sm font-bold hover:bg-[#52cc3f] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Create First Plan
                </button>
              </div>
            )}

          </div>
        </main>
      </div>

      <Footer />

      {openCreateDialog && (
        <NewWorkoutPlanDialog
          onClose={() => setOpenCreateDialog(false)}
          onConfirm={handleCreateWorkoutPlan}
        />
      )}
    </div>
  );
}