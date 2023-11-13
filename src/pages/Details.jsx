


export default function ExercisedDtails(id){
    async function getExerciseDetails(){
        exercise = await axios.post('http://localhost:5000/api/getoneexercise',{
            exerciseId:id
        })
    }

    return(
    <main>
        

    </main>)
}