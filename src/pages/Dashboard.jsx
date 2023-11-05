import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  


  const [userData, setUserData] = useState([]);
  const [exercises,setExercises] = useState([]);
  const [workoutPlans,setWorkoutPlans] = useState([]);

   useEffect(() => {
   
    fetchLoggedInData();
  }, []);


  

  async function fetchLoggedInData(){
    try {
      const response = await axios.get('http://localhost:5000/api/getloggedinuser', {
        withCredentials: true,
      });
      setUserData(response.data.sessiondata.sess.user)
      setWorkoutPlans(response.data.exercisePlans)
    } catch (error) {
      console.error('Error fetching logged in user data:', error);
    }
  };
  

 console.log(workoutPlans)
    return (
  <div className='flex bg-backgroundcolor'>
    <Navbar currentsite={"Dashboard"}/>
    <main className='w-screen ml-5'>
    <nav className='w-full h-20 flex justify-between items-center bg-white bg-opacity-5 rounded-2xl'>
      <div className='flex items-center'>
        <h1 className='text-3xl text-text font-bold ml-5'>Dashboard</h1>
      </div>
      <div className='text-3xl flex items-center gap-2'>
        <h1 className='text-stone-300'>Welcome back</h1>
        <h1 className=' text-accent font-semibold mr-3'>{userData.name}!</h1>
      </div>
    </nav>
        <div>
          {workoutPlans.map((workoutplan,index)=>{
            return(
           <div key={index}>
              <div>
              <p className='text-3xl'>{workoutplan.title}</p>
              {workoutplan.exercises.map((exercise,index)=>{
                return(<div key={index}>
                  <p>{exercise.name}</p>
                  </div>)
              })}
              </div>
           </div>
            )
          })}
                    
        </div>
    </main>
  </div>
);
    }
  

export default Dashboard;
