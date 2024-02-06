import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

function Navbar(currentSite) {
  async function Logout() {
    try {
      await axios
        .post("http://localhost:5000/api/auth/logout")
        .then(cookies.remove("connect.sid"), alert("Logged out sucessfully"));
    } catch (error) {
      alert(error);
    }
  }

  const cookies = new Cookies();

  return (
    <nav className=" w-mL h-screen sticky top-0 bg-backgroundcolor h-f flex flex-col items-center text text-2xl border-r border-gray-700">
      <a className="text-3xl font-bold text-accent mt-5 text-center">
        Muscle Tracker
      </a>
      <div className="flex flex-col flex-grow-1 h-full justify-start items-start gap-1 mt-12">
        {currentSite.currentSite == "dashboard" ? (
          <Link
            className="bg-accent w-full p-2 bg-opacity-20 rounded-lg flex  text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/dashboard"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-accent">
              space_dashboard
            </span>
            Dashboard
          </Link>
        ) : (
          <Link
            className="rounded-lg p-2 flex w-full  text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/dashboard"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25">
              space_dashboard
            </span>
            Dashboard
          </Link>
        )}
        <Link
          className="rounded-lg p-2 flex w-full  text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
          to={"/exercises"}
          title="dashboard"
        >
          <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25">
            analytics
          </span>
          Analytics
        </Link>
        <Link
          className="rounded-lg p-2 flex w-full  text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
          to={"/exercises"}
          title="dashboard"
        >
          <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25">
            calendar_today
          </span>
          Schedule
        </Link>
        {currentSite.currentSite == "social" ? (
          <Link
            className="bg-accent w-full p-2 bg-opacity-20 rounded-lg flex  text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/social"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25">
              groups
            </span>
            Social
          </Link>
        ) : (
          <Link
            className="rounded-lg p-2 flex w-full  text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/social"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25">
              groups
            </span>
            Social
          </Link>
        )}
        {currentSite.currentSite == "workoutplans" ? (
          <Link
            className="bg-accent w-full p-2 bg-opacity-20 rounded-lg flex  text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/workoutplans"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25">
              list_alt
            </span>
            Workout Plans
          </Link>
        ) : (
          <Link
            className="rounded-lg p-2 flex  text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/workoutplans"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25">
              list_alt
            </span>
            Workout Plans
          </Link>
        )}
        {currentSite.currentSite == "exercises" ? (
          <Link
            className="bg-accent w-full p-2 bg-opacity-20 rounded-lg flex  text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/exercises"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25">
              fitness_center
            </span>
            Exercises
          </Link>
        ) : (
          <Link
            className="rounded-lg p-2 flex w-full  text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/exercises"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25">
              fitness_center
            </span>
            Exercises
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
