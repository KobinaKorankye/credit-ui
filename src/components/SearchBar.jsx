import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function SearchBar({onChange, value, placeholder, className}) {
  return (
        <div className={`flex items-center text-xs ${className}`}>
          <FontAwesomeIcon className='mx-3' icon={faSearch} />
          <input 
        type={'text'}
        autoComplete='off'
        placeholder={placeholder || `Type to search`}
        value={value}
        onChange={onChange}
        className="shadow appearance-none border rounded-full w-full py-2 px-3 text-gray-500 
              leading-tight focus:outline-none focus:shadow-outline"/>
        </div>
  )
}