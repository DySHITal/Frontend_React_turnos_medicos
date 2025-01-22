import { createBrowserRouter } from "react-router-dom";
import Home from "../views/Home";
import Login from '../views/Login';
import Register from '../views/Register';
import Layout from "../Layout";
import ProtectedRoute from "../contexts/ProtectedRout";
import Inicio from "../views/Inicio";
import CreateTurno from "../views/CreateTurno";
import TurnosPaciente from "../views/TurnosPaciente";
import DirectorioProfesionales from "../views/DirectorioProfesionales";
import PacienteProfile from "../views/PacienteProfile";



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
          {
            path: "/inicio",
            element: <Inicio />,
          },
          {
            path: "/crear-turno",
            element: 
            
            <ProtectedRoute>
              <CreateTurno />
            </ProtectedRoute>,
          },
          {
            path: "/turnos-paciente",
            element: 
            
            <ProtectedRoute>
              <TurnosPaciente />
            </ProtectedRoute>,
          },
          {
            path: "/directorio-profesionales",
            element: <DirectorioProfesionales/>
          },
          {
            path: "/paciente-profile",
            element: 
            
            <ProtectedRoute>
              <PacienteProfile />
            </ProtectedRoute>,
          },
          
      ],
  }, 
 
]);

export default AppRouter;
