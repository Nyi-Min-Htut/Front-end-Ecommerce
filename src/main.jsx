import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './route/routes.jsx'
import { ToastContainer } from "react-toastify";
    

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// const router = createBrowserRouter([
//   {
//     path:"/",
//     element: <App/>,
//   }
// ])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer/>
    <RouterProvider router={router}/>
  </StrictMode>,
)
