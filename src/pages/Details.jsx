import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ExerciseDetails() {
  const [exerciseData, setExerciseData] = useState([]);

  let { id } = useParams();
  id = parseInt(id);

  async function getExerciseDetails() {
    const exercise = await axios.post(
      "http://localhost:5000/api/getoneexercise",
      {
        exerciseId: id,
      }
    );
    setExerciseData(exercise.data.data);
  }

  useEffect(() => {
    getExerciseDetails();
  }, []);

  const formattedName = exerciseData.name?.replace(/[\s/()]/g, "_") || "";
  console.log(exerciseData);
  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar currentSite={"exercises"} />
      <main className="flex-grow ml-5 bg-backgroundcolor">
        <nav className="w-full h-20 flex justify-between items-center bg-white bg-opacity-10 rounded-2xl">
          <div className="flex items-center">
            <h1 className="text-3xl text-text font-bold ml-5">
              Exercise Details
            </h1>
          </div>
        </nav>
        <div className="flex flex-col items-center">
          <h1 className="text-text text-3xl font-semibold">
            {exerciseData.name}
          </h1>
          <img
            className=" rounded-lg rounded-b-none aspect-square w-96 h-96"
            src={`https://ik.imagekit.io/bubenik/exercises/${formattedName}/1.jpg`}
            alt={exerciseData.name}
          />
          <p className=" text-text w-1/2 mt-5">{exerciseData.instructions}</p>
        </div>
      </main>
    </div>
  );
}
