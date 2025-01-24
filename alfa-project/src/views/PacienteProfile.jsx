import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext"; 
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import { NavLink } from "react-router-dom";

function PacienteProfile() {
  const { token } = useAuth("state"); 
  const { handleTokenExpiration } = useAuth("actions"); 
  const [paciente, setPaciente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    dni: '',
    obra_social: ''
  });

  const nombreRef = useRef(null);
  const apellidoRef = useRef(null);
  const correoRef = useRef(null);
  const dniRef = useRef(null);
  const obraSocialRef = useRef(null);

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
            Authorization: `Bearer ${token}`, 
          },
        });

        if (response.status === 401) {
          handleTokenExpiration(); 
          setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          return;
        }

        if (!response.ok) {
          throw new Error("Error al obtener los datos del paciente.");
        }

        const data = await response.json();
        setPaciente(data);
        setFormData({
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          dni: data.dni,
          obra_social: data.obra_social
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPacienteData();
  }, [token, handleTokenExpiration]);

  const handleEditClick = () => {
    setIsEditing(true); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/modificar_paciente", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 401) {
        console.log("Token expirado");
        handleTokenExpiration();
        return;
      }

      if (!response.ok) {
        throw new Error("Error al modificar el paciente");
      }

      const data = await response.json();
      setSuccessMessage(data.msg || "Paciente modificado exitosamente"); 
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
      setIsEditing(false);
      setPaciente(formData);
    } catch (err) {
      alert(err.message); 
    }
  };

  if (isLoading) {
    return <div>Cargando datos del paciente...</div>;
  }

  if (error) {
    return <div className="text-red-500 font-semibold">Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-full lg:h-[763px] bg-cyan-100 p-9">
          {successMessage && (
            <p className="text-emerald-500 font-semibold text-center">
              {successMessage}
            </p>
          )}
        <div className="p-6 max-w-3xl mx-auto w-full bg-teal-200 shadow rounded-lg mt-20">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold text-gray-900">Información del Paciente</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Tus datos:</p>
          </div>
          <div className="mt-6 border-t border-cyan-500">
            <dl className="divide-y divide-cyan-500">
              {['nombre', 'apellido', 'correo', 'dni', 'obra_social'].map((field, index) => (
                <div key={index} className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">{field.charAt(0).toUpperCase() + field.slice(1)}</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {isEditing ? (
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        ref={field === 'nombre' ? nombreRef : 
                            field === 'apellido' ? apellidoRef : 
                            field === 'correo' ? correoRef : 
                            field === 'dni' ? dniRef : obraSocialRef}
                        className="p-2 border border-gray-300 rounded"
                      />
                    ) : (
                      paciente[field]
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex justify-center mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="bg-teal-500 text-white px-6 py-3 mx-6 rounded-md hover:bg-teal-700"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-800 px-6 py-3 mx-6 rounded-md hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={handleEditClick}
                className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white"
              >
                Editar
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-8">
        {isEditing ? (
              <>
                <button className="hidden bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
                     <NavLink to="/">Volver</NavLink>
           </button>
              </>
            ) : (
              <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
                     <NavLink to="/">Volver</NavLink>
           </button>
            )}
           
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PacienteProfile;
