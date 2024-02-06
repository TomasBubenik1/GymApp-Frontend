import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "@mui/joy/Avatar";
import ProfileBox from "../components/ProfileBox";

export default function ProfilePage() {
  let { id } = useParams();
  id = parseInt(id);

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchLoggedInData();
  }, []);

  async function fetchLoggedInData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getloggedinuser",
        {
          withCredentials: true,
        }
      );
      setUserData(response.data.sessiondata.sess.user);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar currentSite={"dashboard"} />
      <main className=" grow bg-backgroundcolor">
        <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
          <h1 className="text-3xl text-text font-bold ml-5">Dashboard</h1>
          <div className="">
            <ProfileBox
              nickname={userData.nickname}
              profilepic={userData.profilepicture}
            ></ProfileBox>
          </div>
        </nav>
      </main>
    </div>
  );
}
