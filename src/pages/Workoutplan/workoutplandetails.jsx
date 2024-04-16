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
import { useParams } from "react-router-dom";

export default function WorkoutPlanDetails() {
  const [userData, setUserData] = useState("user");
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [userExerciseData, setUserExerciseData] = useState([]);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [changesPayload, updateChangesPayload] = useState([]);
  const [newDatasPayload, updateNewDataPayload] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [singleWorkoutPlan, setSingleWorkoutPlanData] = useState([]);
  const [estimatedLenght, setEstimatedLenght] = useState(0);
  const [canViewThePlan, setCanViewThePlan] = useState(true);
  const [isPrivacyDropDownOpen, setPricavyDropDown] = useState(false);
  const [muscleGroupPercentages, setMuscleGroupPercentages] = useState({
    lowerBody: 0,
    upperBody: 0,
    core: 0,
  });

  let { workoutPlanId } = useParams();

  const privacyOptions = ["Public", "Friends", "Private"];

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
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
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
  };

  function calculateTotalWeight() {
    let totalWeight = 0;
    if (singleWorkoutPlan && singleWorkoutPlan.exercises) {
      singleWorkoutPlan.exercises.forEach((exercise) => {
        if (exercise.userExerciseData.length > 0) {
          const sets = parseInt(exercise.userExerciseData[0].sets, 10) || 1;
          const weight = parseFloat(exercise.userExerciseData[0].weight) || 1;
          const reps = parseFloat(exercise.userExerciseData[0].reps) || 1;
          totalWeight += sets * weight * reps;
        }
      });
    }
    return totalWeight;
  }

  function calculateMuscleGroupPercentages() {
    var lowerBodyCount = 0;
    var upperBodyCount = 0;
    var coreCount = 0;
    var totalExercises = singleWorkoutPlan.exercises.length;

    singleWorkoutPlan.exercises.forEach((exercise) => {
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
    if (singleWorkoutPlan.exercises && singleWorkoutPlan.exercises.length > 0) {
      calculateMuscleGroupPercentages();
    }
  }, [singleWorkoutPlan]);
  const navigate = useNavigate();

  function onAddClick() {
    navigate("/exercises", {
      state: {
        workoutplantitle: singleWorkoutPlan.title,
        workoutplanid: singleWorkoutPlan.id,
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

  function CalculateAverageLevel() {
    if (singleWorkoutPlan && singleWorkoutPlan.exercises) {
      const mapka = {
        Beginner: 0,
        Intermediate: 0,
        Expert: 0,
      };

      singleWorkoutPlan.exercises.forEach((exercise) => {
        const level = exercise.level.toLowerCase(); // Convert level to lowercase for consistency
        if (level === "beginner") {
          mapka["Beginner"] += 1;
        } else if (level === "intermediate") {
          mapka["Intermediate"] += 1;
        } else if (level === "expert") {
          mapka["Expert"] += 1;
        }
      });

      let maxLevel = "Beginner"; // Default max level to Beginner
      let maxValue = mapka["Beginner"];

      Object.entries(mapka).forEach(([level, count]) => {
        if (count > maxValue) {
          maxLevel = level;
          maxValue = count;
        }
      });

      return maxLevel;
    }
  }

  function CalculateDuration() {
    time = 0;
    singleWorkoutPlan.exercises.forEach((exercise) => {
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

  async function handleVisbilityChange(vOption) {
    try {
      setPricavyDropDown(false);
      setSingleWorkoutPlanData((prevdata) => ({
        ...prevdata,
        visibility: vOption,
      }));
      const response = axios.post(
        "http://localhost:5000/api/changeworkoutplanvisibility",
        {
          workoutPlanId: singleWorkoutPlan.id,
          newVisibility: vOption,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Erorr");
    }
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
      ...singleWorkoutPlan,
      exercises: singleWorkoutPlan.exercises?.map((exercise) => {
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

    setSingleWorkoutPlanData(updatedWorkoutPlan);
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
      ...singleWorkoutPlan,
      exercises: singleWorkoutPlan.exercises?.map((exercise) => {
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

    setSingleWorkoutPlanData(updatedWorkoutPlan);
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
      ...singleWorkoutPlan,
      exercises: singleWorkoutPlan.exercises.map((exercise) => {
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

    setSingleWorkoutPlanData(updatedWorkoutPlan);
    console.log(changesPayload);
  };

  async function fetchSingleWorkoutPlan() {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/getoneworkoutplan",
        {
          workoutPlanId: parseInt(workoutPlanId),
        },
        { withCredentials: true }
      );
      console.log("Odpoved:", response.status);
      setSingleWorkoutPlanData(response.data);
    } catch (error) {
      if (error.response.status === 403) {
        setCanViewThePlan(false);
      }
      console.error("There was error getting workout plan:", error);
    }
  }

  async function removeExerciseFromPlan(exerciseId) {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/removeexercisefromplan",
        {
          exerciseId: exerciseId,
          workoutPlanId: singleWorkoutPlan.id,
        },
        { withCredentials: true }
      );
      console.log(res);
    } catch (error) {
      console.error(
        "There was issue removing exercise from workoutplan:",
        error
      );
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

  function toggleDropdown(id) {
    if (openDropdownId == id) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
  }

  useEffect(() => {
    fetchLoggedInData();
    fetchSingleWorkoutPlan();
    console.log("kokot");
  }, []);

  useEffect(() => {
    if (Object.keys(singleWorkoutPlan).length > 0) {
      CalculateDuration();
    }
  }, [singleWorkoutPlan]);

  console.log(singleWorkoutPlan);
  return (
    <div className="flex flex-col bg-backgroundcolor">
      <div className="flex bg-backgroundcolor w-full mb-20">
        <Navbar currentSite={"workoutplans"} username={userData?.username} />
        <main className=" grow bg-backgroundcolor">
          <div className=" h-full w-full">
            <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
              <h1 className="text-3xl text-text font-bold ml-5">
                {canViewThePlan
                  ? singleWorkoutPlan.title
                  : "You don't have acess to this workout plan!"}
              </h1>
              <div className="">
                <ProfileBox
                  nickname={userData.nickname}
                  profilepic={userData.profilepicture}
                  username={userData.username}
                ></ProfileBox>
              </div>
            </nav>
            {canViewThePlan ? (
              <div>
                <div className="ml-5"></div>
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
                      <p className="ml-5 text-3xl">
                        {calculateTotalWeight()} kg
                      </p>
                    </div>
                    <div>
                      <p className="ml-5 opacity-60">DIFFICULTY</p>
                      <p className="ml-5 text-3xl">{CalculateAverageLevel()}</p>
                    </div>
                    <div>
                      <p className="ml-5 opacity-60">VISIBILITY</p>
                      <div className=" flex flex-row gap-1">
                        <p className="ml-5 text-3xl">
                          {singleWorkoutPlan.visibility}
                        </p>
                        <button
                          onClick={() =>
                            setPricavyDropDown(!isPrivacyDropDownOpen)
                          }
                        >
                          <p className=" text-gray-600 mt-1 underline">Edit</p>
                        </button>
                        {isPrivacyDropDownOpen && (
                          <div className=" bg-foreground rounded-lg w-56 h-44 absolute mt-20 flex flex-col justify-evenly shadow-lg">
                            {privacyOptions.map((pOption, i) => {
                              return (
                                <div
                                  key={i}
                                  className={`flex flex-row justify-center mt-1 ${
                                    pOption == singleWorkoutPlan.visibility
                                      ? " text-accent"
                                      : ""
                                  }`}
                                >
                                  {i === 0 ? (
                                    <span className="material-symbols-outlined text-2xl text-center">
                                      public
                                    </span>
                                  ) : i === 1 ? (
                                    <span className="material-symbols-outlined  text-2xl text-center">
                                      group
                                    </span>
                                  ) : i === 2 ? (
                                    <span className="material-symbols-outlined text-2xl text-center">
                                      lock
                                    </span>
                                  ) : null}
                                  <button
                                    onClick={() =>
                                      handleVisbilityChange(pOption)
                                    }
                                  >
                                    {pOption}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
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
                  <div className=" gap-5 rounded-xl bg-[#18181B] sm:mt-36 sm:w-[750px]  sm:ml-10 mt-40 ml-24">
                    <p className=" text-gray-500 text-xl pt-5 pl-5 font-semibold">
                      {singleWorkoutPlan.title}
                    </p>
                    <div className="items-center flex flex-col mt-3"></div>
                    {singleWorkoutPlan.exercises?.map((exercise, i) => {
                      if (exercise.userExerciseData.length == 0) {
                        return (
                          <div className="border shadow-md border-gray-700 hover:border-white transition duration-3 items-center pr-3 align-middle flex gap-1 bg-backgroundcolor w-[680px] h-12 mr-10 mt-5 ml-6 rounded-md">
                            <Checkbox
                              {...label}
                              color="success"
                              sx={{
                                color: "#18181B",
                                marginTop: "5px",
                              }}
                            />
                            <p className="text-text text-xl self-center w-[280px] ">
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
                              min={0}
                              max={1000}
                              type="number"
                              className=" bg-transparent w-16 text-text text-right"
                              onChange={(e) => {
                                handleNewWeight(exercise.id, e);
                              }}
                            ></input>
                            <p className="text-text">Kg</p>
                            <input
                              min={1}
                              max={30}
                              type="number"
                              className=" bg-transparent w-16 text-text text-right"
                              onChange={(e) => {
                                handleNewReps(exercise.id, e);
                              }}
                            ></input>
                            <p className="text-text">Reps</p>
                            <input
                              type="number"
                              min={1}
                              max={30}
                              className=" bg-transparent w-16 text-text text-right"
                              onChange={(e) => {
                                handleNewSets(exercise.id, e);
                              }}
                            ></input>
                            <p className="text-text">Sets</p>
                            <button onClick={() => toggleDropdown(exercise.id)}>
                              <span className="material-symbols-outlined text-text text-2xl text-center">
                                more_horiz
                              </span>
                              {openDropdownId == exercise.id && (
                                <div
                                  className="absolute bg-foreground z-50 text-text mt-5 rounded-lg border border-gray-300 shadow-[0_0px_5px_] w-[100px]"
                                  style={{ marginLeft: "-50px" }}
                                >
                                  <ul>
                                    <li
                                      className="p-2 hover:bg-foregroundhover rounded-t-lg flex flex-row"
                                      onClick={() =>
                                        removeExerciseFromPlan(exercise.id)
                                      }
                                    >
                                      <span className="material-symbols-outlined text-red-600 text-2xl text-center">
                                        delete_forever
                                      </span>
                                      <p className="mt-1 text-red-600 font-bold">
                                        Delete
                                      </p>
                                    </li>
                                    <Link
                                      to={`http://localhost:3000/details/${exercise.id}`}
                                      className="p-2 hover:bg-foregroundhover rounded-b-lg flex flex-row"
                                    >
                                      <span className="material-symbols-outlined text-text text-2xl text-center">
                                        info
                                      </span>
                                      <p className="mt-1 text-text font-semibold">
                                        Details
                                      </p>
                                    </Link>
                                  </ul>
                                </div>
                              )}
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div className=" border shadow-md border-gray-700 pr-3 hover:border-white transition duration-300 items-center align-middle flex gap-1 bg-backgroundcolor w-[680px] h-12 mr-10 mt-5 ml-6 rounded-md">
                            <Checkbox
                              {...label}
                              color="success"
                              sx={{
                                color: "#18181B",
                                marginTop: "5px",
                              }}
                            />
                            <p className="text-text text-xl self-center w-[280px] ">
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
                              className=" bg-transparent w-16 text-text text-right"
                              value={exercise.userExerciseData[0].weight}
                            ></input>
                            <p className=" text-gray-700">Kg</p>
                            <input
                              type="number"
                              onChange={(e) => {
                                handleRepsChange(exercise.id, e);
                              }}
                              className=" bg-transparent w-16 text-text text-right"
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
                              className=" bg-transparent w-16 text-text text-right"
                              value={exercise.userExerciseData[0].sets}
                            ></input>
                            <p className=" text-gray-700">Sets</p>
                            <button onClick={() => toggleDropdown(exercise.id)}>
                              <span className="material-symbols-outlined text-text text-2xl text-center">
                                more_horiz
                              </span>
                              {openDropdownId == exercise.id && (
                                <div
                                  className="absolute bg-foreground z-50 text-text mt-5 rounded-lg border border-gray-300 shadow-[0_0px_5px_] w-[100px]"
                                  style={{ marginLeft: "-50px" }}
                                >
                                  <ul>
                                    <li
                                      className="p-2 hover:bg-foregroundhover rounded-t-lg flex flex-row"
                                      onClick={() =>
                                        removeExerciseFromPlan(exercise.id)
                                      }
                                    >
                                      <span className="material-symbols-outlined text-red-600 text-2xl text-center">
                                        delete_forever
                                      </span>
                                      <p className="mt-1 text-red-600 font-bold">
                                        Delete
                                      </p>
                                    </li>
                                    <Link
                                      to={`http://localhost:3000/details/${exercise.id}`}
                                      className="p-2 hover:bg-foregroundhover rounded-b-lg flex flex-row"
                                    >
                                      <span className="material-symbols-outlined text-text text-2xl text-center">
                                        info
                                      </span>
                                      <p className="mt-1 text-text font-semibold">
                                        Details
                                      </p>
                                    </Link>
                                  </ul>
                                </div>
                              )}
                            </button>
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
                  {(Object.keys(changesPayload).length != 0) |
                    (Object.keys(newDatasPayload).length != 0) && (
                    <div className="flex justify-end mr-28 mt-5 fixed z-50">
                      <button
                        className="p-3 bg-accent fixed bottom-10 right-16 text-text rounded-lg self"
                        onClick={handleApplyChanges}
                      >
                        Apply changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex w-full h-full justify-center items-center">
                <p className="text-text text-3xl mb-20">
                  You don't have access to view this workout plan!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer></Footer>
    </div>
  );
}
