import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { Avatar } from "@mui/joy";
import ProfileBox from "../../components/ProfileBox";
import Footer from "../../components/Footer";
import { handleToggleLike } from "../../utils/handleToggleLike";

function SocialMain() {
  const [userData, setUserData] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setAllPosts] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    fetchLoggedInData();
    fetchAllPosts();
    console.log(posts);
  }, []);

  useEffect(() => {
    handleUserSearch();
    console.log(foundUsers);
  }, [searchText]);
  function handlePostTextChange(e) {
    setPostText(e.target.value);
  }

  function handleImageChange(e) {
    setSelectedImage(e.target.files[0]);
  }

  async function ForYouPosts() {}

  async function fetchAllPosts() {
    const response = await axios.get("http://localhost:5000/api/getallposts");
    setAllPosts(response.data);
  }

  async function handlePostCreate() {
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("content", postText);

    const respone = await axios
      .post("http://localhost:5000/api/createpost", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      );
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
      setWorkoutPlans(response.data.exercisePlans);

      console.log(response);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  function handleSearchTextChange(e) {
    setSearchText(e.target.value);
  }
  async function handleUserSearch() {
    const res = await axios.post(
      "http://localhost:5000/api/searchusers",
      {
        searchText: searchText,
      },
      { withCredentials: true }
    );
    setFoundUsers(res.data.foundUsers);
  }
  const handlePostClick = (e, postId) => {
    if (e.target.matches(".no-redirect") || e.target.closest(".no-redirect")) {
      e.preventDefault();
      console.log("Interactive element clicked, no redirection");
    } else {
      navigate(`/postdetail/${postId}`);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex bg-backgroundcolor w-full">
        <Navbar currentSite={"social"} username={userData.username} />
        <main className="flex-grow bg-backgroundcolor">
          <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
            <h1 className="text-3xl text-text font-bold ml-5">Social</h1>
            <div className="flex flex-row gap-2">
              <div className="flex flex-col relative">
                <input
                  onChange={(e) => handleSearchTextChange(e)}
                  className="bg-foreground rounded-lg p-1 text-text h-full"
                  placeholder="Search for your friends!"
                ></input>
                {Object.keys(foundUsers).length > 0 && searchText !== "" && (
                  <div className="absolute mt-14 border border-gray-700 p-3 w-full bg-foreground rounded-lg shadow-[0_0px_5px_]">
                    {foundUsers.map((user, i) => {
                      return (
                        <div key={i} className="text-text flex-row flex mt-2 ">
                          <Link to={`../${user.username}`}>
                            <Avatar src={`${user.profilepicture}`}></Avatar>
                            <div className="flex flex-col">
                              <p className=" font-bold">{user.nickname}</p>
                              <p className="opacity-50">@{user.username}</p>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <ProfileBox
                nickname={userData.nickname}
                profilepic={userData.profilepicture}
                username={userData.username}
              ></ProfileBox>
            </div>
          </nav>
          <div className=" flex flex-col justify-center align-middle items-center">
            <div className="w-l min-h-48 flex h-fit flex-col justify-between border-gray-700 border-b p-5">
              <div className=" flex flex-row w-full">
                <Avatar
                  style={{ width: "52px", height: "48px", marginTop: "-5px" }}
                  src={`${userData.profilepicture}?tr=w-30,h-30`}
                ></Avatar>
                <div className="flex flex-col w-full ml-5">
                  <textarea
                    maxLength={255}
                    onChange={handlePostTextChange}
                    placeholder="Share your thoughts!"
                    className="outline-none line self-start h-fit bg-transparent text-text text-half2xl resize-none w-full"
                  ></textarea>
                  {selectedImage && (
                    <div className="relative mt-3">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected Preview"
                        className=" object-contain rounded-lg"
                        style={{ height: "500px", width: "450px" }}
                      />
                      <div className="absolute top-0 right-0">
                        <div
                          className="flex justify-center items-center bg-black bg-opacity-50 p-1 rounded-full text-4xl text-white font-bold"
                          onClick={() => setSelectedImage(null)}
                        >
                          <span className="material-symbols-outlined">
                            close
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className=" flex mt-5 border-t-gray-700 border-t w-full justify-between">
                <div className="flex flex-row mt-4 gap-2">
                  <input
                    className=" hidden"
                    type="file"
                    id="imageupload"
                    accept="image/*"
                    onChange={handleImageChange}
                  ></input>

                  <label for="imageupload">
                    <div className="flex justify-center items-center rounded-full p-2 text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25 ">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  </label>
                  <label for="gifbox">
                    <div className="flex justify-center items-center rounded-full p-2 text-accent transition duration-150 ease-in hover:shadow-2xl hover:bg-accent hover:bg-opacity-25 ">
                      <span className="material-symbols-outlined">gif_box</span>
                    </div>
                  </label>
                </div>
                <button
                  onClick={handlePostCreate}
                  disabled={(postText.length < 1) & (selectedImage == null)}
                  className="text-text rounded-xl disabled:opacity-50 bg-accent font-bold pl-5 pr-5 pt-1 pb-1  mt-5"
                >
                  Post
                </button>
              </div>
            </div>
            {posts.map((post, i) => {
              return (
                <div
                  className="w-l border-gray-800 border-t p-3 hover:bg-backgroundHover transition duration-200"
                  onClick={(e) => handlePostClick(e, post.id)}
                >
                  <div className="flex flex-row text-white text-xl no-redirect">
                    <Link to={`../${post.createdBy.username}`}>
                      <Avatar
                        style={{
                          width: "50px",
                          height: "48px",
                          marginTop: "2px",
                        }}
                        variant=""
                        src={`${post.createdBy.profilepicture}?tr=w-30,h-30`}
                      ></Avatar>
                    </Link>
                    <Link to={`../${post.createdBy.username}`}>
                      <div className="flex flex-row ml-1">
                        <p
                          className=" mt-2 font-bold hover:border-b"
                          style={{}}
                        >
                          {post.createdBy.nickname}
                        </p>
                        <p className=" mt-2 ml-2 opacity-30 font-thin">
                          @{post.createdBy.username}
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
                  <div className="text-xl text-white p-3 ml-9  ">
                    <p>{post.content}</p>
                    {post.image && (
                      <img
                        className="object-contain rounded-2xl self-center border border-gray-900 p-1 shadow-xl"
                        src={`https://ik.imagekit.io/bubenik/PostImages/${post.image}`}
                      ></img>
                    )}
                    <div className=" flex ml-10 mt-5 text-gray-700">
                      <div className=" flex flex-row justify-center items-center">
                        <div className="flex justify-center items-center rounded-full p-2 transition duration-150 ease-in hover:shadow-2xl hover:bg-cyan-400 hover:bg-opacity-25 hover:text-cyan-500">
                          <span className="material-symbols-outlined">
                            chat_bubble_outline
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row justify-center items-center hover:text-pink-500 group no-redirect">
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SocialMain;
