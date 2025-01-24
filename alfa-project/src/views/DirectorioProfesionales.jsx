import React, { useEffect, useState } from "react";
import medico from "../assets/medico-icono.png";
import Navbar from "./components/Navbar";
import img2 from "../assets/imgCMI-2.jpg";
import Footer from "./components/Footer";
import { NavLink } from "react-router-dom";

const DirectorioProfesionales = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchObrasSociales = async (id_profesional) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/os_profesional/${id_profesional}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`No se encontraron obras sociales para el profesional ${id_profesional}.`);
          return [];
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const obrasSociales = data.map(item => item[0]); 
      return obrasSociales;
    } catch (error) {
      console.error(`Error al obtener obras sociales para el profesional ${id_profesional}: ${error.message}`);
      return [];
    }
  };

  
  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/get_profesionales", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los profesionales.");
        }
        const profesionales = await response.json();

        
        for (const profesional of profesionales) {
          const obrasSociales = await fetchObrasSociales(profesional.id_profesional);
          profesional.obrasSociales = obrasSociales;
        }

        
        setProfesionales(profesionales); 
      } catch (err) {
        console.error("Error general:", err.message);
        setError(err.message)
      } finally {
        setLoading(false); 
      }
    };

    fetchProfesionales();
  }, []); 

  if (loading) {
    return (
      <div className="text-center py-24">
        <p className="text-lg font-semibold text-gray-700">Cargando profesionales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-lg font-semibold text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-full bg-cyan-500 relative isolate overflow-hidden sm:py-12">
        <img
          src={img2}
          alt="Centro Médico Integral"
          className="absolute inset-0 -z-10 w-full h-full sm:h-[540px] lg:h-[740px] md:h-[640px] object-cover object-center"
        />
        <div className="relative max-auto p-10 py-14 shadow-lg rounded-lg mx-28 flex items-center justify-center my-4">
          <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-200 to-cyan-500 opacity-50 rounded-lg"></div>
            <div className="max-w-xl">
              <h2 className="text-pretty text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                Nuestros Profesionales
              </h2>
              <p className="mt-16 text-xl font-medium text-gray-600">
                Conoce a los especialistas que forman parte de nuestro equipo. Estamos comprometidos a ofrecer la mejor atención médica.
              </p>
            </div>
            <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
              {profesionales.map((profesional) => (
                <li key={profesional.id_profesional}>
                  <div className="flex items-center gap-x-6">
                    <img
                      className="h-16 w-16 rounded-full"
                      src={medico}
                      alt="medico-icono"
                    />
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-gray-900">
                        {profesional.nombre} {profesional.apellido}
                      </h3>
                      <p className="text-sm font-semibold text-indigo-600">{profesional.especialidad}</p>
                      <p className="text-sm font-semibold text-gray-700">{profesional.numero_matricula}</p>
                      <p className="text-sm font-semibold text-indigo-600">{profesional.correo}</p>
                      <p className="text-sm font-semibold text-gray-700 mt-2">
                        <strong>Obras Sociales:</strong>{" "}
                        {profesional.obrasSociales && profesional.obrasSociales.length > 0
                          ? profesional.obrasSociales.join(", ")
                          : "No disponible"}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
            <NavLink to="/crear-turno">Reservar Turno</NavLink>
          </button>
          <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
            <NavLink to="/">Volver</NavLink>
          </button>
        </div>
        <div className="mt-9">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default DirectorioProfesionales;
