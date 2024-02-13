import React, { useState } from "react";
import { Avatar } from "@mui/joy";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ProfileBox({ nickname, profilepic, username }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  const handleProfileClick = () => {
    console.log("Profile picture clicked");
  };

  async function handleLogoutClick() {
    try {
      const res = axios
        .post(
          "http://localhost:5000/api/auth/logout",
          {},
          { withCredentials: true }
        )
        .then(navigate("/login"));
    } catch (error) {
      console.error("There was error logging you out:", error);
    }
  }

  return (
    <div
      className="relative mr-5 p-2 pb-1 bg-backgroundcolor rounded-xl flex border border-gray-700 pt-1 pr-1 pl-5"
      onClick={() => toggleDropdown()}
    >
      {username && (
        <Link to={`../${username}`}>
          <Avatar
            style={{
              width: "30px",
              height: "28px",
              marginTop: "2px",
              cursor: "pointer",
            }}
            variant="outlined"
            src={`${profilepic}?tr=w-30,h-30`}
          />
        </Link>
      )}
      <h1 className="text-text font-semibold mt-1 ml-2 ">{nickname}</h1>
      <span className="material-symbols-outlined pr-4 text-white mt-2 ml-1 cursor-pointer">
        expand_more
      </span>
      {dropdownOpen && (
        <div className="absolute bg-forground z-50 text-text mt-10 rounded-lg border border-gray-300 shadow-md">
          <ul className="py-1">
            <Link to={`../${username}`}>
              <li className=" flex flex-row px-4 py-2 cursor-pointer hover:bg-accent hover:bg-opacity-50 hover:text-text">
                <span className="material-symbols-outlined text-navIcon">
                  account_circle
                </span>
                <p>Profile</p>
              </li>
            </Link>
            <li
              onClick={() => navigate("/settings")}
              className="px-4 flex flex-row py-2 cursor-pointer hover:bg-accent hover:bg-opacity-50 hover:text-text"
            >
              <span className="material-symbols-outlined text-navIcon">
                settings
              </span>
              <p>Settings</p>
            </li>
            <li
              onClick={() => handleLogoutClick()}
              className=" flex flex-row px-4 py-2 cursor-pointer hover:bg-accent hover:bg-opacity-50 hover:text-text"
            >
              <span className="material-symbols-outlined text-navIcon">
                logout
              </span>
              <p>Log out</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
