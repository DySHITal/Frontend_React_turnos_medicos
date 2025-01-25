import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { NavLink } from "react-router-dom";

function ProfesionalProfile() {
  const { token } = useAuth("state");
  const { handleTokenExpiration } = useAuth("actions");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    numero_matricula: "",
    especialidad: "",
    obras_sociales: [],
  });

  useEffect(() => {
    if (!token) {
      setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      setIsLoading(false);
      return;
    }

    const fetchProfesionalData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/datos_profesional", {
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
          throw new Error("Error al obtener los datos.");
        }

        const data = await response.json();
        setFormData({
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          numero_matricula: data.numero_matricula,
          especialidad: data.especialidad,
          obras_sociales: data.obras_sociales || [],
        });

        await fetchObrasSociales(data.id_profesional);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchObrasSociales = async (id_profesional) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/os_profesional/${id_profesional}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          handleTokenExpiration();
          setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          return;
        }

        if (!response.ok) {
          throw new Error("Error al obtener las obras sociales.");
        }

        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          obras_sociales: data,
        }));
        
      } catch (err) {
        setError("Error al obtener las obras sociales.");
      }
    };

    fetchProfesionalData();
  }, [token, handleTokenExpiration]);


const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "obras_sociales") {
        // Convertir el string separado por comas a un array de strings
        const obrasSocialesArray = value.split(",").map(item => item.trim());
        setFormData((prev) => ({
            ...prev,
            [name]: obrasSocialesArray,
        }));
        } else {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        }
 };
  
  
  const handleSaveChanges = async () => {
    // convertir obras_sociales en un array de strings antes de enviarlo
    const obrasSocialesCorrectas = formData.obras_sociales.flat();

    const bodyData = {
        ...formData,
        obras_sociales: obrasSocialesCorrectas, // array de strings
    };
    try {
      const response = await fetch("http://127.0.0.1:5000/modificar_profesional", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }

      if (!response.ok) {
        throw new Error("Error al modificar");
      }

      const data = await response.json();
      setSuccessMessage(data.msg || "Modificación exitosa");
      setTimeout(() => setSuccessMessage(""), 2000);
      setIsEditing(false);

    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div>Cargando datos del profesional...</div>;
  }

  if (error) {
    return <div className="text-red-500 font-semibold">Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-full  bg-cyan-100 ">
        {successMessage && (
          <p className="text-emerald-500 font-semibold text-center">
            {successMessage}
          </p>
        )}
        <div className="p-6 max-w-3xl mx-auto w-full bg-teal-200 shadow rounded-lg mt-20">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold text-gray-900">
              Información General
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Tus datos:</p>
          </div>
          <div className="mt-6 border-t border-cyan-500">
            <dl className="divide-y divide-cyan-500">
              {Object.entries(formData).map(([key, value]) => (
                <div
                  key={key}
                  className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                >
                  <dt className="text-sm font-medium text-gray-900">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {isEditing && key !== "obras_sociales" ? (
                        <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded"
                        />
                    ) : key === "obras_sociales" && isEditing ? (
                        <input
                        type="text"
                        name="obras_sociales"
                        value={value.join(", ")} // Para mostrar las obras sociales separadas por comas
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="Ingresa las obras sociales separadas por comas"
                        />
                    ) : Array.isArray(value) ? (
                        value.join(", ")
                    ) : (
                        value
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
                  className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-blue-500 text-white px-6 py-3 mx-6 rounded-md hover:bg-cyan-500"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
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
                            <NavLink to="/dashboard-profesional">Volver</NavLink>
                </button>
                    </>
                ) : (
                    <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
                            <NavLink to="/dashboard-profesional">Volver</NavLink>
                </button>
                )}
                
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProfesionalProfile;
