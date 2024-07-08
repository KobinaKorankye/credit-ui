import React from "react";

export default function Button({ text, className, onClick }) {
  return (
    <div
      className={`flex h-16 scale-[.8] items-center text-sm font-semibold justify-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
}
