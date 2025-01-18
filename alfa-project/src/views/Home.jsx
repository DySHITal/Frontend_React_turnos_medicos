import Navbar from './components/Navbar';
import img1 from '../assets/imgCMI-3.jpg';

function Home() {
 

  return (
    <>
      <div className='h-screen bg-cyan-500 relative isolate overflow-hidden'>
      {/* Navbar */}
      <Navbar/> 
      
          <img
              src={img1}
              alt="Centro Médico Integral"
              className="absolute inset-0 -z-10 w-full h-full object-cover object-center"
          />
      {/* Hero Section */}
      <section className=" text-center py-20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">¡Gestiona tus turnos médicos de forma sencilla!</h2>
          <p className="text-lg mb-8">Reserva tus turnos con los mejores profesionales médicos en pocos clics.</p>
          <button className="bg-teal-300 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-500 hover:text-white">
            Reservar Turno
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
      <footer className="bg-cyan-500 text-black py-8 h-screen ">
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