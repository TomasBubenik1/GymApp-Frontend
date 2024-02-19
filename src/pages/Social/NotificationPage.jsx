import Navbar from "../../components/Navbar";
import ProfileBox from "../../components/ProfileBox";
import { Avatar } from "@mui/joy";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function NotificationPage() {
  const [userData, setUserData] = useState(null);
  const [post, setPost] = useState(null);
  const [notifications, setNotifications] = useState([]);

  async function viewNotifications() {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/viewincomingnotifications",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("There was error clearing notifications:", error);
    }
  }

  async function handleAcceptFriendRequest(senderId) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/acceptfriendrequest",
        { senderId: senderId },
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      console.error("There was error accepting friend request:", error);
    }
  }

  async function handleDeclineFriendRequest() {
    console.log("kokot");
  }

  async function fetchLoggedInData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getloggedinuser",
        {
          withCredentials: true,
        }
      );
      setUserData(response.data.UserData);
      setNotifications(response.data.UserData.receivedNotifications);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }
  useEffect(() => {
    fetchLoggedInData();
    viewNotifications();
  }, []);
  console.log(notifications);

  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar currentSite="notifications" username={userData?.username} />
      <main className="grow bg-backgroundcolor">
        <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
          <h1 className="text-3xl text-text font-bold ml-5">Notifications</h1>
          <ProfileBox
            nickname={userData?.nickname}
            username={userData?.username}
            profilepic={userData?.profilepicture}
          />
        </nav>
        <div className=" flex flex-col justify-center align-middle items-center">
          {notifications.map((notification, i) => {
            return (
              <div className="group w-l min-h-48 flex h-fit flex-col justify-between border-gray-800 border-b p-5 hover:bg-foregroundhover hover:bg-opacity-40">
                <div>
                  <Link
                    to={`../${notification.sender.username}`}
                    className="cursor-pointer"
                  >
                    <Avatar
                      src={`${notification.sender.profilepicture}`}
                    ></Avatar>
                  </Link>
                  <div className="flex flex-row text-text">
                    <p className="font-bold mr-1">
                      {notification.sender.nickname ||
                        notification.sender.username}
                    </p>
                    {notification.type == "like" && (
                      <Link to={`../postdetail/${notification.referenceId}`}>
                        <p>{notification.message}</p>
                      </Link>
                    )}
                    {notification.type == "friendRequest" && (
                      <div>
                        <div className="flex justify-center items-center gap-5 ml-5 border-gray-800 p-2 rounded-lg group-hover:bg-foregroundhover group-hover:bg-opacity-40">
                          <button
                            onClick={() =>
                              handleAcceptFriendRequest(notification.senderId)
                            }
                            className="bg-accent text-text rounded-lg w-48 h-9 text-base font-bold justify-center self-center text-center"
                          >
                            Accept Friend Request
                          </button>
                          <button
                            onClick={() => handleDeclineFriendRequest()}
                            className="bg-foreground text-text rounded-lg w-48 h-9 text-base font-bold justify-center self-center text-center"
                          >
                            Decline Friend Request
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
