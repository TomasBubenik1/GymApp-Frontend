import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'


function Navbar(currentSite){

    async function Logout(){
        try{
          await axios.post('http://localhost:5000/api/auth/logout').then(cookies.remove('connect.sid'),alert("Logged out sucessfully"))
      }catch(error){
        alert(error)
      }
      }
    

    const cookies = new Cookies
    return(
        <nav className='w-32 h-screen sticky top-0 bg-white bg-opacity-10 rounded-md h-f justify-between flex flex-col items-center'>
          <a className='text-3xl font-semibold text-accent mt-2 self-center text-center'>Muscle Tracker</a>
          <div className='flex flex-col justify-center flex-grow-1 gap-10 items-center'>
            <Link to={'/dashboard'}><span className="material-symbols-outlined text-navIcons text-accent">space_dashboard</span></Link>
            <span className="material-symbols-outlined text-navIcons text-primary">analytics</span>
            <span className="material-symbols-outlined text-navIcons text-primary">calendar_today</span>
            <span className="material-symbols-outlined text-navIcons text-primary">groups</span>
            <Link to={'/exercises'}><span className="material-symbols-outlined text-navIcons text-primary">fitness_center</span></Link>
          </div>
          <div className='flex flex-col items-center gap-8 justify-center mb-2'>
          <span className="material-symbols-outlined text-navIcons text-primary">settings</span>
            <Link to={'/login'} onClick={Logout}><span className="material-symbols-outlined text-navIcons text-primary">logout</span></Link>
          </div>
        </nav>
        
    )
}

export default Navbar