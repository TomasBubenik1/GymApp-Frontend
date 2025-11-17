import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [pageProgress, setPageProgress] = useState(1);
  const [emailTaken, setEmailTaken] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    username: "",
    currentWeight: "",
    goalWeight: "",
    height: "",
  });

  function handleDataChange(param, value) {
    setUserData((prevData) => ({
      ...prevData,
      [param]: value,
    }));
  }

  async function handleEmailChange(e) {
    const newEmail = e.target.value;
    if (newEmail !== "") {
      try {
        const isTaken = await axios.post(
          "http://localhost:5000/api/checkuniqueemail",
          {
            email: newEmail,
          }
        );
        setEmailTaken(isTaken.data.result);
        if (!isTaken.data.result) {
          handleDataChange("email", newEmail);
        }
      } catch (error) {
        console.error("Error checking email uniqueness:", error);
        setEmailTaken(false);
      }
    } else {
      setEmailTaken(false);
    }
  }

  async function handleUsernameChange(e) {
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

  async function handleRegisterSubmit() {
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        nickname: userData.username,
        currentWeight: parseFloat(userData.currentWeight),
        goalWeight: parseFloat(userData.goalWeight),
        height: parseFloat(userData.height),
      });
      navigate("../login");
    } catch (error) {
      console.error("There was error creating user:", error);
    }
  }
  if (pageProgress == 1) {
    return (
      <main className="flex">
        <div
          className="bg-gray-700 flex flex-col justify-center"
          style={{ width: "100vw", height: "100vh" }}
        >
          <div
            className="w-full bg-gray-900 p-8 px-8 mx-auto rounded-3xl"
            style={{ height: "85%", width: "40%" }}
          >
            <h2 className="text-5xl text-accentGlow font-semibold">Register</h2>
            <div className="flex flex-col text-gray-400 py-2 mt-3">
              <label className="flex">Email</label>
              <input
                onChange={(e) => handleEmailChange(e)}
                type="email"
                name="email"
                id="email"
                placeholder=""
                className={`${
                  emailTaken
                    ? "bg-gray-700 p-2.5 rounded-lg text-sm outline-none border-red-600 border text-text"
                    : "bg-gray-700 p-2.5 rounded-lg text-sm outline-none border-gray-600 border text-text"
                }`}
                required="@"
              ></input>
              {emailTaken && (
                <p className="text-red-600 text-md">
                  This email is already used!
                </p>
              )}
            </div>
            <div className="flex flex-col text-gray-400 py-2 mt-5">
              <label className="flex">Username</label>
              <input
                onChange={(e) => handleUsernameChange(e)}
                type="username"
                name="username"
                id="username"
                placeholder=""
                className={`${
                  usernameTaken
                    ? "bg-gray-700 p-2.5 rounded-lg text-sm outline-none border-red-600 border text-text"
                    : "bg-gray-700 p-2.5 rounded-lg text-sm outline-none border-gray-600 border text-text"
                }`}
                required="@"
              ></input>
              {usernameTaken && (
                <p className="text-red-600 text-md">
                  This username is already used!
                </p>
              )}
            </div>
            <div className="flex flex-col text-gray-400 py-2 mt-5">
              <label className="flex">Password</label>
              <input
                onChange={(e) => handleDataChange("password", e.target.value)}
                type="password"
                name="password"
                id="password"
                placeholder=""
                className=" bg-gray-700 p-2.5 rounded-lg text-sm outline-none border-gray-600 border"
                required=""
              ></input>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            ></div>
            <div>
              <button
                disabled={
                  userData.email.includes("@") &&
                  userData.password &&
                  userData.username.length > 5 &&
                  emailTaken == false &&
                  usernameTaken == false
                    ? false
                    : true
                }
                className="bg-accent text-gray-300 text-xl rounded-lg mt-16 w-full h-8 disabled:bg-accent disabled:opacity-50"
                onClick={() => setPageProgress(2)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  } else if (pageProgress == 2) {
    return (
      <main className="flex">
        <div
          className="bg-gray-700 flex flex-col justify-center"
          style={{ width: "100vw", height: "100vh" }}
        >
          <div
            className="w-full bg-gray-900 p-8 px-8 mx-auto rounded-3xl"
            style={{ height: "85%", width: "40%" }}
          >
            <h2 className="text-5xl text-accentGlow font-semibold">Register</h2>
            <div className="flex flex-col text-gray-400 py-2 mt-3">
              <label className="flex">Current Weight</label>
              <input
                onChange={(e) =>
                  handleDataChange("currentWeight", e.target.value)
                }
                type="p"
                name="currentWeight"
                id="currentWeight"
                placeholder=""
                defaultValue={""}
                value={userData.currentWeight}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required="@"
              ></input>
            </div>
            <div className="flex flex-col text-gray-400 py-2 mt-5">
              <label className="flex">Goal Weight</label>
              <input
                onChange={(e) => handleDataChange("goalWeight", e.target.value)}
                type="text"
                name="goalWeight"
                id="goalWeight"
                value={userData.goalWeight}
                placeholder=""
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              ></input>
            </div>
            <div className="flex flex-col text-gray-400 py-2 mt-5">
              <label className="flex">Height</label>
              <input
                onChange={(e) => handleDataChange("height", e.target.value)}
                type="text"
                name="height"
                id="height"
                value={userData.height}
                placeholder=""
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              ></input>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            ></div>
            <div>
              <button
                disabled={
                  userData.email.includes("@") && userData.password
                    ? false
                    : true
                }
                className="bg-accent text-gray-300 text-xl rounded-lg mt-16 w-full h-8 disabled:bg-accent"
                onClick={handleRegisterSubmit}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
