import React from 'react'
import { useNavigate } from 'react-router-dom'


export default function Table({ columns, columnNames, rows, className, linksTo }) {
  const navigate = useNavigate();

  console.log('Rows: ', rows);

  return (
    <table className={`table-auto w-full text-xs ${className}`}>
      <thead className='capitalize'>
        <tr>
          {columnNames?.length ?
            columnNames?.map((column) => (
              <th className='px-4 py-2 text-left'>{column}</th>
            ))
            : columns?.length > 0 ?
              columns?.map((column) => (
                <th className='border-x-0 px-4 py-2 text-left'>{column}</th>
              )) :
              rows?.length > 0 && Object.keys(rows[0])?.map((column) => (
                <th className='border-x-0 px-4 py-2 text-left'>{column}</th>
              ))
          }
        </tr>
      </thead>
      <tbody style={{ fontFamily: '' }}>
        {
          columns?.length > 0 ?
            rows?.map((row, index) => (
              <tr onClick={() => { navigate(linksTo, { state: { user: row } }) }} className={`hover:bg-gray-200 ${index % 2 != 0 ? 'bg-gray-100' : ''} cursor-pointer flex-col`}>
                {
                  columns.map((column) => (
                    column == ' ' ? 
                    <td className='border border-gray-300 border-2 border-x-0 px-4 py-2 text-left flex gap-2'>
                      {row['is_active'] ? <div className='text-xs p-1 rounded text-white bg-teal-500'>Active</div>: <div className='text-xs p-1 rounded text-white bg-red-600'>Inactive</div>}
                      {row['is_elevated_user'] && <div className='text-xs p-1 rounded text-white bg-purple-500'>Elevated</div>}
                      {row['is_superuser'] && <div className='text-xs p-1 rounded text-white bg-sky-500'>Super</div>}
                      </td> : <td className='border border-gray-300 border-2 border-x-0 px-4 py-2 text-left'>{row[column]}</td>
                  ))
                }
              </tr>
            )) :
            rows?.length > 0 && rows?.map((row, index) => (
              <tr onClick={() => { navigate(linksTo, { state: { user: row } }) }} className={`hover:bg-gray-200 ${index % 2 != 0 ? 'bg-gray-100' : ''} cursor-pointer flex-col`}>
                {
                  Object.values(row)?.map((value) => (
                    <td className='border border-gray-300 border-2 border-x-0 px-4 py-2 text-left'>{value}</td>
                  ))
                }
              </tr>
            ))
        }
      </tbody>
    </table>
  )
}