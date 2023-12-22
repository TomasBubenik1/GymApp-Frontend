import { useState,useEffect } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import Exercises from '../components/Exercises'
import Pagination from '../components/Pagination'
import DropdownMenuFilter from '../components/Dropdown'


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
      if (selectedOptions.selectedPrimaryMuscle != null){payload.selectedPrimaryMuscle = selectedOptions.selectedPrimaryMuscle}else{payload.selectedPrimaryMuscle=[]}
      if (selectedOptions.selectedCategory){payload.selectedCategory = selectedOptions.selectedCategory.toLowerCase()}
      if(Object.keys(payload).length < 0 ){return}

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
        setOpenCategory(false)
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
  <Navbar currentSite={"exercises"}/>
  <main className='flex-grow ml-5 bg-backgroundcolor'>
    <nav className='w-full h-20 flex justify-between items-center bg-white bg-opacity-10 rounded-2xl'>
      <div className='flex w-full'>
        <h1 className='text-3xl text-text font-bold ml-5'>Exercises</h1>
        <span className="material-symbols-outlined pr-4 text-4xl self-end text-end text-accent justify-end align-middle items-end">account_circle</span>
      </div>
      
    </nav>
    <div>
      <div>
      <div className='text-2xl flex items-center gap-2 mt-3'>
        <h1 className='text-stone-300'>Welcome back</h1>
        <h1 className=' text-accent font-bold mr-3'>{userData.name}!👋</h1>
      </div>
        <div className='h-20 flex gap-3 mt-6 mb-5'>
          
          
          <DropdownMenuFilter label={"Level"} onSelect={(selectedSkillLevel)=> setSelectedOptions((prevOptions)=>({...prevOptions,selectedSkillLevel}))} selectedOption={selectedOptions.selectedSkillLevel} options={skillLevels}/>
          <DropdownMenuFilter label={"Force"} onSelect={(selectedForce)=>setSelectedOptions((prevOptions)=>({...prevOptions,selectedForce}))} selectedOption={selectedOptions.selectedForce} options={forces}/>
          <DropdownMenuFilter label={"Equipment"} onSelect={(selectedEquipment) => setSelectedOptions((prevOptions) => ({ ...prevOptions, selectedEquipment }))} selectedOption={selectedOptions.selectedEquipment} options={equipments}/>
          <DropdownMenuFilter label={"Primary Muscle"} onSelect={(selectedPrimaryMuscle)=> setSelectedOptions((prevOptions)=>({...prevOptions,selectedPrimaryMuscle}))} selectedOption={selectedOptions.selectedPrimaryMuscle} options={muscles}></DropdownMenuFilter>
          <DropdownMenuFilter label={"Category"} onSelect={(selectedCategory)=> setSelectedOptions((prevOptions)=>({...prevOptions,selectedCategory}))}selectedOption={selectedOptions.selectedCategory} options={categories}></DropdownMenuFilter>
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
        <div className='flex w-full align-middle justify-end gap-3'>
        <span className="material-symbols-outlined text-gray-400 bg-[#1a1a1a] p-2 rounded-lg">
        arrow_back_ios
</span>
<span className="material-symbols-outlined text-gray-400 bg-[#1a1a1a] p-2 rounded-lg mr-5">
        arrow_forward_ios
</span>
</div>
        <Exercises exercises={currentExercises} loading={loading} workoutPlanId={selectedWorkoutPlanId} userId={userData.id}></Exercises>
      </div>
      <Pagination></Pagination>
      
    </div>
   
  </main>

</div>
    )
    
}

  