import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';



export default function WorkoutPlans() {

  const [userData, setUserData] = useState("user");
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [exerciseHistory,setExerciseHistory] = useState([])

  const [selectedWorkoutPlan, selectWorkoutPlan] = useState([]);
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [workoutPlanTitle, setWorkoutTitle] = useState("");
  const [workoutPlanDescription, setWorkoutDescription] = useState("");

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
      setUserData(response.data.sessiondata.sess.user);
      setWorkoutPlans(response.data.exercisePlans);
      setExerciseHistory(response.data.exerciseHistory)
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  useEffect(() => {
    fetchLoggedInData();
  }, []);

  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar currentSite={"workoutplans"} />
      <main className="flex-grow ml-5 bg-backgroundcolor h-full">
        <nav className="w-full h-20 flex justify-between items-center bg-white bg-opacity-10 rounded-2xl">
          <div className="flex items-center">
            <h1 className="text-3xl text-text font-bold ml-5">
              {Object.keys(selectedWorkoutPlan).length > 0 ? (
                <p className="text-text text-3xl">
                  {" "}
                  {selectedWorkoutPlan.title}
                  <span className="material-symbols-outlined pr-4">
                    expand_more
                  </span>
                </p>
              ) : (
                <p>Select your workout plan.</p>
              )}
            </h1>
          </div>
        </nav>
        {selectedWorkoutPlan.length == 0 ? (
          <div className="flex flex-col w-full items-center justify-center h-full">
            <p className="text-text text-3xl font-semibold h-3">
              Select your workout plan:
            </p>
            <div className="h-32 overflow-auto mt-10">
              {workoutPlans.map((workoutplan, i) => (
                <div key={i}>
                  <p
                    className="text-text text-2xl"
                    onClick={() => selectWorkoutPlan(workoutplan)}
                  >
                    {workoutplan.title}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-text text-2xl mt-10">Or</p>
            <p
              className="text-3xl mt-5 font-semibold text-accent"
              onClick={() => setOpenCreateDialog(true)}
            >
              Create new
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full h-full">
            <div className="text-text w-full text-md flex gap-52 p-10">
              <div>
                <p className="ml-5 opacity-60">EST DURATION</p>
                <p className="ml-5 text-3xl">25-30 mins</p>
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
            <div className=' gap-5 rounded-2xl bg-[#18181B] mt-40 ml-24' style={{height:"450px",width:"750px"}}>
            <div className='items-center flex flex-col mt-10'></div>
            {selectedWorkoutPlan.exercises.map((exercise, i) => {
              return (
                <div className=" align-middle border-white flex gap-1 bg-backgroundcolor w-5/6 h-10 mr-10 mt-5 ml-6 rounded-sm">
                  <Checkbox {...label} color="success" sx={{
                      color: "#18181B",
                      marginTop:"5px"
                     }}/>
                  <p className="text-text text-xl self-center">{exercise.name}</p>
                  {exerciseHistory.length == 0 && (
                  <div className='flex '>
                <input className='self-center bg-transparent text-text' placeholder='Weight' type='text'></input>
                </div>
                )}
                  {exerciseHistory.map((exerciseH,i)=>{
                    if(exerciseH.exerciseId == exercise.id){
                      return(
                        <div className='flex'>
                     <p className=' text-text text-xl self-center'>{exerciseH.weight}</p><p className=' text-text text-xl self-center text-opacity-60'>kg</p>
                     </div>
                      )
                    }
                  else return(<div className='flex'>
                    <input className=' self-center bg-transparent' placeholder='Weight' type='text'></input>
                    <input className=' self-center bg-transparent' placeholder='Reps' type='text'></input>
                    <input className=' self-center bg-transparent' placeholder='Sets' type='text'></input>
                  </div>)
                  })}
                </div>
              );
            })}
            </div>
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
  );
}
