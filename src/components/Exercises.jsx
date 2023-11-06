import React from 'react';

export default function Exercises({ exercises, loading }) {
  if (loading) {
    return (
      <h2>Loading</h2>
    );
  }
  return (
    <div className='grid row-auto grid-cols-3 p-3 gap-5'>
      {exercises.map((exercise, index) => {
        const formattedName = exercise.name.replace(/[\s/]/g, '_'); // Replace both spaces and forward slashes
        return (
          <div key={index} className=' border-2 border-primary rounded-lg'>
            <div>
            <img  className=' rounded-lg rounded-b-none aspect-square' style={{width:'100%',height:'250px'}} src={`https://ik.imagekit.io/bubenik/exercises/${formattedName}/1.jpg`}alt={exercise.name}/>
            </div>
            <div className='text-center font-semibold bg-primary'>
              <h1 className='text-lg text-text'>{exercise.name}</h1>
              <button className='text-text'onClick={() => {console.log(exercise.name)}}>Add</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
