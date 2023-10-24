import { Outlet,Navigate } from 'react-router-dom';
import Cookies from "universal-cookie";

function PrivateRoute(){
    const cookies = new Cookies();
    const isAuth = cookies.get("connect.sid");
    return(
        isAuth ? <Outlet/>: <Navigate to='login'/>
    )

}

export default PrivateRoute