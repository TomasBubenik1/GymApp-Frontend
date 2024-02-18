import axios from "axios";
import Navbar from "../../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileBox from "../../components/ProfileBox";

export default function ExerciseDetails() {
  const [exerciseData, setExerciseData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

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

  async function fetchLoggedInData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getloggedinuser",
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setUserData(response.data.UserData);
      setNotificationCount(response.data.UserData.receivedNotifications.length);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  useEffect(() => {
    getExerciseDetails();
    fetchLoggedInData();
  }, []);

  const formattedName = exerciseData.name?.replace(/[\s/()]/g, "_") || "";
  console.log(exerciseData);
  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar currentSite={"exercises"} username={userData.username} notificationCount={notificationCount} />
      <main className="grow bg-backgroundcolor">
        <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
          <h1 className="text-3xl text-text font-bold ml-5">Exercises</h1>
          <div className="">
            <ProfileBox
              nickname={userData.nickname}
              profilepic={userData.profilepicture}
              username={userData.username}
            ></ProfileBox>
          </div>
        </nav>
        <div className=" flex flex-col justify-center items-center">
          <p className="text-text text-3xl">{exerciseData.name}</p>
          <img
            className=" rounded-2xl  aspect-square w-96 h-96 border border-gray-800"
            src={`https://ik.imagekit.io/bubenik/exercises/${formattedName}/1.jpg`}
            alt={exerciseData.name}
          />
          <p className="text-text text-[1rem] max-w-[50vw]">
            {exerciseData.instructions}
          </p>
        </div>
      </main>
    </div>
  );
}
