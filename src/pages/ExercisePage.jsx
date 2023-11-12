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
    const [openWorkoutPlans,setOpenWorkoutPlans] = useState(false)
    const [openCreateDialog,setOpenCreateDialog] = useState(false)

    const [selectedOptions, setSelectedOptions] = useState({
      selectedSkillLevel: null,
      selectedForce: null,
      selectedEquipment: null,
      selectedPrimaryMuscle: [],
      selectedCategory: null,
    });
    
    const [selectedWorkoutPlan,selectWorkoutPlan] = useState(null)
    const [selectedWorkoutPlanId,selectWorkoutPlanId] = useState(null)

    


    const [workoutPlanTitle,setWorkoutTitle] = useState('')
    const [workoutPlanDescription,setWorkoutDescription] = useState('')

    const [exercises,setExercises] = useState([])
    const [loading,setLoading] = useState(false)
    const [currentPage,setCurrentPage] = useState(1)
    const [exercisesPerPage,setExercisesPerPage] = useState(21)
    const [userData, setUserData] = useState('user');
    const [workoutPlans,setWorkoutPlans] = useState([]);

    const handleTitleChange = (e) => {
      setWorkoutTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
      setWorkoutDescription(e.target.value);
    };



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

    async function fetchSelectedExercises(){
      setLoading(true);
      const payload = {}
      if (selectedOptions.selectedSkillLevel){payload.selectedSkillLevel = selectedOptions.selectedSkillLevel.toLowerCase()}
      if (selectedOptions.selectedForce){payload.selectedForce = selectedOptions.selectedForce.toLowerCase()}
      if (selectedOptions.selectedEquipment){payload.selectedEquipment = selectedOptions.selectedEquipment.toLowerCase()}
      if (selectedOptions.selectedPrimaryMuscle.length > 0 ){payload.selectedPrimaryMuscle = selectedOptions.selectedPrimaryMuscle}else{payload.selectedPrimaryMuscle=[]}
      if (selectedOptions.selectedCategory){payload.selectedCategory = selectedOptions.selectedCategory.toLowerCase()}
      
      const response = await axios.post('http://localhost:5000/api/getfilteredexercises',payload);
      setExercises(response.data.filteredExercises);
      setLoading(false);
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

    async function handleCreateWorkoutPlan(){
      try{
        console.log("pressed")
        const response = await axios.post('http://localhost:5000/api/createworkoutplan',{
          title:workoutPlanTitle,
          description:workoutPlanDescription,
          userId: userData.id

        })
        console.log(response)
      }catch(error){
        console.error('Error while creating workout plan',error)
      }
    }



    
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise-exercisesPerPage
    const currentExercises = exercises.slice(indexOfFirstExercise,indexOfLastExercise)


    useEffect(() => {

      fetchLoggedInData();
      fetchExerciseData();
    }, []);

     
    useEffect(() => {
    console.log(selectedOptions)
    fetchSelectedExercises()
    }, [selectedOptions]);

  
   
    return(
      <div className='flex bg-backgroundcolor w-full'>
  <Navbar currentsite = {"ExercisePage"}/>
  <main className='flex-grow ml-5 bg-backgroundcolor'>
    <nav className='w-full h-20 flex justify-between items-center bg-white bg-opacity-10 rounded-2xl'>
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
        <div className='h-20 flex gap-3 mt-6 mb-5'>
          <div className='flex flex-col w-full h-full  rounded-md bg-white bg-opacity-10' onClick={() => setOpenSkillLevel(!openSkillLevel)}>
            <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Skill Level</label>
            <div className=''>
            <div className='text-lg text-white font-semibold flex w-full'>
              <p className='flex-grow pl-6'>{selectedOptions.selectedSkillLevel}</p>
            <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>
           {openSkillLevel && (
             <div className="mt-8 w-full text-white bg-[#1a1a1a] relative rounded-md p-2 justify-center flex flex-col items-center">
           {
            skillLevels.map((skillLevel,i)=>{
              if(skillLevel === selectedOptions.selectedSkillLevel){
                return(
                <div>
<p className='font-semibold' onClick={()=> setSelectedOptions((prevOptions)=> ({...prevOptions,selectedSkillLevel:null}))} key={i} value={skillLevel}>{skillLevel}</p>
                </div>
                )
              }
              return(
                <p className='bg-opacity-0'  onClick={()=> setSelectedOptions((prevOptions)=> ({...prevOptions,selectedSkillLevel:skillLevel}))} key={i} value={skillLevel}>{skillLevel}</p>
                )
            })
           }
          </div>
           )
           }
            </div>
          </div>
          <div className=' flex flex-col w-full h-full  rounded-md bg-white bg-opacity-10' onClick={() => setOpenForce(!openForce)}>
            <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Force</label>
            <div className='text-lg text-white font-semibold flex w-full'>
              <p className='flex-grow pl-6'>{selectedOptions.selectedForce}</p>
            <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>
            {openForce && (
             <div className="mt-6 w-full   text-white bg-[#1a1a1a] relative rounded-md p-2 justify-center flex flex-col items-center">
            {
              forces.map((force,i)=>{
                if(force === selectedOptions.selectedForce){
                  return(
                  <div>
                  <p className='bg-opacity-0  font-semibold'  onClick={()=> setSelectedOptions((prevOptions)=> ({...prevOptions,selectedForce:null}))} key={i} value={force}>{force}</p>
                  </div>
                  )
                }
                return(
                  <p className='bg-opacity-0'  onClick={()=> setSelectedOptions((prevOptions)=> ({...prevOptions,selectedForce:force}))} key={i} value={force}>{force}</p>
                  )
              })
            }
          </div>
           )
           }
          </div>
          <div className=' flex flex-col w-full h-full  rounded-md bg-white bg-opacity-10' onClick={() => setOpenEquipment(!openEquipment)}>
            <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Equipment</label>
            <div className='text-lg text-white font-semibold flex w-full'>
              <p className='flex-grow pl-6'>{selectedOptions.selectedEquipment}</p>
            <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>
            {openEquipment && (
            <div className="mt-6 w-full text-white bg-[#1a1a1a] relative rounded-md p-2 justify-center flex flex-col items-center">
           {
            equipments.map((equipment,i)=>{
              if(equipment === selectedOptions.selectedEquipment){
                return(
                <div>
                <p className='bg-opacity-0  font-semibold'  onClick={()=> setSelectedOptions((prevOptions)=> ({...prevOptions,selectedEquipment:null}))} key={i} value={equipment}>{equipment}</p>
                </div>
                )
              }
              return(
                <p className='bg-opacity-0'  onClick={()=> setSelectedOptions((prevOptions)=> ({...prevOptions,selectedEquipment:equipment}))} key={i} value={equipment}>{equipment}</p>
                )
            })
           }
          </div>
           )
           }
          </div>
          <div className=' flex flex-col w-full h-full rounded-md bg-white bg-opacity-10' onClick={() => setOpenPrimaryMuscle(!openPrimaryMuscle)}>
            <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Primary Muscle</label>
            <div className='text-lg text-white font-semibold flex w-full'>
              <p className='flex-grow pl-6'>{selectedOptions.selectedPrimaryMuscle}</p>
            <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>
            {openPrimaryMuscle && (
             <div className="mt-6 w-full text-white bg-[#1a1a1a] relative rounded-md p-2 justify-center flex flex-col items-center">
             {
              muscles.map((muscle,i)=>{
                if(selectedOptions.selectedPrimaryMuscle.includes(muscle)){
                  return(
                  <div>
                  <p className='bg-opacity-0  font-semibold' onClick={()=> setSelectedOptions((prevOptions)=> ({...prevOptions,selectedPrimaryMuscle: [] }))} key={i} value={muscle}>{muscle}</p>
                  </div>
                  )
                }
                return(
                    <p className='bg-opacity-0 w-full' onClick={() => setSelectedOptions((prevOptions) => ({ ...prevOptions, selectedPrimaryMuscle: [muscle] }))} key={i} value={muscle}>{muscle}</p>
                  )
              })
            }
          </div>
           )
           }
          </div>
          <div className=' flex flex-col w-full h-full  rounded-md bg-white bg-opacity-10' onClick={() => setOpenCategory(!openCategory)}>
            <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Category</label>
            <div>
            <div className='text-lg text-white font-semibold flex w-full'>
              <p className='flex-grow pl-6'>{selectedOptions.selectedCategory}</p>
            <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>
           {openCategory && (
            <div className="mt-6 w-full text-white bg-[#1a1a1a] relative rounded-md p-2 justify-center flex flex-col items-center">
              {
                
                categories.map((category,i)=>{
                  if(category === selectedOptions.selectedCategory){
                    return(
                      <div>
                    <p className='bg-opacity-0 text-accent font-semibold'  onClick={()=> setSelectedOptions((prevOptions)=> ({...prevOptions,selectedCategory:null}))} key={i} value={category}>{category}</p>
                    </div>
                    )
                  }

                  return(
                  <p className='bg-opacity-0'  onClick={()=> setSelectedOptions((prevOptions)=> ({...prevOptions,selectedCategory:category}))} key={i} value={category}>{category}</p>
                  )
                  
                })
              }
          </div>
           )
           }
            </div>
          </div>
          <div className=' flex flex-col w-full h-full  rounded-md bg-white bg-opacity-10' onClick={() => setOpenWorkoutPlans(!openWorkoutPlans)}>
          <label className='text-base  text-gray-400 ml-6 font-semibold mt-3 self-start'>Workout Plan</label>
          <div className='text-lg text-white font-semibold flex w-full'>
          <p className='flex-grow pl-6 text-base'>{selectedWorkoutPlan}</p>
          <span className="material-symbols-outlined pr-4">expand_more</span>
           </div>

           {openWorkoutPlans && (
                <div className="mt-6 w-full text-white bg-[#1a1a1a] relative rounded-md p-2 justify-center flex flex-col items-center">
                  {
                    workoutPlans.map((workoutplan,i)=>{
                      return(
                        <div className='' key={i} onClick={()=>(selectWorkoutPlan(workoutplan.title),selectWorkoutPlanId(workoutplan.id))}>
                          {workoutplan.title}
                        </div>
                      )
                    })
                  }
                  <div className='flex' onClick={() => setOpenCreateDialog(!openCreateDialog)}>
                  <p>Create new</p>
                  <span className="material-symbols-outlined text-white text-[30px]">add</span>
                  </div>
                </div>            
           )}
          </div>{openCreateDialog && (
  <div  className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-70 bg-black">
    <div className=" rounded-md bg-[#18181B] flex flex-col" style={{height:'48vh',width:'36vw'}}>
    <span className="material-symbols-outlined pr-4 text-white self-end p-2" onClick={()=> setOpenCreateDialog(false)}>close</span>
      <h1 className='text-white text-2xl p-1 ml-14 font-semibold'>Create Workout Plan</h1>
      
      <label className='text-white font-semibold ml-16 mb-3 mt-3'>Title</label>
      <input  onChange={handleTitleChange} type='text' placeholder='Title' className=' text-white p-1 bg-[#18181B] border rounded-md self-center align-middle' style={{width:'80%'}}/> 
      <label className='text-white font-semibold ml-16 mb-3 mt-5' >Description</label>
      <textarea  onChange={handleDescriptionChange} className='bg-[#18181B] border rounded-md  self-center text-white' placeholder='Description' style={{width:'80%', height:'20%'}}></textarea>
      <div className='flex grow w-full justify-end items-end gap-2'>
      <button  className='mb-5 rounded-md text-white text-sm font-semibold bg-[#2f2f35] w-20 h-8'>Cancel</button>
      <button onClick={handleCreateWorkoutPlan} disabled={workoutPlanTitle.length < 3} className=' disabled:opacity-50 disabled:bg-[#2f2f35]   mb-5 mr-5 rounded-md text-white text-sm font-semibold bg-accent w-20 h-8'>Create</button>
      </div>
    </div>
  </div>
)}

        </div>
        <Exercises exercises={currentExercises} loading={loading} workoutPlanId={selectedWorkoutPlanId} userId={userData.id}></Exercises>
      </div>
      <Pagination></Pagination>
      
    </div>
   
  </main>

</div>
    )
    
}

  