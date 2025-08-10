import { createBrowserRouter } from 'react-router-dom'
import Layout from '../AdminPanel/Layout';
import Category from '../AdminPanel/AdminPages/Category';
import Employee from '../AdminPanel/AdminPages/Employee';


const router = createBrowserRouter([
  {
    path:"/",
    element: <Layout/>,
    children:[
      {
        path:"admin",
        element: <Employee/>
      },
      {
        path:"categories",
        element: <Category/>
      }
    ]
  }
]);


export default router;