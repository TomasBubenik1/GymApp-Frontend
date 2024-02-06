import React from 'react'
import { useState } from 'react';


export default function SoonerPopUp(){

    const [showPopUp,setShowPopUp] = useState(false);


function popUp(){ 
    const a = document.getElementById("popup")
    if(a){
        a.style.transform = "translateY(100px)"
    }
    setTimeout(3000)
    if(a){
        a.style.transform = "translateY(0px)"
    }

}
    return(
        
        <div id="popup" className='w-42 h-12 border-gray-500 fixed text-3xl text-text -bottom-10 right-0'>
            <p>afifjdsai</p>
        </div>
    )

}