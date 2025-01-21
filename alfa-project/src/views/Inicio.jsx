import img1 from '../assets/imgCMI-3.jpg';
import Footer from './components/Footer';
import Navbar from './components/Navbar';


function Inicio() {
    

    return (
        <>
        
        <div className="relative isolate overflow-hidden bg-teal-700  h-full sm:h-[600px] md:h-[835px] lg:h-[950px]:">

        <Navbar/>   


            <img
                src={img1}
                alt="Centro Médico Integral"
                className="absolute inset-0 -z-10 w-full  h-full object-cover object-center"
            />

            <div className="relative flex items-center justify-center h-full px-1 lg:px-2 my-7">

                <div className="relative w-full max-auto p-10 py-28 rounded-lg shadow-lg mx-28">
                    <div
                        className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-300 to-cyan-500 opacity-50 rounded-lg "
                        // style={{ mixBlendMode: 'multiply' }}
                    ></div>

                    <div>
                        <h2 className="text-5xl font-semibold tracking-tight text-black sm:text-7xl">
                            Servicios de Salud Integral
                        </h2>
                        <p className="mt-8 text-lg font-medium text-gray-800 sm:text-xl">
                            Brindamos atención médica integral para toda la familia. Nuestros especialistas están
                            comprometidos con tu bienestar y salud.
                        </p>
                    </div>

                    
                    <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold text-black sm:grid-cols-2 md:flex lg:gap-x-10">
                        <a href="#">
                            Consultas Médicas <span aria-hidden="true">&rarr;</span>
                        </a>
                        <a href="#">
                            Servicios de Emergencia <span aria-hidden="true">&rarr;</span>
                        </a>
                        <a href="#">
                            Tratamientos Especializados <span aria-hidden="true">&rarr;</span>
                        </a>
                        <a href="#">
                            Programa de Salud Preventiva <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>

                    <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col-reverse gap-1">
                            <dt className="text-base text-gray-800">Consultas realizadas</dt>
                            <dd className="text-4xl font-semibold tracking-tight text-black">5000+</dd>
                        </div>
                        <div className="flex flex-col-reverse gap-1">
                            <dt className="text-base text-gray-800">Pacientes atendidos</dt>
                            <dd className="text-4xl font-semibold tracking-tight text-black">3000+</dd>
                        </div>
                        <div className="flex flex-col-reverse gap-1">
                            <dt className="text-base text-gray-800">Especialidades disponibles</dt>
                            <dd className="text-4xl font-semibold tracking-tight text-black">15+</dd>
                        </div>
                        <div className="flex flex-col-reverse gap-1">
                            <dt className="text-base text-gray-800">Años de experiencia</dt>
                            <dd className="text-4xl font-semibold tracking-tight text-black">20</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
        <div>
                <Footer/>
        </div>
        </>
    );
}

export default Inicio;
