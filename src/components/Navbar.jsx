import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'


function Navbar(){

    async function Logout(){
        try{
          await axios.post('http://localhost:5000/api/auth/logout').then(cookies.remove('connect.sid'),alert("Logged out sucessfully"))
      }catch(error){
        alert(error)
      }
      }
    

    const cookies = new Cookies
    return(
        <nav className='w-32 bg-gray-900 h-screen'>
        <div className='flex flex-col justify-between h-full'>
          <div className='flex mt-2 flex-col justify-center items-center'>
            <a className='text-2xl font-semibold text-white'>Muscle</a>
            <a className='text-2xl font-semibold text-white'>Tracker</a>
          </div>
          <div className='flex flex-col justify-center flex-grow-1 gap-10 items-center'>
            <Link to={'/dashboard'}><span className="material-icons "id='btnWidgets'>space_dashboard</span></Link>
            <span className="material-symbols-outlined" id='btnWidgets'>analytics</span>
            <span className="material-symbols-outlined" id='btnWidgets'>calendar_today</span>
            <span className="material-symbols-outlined" id='btnWidgets'>groups</span>
            <Link to={'/exercises'}><span className="material-symbols-outlined" id='btnWidgets'>fitness_center</span></Link>
            
           
          </div>
          <div className='flex flex-col items-center gap-8 justify-center mb-2'>
            <span className="material-symbols-outlined" id='btnWidgets'>settings</span>
            <Link to={'/login'}><span className="material-symbols-outlined" id='btnWidgets' onClick={Logout}>logout</span></Link>
          </div>
        </div>
      </nav>
    )
}

export default Navbar