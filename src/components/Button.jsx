import React from "react";

export default function Button({ text, className, onClick }) {
  return (
    <div
      className={`flex w-64 h-10 items-center justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
