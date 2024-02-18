import React from "react";
import ProfileBox from "../components/ProfileBox";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";

export function ProfileSettings() {
  const [userData, setUserData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);


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
      console.log(response);
      setUserData(response.data.UserData);
      setNotificationCount(response.data.UserData.receivedNotifications.length);

    } catch (error) {
      console.error("Error fetching logged in user data:", error);
    }
  }

  return (
    <div className="flex bg-backgroundcolor w-full">
      <Navbar currentSite={"dashboard"} notificationCount={notificationCount} />
      <div className=" grow flex flex-col">
        <nav className="w-full h-20 flex justify-between items-center bg-backgroundcolor border-b border-gray-700">
          <h1 className="text-3xl text-text font-bold ml-5">Dashboard</h1>
          <div className="">
            <ProfileBox
              nickname={userData.nickname}
              profilepic={userData.profilepicture}
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
                  type="text"
                  id="name"
                  placeholder="Your username"
                  className="bg-forground text-white block w-full border-gray-700 rounded-lg border  p-2"
                />
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
                  <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={userData.profilepicture}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </label>
                <input type="file" id="profilepic" className="hidden"></input>
              </div>
            </div>
            <div className="mb-6">
              <label for="nickname" className="block text-sm font-medium mb-1">
                Nickname
              </label>
              <input
                type="text"
                id="nickname"
                placeholder="Your nickname"
                className="bg-forground text-white block w-full border-gray-700 rounded-lg border  p-2"
              />
            </div>

            <div className="mb-6">
              <label for="real name" className="block text-sm font-medium mb-1">
                Real name
              </label>
              <input
                type="text"
                id="real name"
                placeholder="Your real name"
                className="bg-forground text-white block w-full border-gray-700 rounded-lg border  p-2"
              />
            </div>

            <div className="mb-6">
              <label for="bio" className="block text-sm font-medium mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                placeholder="Tell us a little bit about yourself"
                className="bg-forground text-white block w-full border-gray-700 rounded-lg border p-2 resize-none"
                rows="4"
              ></textarea>
            </div>

            <button className=" bg-accent bg-opacity-80 hover:bg-accent hover:bg-opacity-100text-white font-bold py-2 px-4 rounded">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
