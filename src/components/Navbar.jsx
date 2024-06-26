import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

function Navbar({ currentSite, username }) {
  const cookies = new Cookies();

  const [notificationCount, setNotificationCount] = useState(0);

  async function fetchLoggedInData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getloggedinuser",
        {
          withCredentials: true,
        }
      );

      let unreadCount = 0;

      console.log(
        "Notifications:",
        response.data.UserData.receivedNotifications
      );
      response.data.UserData.receivedNotifications.forEach((notification) => {
        if (notification.read == false) {
          unreadCount += 1;
        }
      });
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }
  useEffect(() => {
    fetchLoggedInData();
  }, []);
  return (
    <nav className=" lg:w-[300px] lg:min-w-[300px] lg:max-w-[300px] 2xl:min-w-[500px] 2xl:max-w-[500px] 2xl:w-[500px] h-screen sticky top-0 bg-backgroundcolor h-f flex flex-col items-center text text-2xl border-r border-gray-700">
      <a className="text-3xl font-bold text-accent mt-5 text-center">
        <Link to={"/dashboard"}>Muscle Tracker</Link>
      </a>
      <div className="flex flex-col flex-grow-1 h-full justify-start items-start gap-2 mt-12">
        {currentSite == "dashboard" ? (
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
            <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in">
              space_dashboard
            </span>
            Dashboard
          </Link>
        )}
        {currentSite == "social" ? (
          <Link
            className="bg-accent w-full p-2 bg-opacity-20 rounded-lg flex  text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/social"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-accent transition duration-150 ease-in ">
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
            <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in ">
              groups
            </span>
            Social
          </Link>
        )}
        {currentSite == "workoutplans" ? (
          <Link
            className="bg-accent w-full p-2 bg-opacity-20 rounded-lg flex  text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/workoutplanselection"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-accent transition duration-150 ease-in ">
              list_alt
            </span>
            Workout Plans
          </Link>
        ) : (
          <Link
            className="rounded-lg p-2 flex  text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/workoutplanselection"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in  ">
              list_alt
            </span>
            Workout Plans
          </Link>
        )}
        {currentSite == "exercises" ? (
          <Link
            className="bg-accent w-full p-2 bg-opacity-20 rounded-lg flex  text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={"/exercises"}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-accent transition duration-150 ease-in  ">
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
            <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in ">
              fitness_center
            </span>
            Exercises
          </Link>
        )}
        {currentSite == "notifications" ? (
          <Link
            className="bg-accent w-full p-2 bg-opacity-20 rounded-lg flex  text-accent transition duration-150 ease-in "
            to={"/notifications"}
            title="dashboard"
          >
            <div className="relative flex flex-col">
              <span className="material-symbols-outlined text-navIcons transition duration-150 ease-in  ">
                notifications
              </span>
            </div>
            Notifications
          </Link>
        ) : (
          <Link
            className="rounded-lg p-2 flex w-full text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to="/notifications"
            title="dashboard"
          >
            <div className="relative flex flex-col">
              <span className="material-symbols-outlined text-navIcons transition duration-150 ease-in  ">
                notifications
              </span>
              {notificationCount > 0 && (
                <p className="absolute top-0 right-0 text-xs bg-accent text-white rounded-full px-1.5 py-0.5">
                  {notificationCount}
                </p>
              )}
            </div>
            Notifications
          </Link>
        )}
        {currentSite == "profile" ? (
          <Link
            className="bg-accent w-full p-2 bg-opacity-20 rounded-lg flex  text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={`../${username}`}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-accent transition duration-150 ease-in ">
              person
            </span>
            Profile
          </Link>
        ) : (
          <Link
            className="rounded-lg p-2 flex w-full  text-text transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25"
            to={`../${username}`}
            title="dashboard"
          >
            <span className="mr-3 material-symbols-outlined text-navIcons text-text transition duration-150 ease-in">
              person
            </span>
            Profile
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
