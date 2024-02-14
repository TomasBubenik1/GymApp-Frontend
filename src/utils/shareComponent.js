import React from "react";

export default function ShareComponent({ workoutplanId }) {
  function copyToClipboard() {
    const textToCopy = `http://localhost:3000/workoutdetails/${workoutplanId}`;
    navigator.clipboard.writeText(textToCopy);
  }

  return (
    <li
      className="p-2 hover:bg-foregroundhover rounded-b-lg flex flex-row"
      onClick={copyToClipboard}
    >
      <span className="material-symbols-outlined text-text text-2xl text-center">
        ios_share
      </span>
      <p className="mt-1 text-text font-semibold ml-1">Share</p>
    </li>
  );
}
