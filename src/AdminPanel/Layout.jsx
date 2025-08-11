import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  const [open, setOpen] = React.useState(false);
  const [openSidebar, setOpenSidebar] = useState(true);

  console.log(openSidebar);
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  return (

    <div className="flex h-screen">
      <ToastContainer />
      {/* Sidebar with smooth transition */}
      <Sidebar sidebarstatus= {openSidebar} toggleSidebar={toggleSidebar}/>
      
      <div className="flex flex-col w-full">
        <Navbar sidebarstatus={openSidebar} toggleSidebar={toggleSidebar}/>
        <div className="flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}