import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  const [userData, setUserData] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    async function fetchLoggedInData(){
      try {
        const response = await axios.get('http://localhost:5000/api/getloggedinuser', {
          withCredentials: true,
        });
        setUserData()
        console.log(response.data.sessiondata.sess.user) 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLoggedInData();
  }, []);

 
  
  
    return(
      <body className='flex'>
      <Navbar/>
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
  

export default Dashboard;
