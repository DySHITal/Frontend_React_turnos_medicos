import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./components/Navbar";
import { NavLink } from "react-router-dom";

const CalendarProfesional = () => {
  const { token } = useAuth("state");
  const { handleTokenExpiration } = useAuth("actions");
  const [turnos, setTurnos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch turnos
  const fetchTurnos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:5000/turnos_profesional", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        handleTokenExpiration();
        throw new Error("Token expirado. Por favor, inicie sesión nuevamente.");
      }
      if (!response.ok) {
        throw new Error("Error al obtener los turnos. Intente más tarde.");
      }

      const data = await response.json();
      setTurnos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar asistencia
  const updateAsistencia = async (idTurno, asistio) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/turnos/${idTurno}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ asistio }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la asistencia.");
      }

      // Actualizar estado local
      setTurnos((prevTurnos) =>
        prevTurnos.map((turno) =>
          turno.id === idTurno ? { ...turno, asistio } : turno
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Filtrar turnos por fecha seleccionada
  const getEventsForDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return turnos.filter(
      (turno) => new Date(turno.fecha).toISOString().split("T")[0] === formattedDate
    );
  };

  // Renderizar turnos con asistencia
  const renderTurnos = () => {
    const events = getEventsForDate(selectedDate);
    if (events.length === 0) {
      return <p>No hay turnos para esta fecha.</p>;
    }
    return (
      <div className="">
      <ul role="list"
              className="w-45 min-h-[500px] sm:min-h-[200px] "
            >
        {events.map((turno, index) => (
          <li
            key={turno.id || index}
            className={`p-2 border rounded-md shadow-sm ${
              turno.asistio === true
                ? "bg-green-100"
                : turno.asistio === false
                ? "bg-red-100"
                : "bg-gray-50"
            }`}
          >
            <strong>Hora:</strong> {turno.hora}  <strong>Paciente:</strong> {turno.nombre}{" "}
            {turno.apellido}
            <div className="mt-2">
              <button
                className="px-3 py-1 mr-2 bg-green-500 text-white rounded-md"
                onClick={() => updateAsistencia(turno.id, true)}
              >
                Asistió
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded-md"
                onClick={() => updateAsistencia(turno.id, false)}
              >
                No Asistió
              </button>
            </div>
          </li>
        ))}
      </ul>
      </div>
    );
  };

  // Resaltar fechas con turnos en el calendario
  const highlightDates = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const hasAppointments = turnos.some(
      (turno) => new Date(turno.fecha).toISOString().split("T")[0] === formattedDate
    );
    return hasAppointments ? "bg-green-300" : null;
  };

  // Fetch turnos al montar el componente
  useEffect(() => {
    fetchTurnos();
  }, []);

  if (isLoading) return <p>Cargando turnos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
    <Navbar />
    <section className=" flex items-center flex-col p-6 bg-cyan-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Calendario de Turnos</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendario */}
        <div className="w-full ">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={highlightDates}
          />
        </div>

        {/* Lista de turnos */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Turnos para el {selectedDate.toLocaleDateString()}
          </h2>
          {renderTurnos()}
        </div>
     </div>
     <div className="flex justify-center mt-11">
            
            <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
              <NavLink to="/dashboard-profesional">Volver</NavLink>
            </button>
          
      </div>
    </section>
   
    </>
  );
};

export default CalendarProfesional;
