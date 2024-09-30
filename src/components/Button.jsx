import React from "react";

export default function Button({ text, className, onClick }) {
  return (
    <div
      className={`flex h-10 scale-[.8] items-center text-base font-semibold justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
