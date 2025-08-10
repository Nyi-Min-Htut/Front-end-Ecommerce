import React from 'react'

export default function Navbar({openSidebar, toggleSidebar}) {
  return (
    <nav className="flex justify-end px-10 py-2 bg-white shadow-md text-gray-800">
          {!openSidebar && (
            <div className="w-1/3 cursor-pointer group">
              <span className="absolute transition-opacity duration-700 opacity-100 group-hover:opacity-0">
                Logo
              </span>
              <span
                className="absolute transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                onClick={toggleSidebar}
              >
                👀 Open Sidebar
              </span>
            </div>
          )}

          <div className="w-2/3 ">
            <ul className="flex justify-end gap-6 px-10 items-center">
              <li>
                <img
                  src="https://i.pinimg.com/1200x/d9/73/ee/d973ee6ac0805aaa90b8234f5dcc6591.jpg"
                  alt=""
                  className="bg-red-300 w-10 h-10 rounded-full"
                />
              </li>
              <li >Admin</li>
            </ul>
          </div>
        </nav>
  )
}
