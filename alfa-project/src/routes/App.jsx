import { createBrowserRouter } from "react-router-dom";
import Home from "../views/Home";
import Login from '../views/Login';


const App = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
 
]);

export default App;
