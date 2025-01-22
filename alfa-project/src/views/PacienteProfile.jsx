import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"; 
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import { NavLink } from "react-router-dom";

function PacienteProfile() {
  const { token } = useAuth("state"); // Obtiene el token desde el estado global
  const { handleTokenExpiration } = useAuth("actions"); // Acción para manejar la expiración del token
  const [paciente, setPaciente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      setIsLoading(false);
      return;
    }

    const fetchPacienteData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/datos_paciente", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado
          },
        });

        if (response.status === 401) {
          // Si la respuesta es 401, significa que el token expiró
          handleTokenExpiration(); // Llama a la acción para manejar la expiración del token
          setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          return;
        }

        if (!response.ok) {
          throw new Error("Error al obtener los datos del paciente.");
        }

        const data = await response.json();
        setPaciente(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPacienteData();
  }, [token, handleTokenExpiration]); // Dependencias: se ejecuta cuando cambien `token` o `handleTokenExpiration`

  if (isLoading) {
    return <div>Cargando datos del paciente...</div>;
  }

  if (error) {
    return <div className="text-red-500 font-semibold">Error: {error}</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="flex flex-col h-full lg:h-[763px] bg-cyan-100 p-10">
    <div className="p-6 max-w-3xl mx-auto w-full bg-teal-200 shadow rounded-lg mt-20">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold text-gray-900">
          Información del Paciente
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Tus datos:
        </p>
      </div>
      <div className="mt-6 border-t border-cyan-500">
        <dl className="divide-y divide-cyan-500">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Nombre</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {paciente.nombre}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Apellido</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {paciente.apellido}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Correo</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {paciente.correo}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">DNI</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {paciente.dni}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Obra Social</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
              {paciente.obra_social}
            </dd>
          </div>
        </dl>
      </div>
      </div>
      <div className="flex justify-center mt-8">
          
          <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
                    <NavLink to="/">Volver</NavLink>
          </button>
        </div>
    </div>
    
    
    <Footer/>
    </>
  );
}

export default PacienteProfile;
