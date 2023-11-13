import axios from 'axios';
import React from 'react';

export default function Exercises({exercises,loading,workoutPlanId,userId}) {
  if (loading) {
    return (
      <h2>Loading</h2>
    );
  }
  async function handleAddIntoExercisePlan(exerciseID){
    if(!workoutPlanId){return alert("You must select workout plan in order to add exercise!")}

    const response = await axios.post('http://localhost:5000/api/addexerciseintoplan',{
      workoutPlanId:workoutPlanId,
      exerciseId:exerciseID,
      userId:userId
    })
    alert(response.data.message)

  }
  

  return (
    <div className='grid row-auto grid-cols-3 p-3 gap-5'>
      {exercises.map((exercise, index) => {
const formattedName = exercise.name.replace(/[\s/()]/g, '_'); // Replace spaces, forward slashes, and parentheses
return (  
          <div key={index} className=' rounded-lg border border-accent border-opacity-20 p-2'>
            <div>
            <img  className=' rounded-lg rounded-b-none aspect-square' style={{width:'100%',height:'250px'}} src={`https://ik.imagekit.io/bubenik/exercises/${formattedName}/1.jpg`}alt={exercise.name}/>
            </div>
            <h1 className='text-2xl text-text text-left font-semibold'>{exercise.name}</h1> 
            <p className='text-text text-lg'>{exercise.level.charAt(0).toUpperCase() + exercise.level.slice(1)}</p>
            <div className='flex gap-3'> 
            <div className='text-center font-semibold bg-[#18181B] p-2  self-center w-full rounded-md'>
            <button className='text-text text-center' onClick={() => handleAddIntoExercisePlan(exercise.id)}>Add</button>
            </div>
            <div className='text-center font-semibold bg-[#18181B] p-2  self-center w-full rounded-md' >
              <button className='text-text text-center'onClick={() => {console.log(exercise.name)}}>Details</button>
            </div>
            </div>
            
          </div>
        );
      })}
    </div>
  );
}
