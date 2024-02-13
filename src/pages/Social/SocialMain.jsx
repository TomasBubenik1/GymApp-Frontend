import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/joy";
import ProfileBox from "../../components/ProfileBox";
import Footer from "../../components/Footer";

function SocialMain() {
  const [userData, setUserData] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setAllPosts] = useState([]);

  useEffect(() => {
    fetchLoggedInData();
    fetchAllPosts();
    console.log(posts);
  }, []);

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
      .then(window.location.reload());
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

  return (
    <div className="flex flex-col">
      <div className="flex bg-backgroundcolor w-full">
        <Navbar currentSite={"social"} />
        <main className="flex-grow bg-backgroundcolor">
          <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
            <h1 className="text-3xl text-text font-bold ml-5">Social</h1>
            <div className="flex flex-row gap-2">
              <input className=" bg-forground rounded-lg p-1" placeholder='Search for your friends!'></input>
              <ProfileBox
                nickname={userData.nickname}
                profilepic={userData.profilepicture}
                username={userData.username}
              ></ProfileBox>
            </div>
          </nav>
          <div className="w-l min-h-48 flex h-fit flex-col justify-between border-gray-700 border p-5">
            <div className=" flex flex-row w-full">
              <Avatar
                style={{ width: "36px", height: "34px", marginTop: "2px" }}
                variant="outlined"
                src={`${userData.profilepicture}?tr=w-30,h-30`}
              ></Avatar>
              <div className="flex flex-col w-full ml-5">
                <textarea
                  onChange={handlePostTextChange}
                  placeholder="Share your thoughts!"
                  className="outline-none line self-start h-fit bg-transparent text-text text-half2xl resize-none w-full"
                ></textarea>
                {selectedImage && (
                  <div className="relative mt-3">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Selected Preview"
                      className="object-fill rounded-lg"
                      style={{ height: "500px", width: "450px" }}
                    />
                    <div className="absolute top-0 right-0">
                      <div
                        className="flex justify-center items-center bg-black bg-opacity-50 p-1 rounded-full text-4xl text-white font-bold"
                        onClick={() => setSelectedImage(null)}
                      >
                        <span className="material-symbols-outlined">close</span>
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
              <div className="w-l border-gray-800 border p-3">
                <div className="flex flex-row text-white text-xl">
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
                    <div className="flex flex-row">
                      <p className=" mt-2 font-bold">
                        {post.createdBy.nickname}
                      </p>
                      <p className=" mt-2 ml-2 opacity-30">
                        @{post.createdBy.username}
                      </p>
                    </div>
                  </Link>
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
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SocialMain;
