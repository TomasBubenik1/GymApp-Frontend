import Navbar from "../../components/Navbar";
import ProfileBox from "../../components/ProfileBox";
import axios from "axios";
import { useState } from "react";

export default function NotificationPage() {
  const [userData, setUserData] = useState(null);
  const [post, setPost] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  async function fetchLoggedInData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getloggedinuser",
        {
          withCredentials: true,
        }
      );
      setUserData(response.data.UserData);
      setNotificationCount(response.data.UserData.receivedNotifications.length);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar
        currentSite="dashboard"
        username={userData?.username}
        notificationCount={notificationCount}
      />
      <main className="grow bg-backgroundcolor">
        <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
          <h1 className="text-3xl text-text font-bold ml-5">Post</h1>
          <ProfileBox
            nickname={userData?.nickname}
            username={userData?.username}
            profilepic={userData?.profilepicture}
          />
        </nav>
      </main>
    </div>
  );
}
