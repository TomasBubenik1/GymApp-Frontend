import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import BarChartComponent from '../components/Charts/TotalWeightLifted';
import SingleExerciseChart from '../components/Charts/TotalWeightLifted';
import Avatar from '@mui/joy/Avatar';

function Dashboard(){

  


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
  
    return (
  <div className='flex bg-backgroundcolor w-full'>
    <Navbar currentSite={"dashboard"}/>
    <main className=' grow bg-backgroundcolor'>
    <nav className='w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700'>
        <h1 className='text-3xl text-text font-bold ml-5'>Dashboard</h1>
        <div className="">
            <div className="mr-5 p-2 pb-1 bg-backgroundcolor rounded-xl flex border border-gray-700 pt-1 pr-1 pl-5">
              <Avatar style={{width:"30px",height:"28px",marginTop:"2px"}} variant='outlined' src={`${userData.profilepicture}?tr=w-30,h-30`} >TB</Avatar>
              <h1 className="text-text font-semibold mt-1 ml-2 ">{userData.name}</h1>
              <span className="material-symbols-outlined pr-4 text-white mt-2 ml-1">
                    expand_more
                  </span>
            </div>
          </div>
    </nav>
        <div className='ml-5'>
          <SingleExerciseChart></SingleExerciseChart>
                    
        </div>
    </main>
  </div>
);
    }
  

export default Dashboard;
