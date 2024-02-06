import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Avatar } from "@mui/joy";

function SocialMain() {
  const [userData, setUserData] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchLoggedInData();
  }, []);

  function handlePostTextChange(e) {
    setPostText(e.target.value);
  }

  function handleImageChange(e) {
    setSelectedImage(e.target.files[0]);
  }

  async function handlePostCreate() {
    const formData = new FormData();
    formData.append("image", selectedImage);

    const respone = await axios.post("http://localhost:5000/api/createpost",formData,{
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(respone);
  }

  async function fetchLoggedInData() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getloggedinuser",
        {
          withCredentials: true,
        }
      );
      setUserData(response.data.sessiondata.sess.user);
      setWorkoutPlans(response.data.exercisePlans);
      console.log(response);
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar currentSite={"social"} />
      <main className="flex-grow bg-backgroundcolor">
        <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
          <h1 className="text-3xl text-text font-bold ml-5">Social</h1>
          <div className="">
            <div className="mr-5 p-2 pb-1 bg-backgroundcolor rounded-xl flex border border-gray-700 pt-1 pr-1 pl-5">
              <Avatar
                style={{ width: "30px", height: "28px", marginTop: "2px" }}
                variant="outlined"
                src={`${userData.profilepicture}?tr=w-30,h-30`}
              ></Avatar>
              <h1 className="text-text font-semibold mt-1 ml-2 ">
                {userData.name}
              </h1>
              <span className="material-symbols-outlined pr-4 text-white mt-2 ml-1">
                expand_more
              </span>
            </div>
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
                placeholder="What is happening?!"
                className="outline-none line self-start h-fit bg-transparent text-text text-half2xl resize-none w-full"
              ></textarea>
              {selectedImage && (
                <div className="relative mt-3">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected Preview"
                    className="max-w-full max-h-40 object-cover"
                  />
                  <div className="absolute top-0 right-0 p-2">
                    <div
                      className=" flex justify-center items-center bg-black bg-opacity-50 p-1 rounded-full text-4xl text-white font-bold"
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
            <div>
              <input
                className=" hidden"
                type="file"
                id="imageupload"
                accept="image/*"
                onChange={handleImageChange}
              ></input>
              <label for="imageupload">
                <span className="material-symbols-outlined pr-4 text-accent mt-2 text-2xl ml-5">
                  image
                </span>
              </label>
              <span className="material-symbols-outlined pr-4 text-accent mt-2 text-2xl">
                gif_box
              </span>
            </div>
            <button
              onClick={handlePostCreate}
              className="text-text rounded-xl bg-accent font-bold pl-5 pr-5 pt-1 pb-1  mt-5"
            >
              Post
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SocialMain;
