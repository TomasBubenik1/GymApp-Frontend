import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {

  


  const [userData, setUserData] = useState([]);
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
  <div className='flex bg-backgroundcolor w-full'>
    <Navbar currentSite={"dashboard"}/>
    <main className='flex-grow ml-5 bg-backgroundcolor'>
    <nav className='w-full h-20 flex justify-between items-center bg-white bg-opacity-10 rounded-2xl'>
      <div className='flex items-center'>
        <h1 className='text-3xl text-text font-bold ml-5'>Dashboard</h1>
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
