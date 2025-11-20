import { createBrowserRouter } from 'react-router-dom'
import Layout from '../AdminPanel/Layout';
import Category from '../AdminPanel/AdminPages/Category';
import Employee from '../AdminPanel/AdminPages/Employee';
import Product from '../AdminPanel/AdminPages/Product';
import ProductVariation from '../AdminPanel/AdminPages/ProductVariation';
import ProductCreatePage from '../AdminPanel/AdminPages/ProductCreatePage';
import Attribute from '../AdminPanel/AdminPages/Attribute';
import Role from '../AdminPanel/AdminPages/Role';
import ProductEditPage from '../AdminPanel/AdminPages/ProductEditPage';
import EmployeeCreate from '../AdminPanel/AdminPages/EmployeeCreate';
import LoginPage from '../AdminPanel/AdminPages/LoginPage';
import ProtectedRoute from '../AdminPanel/AdminPages/ProtectedRoute';
import HomePageLayout from '../AdminPanel/Ecommerce/Layout/HomePageLayout';
import HomePage from '../AdminPanel/Ecommerce/Layout/Pages/HomePage';
import ProductDetail from '../AdminPanel/Ecommerce/Layout/Pages/ProductDetail';
import ProductDetailAP from '../AdminPanel/AdminPages/ProductDetailAP';
import OrderListPage from '../AdminPanel/Ecommerce/Layout/Pages/OrderlistPage';
import OrderDetail from '../AdminPanel/Ecommerce/Layout/Pages/OrderDetailPage';
import CustomerRegister from '../AdminPanel/Ecommerce/Layout/Pages/CustomerRegister';
import CustomerLogin from '../AdminPanel/Ecommerce/Layout/Pages/CustomerLogin';
import Brand from '../AdminPanel/AdminPages/Brand';
import VariantEdit from '../AdminPanel/AdminPages/VariantEdit';
import EmployeeEditPage from '../AdminPanel/AdminPages/EmployeeEdit';

const router = createBrowserRouter([
  {
    path:"/adminlogin",
    element: <LoginPage/>
  },
  {
    path:'/register',
    element: <CustomerRegister/>
  },
  {
    path:'/login',
    element: <CustomerLogin/>
  },
  {
    path:'/',
    element: <HomePageLayout/>,
    children:[
      {
        path:"/",
        element: <HomePage/>
      },
      {
        path:'/home',
        element: <HomePage/>
      },
      {
        path:'/products/:id',
        element: <ProductDetail/>
      },
      {
        path:'/orderedlist',
        element: <OrderListPage/>
      },
      {
        path:'/orderedlist/:id',
        element: <OrderDetail/>
      }
      
    ]
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Layout />, // Layout wraps all children
        children: [
          { path: "employees", element: <Employee /> },
          { path: "employees/create", element: <EmployeeCreate /> },
          { path: "employees/:id/edit",element: <EmployeeEditPage/>},
          { path: "categories", element: <Category /> },
          { path: "products", element: <Product /> },
          {path: "products_variations_create/:id", element: <ProductVariation/>},
          {path: "variants/:id/edit", element: <VariantEdit/>},
          {path: "products/:id/details",element: <ProductDetailAP/>},
          { path: "products/create", element: <ProductCreatePage /> },
          { path: "products/:id/edit", element: <ProductEditPage /> },
          { path: "attributes", element: <Attribute /> },
          { path: "roles", element: <Role /> },
          { path: "brands", element: <Brand/> }
        ]
      }
    ]
  },
  {
    path: "/unauthorized",
    element: <div>You do not have access to this page!</div>
  }
]);


export default router;