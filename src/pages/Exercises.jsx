import { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'

export default function Exercises(){
    
    const [exercises,setExercises] = useState(null)

    async function fetchExercises(){
        await axios.get('https://api.api-ninjas.com/v1/exercises?muscle=').then(response =>{setExercises(response)})
    }
    fetchExercises()
    console.log(exercises)

    return(
    <body className='flex'>
    <Navbar/>
    <main className='w-screen'>
      <nav className='w-full bg-slate-600 h-20'>
      <div className='flex items-center h-full '>
        <h1 className='text-3xl text-white font-bold ml-5'>Exercises</h1>
      </div>
      <div>
       
      </div>
      </nav>
      </main>
    <p>a</p>
    </body>
    )
}

