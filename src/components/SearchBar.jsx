import React from 'react'
import { BiSearch } from 'react-icons/bi'

export default function SearchBar({ onChange, value, placeholder, className }) {
  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        <BiSearch className="h-4 w-4" />
      </div>
      <input
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        className={`
          flex h-10 sm:h-9 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 sm:py-1 text-base sm:text-sm
          shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1
          focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 touch-target
          ${className || ''}
        `}
      />
    </div>
  )
}