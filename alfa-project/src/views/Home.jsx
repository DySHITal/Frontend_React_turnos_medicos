import Navbar from './components/Navbar';
import img1 from '../assets/imgCMI-3.jpg';
import Footer from './components/Footer';
import { NavLink } from "react-router-dom";

function Home() {
 

  return (
    <>
     <Navbar/> 
      <div className='h-full bg-cyan-500 relative isolate overflow-hidden lg:py-3 lg:pb-32 sm:py-12'>
       
          <img
              src={img1}
              alt="Centro Médico Integral"
              className="absolute inset-0 -z-10 w-full h-full sm:h-[540px] md:h-[640px] lg:h-[700px] object-cover object-center"
          />
      {/* Hero Section */}
      <section className=" text-center py-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">¡Gestiona tus turnos médicos de forma sencilla!</h2>
          <p className="text-lg mb-8">Reserva tus turnos con los mejores profesionales médicos en pocos clics.</p>
          <button className="bg-teal-300 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-500 hover:text-white">
              <NavLink
                  to="/crear-turno"
              >
                  Reservar Turno
              </NavLink>
            
          </button>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-12">Nuestros Servicios</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-teal-200 shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold mb-2">Agenda de Turnos</h4>
              <NavLink
                  to="/turnos-paciente"  className={"hover:text-blue-500 hover:underline"}
              >
                  Revisá tus turnos médicos con facilidad y rapidez
              </NavLink>
            </div>
            <div className="bg-teal-200 shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold mb-2">Perfil</h4>
              <NavLink
                  to="/paciente-profile"  className={"hover:text-blue-500 hover:underline"}
              >
                  Accedé a tus datos personales
              </NavLink>
            </div>
            <div className="bg-teal-200 shadow-md rounded-lg p-6">
              <h4 className="text-xl font-bold mb-2">Médicos Calificados</h4>
              <NavLink
                  to="/directorio-profesionales"  className={"hover:text-blue-500 hover:underline"}
              >
                  Accede a un directorio de profesionales confiables
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
    </>
  )
}

export default Home