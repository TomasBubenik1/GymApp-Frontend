import axios from 'axios'
import { useState } from 'react'
import React from 'react';



export default function NewWorkoutPlanDialog(userId,{isWorkOutOpen}){

    const [workoutPlanTitle,setWorkoutTitle] = useState('')
    const [workoutPlanDescription,setWorkoutDescription] = useState('')

    const handleTitleChange = (e) => {
        setWorkoutTitle(e.target.value);
      };
    
      const handleDescriptionChange = (e) => {
        setWorkoutDescription(e.target.value);
      };

    async function handleCreateWorkoutPlan(){
        try{
          console.log("pressed")
          const response = await axios.post('http://localhost:5000/api/createworkoutplan',{
            title:workoutPlanTitle,
            description:workoutPlanDescription,
            userId: userId.userId
  
          })
          console.log(response)
        }catch(error){
          console.error('Error while creating workout plan',error)
        }
      }


    return(
    <div  className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-70 bg-black">
      <div className=" rounded-md bg-[#18181B] flex flex-col" style={{height:'48vh',width:'36vw'}}>
      <span className="material-symbols-outlined pr-4 text-white self-end p-2" onClick={event => isWorkOutOpen(false)}>close</span>
        <h1 className='text-white text-2xl p-1 ml-14 font-semibold'>Create Workout Plan</h1>
        
        <label className='text-white font-semibold ml-16 mb-3 mt-3'>Title</label>
        <input  onChange={handleTitleChange} type='text' placeholder='Title' className=' text-white p-1 bg-[#18181B] border rounded-md self-center align-middle' style={{width:'80%'}}/> 
        <label className='text-white font-semibold ml-16 mb-3 mt-5' >Description</label>
        <textarea  onChange={handleDescriptionChange} className='bg-[#18181B] border rounded-md  self-center text-white' placeholder='Description' style={{width:'80%', height:'20%'}}></textarea>
        <div className='flex grow w-full justify-end items-end gap-2'>
        <button  className='mb-5 rounded-md text-white text-sm font-semibold bg-[#2f2f35] w-20 h-8' onClick={event => isWorkOutOpen(false)}>Cancel</button>
        <button onClick={handleCreateWorkoutPlan} disabled={workoutPlanTitle.length < 3} className=' disabled:opacity-50 disabled:bg-[#2f2f35]   mb-5 mr-5 rounded-md text-white text-sm font-semibold bg-accent w-20 h-8'>Create</button>
        </div>
      </div>
    </div>
    )
    
}