import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { mappings } from '../constants';


export default function Table({ columns, columnNames, rows, className, linksTo, onRowClick }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full overflow-x-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>
        <thead>
          <tr className="border-b border-border">
            {columnNames?.length ?
              columnNames?.map((column, index) => (
                <th key={index} className="h-10 px-2 text-left align-middle font-medium text-foreground capitalize whitespace-nowrap">
                  {column}
                </th>
              ))
              : columns?.length > 0 ?
                columns?.map((column, index) => (
                  <th key={index} className="h-10 px-2 text-left align-middle font-medium text-foreground capitalize whitespace-nowrap">
                    {column}
                  </th>
                )) :
                rows?.length > 0 && Object.keys(rows[0])?.map((column, index) => (
                  <th key={index} className="h-10 px-2 text-left align-middle font-medium text-foreground capitalize whitespace-nowrap">
                    {column}
                  </th>
                ))
            }
          </tr>
        </thead>
        <tbody>
          {
            columns?.length > 0 ?
              rows?.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    if (linksTo) navigate(linksTo, { state: { user: row }});
                    if (onRowClick) onRowClick(row);
                  }}
                  className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                >
                  {
                    columns.map((column, colIndex) => (
                      column === ' ' ?
                        <td key={colIndex} className="p-2 align-middle whitespace-nowrap">
                          <div className="flex gap-2">
                            {row['is_active'] ?
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Active
                              </span> :
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                Inactive
                              </span>
                            }
                            {row['is_elevated_user'] &&
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                Elevated
                              </span>
                            }
                            {row['is_superuser'] &&
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Super
                              </span>
                            }
                          </div>
                        </td> :
                        <td key={colIndex} className="p-2 align-middle whitespace-nowrap">
                          {mappings[row[column]] || row[column]}
                        </td>
                    ))
                  }
                </tr>
              )) :
              rows?.length > 0 && rows?.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    if (linksTo) navigate(linksTo, { state: { user: row } });
                    if (onRowClick) onRowClick(row);
                  }}
                  className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                >
                  {
                    Object.values(row)?.map((value, valueIndex) => (
                      <td key={valueIndex} className="p-2 align-middle whitespace-nowrap">
                        {mappings[value] || value}
                      </td>
                    ))
                  }
                </tr>
              ))
          }
        </tbody>
      </table>
    </div>
  )
}