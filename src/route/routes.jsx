import { createBrowserRouter } from 'react-router-dom'
import Layout from '../AdminPanel/Layout';
import Category from '../AdminPanel/AdminPages/Category';
import Employee from '../AdminPanel/AdminPages/Employee';
import Product from '../AdminPanel/AdminPages/Product';
import ProductCreatePage from '../AdminPanel/AdminPages/ProductCreatePage';
import Attribute from '../AdminPanel/AdminPages/Attribute';
import Role from '../AdminPanel/AdminPages/Role';
import ProductEditPage from '../AdminPanel/AdminPages/ProductEditPage';
import EmployeeCreate from '../AdminPanel/AdminPages/EmployeeCreate';

const router = createBrowserRouter([
  {
    path:"/",
    element: <Layout/>,
    children:[
      {
        path:"employees",
        element: <Employee/>
      },
      {
        path:"employees/create",
        element: <EmployeeCreate/>
      },
      {
        path:"categories",
        element: <Category/>
      },
      {
        path:"products",
        element: <Product/>
      },
      {
        path:"products/create",
        element: <ProductCreatePage/>
      },
      {
        path:"products/:id/edit",
        element: <ProductEditPage/>
      },
      {
        path:"attributes",
        element: <Attribute/>
      },
      {
        path:'roles',
        element: <Role/>
      }

    ]
  }
]);


export default router;