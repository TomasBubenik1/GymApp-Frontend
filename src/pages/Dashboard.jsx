import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';


const Dashboard = () => {
  const cookies = new Cookies
  const [userData, setUserData] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    async function fetchLoggedInData(){
      try {
        const response = await axios.get('http://localhost:5000/api/getloggedinuser', {
          withCredentials: true,
        });
        setUserData(response.data.sessiondata.Data.user);
        setSessionId(response.data.sessionId);
        console.log(userData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLoggedInData();
  }, []);

  async function Logout(){
    try{
      await axios.post('http://localhost:5000/api/auth/logout').then(cookies.remove('connect.sid'),alert("Logged out sucessfully"))
  }catch(error){
    alert(error)
  }
  }
  
  if(userData){
    return(
      <body className='flex'>
      <nav className='w-32 bg-gray-900 h-screen'>
        <div className='flex flex-col justify-between h-full'>
          <div className='flex mt-2 flex-col justify-center items-center'>
            <a className='text-2xl font-semibold text-white'>Muscle</a>
            <a className='text-2xl font-semibold text-white'>Tracker</a>
          </div>
          <div className='flex flex-col justify-center flex-grow-1 gap-10 items-center'>
            <span className="material-icons "id='btnWidgets'>space_dashboard</span>
            <span className="material-symbols-outlined" id='btnWidgets'>analytics</span>
            <span className="material-symbols-outlined" id='btnWidgets'>groups</span>
            <span className="material-symbols-outlined" id='btnWidgets'>fitness_center</span>
           
          </div>
          <div className='flex flex-col items-center gap-8 justify-center mb-2'>
            <span className="material-symbols-outlined" id='btnWidgets'>settings</span>
            <span className="material-symbols-outlined" id='btnWidgets' onClick={Logout}>logout</span>
          </div>
        </div>
      </nav>
      <main className='w-screen'>
      <nav className='w-full bg-slate-600 h-20'>
      <div className='flex items-center h-full '>
        <h1 className='text-3xl text-white font-bold ml-5'>Dashboard</h1>
      </div>
      <div>
       
      </div>
      </nav>
      </main>
    </body>

    )
  }
  if(!userData){
    <p>Please sign in</p>
  }
};

export default Dashboard;
