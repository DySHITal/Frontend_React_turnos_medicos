import { Link, NavLink } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth("state");
  const { logout } = useAuth("actions");

  return (
    <>
      <div className='h-screen bg-cyan-500'>
      {/* Navbar */}
      <header className="bg-cyan-500 text-black py-4">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Centro Médico Integral</h1>
          <ul className="flex gap-6">
            <li>
              <a href="/inicio" className="hover:underline">Inicio</a>
            </li>
            <li>
              <a href="#services" className="hover:underline">Servicios</a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">Contacto</a>
            </li>
            <li>
            <div className="bg-teal-200 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white">
                    
                    {isAuthenticated ? (
                        
                         <button
                         onClick={logout}
                         className="navbar-item button is-danger"
                     >
                         Logout
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
                Registrarse
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-cyan-100 text-center py-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">¡Gestiona tus turnos médicos de forma sencilla!</h2>
          <p className="text-lg mb-8">Reserva tus turnos con los mejores profesionales médicos en pocos clics.</p>
          <button className="bg-teal-300 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-500 hover:text-white">
            Reservar Turno
          </button>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="services" className="py-20 bg-cyan-100 ">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12">Nuestros Servicios</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-teal-200 shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold mb-2">Agenda de Turnos</h4>
              <p>Reserva tus turnos médicos con facilidad y rapidez.</p>
            </div>
            <div className="bg-teal-200 shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold mb-2">Historial Médico</h4>
              <p>Consulta tu historial médico desde cualquier lugar.</p>
            </div>
            <div className="bg-teal-200 shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold mb-2">Médicos Calificados</h4>
              <p>Accede a un directorio de profesionales confiables.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cyan-500 text-black py-8 ">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Centro Medico Integral. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:underline">Política de Privacidad</a>
            <a href="#" className="hover:underline">Términos de Uso</a>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}

export default Home