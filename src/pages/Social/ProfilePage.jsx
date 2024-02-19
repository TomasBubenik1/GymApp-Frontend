import axios from "axios";
import Navbar from "../../components/Navbar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Avatar from "@mui/joy/Avatar";
import { Link } from "react-router-dom";
import ProfileBox from "../../components/ProfileBox";
import { handleToggleLike } from "../../utils/handleToggleLike";

export default function ProfilePage() {
  let { username } = useParams();

  const [userData, setUserData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [posts, setAllPosts] = useState([]);

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

  async function handleRemoveFriend() {
    console.log("klik");
    if (!profileData.id) return console.log("No profile Id");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/removefriend",
        { friendId: profileData.id },
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      console.error("There was error removing friend:", error);
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
  const handlePostClick = (e) => {
    if (e.target.matches(".no-redirect") || e.target.closest(".no-redirect")) {
      e.preventDefault();
      console.log("Interactive element clicked, no redirection");
    } else {
      console.log("Redirect to post detail page");
    }
  };

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
      setAllPosts(response.data.userProfile.posts || []);
      setFriendStatus(response.data.friendRequestStatus);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar currentSite={"profile"} username={userData.username} />
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
                src={`${profileData.profilepicture}`}
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
                          className="text-text rounded-lg w-48 ml-5 h-9 text-base font-bold justify-center self-center text-center bg-foreground"
                        >
                          Cancel Friend Request
                        </button>
                      ) : (
                        <div className="flex justify-center items-center gap-5 ml-5 bg-backgroundcolor p-2 rounded-lg">
                          <button
                            onClick={() => handleAcceptFriendRequest()}
                            className=" bg-accent text-text rounded-lg w-48 h-9 text-base font-bold justify-center self-center text-center"
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
                      )
                    ) : friendStatus && friendStatus.status == "accepted" ? (
                      <button
                        onClick={() => handleRemoveFriend()}
                        className="text-text rounded-lg w-48 ml-5 h-9 text-base font-bold justify-center self-center text-center bg-foreground"
                      >
                        Remove Friend
                      </button>
                    ) : (
                      <button
                        onClick={handleFriendAdd}
                        className="text-text rounded-lg w-48 ml-5 h-9 text-base font-bold justify-center self-center text-center bg-foreground"
                      >
                        Send Friend Request
                      </button>
                    ))}

                  {username == userData.username && (
                    <div>
                      <Link to={"../settings"}>
                        <button className="text-text rounded-lg w-32 ml-6 h-9 text-base font-bold justify-center self-center text-center bg-foreground">
                          Settings
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
                <div className="text-text text-xl ml-5 flex flex-row gap-5">
                  <p>{profileData?.posts?.length} posts</p>
                  <p> {profileData?.workoutPlans?.length} workout plans</p>
                </div>
              </div>
            </div>

            {posts?.length > 0 ? (
              <div>
                {posts.map((post, i) => {
                  return (
                    <div
                      className="w-l border-gray-800 border-t p-3 hover:bg-[#080808]"
                      onClick={() => handlePostClick}
                    >
                      <div className="flex flex-row text-white text-xl">
                        <Link to={`../${username}`}>
                          <Avatar
                            style={{
                              width: "50px",
                              height: "48px",
                              marginTop: "2px",
                              marginRight: "5px",
                            }}
                            variant=""
                            src={`${profileData.profilepicture}?tr=w-30,h-30`}
                          ></Avatar>
                        </Link>
                        <Link to={`../${username}`}>
                          <div className="flex flex-row">
                            <p
                              className=" mt-2 font-boldhover:border-b"
                              style={{}}
                            >
                              {profileData.nickname}
                            </p>
                            <p className=" mt-2 ml-2 opacity-30 font-thin">
                              @{username}
                            </p>
                            <p className="opacity-30 mt-1 ml-1 font-thin">.</p>
                            <p className="opacity-30 mt-2 ml-1 font-thin">
                              {new Date(post.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </Link>
                      </div>
                      <div className="text-xl text-white p-3 ml-9 mr-3  ">
                        <p>{post.content}</p>
                        {post.image && (
                          <img
                            className=" object-contain rounded-2xl border border-gray-900 shadow-xl"
                            style={{ height: "500px", width: "550px" }}
                            src={`https://ik.imagekit.io/bubenik/PostImages/${post.image}`}
                          ></img>
                        )}
                        <div className=" flex ml-10 mt-5 gap-40 text-gray-700">
                          <div>
                            <span className="material-symbols-outlined text-gray-700 text-2xl">
                              chat_bubble_outline
                            </span>
                          </div>
                          <div className="flex flex-row justify-center items-center hover:text-pink-500 group">
                            {post.likes > 0 ? (
                              userData?.likedPosts?.some(
                                (likedPost) => likedPost.postId == post.id
                              ) ? (
                                <div className="flex flex-row justify-center items-center hover:text-pink-500 group no-redirect">
                                  <div className="flex justify-center items-center rounded-full p-2 hover:shadow-2xl text-pink-500 group-hover:bg-pink-500 group-hover:bg-opacity-25 no-redirect">
                                    <span
                                      className="material-icons cursor-pointer no-redirect"
                                      onClick={() =>
                                        handleToggleLike(
                                          post.id,
                                          posts,
                                          setAllPosts,
                                          userData,
                                          setUserData
                                        )
                                      }
                                    >
                                      favorite
                                    </span>
                                  </div>
                                  <p className="mb-0.5 cursor-pointer text-pink-500 group-hover:text-pink-500 no-redirect">
                                    {post.likes}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-row justify-center items-center hover:text-pink-500 group no-redirect">
                                  <div className="flex justify-center items-center rounded-full p-2 hover:shadow-2xl group-hover:bg-pink-500 group-hover:bg-opacity-25 no-redirect">
                                    <span
                                      className="material-symbols-outlined cursor-pointer no-redirect"
                                      onClick={() =>
                                        handleToggleLike(
                                          post.id,
                                          posts,
                                          setAllPosts,
                                          userData,
                                          setUserData
                                        )
                                      }
                                    >
                                      favorite_border
                                    </span>
                                  </div>
                                  <p className="mb-0.5 cursor-pointer group-hover:text-pink-500 no-redirect">
                                    {post.likes}
                                  </p>
                                </div>
                              )
                            ) : (
                              <div className="flex justify-center items-center rounded-full p-2 hover:shadow-2xl group-hover:bg-pink-500 group-hover:bg-opacity-25 no-redirect">
                                <span
                                  className="material-symbols-outlined cursor-pointer no-redirect"
                                  onClick={() =>
                                    handleToggleLike(
                                      post.id,
                                      posts,
                                      setAllPosts,
                                      userData,
                                      setUserData
                                    )
                                  }
                                >
                                  favorite_border
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="material-symbols-outlined text-gray-700 text-2xl">
                              share
                            </span>
                          </div>
                        </div>
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
