import React, { useState } from 'react'

export default function Navbar({openSidebar, toggleSidebar}) {
  const [search, setSearch] = useState('');
  const authUser = JSON.parse(localStorage.getItem('authUser'));

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    window.location.href = '/admin/login';
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-md text-gray-800">
      {/* Left Section - Sidebar Toggle */}
      {!openSidebar && (
        <div className="flex items-center">
          <div className="cursor-pointer group relative w-32 h-8">
            <span className="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0 flex items-center">
              Logo
            </span>
            <span
              className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center text-blue-600 font-medium cursor-pointer"
              onClick={toggleSidebar}
            >
              👀 Open Sidebar
            </span>
          </div>
        </div>
      )}

      {/* Right Section - User Info & Logout */}
      <div className="flex items-center gap-4">
        <ul className="flex justify-end gap-4 items-center">
          <li className="flex items-center gap-3">
            <img
              src={authUser?.image_url}
              alt={authUser?.name}
              className="bg-gray-300 w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium">{authUser?.name}</span>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}