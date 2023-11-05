import { useState,useEffect } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import Exercises from '../components/Exercises'
import Pagination from '../components/Pagination'


export default function ExercisePage(){


    const [openSkillLevel,setOpenSkillLevel] = useState(false)
    const [openForce,setOpenForce] = useState(false)
    const [openEquipment,setOpenEquipment] = useState(false)
    const [openPrimaryMuscle,setOpenPrimaryMuscle] = useState(false)
    const [openCategory,setOpenCategory] = useState(false)

    const [selectedSkillLevel,setSkillLevel] = useState('')
    const [selectedForce,setForce] = useState('')
    const [selectedEquipment,setEquipment] = useState('')
    const [selectedPrimaryMuscle,setPrimaryMuscle] = useState('')
    const [selectedCategory,setCategory] = useState('')
    

    const [exercises,setExercises] = useState([])
    const [loading,setLoading] = useState(false)
    const [currentPage,setCurrentPage] = useState(1)
    const [exercisesPerPage,setExercisesPerPage] = useState(21)
    const [userData, setUserData] = useState('user');
    const [workoutPlans,setWorkoutPlans] = useState([]);


  const skillLevels = [
    "Beginner",
    "Intermediate",
    "Expert"

  ]

  const forces = [
    "Push",
    "Pull",
    "Static"
  ]

    const categories = [
    "Strength",
    "Streching",
    "Plyometrics",
    "Strongman",
    "Powerlifting",
    "Cardio",
    "Crossfit",
    "Olympic Weightlifting",
    "Weighted Bodyweight",
    "Assisted bodyweight"
    ];

    const muscles = [
      "Abdominals",
      "Hamstrings",
      "Calves",
      "Shoulders",
      "Adductors",
      "Glutes",
      "Quadriceps",
      "Biceps",
      "Forearms",
      "Abductors",
      "Triceps",
      "Chest",
      "Lower back",
      "Traps",
      "Middle back",
      "Lats",
      "Neck",
    ];
    
    const equipments = [
      "Body only",
      "Machine",
      "Kettlebells",
      "Dumbbell",
      "Cable",
      "Barbell",
      "Bands",
      "Medicine ball",
      "Exercise ball",
      "E-z curl bar",
      "Foam roll",
    ];
    

    useEffect(() => {

      fetchLoggedInData();
      fetchExerciseData();
    }, []);
  

    async function fetchExerciseData(){
      try{
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/getallexercises');
        setExercises(response.data.Exercisesdata);
        setLoading(false);
        
      }catch(err){
        console.error('Error fetching exercise data')
      }
    }

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




    
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise-exercisesPerPage
    const currentExercises = exercises.slice(indexOfFirstExercise,indexOfLastExercise)

    
    return(
      <div className='flex bg-backgroundcolor w-full'>
  <Navbar currentsite = {"ExercisePage"}/>
  <main className='flex-grow ml-5 bg-backgroundcolor'>
    <nav className='w-full h-20 flex justify-between items-center bg-white bg-opacity-5 rounded-2xl'>
      <div className='flex items-center'>
        <h1 className='text-3xl text-text font-bold ml-5'>Exercises</h1>
      </div>
      <div className='text-3xl flex items-center gap-2'>
        <h1 className='text-stone-300'>Welcome back</h1>
        <h1 className=' text-accent font-semibold mr-3'>{userData.name}!</h1>
      </div>
    </nav>
    <div>
      <div>
        <div className='h-32 items-center flex mb-16 flex-wrap'>
          <div className='ml-5 flex flex-col w-56 h-20  rounded-md bg-white bg-opacity-5' onClick={() => setOpenSkillLevel(!openSkillLevel)}>
            <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Skill Level</label>
            <div className=''>
            <div className='text-lg text-white font-semibold flex w-full'>
              <p className='flex-grow pl-6'>{selectedSkillLevel}</p>
            <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>
           {openSkillLevel && (
             <div className="mt-6 w-56 text-white bg-opacity-5 relative rounded-md p-2 justify-center flex flex-col items-center" style={{backgroundColor:'#0d0d0d'}}>
           {
            skillLevels.map((skillLevel,i)=>{
              if(skillLevel === selectedSkillLevel){
                return(
                <div>
                <p className='bg-opacity-0  font-semibold'  onClick={()=>{setSkillLevel('')}} key={i} value={skillLevel}>{skillLevel}</p>
                </div>
                )
              }
              return(
                <p className='bg-opacity-0'  onClick={()=>{setSkillLevel(skillLevel)}} key={i} value={skillLevel}>{skillLevel}</p>
                )
            })
           }
          </div>
           )
           }
            </div>
          </div>
          <div className='ml-5 flex flex-col w-56 h-20  rounded-md bg-white bg-opacity-5' onClick={() => setOpenForce(!openForce)}>
            <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Force</label>
            <div className='text-lg text-white font-semibold flex w-full'>
              <p className='flex-grow pl-6'>{selectedForce}</p>
            <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>
            {openForce && (
             <div className="mt-6 w-56 text-white bg-opacity-5 relative rounded-md p-2 justify-center flex flex-col items-center" style={{backgroundColor:'#0d0d0d'}}>
            {
              forces.map((force,i)=>{
                if(force === selectedForce){
                  return(
                  <div>
                  <p className='bg-opacity-0  font-semibold'  onClick={()=>{setForce('')}} key={i} value={force}>{force}</p>
                  </div>
                  )
                }
                return(
                  <p className='bg-opacity-0'  onClick={()=>{setForce(force)}} key={i} value={force}>{force}</p>
                  )
              })
            }
          </div>
           )
           }
          </div>
          <div className='ml-5 flex flex-col w-56 h-20  rounded-md bg-white bg-opacity-5' onClick={() => setOpenEquipment(!openEquipment)}>
            <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Equipment</label>
            <div className='text-lg text-white font-semibold flex w-full'>
              <p className='flex-grow pl-6'>{selectedEquipment}</p>
            <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>
            {openEquipment && (
            <div className="mt-6 w-56 text-white bg-opacity-5 relative rounded-md p-2 justify-center flex flex-col items-center" style={{backgroundColor:'#0d0d0d'}}>
           {
            equipments.map((equipment,i)=>{
              if(equipment === selectedEquipment){
                return(
                <div>
                <p className='bg-opacity-0  font-semibold'  onClick={()=>{setEquipment('')}} key={i} value={equipment}>{equipment}</p>
                </div>
                )
              }
              return(
                <p className='bg-opacity-0'  onClick={()=>{setEquipment(equipment)}} key={i} value={equipment}>{equipment}</p>
                )
            })
           }
          </div>
           )
           }
          </div>
          <div className='ml-5 flex flex-col w-56 h-20 rounded-md bg-white bg-opacity-5' onClick={() => setOpenPrimaryMuscle(!openPrimaryMuscle)}>
            <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Primary Muscle</label>
            <div className='text-lg text-white font-semibold flex w-full'>
              <p className='flex-grow pl-6'>{selectedPrimaryMuscle}</p>
            <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>
            {openPrimaryMuscle && (
             <div className="mt-6 w-56 text-white bg-opacity-5 relative rounded-md p-2 justify-center flex flex-col items-center" style={{backgroundColor:'#0d0d0d'}}>
            {
              muscles.map((muscle,i)=>{
                if(muscle === selectedPrimaryMuscle){
                  return(
                  <div>
                  <p className='bg-opacity-0  font-semibold'  onClick={()=>{setPrimaryMuscle('')}} key={i} value={muscle}>{muscle}</p>
                  </div>
                  )
                }
                return(
                  <p className='bg-opacity-0'  onClick={()=>{setPrimaryMuscle(muscle)}} key={i} value={muscle}>{muscle}</p>
                  )
              })
            }
          </div>
           )
           }
          </div>
          <div className='ml-5 flex flex-col w-56 h-20  rounded-md bg-white bg-opacity-5' onClick={() => setOpenCategory(!openCategory)}>
            <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Category</label>
            <div>
            <div className='text-lg text-white font-semibold flex w-full'>
              <p className='flex-grow pl-6'>{selectedCategory}</p>
            <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>
           {openCategory && (
            <div className="mt-6 w-56 text-white bg-opacity-5 relative rounded-md p-2 justify-center flex flex-col items-center" style={{backgroundColor:'#0d0d0d'}}>
              {
                
                categories.map((category,i)=>{
                  if(category === selectedCategory){
                    return(
                      <div>
                    <p className='bg-opacity-0 text-accent font-semibold'  onClick={()=>{setCategory('')}} key={i} value={category}>{category}</p>
                    </div>
                    )
                  }

                  return(
                  <p className='bg-opacity-0'  onClick={()=>{setCategory(category)}} key={i} value={category}>{category}</p>
                  )
                  
                })
              }
          </div>
           )
           }
            </div>
          </div>
          
          

        </div>
        <Exercises exercises={currentExercises} loading={loading}></Exercises>
      </div>
      <Pagination></Pagination>
    </div>
  </main>

</div>


    )
}

  