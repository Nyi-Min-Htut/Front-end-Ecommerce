import React, { useState } from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

export default function HomePageLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      <Navbar onSearchChange={setSearchQuery}/>
      <Outlet context={{searchQuery}}/>
    </div>
  )
}
