import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import "../styles/UtilStyles.css";
import ProfileBox from "../components/ProfileBox";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function WorkoutPlans() {
  const [userData, setUserData] = useState("user");
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [userExerciseData, setUserExerciseData] = useState([]);
  const [selectedWorkoutPlan, selectWorkoutPlan] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [workoutPlanTitle, setWorkoutTitle] = useState("");
  const [workoutPlanDescription, setWorkoutDescription] = useState("");
  const [changesPayload, updateChangesPayload] = useState([]);
  const [newDatasPayload, updateNewDataPayload] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [estimatedLenght, setEstimatedLenght] = useState(0);
  const [muscleGroupPercentages, setMuscleGroupPercentages] = useState({
    lowerBody: 0,
    upperBody: 0,
    core: 0,
  });

  const muscleGroupColors = {
    lowerBody: "#976333",
    upperBody: "#899733",
    core: "#42B6CF",
  };
  const lowerBodyMuscles = [
    "quadriceps",
    "hamstrings",
    "calves",
    "glutes",
    "abductors",
    "adductors",
  ];
  const upperBodyMuscles = [
    "biceps",
    "triceps",
    "chest",
    "lats",
    "shoulders",
    "traps",
    "forearms",
    "middle back",
  ];
  const coreMuscles = ["abdominals", "lower back", "neck"];

  function toggleDropdown(id) {
    if (openDropdownId === id) {
      setOpenDropdownId(null); // Close the dropdown if it's already open
    } else {
      setOpenDropdownId(id); // Open the dropdown for the clicked workout plan
    }
  }

  const getMuscleGroupColor = (primaryMuscles) => {
    if (primaryMuscles.some((muscle) => lowerBodyMuscles.includes(muscle))) {
      return muscleGroupColors.lowerBody;
    } else if (
      primaryMuscles.some((muscle) => upperBodyMuscles.includes(muscle))
    ) {
      return muscleGroupColors.upperBody;
    } else if (primaryMuscles.some((muscle) => coreMuscles.includes(muscle))) {
      return muscleGroupColors.core;
    }
    return "defaultColor"; // Fallback color
  };

  function calculateMuscleGroupPercentages() {
    var lowerBodyCount = 0;
    var upperBodyCount = 0;
    var coreCount = 0;
    var totalExercises = selectedWorkoutPlan.exercises.length;

    selectedWorkoutPlan.exercises.forEach((exercise) => {
      if (
        exercise.primaryMuscles.some((muscle) =>
          lowerBodyMuscles.includes(muscle)
        )
      ) {
        lowerBodyCount += 1;
      } else if (
        exercise.primaryMuscles.some((muscle) =>
          upperBodyMuscles.includes(muscle)
        )
      ) {
        upperBodyCount += 1;
      } else if (
        exercise.primaryMuscles.some((muscle) => coreMuscles.includes(muscle))
      ) {
        coreCount += 1;
      }
    });

    setMuscleGroupPercentages({
      lowerBody: Math.round((lowerBodyCount / totalExercises) * 100),
      upperBody: Math.round((upperBodyCount / totalExercises) * 100),
      core: Math.round((coreCount / totalExercises) * 100),
    });
  }

  useEffect(() => {
    if (
      selectedWorkoutPlan.exercises &&
      selectedWorkoutPlan.exercises.length > 0
    ) {
      calculateMuscleGroupPercentages();
    }
  }, [selectedWorkoutPlan]);
  const navigate = useNavigate();

  function onAddClick() {
    navigate("/exercises", {
      state: {
        workoutplantitle: selectedWorkoutPlan.title,
        workoutplanid: selectedWorkoutPlan.id,
      },
    });
  }

  var time = 0;

  function handleApplyChanges() {
    const changesArray = Object.values(changesPayload);
    const newDataArray = Object.values(newDatasPayload);
    if (changesArray.length >= 1) {
      changesArray.forEach(async (changePayload) => {
        await axios.post(
          "http://localhost:5000/api/updateexercisedata",
          {
            exerciseId: changePayload.exerciseId,
            newWeight: changePayload.weight,
            newReps: changePayload.reps,
            newSets: changePayload.sets,
          },
          { withCredentials: true }
        );
      });
    }
    if (newDataArray.length >= 1) {
      newDataArray.forEach(async (newDataPayload) => {
        console.log(newDataPayload.weight);
        if (newDataPayload.weight == undefined) {
          alert(
            "You must specify the weight when setting the data on exercise you havent done before.."
          );
        }
        if (newDataPayload.reps == undefined) {
          alert(
            "You must specify the reps when setting the data on exercise you havent done before.."
          );
        }
        if (newDataPayload.sets == undefined) {
          alert(
            "You must specify the sets when setting the data on exercise you havent done before.."
          );
        } else {
          console.log("Applied changes");
          await axios.post(
            "http://localhost:5000/api/addexercisedata",
            {
              exerciseId: newDataPayload.exerciseId,
              weight: newDataPayload.weight,
              reps: newDataPayload.reps,
              sets: newDataPayload.sets,
            },
            { withCredentials: true }
          );
        }
      });
    }
  }

  function CalculateDuration() {
    time = 0;
    selectedWorkoutPlan.exercises.forEach((exercise) => {
      if (
        exercise.userExerciseData.length > 0 &&
        !isNaN(exercise.userExerciseData[0].sets)
      ) {
        var sets = parseInt(exercise.userExerciseData[0].sets, 10) || 0;
        var durationPerSet = 5;
        time += sets * durationPerSet;
      }
    });
    setEstimatedLenght(time);
  }

  const handleNewReps = (exerciseId, e) => {
    const newReps = parseInt(e.target.value);
    console.log(newReps);

    updateNewDataPayload((prevChangesPayload) => ({
      ...prevChangesPayload,
      [exerciseId]: {
        ...prevChangesPayload[exerciseId],
        reps: newReps,
        exerciseId: exerciseId,
      },
    }));
    console.log(newDatasPayload);
  };

  const handleNewSets = (exerciseId, e) => {
    const newSets = parseInt(e.target.value);

    updateNewDataPayload((prevChangesPayload) => ({
      ...prevChangesPayload,
      [exerciseId]: {
        ...prevChangesPayload[exerciseId],
        sets: newSets,
        exerciseId: exerciseId,
      },
    }));
    console.log(newDatasPayload);
  };

  const handleNewWeight = (exerciseId, e) => {
    const newWeight = parseFloat(e.target.value);

    updateNewDataPayload((prevChangesPayload) => ({
      ...prevChangesPayload,
      [exerciseId]: {
        ...prevChangesPayload[exerciseId],
        weight: newWeight,
        exerciseId: exerciseId,
      },
    }));
    console.log(newDatasPayload);
  };

  const handleWeightChange = (exerciseId, e) => {
    const newWeight = parseFloat(e.target.value);
    updateChangesPayload((prevChangesPayload) => ({
      ...prevChangesPayload,
      [exerciseId]: {
        ...prevChangesPayload[exerciseId],
        weight: newWeight,
        exerciseId: exerciseId,
      },
    }));
    const updatedWorkoutPlan = {
      ...selectedWorkoutPlan,
      exercises: selectedWorkoutPlan.exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            userExerciseData: [
              {
                ...exercise.userExerciseData[0],
                weight: newWeight,
              },
            ],
          };
        }
        return exercise;
      }),
    };

    selectWorkoutPlan(updatedWorkoutPlan);
    console.log(changesPayload);
  };

  const handleRepsChange = (exerciseId, e) => {
    const newReps = parseInt(e.target.value);
    updateChangesPayload((prevChangesPayload) => ({
      ...prevChangesPayload,
      [exerciseId]: {
        ...prevChangesPayload[exerciseId],
        reps: newReps,
        exerciseId: exerciseId,
      },
    }));
    const updatedWorkoutPlan = {
      ...selectedWorkoutPlan,
      exercises: selectedWorkoutPlan.exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            userExerciseData: [
              {
                ...exercise.userExerciseData[0],
                reps: newReps,
              },
            ],
          };
        }
        return exercise;
      }),
    };

    selectWorkoutPlan(updatedWorkoutPlan);
    console.log(changesPayload);
  };

  const handleSetsChange = (exerciseId, e) => {
    const newSets = parseInt(e.target.value);
    updateChangesPayload((prevChangesPayload) => ({
      ...prevChangesPayload,
      [exerciseId]: {
        ...prevChangesPayload[exerciseId],
        sets: newSets,
        exerciseId: exerciseId,
      },
    }));
    const updatedWorkoutPlan = {
      ...selectedWorkoutPlan,
      exercises: selectedWorkoutPlan.exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            userExerciseData: [
              {
                ...exercise.userExerciseData[0],
                sets: newSets,
              },
            ],
          };
        }
        return exercise;
      }),
    };

    selectWorkoutPlan(updatedWorkoutPlan);
    console.log(changesPayload);
  };

  const handleTitleChange = (e) => {
    setWorkoutTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setWorkoutDescription(e.target.value);
  };

  async function handleCreateWorkoutPlan() {
    try {
      console.log("pressed");
      const response = await axios.post(
        "http://localhost:5000/api/createworkoutplan",
        {
          title: workoutPlanTitle,
          description: workoutPlanDescription,
          userId: userData.id,
        }
      );
      setOpenCreateDialog(!openCreateDialog);
    } catch (error) {
      console.error("Error while creating workout plan", error);
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
      setWorkoutPlans(response.data.exercisePlans);
      setUserExerciseData(response.data.userExerciseData);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  useEffect(() => {
    fetchLoggedInData();
  }, []);

  useEffect(() => {
    if (Object.keys(selectedWorkoutPlan).length > 0) {
      CalculateDuration();
    }
  }, [selectedWorkoutPlan]);

  return (
    <div className="">
      <div className="flex bg-backgroundcolor w-full">
        <Navbar currentSite={"workoutplans"} />
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
          {selectedWorkoutPlan.length == 0 ? (
            <div className="flex flex-col items-center justify-center bg-backgroundcolor">
              <p className="text-text text-3xl font-semibold mb-10">
                Select your workout plan:
              </p>
              <div className=" flex ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
                  {workoutPlans.map((workoutplan, i) => (
                    <div
                      className="flex flex-col border p-1 border-accent rounded-lg overflow-hidden shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer"
                      key={i}
                    >
                      <img
                        alt={`Thumbnail for ${workoutplan.title}`}
                        className="rounded-t-lg h-48 w-full object-cover"
                        src={workoutplan.thumbnail}
                        onClick={() => selectWorkoutPlan(workoutplan)}
                      />
                      <div className=" flex justify-between p-3">
                        <p
                          className="text-text text-xl font-medium "
                          onClick={() => selectWorkoutPlan(workoutplan)}
                        >
                          {workoutplan.title}
                        </p>
                        <button onClick={() => toggleDropdown(workoutplan.id)}>
                          <span className="material-symbols-outlined text-text text-2xl text-center">
                            more_horiz
                          </span>
                          {openDropdownId == workoutplan.id && (
                            <div className="absolute bg-forground z-50 text-text mt-10 rounded-lg border border-gray-300 shadow-md">
                              <ul>
                                <li className="p-2 hover:bg-gray-100">
                                  Option 1
                                </li>
                                <li className="p-2 hover:bg-gray-100">
                                  Option 2
                                </li>
                              </ul>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div
                    className="flex border justify-center items-center border-accent rounded-lg overflow-hidden shadow-lg transform transition duration-500 hover:scale-105 cursor-pointer"
                    onClick={() => setOpenCreateDialog(true)}
                  >
                    <span className="material-symbols-outlined mt-3 text-text text-4xl text-center">
                      add
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full">
              <div className="text-text w-full text-md flex sm:gap-40 gap-52 p-10">
                <div>
                  <p className="ml-5 opacity-60">EST DURATION</p>
                  <p className="ml-5 text-3xl">
                    {estimatedLenght}-{estimatedLenght + 15} Mins
                  </p>
                </div>
                <div>
                  <p className="ml-5 opacity-60">WEIGHT MOVED</p>
                  <p className="ml-5 text-3xl">560 kg</p>
                </div>
                <div>
                  <p className="ml-5 opacity-60">DIFFICULTY</p>
                  <p className="ml-5 text-3xl">Moderate</p>
                </div>
                <div>
                  <p className="ml-5 opacity-60">VISIBILITY</p>
                  <p className="ml-5 text-3xl">Private</p>
                </div>
              </div>
              <div
                className="flex flex-row h-1 gap-1 ml-16 font-semibold "
                style={{ maxWidth: "800px" }}
              >
                {muscleGroupPercentages.lowerBody > 0 && (
                  <div
                    className="flex flex-col"
                    style={{
                      width: `${muscleGroupPercentages.lowerBody}%`,
                      backgroundColor: "#976333",
                    }}
                  >
                    <p
                      className="mt-2"
                      style={{ color: "#976333", fontSize: "15px" }}
                    >
                      LOWER BODY
                    </p>
                    <p className="text-text text-xl mt-1">
                      {muscleGroupPercentages.lowerBody}%
                    </p>
                  </div>
                )}
                {muscleGroupPercentages.upperBody > 0 && (
                  <div
                    className="flex flex-col"
                    style={{
                      width: `${muscleGroupPercentages.upperBody}%`,
                      backgroundColor: "#899733",
                    }}
                  >
                    <p
                      className="mt-2"
                      style={{ color: "#899733", fontSize: "15px" }}
                    >
                      UPPER BODY
                    </p>
                    <p className="text-text text-xl mt-1">
                      {muscleGroupPercentages.upperBody}%
                    </p>
                  </div>
                )}
                {muscleGroupPercentages.core > 0 && (
                  <div
                    style={{
                      width: `${muscleGroupPercentages.core}%`,
                      backgroundColor: "#42B6CF",
                    }}
                  >
                    <p
                      className="mt-2"
                      style={{ color: "#42B6CF", fontSize: "15px" }}
                    >
                      CORE
                    </p>
                    <p className="text-text text-xl mt-1">
                      {muscleGroupPercentages.core}%
                    </p>
                  </div>
                )}
              </div>
              <div className=" gap-5 rounded-xl bg-[#18181B] sm:mt-36 sm:w-exerciseListContainer  sm:ml-10 mt-40 ml-24">
                <p className=" text-gray-500 text-xl pt-5 pl-5 font-semibold">
                  {selectedWorkoutPlan.title}
                </p>
                <div className="items-center flex flex-col mt-3"></div>
                {selectedWorkoutPlan.exercises.map((exercise, i) => {
                  if (exercise.userExerciseData.length == 0) {
                    return (
                      <div className="border shadow-md border-gray-700 hover:border-white transition duration-3 items-center align-middle flex gap-1 bg-backgroundcolor w-6/7 h-12 mr-10 mt-5 ml-6 rounded-md">
                        <Checkbox
                          {...label}
                          color="success"
                          sx={{
                            color: "#18181B",
                            marginTop: "5px",
                          }}
                        />
                        <p className="text-text text-xl self-center w-60 ">
                          {exercise.name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: getMuscleGroupColor(
                              exercise.primaryMuscles
                            ),
                            marginRight: "10px",
                          }}
                        />
                        <input
                          type="number"
                          className=" bg-transparent w-16 text-text"
                          onChange={(e) => {
                            handleNewWeight(exercise.id, e);
                          }}
                        ></input>
                        <p className="text-text">Kg</p>
                        <input
                          type="number"
                          className=" bg-transparent w-16 text-text"
                          onChange={(e) => {
                            handleNewReps(exercise.id, e);
                          }}
                        ></input>
                        <p className="text-text">Reps</p>
                        <input
                          type="number"
                          max={30}
                          className=" bg-transparent w-16 text-text"
                          onChange={(e) => {
                            handleNewSets(exercise.id, e);
                          }}
                        ></input>
                        <p className="text-text">Sets</p>
                      </div>
                    );
                  } else {
                    return (
                      <div className=" border shadow-md border-gray-700 hover:border-white transition duration-300 items-center align-middle flex gap-1 bg-backgroundcolor w-6/7 h-12 mr-10 mt-5 ml-6 rounded-md">
                        <Checkbox
                          {...label}
                          color="success"
                          sx={{
                            color: "#18181B",
                            marginTop: "5px",
                          }}
                        />
                        <p className="text-text text-xl self-center w-60 ">
                          {exercise.name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: getMuscleGroupColor(
                              exercise.primaryMuscles
                            ),
                            marginRight: "15px",
                          }}
                        />
                        <input
                          type="number"
                          onChange={(e) => {
                            handleWeightChange(exercise.id, e);
                          }}
                          className=" bg-transparent w-16 text-text"
                          value={exercise.userExerciseData[0].weight}
                        ></input>
                        <p className=" text-gray-700">Kg</p>
                        <input
                          type="number"
                          onChange={(e) => {
                            handleRepsChange(exercise.id, e);
                          }}
                          className=" bg-transparent w-16 text-text"
                          value={exercise.userExerciseData[0].reps}
                        ></input>
                        <p className=" text-gray-700">Reps</p>
                        <input
                          type="number"
                          max={30}
                          min={3}
                          onChange={(e) => {
                            handleSetsChange(exercise.id, e);
                          }}
                          className=" bg-transparent w-16 text-text"
                          value={exercise.userExerciseData[0].sets}
                        ></input>
                        <p className=" text-gray-700">Sets</p>
                      </div>
                    );
                  }
                })}
                <div className="text-text">
                  <div className=" flex justify-center mt-5 mb-5">
                    <button onClick={onAddClick}>
                      <span className="material-symbols-outlined mt-3 text-text text-4xl">
                        add
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(Object.keys(changesPayload).length != 0) |
            (Object.keys(newDatasPayload).length != 0) && (
            <div className="flex justify-end mr-28 mt-5">
              <button
                className="p-3 bg-accent fixed bottom-10 right-16 text-text rounded-lg self"
                onClick={handleApplyChanges}
              >
                Apply changes
              </button>
            </div>
          )}

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
