import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import Exercises from "../../components/Exercises";
import DropdownMenuFilter from "../../components/Dropdown";
import ProfileBox from "../../components/ProfileBox";
import { useLocation } from "react-router-dom";
import Footer from "../../components/Footer";

export default function ExercisePage() {
  const [openSkillLevel, setOpenSkillLevel] = useState(false);
  const [openForce, setOpenForce] = useState(false);
  const [openEquipment, setOpenEquipment] = useState(false);
  const [openPrimaryMuscle, setOpenPrimaryMuscle] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openWorkoutPlans, setOpenWorkoutPlans] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [searchBarText, setSearchbarText] = useState(undefined);
  const [notificationCount, setNotificationCount] = useState(0);

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

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage, setExercisesPerPage] = useState(30);
  const [userData, setUserData] = useState("user");
  const [workoutPlans, setWorkoutPlans] = useState([]);

  function handleSearchbardChange(e) {
    setSearchbarText(e.target.value);
  }

  useEffect(() => {
    fetchSelectedExercises();
  }, [searchBarText, currentPage]);

  const handleTitleChange = (e) => {
    setWorkoutTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setWorkoutDescription(e.target.value);
  };

  const skillLevels = ["Beginner", "Intermediate", "Expert"];

  const forces = ["Push", "Pull", "Static"];

  const categories = [
    "Strength",
    "Streching",
    "Plyometrics",
    "Strongman",
    "Powerlifting",
    "Cardio",
    "Crossfit",
    "Olympic Weightlifting",
    "Weighted Bodyweight",
    "Assisted bodyweight",
  ];

  const muscles = [
    "Abdominals",
    "Hamstrings",
    "Calves",
    "Shoulders",
    "Adductors",
    "Glutes",
    "Quadriceps",
    "Biceps",
    "Forearms",
    "Abductors",
    "Triceps",
    "Chest",
    "Lower back",
    "Traps",
    "Middle back",
    "Lats",
    "Neck",
  ];

  const equipments = [
    "Body only",
    "Machine",
    "Kettlebells",
    "Dumbbell",
    "Cable",
    "Barbell",
    "Bands",
    "Medicine ball",
    "Exercise ball",
    "E-z curl bar",
    "Foam roll",
  ];

  async function fetchExerciseData() {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/getallexercises"
      );
      setExercises(response.data.Exercisesdata);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching exercise data");
    }
  }

  async function fetchSelectedExercises() {
    setLoading(true);
    const payload = {};

    console.log(payload);
    payload.page = currentPage;
    payload.searchText = searchBarText;
    if (selectedOptions.selectedSkillLevel) {
      payload.selectedSkillLevel =
        selectedOptions.selectedSkillLevel.toLowerCase();
    }
    if (selectedOptions.selectedForce) {
      payload.selectedForce = selectedOptions.selectedForce.toLowerCase();
    }
    if (selectedOptions.selectedEquipment) {
      payload.selectedEquipment =
        selectedOptions.selectedEquipment.toLowerCase();
    }
    if (selectedOptions.selectedPrimaryMuscle != null) {
      payload.selectedPrimaryMuscle = selectedOptions.selectedPrimaryMuscle;
    } else {
      payload.selectedPrimaryMuscle = [];
    }
    if (selectedOptions.selectedCategory) {
      payload.selectedCategory = selectedOptions.selectedCategory.toLowerCase();
    }
    if (Object.keys(payload).length < 0) {
      return;
    }

    const response = await axios.post(
      "http://localhost:5000/api/getfilteredexercises",
      payload
    );
    setExercises(response.data.filteredExercises);
    setLoading(false);
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
      setNotificationCount(response.data.UserData.receivedNotifications.length);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  async function handleCreateWorkoutPlan() {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/createworkoutplan",
        {
          title: workoutPlanTitle,
          description: workoutPlanDescription,
          userId: userData.id,
        }
      );
      console.log(response);
      setOpenCategory(false);
    } catch (error) {
      console.error("Error while creating workout plan", error);
    }
  }

  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = exercises.slice(
    indexOfFirstExercise,
    indexOfLastExercise
  );

  useEffect(() => {
    fetchLoggedInData();
    fetchExerciseData();
    if (
      location.state &&
      location.state.workoutplantitle != null &&
      location.state.workoutplanid != null
    ) {
      selectWorkoutPlan(location.state.workoutplantitle);
      selectWorkoutPlanId(location.state.workoutplanid);
    }
  }, []);

  useEffect(() => {
    console.log(selectedOptions);
    fetchSelectedExercises();
  }, [selectedOptions, currentPage]);

  console.log("Exercises:", exercises);
  return (
    <div className="flex flex-col">
      <div className="flex bg-backgroundcolor w-full">
        <Navbar
          currentSite={"exercises"}
          username={userData.username}
          notificationCount={notificationCount}
        />
        <main className=" grow bg-backgroundcolor">
          <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
            <h1 className="text-3xl text-text font-bold ml-5">Exercises</h1>
            <div className="">
              <ProfileBox
                nickname={userData.nickname}
                profilepic={userData.profilepicture}
                username={userData.username}
              ></ProfileBox>
            </div>
          </nav>
          <div className="ml-3">
            <div>
              <div className="text-2xl flex items-center gap-2 mt-3">
                <h1 className="text-stone-300">Welcome back</h1>
                <h1 className=" text-accent font-bold mr-3">
                  {userData.username}!👋
                </h1>
              </div>
              <div className="h-20 flex gap-3 mt-6 mb-5">
                <DropdownMenuFilter
                  label={"Level"}
                  onSelect={(selectedSkillLevel) =>
                    setSelectedOptions((prevOptions) => ({
                      ...prevOptions,
                      selectedSkillLevel,
                    }))
                  }
                  selectedOption={selectedOptions.selectedSkillLevel}
                  options={skillLevels}
                />
                <DropdownMenuFilter
                  label={"Force"}
                  onSelect={(selectedForce) =>
                    setSelectedOptions((prevOptions) => ({
                      ...prevOptions,
                      selectedForce,
                    }))
                  }
                  selectedOption={selectedOptions.selectedForce}
                  options={forces}
                />
                <DropdownMenuFilter
                  label={"Equipment"}
                  onSelect={(selectedEquipment) =>
                    setSelectedOptions((prevOptions) => ({
                      ...prevOptions,
                      selectedEquipment,
                    }))
                  }
                  selectedOption={selectedOptions.selectedEquipment}
                  options={equipments}
                />
                <DropdownMenuFilter
                  label={"Primary Muscle"}
                  onSelect={(selectedPrimaryMuscle) =>
                    setSelectedOptions((prevOptions) => ({
                      ...prevOptions,
                      selectedPrimaryMuscle,
                    }))
                  }
                  selectedOption={selectedOptions.selectedPrimaryMuscle}
                  options={muscles}
                ></DropdownMenuFilter>
                <DropdownMenuFilter
                  label={"Category"}
                  onSelect={(selectedCategory) =>
                    setSelectedOptions((prevOptions) => ({
                      ...prevOptions,
                      selectedCategory,
                    }))
                  }
                  selectedOption={selectedOptions.selectedCategory}
                  options={categories}
                ></DropdownMenuFilter>
                <div
                  className=" flex flex-col w-full h-full  rounded-md bg-foreground"
                  onClick={() => setOpenWorkoutPlans(!openWorkoutPlans)}
                >
                  <label className="text-base  text-gray-400 ml-6 font-semibold mt-3 self-start">
                    Workout Plan
                  </label>
                  <div className="text-lg text-white font-semibold flex w-full">
                    <p className="flex-grow pl-6 text-base">
                      {selectedWorkoutPlan}
                    </p>
                    <span className="material-symbols-outlined pr-4">
                      expand_more
                    </span>
                  </div>
                  {openWorkoutPlans && (
                    <div className="mt-6 w-full text-white bg-foreground relative rounded-md p-2 justify-center flex flex-col items-center z-50">
                      {workoutPlans.map((workoutplan, i) => {
                        if (workoutplan.title == selectedWorkoutPlan) {
                          return (
                            <div
                              className=" text-accent font-semibold"
                              key={i}
                              onClick={() => (
                                selectWorkoutPlan(null),
                                selectWorkoutPlanId(null)
                              )}
                            >
                              {workoutplan.title}
                            </div>
                          );
                        }
                        return (
                          <div
                            className=""
                            key={i}
                            onClick={() => (
                              selectWorkoutPlan(workoutplan.title),
                              selectWorkoutPlanId(workoutplan.id)
                            )}
                          >
                            {workoutplan.title}
                          </div>
                        );
                      })}
                      <div
                        className="flex"
                        onClick={() => setOpenCreateDialog(!openCreateDialog)}
                      >
                        <p>Create new</p>
                        <span className="material-symbols-outlined text-white text-[30px]">
                          add
                        </span>
                      </div>
                    </div>
                  )}
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
                        maxLength={35}
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
                        className="bg-[#18181B] border rounded-md  self-center text-white"
                        placeholder="Description"
                        style={{ width: "80%", height: "20%" }}
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
                          className=" bg-accent disabled:opacity-50 disabled:bg-[#2f2f35]   mb-5 mr-5 rounded-md text-white text-sm font-semibold bg-accentColor w-20 h-8"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex w-full align-middle justify-between gap-3">
                <input
                  onChange={handleSearchbardChange}
                  placeholder="Search bar"
                  className="  text-text bg-transparent border-white border rounded-lg"
                ></input>
                <div>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage == 1}
                  >
                    <div className="flex justify-center items-center rotate-180 mr-3">
                      <span className="material-symbols-outlined text-gray-400 bg-[#1a1a1a] p-2 rounded-lg  ">
                        arrow_forward_ios
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage * exercisesPerPage >= 880}
                  >
                    <div className="flex justify-center items-center mr-3">
                      <span className="material-symbols-outlined text-gray-400 bg-[#1a1a1a] p-2 rounded-lg  ">
                        arrow_forward_ios
                      </span>
                    </div>
                  </button>
                </div>
              </div>
              <Exercises
                exercises={exercises}
                loading={loading}
                workoutPlanId={selectedWorkoutPlanId}
                userId={userData.id}
              ></Exercises>
            </div>
          </div>
        </main>
      </div>
      <Footer></Footer>
    </div>
  );
}
