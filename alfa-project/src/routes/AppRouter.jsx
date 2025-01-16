import { createBrowserRouter } from "react-router-dom";
import Home from "../views/Home";
import Login from '../views/Login';
import Register from '../views/Register';
import Layout from "../Layout";
import ProtectedRoute from "../contexts/ProtectedRout";


const AppRouter = createBrowserRouter([
  {
      element: <Layout />,
      children: [   
          {
            path: "/",
            element:
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>,
          },
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/register",
            element: <Register />,
          },
      ],
  }, 
 
]);

export default AppRouter;
