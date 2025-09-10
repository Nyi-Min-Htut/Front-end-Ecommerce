import React from 'react'
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Button from "@mui/material/Button";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import { Outlet, NavLink } from "react-router-dom";
import CategoryIcon from '@mui/icons-material/Category';
import AnimationIcon from '@mui/icons-material/Animation';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';


export default function Sidebar({sidebarstatus,toggleSidebar}) {

    const sidebarClick =()=>
    {
        toggleSidebar();
    }

  return (

      <div
        className={`bg-black text-white transition-all duration-300 ease-in-out ${
          sidebarstatus ? "w-1/5 opacity-100" : "w-0 opacity-0 overflow-hidden"
        }`}
      >
        <ul>
          <div className="py-4 px-7 mb-10 flex justify-between items-center cursor-pointer">
            <li className="text-left">LOGO</li>
            <li className="text-right">
              <ViewSidebarIcon onClick={sidebarClick} />
            </li>
          </div>

          {/* list of sidebar */}
        <NavLink 
            to="/employees" 
            className={({ isActive }) => 
              `block ${isActive ? "text-white bg-gray-800" : "text-gray-400"}`
            }
          >
            <li className="text-center hover:text-gray-100 transition-all duration-300 border-transparent py-3">
              <PersonIcon className="mr-5" />
              <span className="w-1/5">Admin</span>
            </li>
          </NavLink>

           <NavLink 
            to="/roles" 
            className={({ isActive }) => 
              `block ${isActive ? "text-white bg-gray-800" : "text-gray-400"}`
            }
          >
            <li className="text-center hover:text-gray-100 transition-all duration-300 border-transparent py-3">
              <PersonIcon className="mr-5" />
              <span className="w-1/5">Roles</span>
            </li>
          </NavLink>

          {/* Customer link with active state */}
          <NavLink 
            to="/categories" 
            className={({ isActive }) => 
              `block ${isActive ? "text-white bg-gray-800" : "text-gray-400"}`
            }
          >
            <li className="text-center hover:text-gray-100 transition-all duration-300 border-transparent py-3">
              <CategoryIcon className="mr-5" />
              <span className="w-1/5">Category</span>
            </li>
          </NavLink>

          <NavLink 
            to="/products" 
            className={({ isActive }) => 
              `block ${isActive ? "text-white bg-gray-800" : "text-gray-400"}`
            }
          >
            <li className="text-center hover:text-gray-100 transition-all duration-300 border-transparent py-3">
              <CheckBoxOutlineBlankIcon className="mr-5" />
              <span className="w-1/5">Products</span>
            </li>
          </NavLink>

           <NavLink 
            to="/attributes" 
            className={({ isActive }) => 
              `block ${isActive ? "text-white bg-gray-800" : "text-gray-400"}`
            }
          >
            <li className="text-center hover:text-gray-100 transition-all duration-300 border-transparent py-3">
              <AnimationIcon className="mr-5" />
              <span className="w-1/5">Attributes</span>
            </li>
          </NavLink>
        </ul>
      </div>
  )
}
