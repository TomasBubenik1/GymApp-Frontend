import React from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import "../../styles/UtilStyles.css";
import ProfileBox from "../../components/ProfileBox";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import ShareComponent from "../../utils/shareComponent";

export default function WorkoutPlans() {
  const [userData, setUserData] = useState("user");
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [userExerciseData, setUserExerciseData] = useState([]);
  const [selectedWorkoutPlan, selectWorkoutPlan] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [workoutPlanTitle, setWorkoutTitle] = useState("");
  const [workoutPlanDescription, setWorkoutDescription] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleTitleChange = (e) => {
    setWorkoutTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setWorkoutDescription(e.target.value);
  };

  async function handleWorkoutPlanDelete(workoutPlanId) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/deleteworkoutplan",
        {
          workoutPlanId: workoutPlanId,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("There was error deleting workoutplan:", error);
    }
  }

  async function handleCreateWorkoutPlan() {
    try {
      console.log("pressed");
      const response = await axios.post(
        "http://localhost:5000/api/createworkoutplan",
        {
          title: workoutPlanTitle,
          description: workoutPlanDescription,
          userId: userData.id,
        },
        { withCredentials: true }
      );
      setOpenCreateDialog(!openCreateDialog);
    } catch (error) {
      console.error("Error while creating workout plan", error);
    }
  }

  function toggleDropdown(id) {
    if (openDropdownId == id) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
  }

  async function fetchLoggedInData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getloggedinuser",
        {
          withCredentials: true,
        }
      );
      setUserData(response.data.UserData);
      setWorkoutPlans(response.data.UserData.workoutPlans);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  useEffect(() => {
    fetchLoggedInData();
  }, []);

  return (
    <div className="">
      <div className="flex bg-backgroundcolor w-full">
        <Navbar currentSite={"workoutplans"} username={userData?.username} />
        <main className="flex-grow bg-backgroundcolor h-full">
          <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
            {Object.keys(selectedWorkoutPlan).length > 1 ? (
              <div className="text-text">
                <div className="flex flex-row">
                  <h1 className="text-text text-3xl ml-5 font-bold">
                    {selectedWorkoutPlan.title}
                  </h1>
                  <span className="material-symbols-outlined pr-4 text-white mt-2 ml-1">
                    expand_more
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-text text-3xl ml-5 font-bold">
                Select your workout plan:
              </div>
            )}
            <div className="">
              <ProfileBox
                nickname={userData.nickname}
                profilepic={userData.profilepicture}
                username={userData.username}
              ></ProfileBox>
            </div>
          </nav>
          <div className="flex flex-col items-center justify-center bg-backgroundcolor">
            <p className="text-text text-3xl font-semibold mb-10">
              Select your workout plan:
            </p>
            <div className=" flex ">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                {workoutPlans.map((workoutplan, i) => (
                  <div
                    className="flex flex-col border shadow-lg border-accent rounded-lg overflow-hidden cursor-pointer hover:transition duration-500 bg-foreground xl:w-[350px] xl:h-[270px] 2xl:h-[310px] 2xl:w-[450px] "
                    key={i}
                  >
                    <Link to={`../workoutdetails/${workoutplan.id}`}>
                      <img
                        alt={`Thumbnail for ${workoutplan.title}`}
                        className="object-cover w-full h-full transition duration-500 hover:scale-110 hover:brightness-125"
                        src={workoutplan.thumbnail}
                        onClick={() => selectWorkoutPlan(workoutplan)}
                        style={{ transition: "transform 0.5s, filter 0.5s" }}
                      />
                    </Link>
                    <div className=" z-50 flex justify-between p-3 bg-foreground w-full">
                      <Link to={`../workoutdetails/${workoutplan.id}`}>
                        <p
                          className="text-text text-xl font-medium "
                          onClick={() => selectWorkoutPlan(workoutplan)}
                        >
                          {workoutplan.title}
                        </p>
                      </Link>
                      <button onClick={() => toggleDropdown(workoutplan.id)}>
                        <span className="material-symbols-outlined text-text text-2xl text-center">
                          more_horiz
                        </span>
                        {openDropdownId == workoutplan.id && (
                          <div
                            className="absolute bg-foreground z-50 text-text mt-5 rounded-lg border border-gray-300 shadow-[0_0px_5px_] w-[100px]"
                            style={{ marginLeft: "-50px" }}
                          >
                            <ul>
                              <li
                                className="p-2 hover:bg-foregroundhover rounded-t-lg flex flex-row"
                                onClick={() =>
                                  handleWorkoutPlanDelete(workoutplan.id)
                                }
                              >
                                <span className="material-symbols-outlined text-red-600 text-2xl text-center">
                                  delete_forever
                                </span>
                                <p className="mt-1 text-red-600 font-bold">
                                  Delete
                                </p>
                              </li>
                              <ShareComponent workoutplanId={workoutplan.id} />
                            </ul>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                <div
                  className="flex border justify-center items-center border-accent rounded-lg overflow-hidden shadow-lg transform transition duration-500 cursor-pointer xl:h-[270px] 2xl:h-[310px] 2xl:w-[450px]"
                  onClick={() => setOpenCreateDialog(true)}
                >
                  <span className="material-symbols-outlined mt-3 text-text text-4xl text-center group-hover:scale-150 transition duration-500 group-hover:brightness-150 group-hover: ">
                    add
                  </span>
                </div>
              </div>
            </div>
          </div>
          {openCreateDialog && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-70 bg-black">
              <div
                className=" rounded-md bg-[#18181B] flex flex-col"
                style={{ height: "48vh", width: "36vw" }}
              >
                <span
                  className="material-symbols-outlined pr-4 text-white self-end p-2"
                  onClick={() => setOpenCreateDialog(false)}
                >
                  close
                </span>
                <h1 className="text-white text-2xl p-1 ml-14 font-semibold">
                  Create Workout Plan
                </h1>
                <label className="text-white font-semibold ml-16 mb-3 mt-3">
                  Title
                </label>
                <input
                  onChange={handleTitleChange}
                  type="text"
                  placeholder="Title"
                  className=" text-white p-1 bg-[#18181B] border rounded-md self-center align-middle"
                  style={{ width: "80%" }}
                />
                <label className="text-white font-semibold ml-16 mb-3 mt-5">
                  Description
                </label>
                <textarea
                  maxLength={255}
                  onChange={handleDescriptionChange}
                  className="bg-[#18181B] border rounded-md  self-center text-white w-[80%] h-[1000px] resize-none"
                  placeholder="Description"
                ></textarea>
                <div className="flex grow w-full justify-end items-end gap-2">
                  <button
                    className="mb-5 rounded-md text-white text-sm font-semibold bg-[#2f2f35] w-20 h-8"
                    onClick={() => setOpenCreateDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWorkoutPlan}
                    disabled={workoutPlanTitle.length < 3}
                    className=" disabled:opacity-50 disabled:bg-[#2f2f35]   mb-5 mr-5 rounded-md text-white text-sm font-semibold bg-accent w-20 h-8"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
