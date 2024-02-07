import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }
  function handleUserNameChange(e) {
    setUsername(e.target.value);
  }

  function handleRegisterSubmit() {}
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
          <h2 className="text-5xl text-green-600 font-semibold">Register</h2>
          <div className="flex flex-col text-gray-400 py-2 mt-3">
            <label className="flex">Email</label>
            <input
              onChange={handleEmailChange}
              type="email"
              name="email"
              id="email"
              placeholder=""
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required="@"
            ></input>
          </div>
          <div className="flex flex-col text-gray-400 py-2 mt-5">
            <label className="flex">Password</label>
            <input
              onChange={handlePasswordChange}
              type="password"
              name="password"
              id="password"
              placeholder=""
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required=""
            ></input>
          </div>
          <div className="flex flex-col text-gray-400 py-2 mt-5">
            <label className="flex">Username</label>
            <input
              onChange={handleUserNameChange}
              type="password"
              name="password"
              id="password"
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
          >
            <p className="text-blue-900" style={{ alignSelf: "flex-end" }}>
              Forgot password?
            </p>
          </div>
          <div>
            <button
              disabled={email.includes("@") && password ? false : true}
              className="bg-green-600 text-gray-300 text-xl rounded-l mt-5 w-full h-8"
              onClick={handleRegisterSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
