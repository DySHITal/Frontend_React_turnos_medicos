import { NavLink } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';


function Navbar() {
  const { isAuthenticated } = useAuth("state");
  const { logout } = useAuth("actions");
  const { userType } = useAuth("state");

  return (
    <>
      
      <header className="bg-cyan-500 text-black py-4">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Centro Médico Integral</h1>
          <ul className="flex gap-6">
            <li>
              <a href="/inicio" className="hover:underline">Inicio</a>
            </li>
            <li>
            <a
                href={userType === "profesional" ? "/dashboard-profesional" : "/"}
                className="hover:underline"
              >
                Servicios
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">Sobre Nosotros</a>
            </li>
            <li>
            <div className="bg-teal-200 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white">
                    
                    {isAuthenticated ? (
                        
                         <button
                         onClick={logout}
                         className="navbar-item button is-danger"
                     >
                         Cerrar Sesión
                     </button>
                    ):(
                      
                        <NavLink
                            to="/login"
                            
                            
                        >
                            Iniciar Sesion
                        </NavLink>
                    )}
              </div>
            </li>
            <li>
              <button className="bg-teal-200 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white">
                        <NavLink
                            to="/register"
                            
                            
                        >
                            Registrarse
                        </NavLink>
              </button>
            </li>
          </ul>
        </nav>
      </header>

    </>
  )
}

export default Navbar