import React from 'react'
import { BiSearch } from 'react-icons/bi'

export default function SearchBar({ onChange, value, placeholder, className }) {
  return (
    <div className="rounded-full flex items-center gap-3 px-2 py-2 border border-gray-300 shadow">
      <BiSearch className="text-xl" />
      <input onChange={onChange} value={value} placeholder={placeholder} className={className || "bg-transparent text-gray-700 text-sm outline-none"} />
    </div>
  )
}