import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import Navbar from "./components/Navbar";

const EditarDisponibilidad = () => {
  const { token } = useAuth("state");
  const { handleTokenExpiration } = useAuth("actions");

  const [idProfesional, setIdProfesional] = useState(null);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [nuevaDisponibilidad, setNuevaDisponibilidad] = useState([
    { dias_semana: [], hora_inicio: "", hora_fin: "" },
  ]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const fetchDatosProfesional = async () => {
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
        return;
      }

      if (!response.ok) {
        throw new Error("Error al obtener los datos del profesional");
      }

      const data = await response.json();
      setIdProfesional(data.id_profesional);
    } catch (error) {
      console.error("Error al obtener los datos del profesional:", error.message);
    }
  };

  const fetchDisponibilidad = async (idProfesional) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/disponibilidad/${idProfesional}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }

      if (!response.ok) {
        throw new Error("Error al obtener la disponibilidad");
      }

      const data = await response.json();
      setDisponibilidades(data || []);
    } catch (error) {
      console.error("Error al obtener la disponibilidad:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null);

    const formattedDisponibilidad = nuevaDisponibilidad.map((disp) => ({
      dias_semana: disp.dias_semana.join(","),
      hora_inicio: `${disp.hora_inicio}:00`,
      hora_fin: `${disp.hora_fin}:00`,
      id_horario: null,
    }));

    try {
      const response = await fetch( `${import.meta.env.VITE_API_URL}modificar_disponibilidad`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          disponibilidades: formattedDisponibilidad,
        }),
      });

      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }

      if (!response.ok) {
        throw new Error("Error al modificar la disponibilidad");
      }

      const data = await response.json();
      setSuccessMessage(data.msg || "Disponibilidad modificada exitosamente");
      fetchDisponibilidad(idProfesional);
    } catch (err) {
      console.error("Error al modificar disponibilidad:", err.message);
      setError(err.message);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedDisponibilidades = [...nuevaDisponibilidad];

    if (field === "dias_semana") {
      const selectedDays = updatedDisponibilidades[index].dias_semana;
      if (selectedDays.includes(value)) {
        updatedDisponibilidades[index].dias_semana = selectedDays.filter((day) => day !== value);
      } else {
        updatedDisponibilidades[index].dias_semana.push(value);
      }
    } else {
      updatedDisponibilidades[index][field] = value;
    }

    setNuevaDisponibilidad(updatedDisponibilidades);
  };

  const addHorario = () => {
    setNuevaDisponibilidad([
      ...nuevaDisponibilidad,
      { dias_semana: [], hora_inicio: "", hora_fin: "" },
    ]);
  };

  const removeHorario = (index) => {
    const updatedDisponibilidades = nuevaDisponibilidad.filter((_, i) => i !== index);
    setNuevaDisponibilidad(updatedDisponibilidades);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDatosProfesional();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (idProfesional) {
      fetchDisponibilidad(idProfesional);
    }
  }, [idProfesional]);

  return (
    <>
      <Navbar />
    <section className="bg-cyan-100 min-h-screen flex items-center flex-col p-9">
      <h1 className="text-2xl font-bold mb-4">Gestionar Disponibilidad</h1>
      <div className="flex flex-row md:flex-row gap-3  max-h-full mx-8  items-start">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Disponibilidad actual</h2>
        {disponibilidades.length > 0 ? (
          disponibilidades.map((disp, index) => (
            <div key={index} className="mb-2 border-b pb-2">
              <p><strong>Días:</strong> {disp.dias_semana}</p>
              <p><strong>Horario:</strong> {disp.hora_inicio} - {disp.hora_fin}</p>
            </div>
          ))
        ) : (
          <p>No hay disponibilidad registrada.</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-cyan-500 shadow-lg rounded-lg p-8 w-full flex gap-2 flex-col "
      >
        <h2 className="text-xl font-semibold mb-4">Modificar Disponibilidad</h2>
        {nuevaDisponibilidad.map((disp, index) => (
          <div key={index} className="p-4 rounded-md bg-white mb-4">
            <h3 className="text-lg font-medium mb-2">Horario {index + 1}</h3>
            <div className="space-y-2">
              <div>
                <label className="block font-medium mb-1">Días de la semana:</label>
                <div className="flex flex-wrap gap-2">
                  {diasSemana.map((dia) => (
                    <label key={dia} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={disp.dias_semana.includes(dia)}
                        onChange={() => handleInputChange(index, "dias_semana", dia)}
                      />
                      {dia}
                    </label>
                    
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Hora de inicio:</label>
                <input
                  type="time"
                  value={disp.hora_inicio}
                  onChange={(e) => handleInputChange(index, "hora_inicio", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Hora de fin:</label>
                <input
                  type="time"
                  value={disp.hora_fin}
                  onChange={(e) => handleInputChange(index, "hora_fin", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeHorario(index)}
                className="text-red-500 mt-2"
              >
                Limpiar este horario
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addHorario}
          className="px-4 py-2 bg-blue-500 text-white rounded-md  hover:bg-teal-500 hover:text-white"
        >
          Agregar otro horario
        </button>
        <button type="submit" className="px-4 py-2 bg-teal-300 text-blue-600 rounded-md hover:bg-emerald-500 hover:text-white">
          Guardar cambios
        </button>
      </form>
      </div>
      {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="flex justify-center mt-8">
          <button className="bg-teal-300 text-blue-600 px-6 py-3 rounded-md hover:bg-teal-500 hover:text-white">
            <NavLink to="/dashboard-profesional">Volver</NavLink>
          </button>
        </div>
    </section>
    </>
  );
};

export default EditarDisponibilidad;
