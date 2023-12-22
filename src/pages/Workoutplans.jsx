import React from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import "../styles/UtilStyles.css"




export default function WorkoutPlans() {

  const [userData, setUserData] = useState("user");
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [userExerciseData,setUserExerciseData] = useState([])

  const [selectedWorkoutPlan, selectWorkoutPlan] = useState([]);
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [workoutPlanTitle, setWorkoutTitle] = useState("");
  const [workoutPlanDescription, setWorkoutDescription] = useState("");
  const [changesPayload,updateChangesPayload] = useState([])
  const [newDatasPayload,updateNewDataPayload] = useState([])
  




//userId,exerciseId,newWeight,newReps,newSets

//loop trough and call this function n times
// for( of changesPayload){
//   async function handleApplyChanges(){
//     try{
//       response = await axios.post('http://localhost:5000/api/updateexercisedata',{
//         userId:userData.id,
//         exerciseId:changePayload.exerciseId,
//         newWeight:changePayload.weight,
//         newReps:changePayload.reps,
//         newSets:changePayload.sets
        
//       })

//     }catch(error){
//       alert("There was error applying changes",error)
//     }
//   }
// }


function handleApplyChanges() {
  console.log("Applied changes")
  const changesArray = Object.values(changesPayload);
  const newDataArray = Object.values(newDatasPayload)
  
  changesArray.forEach(async (changePayload) => {
    console.log(changePayload)
    })
  newDataArray.forEach(async (newDataPayload)=>{
    console.log(newDataPayload.weight)
    if(newDataPayload.weight == undefined){alert("You must specify the weight when setting the data on exercise you havent done before..")}
    if(newDataPayload.reps == undefined){alert("You must specify the reps when setting the data on exercise you havent done before..")}
    if(newDataPayload.sets == undefined){alert("You must specify the sets when setting the data on exercise you havent done before..")}
    else{
      axios.post("http://localhost:5000/api/addexercisedata",{
      userId:userData.id,
      exerciseId:newDataPayload.exerciseId,
      weight:parseFloat(newDataPayload.weight),
      reps:parseInt(newDataPayload.reps),
      sets:parseInt(newDataPayload.sets),
    })}})}



const handleNewReps = (exerciseId, e) => {
  const newReps = e.target.value;
  console.log(newReps)
  
  updateNewDataPayload((prevChangesPayload) => ({
    ...prevChangesPayload,
    [exerciseId]: {
      ...prevChangesPayload[exerciseId],
      reps: newReps,
      exerciseId: exerciseId,

    },
  }));
  console.log(newDatasPayload)
};

const handleNewSets = (exerciseId, e) => {
  const newSets = e.target.value;
  
  updateNewDataPayload((prevChangesPayload) => ({
    ...prevChangesPayload,
    [exerciseId]: {
      ...prevChangesPayload[exerciseId],
      sets: newSets,
      exerciseId: exerciseId,

    },
  }));
  console.log(newDatasPayload)
};

const handleNewWeight = (exerciseId, e) => {
  const newWeight = e.target.value;
  
  updateNewDataPayload((prevChangesPayload) => ({
    ...prevChangesPayload,
    [exerciseId]: {
      ...prevChangesPayload[exerciseId],
      weight: newWeight,
      exerciseId: exerciseId,

    },
  }));
  console.log(newDatasPayload)
};


const handleWeightChange = (selectedWorkoutPlan,exerciseId,e) => {
  const newWeight = parseFloat(e.target.value);
  updateChangesPayload((prevChangesPayload) => ({
    ...prevChangesPayload,
    [exerciseId]: {
      ...prevChangesPayload[exerciseId],
      weight: newWeight,
      exerciseId: exerciseId,
      
    },
  }));
selectedWorkoutPlan.exercises.map((exercise,i)=>{if(exercise.id==exerciseId){
  setUserExerciseData((prevUserExerciseData)=>({
    ...prevUserExerciseData,
    weight:newWeight
  }))
}})



};

const handleRepschange = (exerciseId, e) => {
  const newReps = (e.target.value);
  updateChangesPayload((prevChangesPayload) => ({
    ...prevChangesPayload,
    [exerciseId]: {
      ...prevChangesPayload[exerciseId],
      reps: newReps,
      exerciseId: exerciseId,
      
    },
  }));
  setUserExerciseData((prevuserExerciseData) => {
    const updatedHistory = prevuserExerciseData.map((exercise) => {
      if (exercise.exerciseId === exerciseId) {
        return {
          ...exercise,
          reps: newReps,
          exerciseId: exerciseId,

        };
      }
      return exercise;
    });
    return updatedHistory;
  });
  console.log(userExerciseData)
};
const handleSetschange = (exerciseId, e) => {
  const newSets = (e.target.value)
  updateChangesPayload((prevChangesPayload) => ({
    ...prevChangesPayload,
    [exerciseId]: {
      ...prevChangesPayload[exerciseId],
      sets: newSets,
      exerciseId: exerciseId,
      
    },
  }));
  setUserExerciseData((prevuserExerciseData) => {
    const updatedHistory = prevuserExerciseData.map((exercise) => {
      if (exercise.exerciseId === exerciseId) {
        return {
          ...exercise,
          sets: newSets,
        };
      }
      return exercise;
    });
    return updatedHistory;
  });
  console.log(userExerciseData)
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
      setUserData(response.data.sessiondata.sess.user);
      setWorkoutPlans(response.data.exercisePlans);
      setUserExerciseData(response.data.userExerciseData)
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
            <div className="text-text w-full text-md flex sm:gap-40 gap-52 p-10">
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
            <div className=' gap-5 rounded-2xl bg-[#18181B] sm:xh-96 sm:mt-20 sm:w-exerciseListContainer  sm:ml-10 mt-40 ml-24'>
            <div className='items-center flex flex-col mt-10'></div>
            {selectedWorkoutPlan.exercises.map((exercise, i) => {
              if(exercise.userExerciseData.length == 0){
              return (
                <div className=" align-middle border-white flex gap-1 bg-backgroundcolor w-6/7 h-10 mr-10 mt-5 ml-6 rounded-sm">
                  <Checkbox {...label} color="success" sx={{
                      color: "#18181B",
                      marginTop:"5px"
                     }}/>
                  <p className="text-text text-xl self-center w-60 ">{exercise.name}</p>
                  <input type='number' className=' bg-transparent w-16' onChange={(e)=>{handleNewWeight(exercise.id,e)}}></input><p>kg</p>
                </div>
              );
                }
                else{
                  return(
                    <div className=" align-middle border-white flex gap-1 bg-backgroundcolor w-6/7 h-10 mr-10 mt-5 ml-6 rounded-sm">
                  <Checkbox {...label} color="success" sx={{
                      color: "#18181B",
                      marginTop:"5px"
                     }}/>
                  <p className="text-text text-xl self-center w-60 ">{exercise.name}</p>
                  <input type='number' onChange={(e)=>{handleWeightChange(selectedWorkoutPlan,exercise.id,e)}} className=' bg-transparent w-14 text-text' value={exercise.userExerciseData[0].weight}></input><p className=' text-gray-700'>Kg</p>
                  <input type='number' onChange={handleRepschange} className=' bg-transparent w-14 text-text' value={exercise.userExerciseData[0].reps}></input><p className=' text-gray-700'>Reps</p>
                  <input type='number' onChange={handleSetschange} className=' bg-transparent w-14 text-text' value={exercise.userExerciseData[0].sets}></input><p className=' text-gray-700'>Sets</p>
                     
                </div>
                  )
                }
            })}
              <div className='text-text'>
                <div className=' flex justify-center mt-5 mb-5'>
                <button><span className="material-symbols-outlined mt-3 text-text text-4xl">add</span></button>
                </div>
              </div>
            </div>
          </div>
          
        )}
        
        {
          Object.keys(changesPayload).length != 0 &&(
          <div className='flex justify-end mr-28 mt-5'>
          <button className='p-3 bg-accent text-text rounded-lg self' onClick={handleApplyChanges}>
            Apply changes
          </button>
          </div>
          )
        }
        {/* {
          Object.keys(changesPayload).length != 0 &&(
            <div className=' w-56 h-40  bg-[#1a1a1a] flex flex-col rounded-lg'>
              <div>
                <div className='flex'><span className="material-symbols-outlined mt-3 ml-5 text-yellow-500 text-4xl">report</span><p className=' text-text text-lg font-semibold mt-5 text-center'>Save Changes?</p></div>
                <p className='text-white text-opacity-75 text-center'>Would you like to save your changes before exiting?</p>
              </div>
              <div className='flex align-middle content-between justify-evenly gap-2  '>
                <button className=' relative text-text text-base rounded-lg w-1/2 font-semibold bg-gray-800 ml-2' onClick={()=>{}}>Discard</button>
                <button className=' relative text-text text-base rounded-lg w-1/2 font-bold bg-accent mr-2 p-3 text-center self-center items-center justify-center' onClick={()=>{}}>Save</button>
              </div>
            </div>
          )
        } */}
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
