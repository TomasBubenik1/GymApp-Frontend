import React, { useState } from 'react';

export default function DropdownMenuFilter({ label, selectedOption, options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex flex-col w-full h-full rounded-md bg-white bg-opacity-10' onClick={() => setIsOpen(!isOpen)}>
      <label className='text-base text-gray-400 ml-6 font-semibold mt-3 self-start'>{label}</label>
      <div className='text-lg text-white font-semibold flex w-full'>
        <p className='flex-grow pl-6'>{selectedOption}</p>
        <span className="material-symbols-outlined pr-4">expand_more</span>
      </div>
      {isOpen && (
        <div className="mt-6 w-full text-white bg-[#1a1a1a] relative rounded-md p-2 justify-center flex flex-col items-center">
          {options.map((option, i) => {
if(selectedOption === option){return(<p className='font-semibold' onClick={()=>onSelect(null)}>{option}</p>)}
else{return(<p className='' onClick={()=>onSelect(option)}>{option}</p>)}
          })}
        </div>
      )}
    </div>
  );
}