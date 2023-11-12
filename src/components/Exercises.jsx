import axios from 'axios';
import React from 'react';

export default function Exercises({exercises,loading,workoutPlanId,userId}) {
  if (loading) {
    return (
      <h2>Loading</h2>
    );
  }
  async function handleAddIntoExercisePlan(exerciseID){
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
        const formattedName = exercise.name.replace(/[\s/]/g, '_'); // Replace both spaces and forward slashes
        return (
          <div key={index} className=' rounded-lg'>
            <div>
            <img  className=' rounded-lg rounded-b-none aspect-square' style={{width:'100%',height:'250px'}} src={`https://ik.imagekit.io/bubenik/exercises/${formattedName}/1.jpg`}alt={exercise.name}/>
            </div>
            <h1 className='text-2xl text-text text-left font-semibold'>{exercise.name}</h1> 
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
