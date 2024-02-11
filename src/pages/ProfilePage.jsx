import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "@mui/joy/Avatar";
import { Link } from "react-router-dom";
import ProfileBox from "../components/ProfileBox";

export default function ProfilePage() {
  let { username } = useParams();

  const [userData, setUserData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [friendStatus, setFriendStatus] = useState({
    status: null,
    direction: null,
  });

  useEffect(() => {
    fetchLoggedInData();
  }, []);

  useEffect(() => {
    fetchUserProfileData();
  }, [username]);

  async function handleFriendAdd() {
    if (!profileData.id) return;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/sendfriendrequest",
        {
          receiverId: profileData.id,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("There was error adding friend:", error);
    }
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
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  async function handleAcceptFriendRequest() {
    if (!profileData.id) return;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/acceptfriendrequest",
        { senderId: profileData.id },
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

  async function fetchUserProfileData() {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/getprofileinfo",
        { username: username },
        { withCredentials: true }
      );
      setProfileData(response.data.userProfile);
      console.log(response);
      setFriendStatus(response.data.friendRequestStatus);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar currentSite={"dashboard"} />
      <main className=" grow bg-backgroundcolor">
        <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
          <h1 className="text-3xl text-text font-bold ml-5">{username}</h1>
          <div className="">
            <ProfileBox
              nickname={userData.nickname}
              username={userData.username}
              profilepic={userData.profilepicture}
            ></ProfileBox>
          </div>
        </nav>
        <div className=" w-full flex items-center justify-center gap-10 mt-10">
          <div className="flex flex-col">
            <div className=" flex flex-row mb-10">
              <Avatar
                style={{ width: "140px", height: "140px", marginTop: "2px" }}
              ></Avatar>
              <div className="flex flex-col">
                <div className="text-text text-2xl mb-10 flex flex-row">
                  <p className="">{username}</p>
                  {username !== userData.username &&
                    (friendStatus && friendStatus.status == "pending" ? (
                      friendStatus.direction == "outgoing" ? (
                        <button
                          onClick={handleFriendAdd}
                          className="text-text rounded-lg w-48 ml-5 h-9 text-base font-bold justify-center self-center text-center bg-forground"
                        >
                          Cancel Friend Request
                        </button>
                      ) : (
                        <div className="flex justify-center items-center gap-5 ml-5 bg-backgroundcolor p-2 rounded-lg">
                          {" "}
                          <button
                            onClick={() => handleAcceptFriendRequest()} // This function should accept the friend request
                            className="bg-forground text-text rounded-lg w-48 h-9 text-base font-bold justify-center self-center text-center" // Adjusted width for fitting within the container
                          >
                            Accept Friend Request
                          </button>
                          <button
                            onClick={() => handleDeclineFriendRequest()} // This function should decline the friend request
                            className="bg-forground text-text rounded-lg w-48 h-9 text-base font-bold justify-center self-center text-center" // Adjusted width for fitting within the container
                          >
                            Decline Friend Request
                          </button>
                        </div>
                      )
                    ) : friendStatus && friendStatus.status == "accepted" ? (
                      <button
                        onClick={handleFriendAdd}
                        className="text-text rounded-lg w-48 ml-5 h-9 text-base font-bold justify-center self-center text-center bg-forground"
                      >
                        Remove Friend
                      </button>
                    ) : (
                      <button
                        onClick={handleFriendAdd}
                        className="text-text rounded-lg w-48 ml-5 h-9 text-base font-bold justify-center self-center text-center bg-forground"
                      >
                        Send Friend Request
                      </button>
                    ))}

                  {username == userData.username && (
                    <div>
                      <button className="text-text rounded-lg w-32 ml-5 h-9 text-base font-bold justify-center self-center text-center bg-forground">
                        Edit profile
                      </button>
                      <button className="text-text rounded-lg w-32 ml-2 h-9 text-base font-bold justify-center self-center text-center bg-forground">
                        Settings
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-text text-xl ml-5 flex flex-row gap-5">
                  <p>{profileData?.posts?.length} posts</p>
                  <p> {profileData?.workoutPlans?.length} workout plans</p>
                </div>
              </div>
            </div>

            {profileData?.posts?.length > 0 ? (
              <div>
                {profileData.posts.map((post, i) => {
                  return (
                    <div className="w-l border-gray-800 border-t p-3">
                      <div className="flex flex-row text-white text-xl">
                        <Avatar
                          style={{
                            width: "50px",
                            height: "48px",
                            marginTop: "2px",
                          }}
                          variant=""
                          src={`${profileData.profilepicture}?tr=w-30,h-30`}
                        ></Avatar>
                        <div className="flex flex-row">
                          <p className=" mt-2 font-bold">
                            {profileData?.nickname}
                          </p>
                          <p className=" mt-2 ml-2 opacity-30">@{username}</p>
                        </div>
                      </div>
                      <div className="text-xl text-white p-3 ml-9  ">
                        <p>{post.content}</p>
                        {post.image && (
                          <img
                            className="object-fill rounded-2xl"
                            style={{ height: "500px", width: "550px" }}
                            src={`https://ik.imagekit.io/bubenik/PostImages/${post.image}`}
                          ></img>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
