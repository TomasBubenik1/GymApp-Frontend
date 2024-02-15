import React, { useState } from "react";

export default function DropdownMenuFilter({
  label,
  selectedOption,
  options,
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      className="flex flex-col w-full h-full rounded-md bg-foreground"
      onClick={() => setIsOpen(!isOpen)}
    >
      <label className="text-base text-gray-400 ml-6 font-semibold mt-3 self-start">
        {label}
      </label>
      <div className="text-lg text-white font-semibold flex w-full">
        <p className="flex-grow pl-6">{selectedOption}</p>
        <span className="material-symbols-outlined pr-4">expand_more</span>
      </div>
      {isOpen && (
        <button className="mt-6 w-full text-white bg-foreground relative rounded-md justify-center flex flex-col items-center">
          {options.map((option, i) => {
            if (selectedOption === option) {
              return (
                <p
                  className="font-semibold text-accent"
                  onClick={() => onSelect(null)}
                >
                  {option}
                </p>
              );
            } else {
              return (
                <p
                  className="hover:bg-foregroundhover transition duration-300 w-full"
                  onClick={() => onSelect(option)}
                >
                  {option}
                </p>
              );
            }
          })}
        </button>
      )}
    </button>
  );
}
