import React from "react";
import ProfileBox from "../components/ProfileBox";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";

export function ProfileSettings() {
  const [userData, setUserData] = useState([]);
  const [usernameTaken, setUsernameTaken] = useState(false);

  const [setttingsData, setSettingsData] = useState({
    username: "",
    nickname: "",
    realname: "",
    bio: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  function handleImageChange(e) {
    setSelectedImage(e.target.files[0]);
  }

  async function handleSubmitChanges() {
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      Object.keys(setttingsData).forEach((key) => {
        formData.append(key, setttingsData[key]);
      });

      const res = await axios.post(
        "http://localhost:5000/api/handleuserinfochange",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
    } catch (error) {
      console.error("There was error chaning user data:", error);
    }
  }

  function handleDataChange(param, value) {
    setSettingsData((prevData) => ({
      ...prevData,
      [param]: value,
    }));
  }

  useEffect(() => {
    fetchLoggedInData();
  }, []);

  async function handleUsernameChange(e) {
    console.log(e.target.value);
    const newUsername = e.target.value;
    if (newUsername !== "") {
      try {
        const isTaken = await axios.post(
          "http://localhost:5000/api/checkuniqueusername",
          {
            username: newUsername,
          }
        );
        setUsernameTaken(isTaken.data.result);
        if (!isTaken.data.result) {
          handleDataChange("username", newUsername);
        }
      } catch (error) {
        console.error("Error checking username uniqueness:", error);
        setUsernameTaken(false);
      }
    } else {
      setUsernameTaken(false);
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
      console.log(response);
      setUserData(response.data.UserData);
      setSettingsData({
        username: response.data.UserData.username,
        nickname: response.data.UserData.nickname,
        realname: response.data.UserData.nickname,
        bio: response.data.UserData.bio,
      });
    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar currentSite={"dashboard"} />
      <div className=" grow flex flex-col">
        <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
          <h1 className="text-3xl text-text font-bold ml-5">Settings</h1>
          <div className="">
            <ProfileBox
              nickname={userData.nickname}
              profilepic={userData.profilepicture}
              username={userData.username}
            ></ProfileBox>
          </div>
        </nav>
        <div className="bg-backgroundcolor p-10 text-white min-h-screen">
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl mb-6">Public profile</h1>

            <div className="flex mb-6">
              <div className="flex-grow">
                <label for="name" className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input
                  onChange={(e) => handleUsernameChange(e)}
                  type="text"
                  id="name"
                  placeholder="Your username"
                  className={`${
                    usernameTaken
                      ? "bg-foreground text-white block w-full border-red-600 rounded-lg border  p-2 outline-none"
                      : "bg-foreground text-white block w-full border-gray-700 rounded-lg border  p-2"
                  }`}
                />
                {usernameTaken && (
                  <p className="text-red-600 text-md">
                    This username is already used!
                  </p>
                )}
                <p className="mt-1 text-sm">
                  Username must be unique and can't contain any special
                  characters.Username will be used to find your profile.
                </p>
              </div>
              <div className="ml-6">
                <label
                  for="profilepic"
                  className="block text-sm font-medium mb-1 cursor-pointer"
                >
                  Profile picture
                  {selectedImage ? (
                    <div className=" relative">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src={URL?.createObjectURL(selectedImage)}
                          alt="Profile"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden">
                      <img
                        src={userData.profilepicture}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  id="profilepic"
                  className="hidden"
                  onChange={(e) => handleImageChange(e)}
                ></input>
              </div>
            </div>
            <div className="mb-6">
              <label for="nickname" className="block text-sm font-medium mb-1">
                Nickname
              </label>
              <input
                onChange={(e) => handleDataChange("nickname", e.target.value)}
                type="text"
                id="nickname"
                placeholder="Your nickname"
                className="bg-foreground text-white block w-full border-gray-700 rounded-lg border  p-2"
              />
            </div>

            <div className="mb-6">
              <label for="real name" className="block text-sm font-medium mb-1">
                Real name
              </label>
              <input
                onChange={(e) => handleDataChange("realname", e.target.value)}
                type="text"
                id="real name"
                placeholder="Your real name"
                className="bg-foreground text-white block w-full border-gray-700 rounded-lg border  p-2"
              />
            </div>

            <div className="mb-6">
              <label for="bio" className="block text-sm font-medium mb-1">
                Bio
              </label>
              <textarea
                onChange={(e) => handleDataChange("bio", e.target.value)}
                id="bio"
                placeholder="Tell us a little bit about yourself"
                className="bg-foreground text-white block w-full border-gray-700 rounded-lg border  p-2 resize-none"
                rows="4"
              ></textarea>
            </div>

            <button
              className=" bg-accent bg-opacity-80 hover:bg-accent hover:bg-opacity-100text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSubmitChanges()}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
