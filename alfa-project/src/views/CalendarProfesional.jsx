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
  const [successMessage, setSuccessMessage] = useState("");

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

  const updateAsistencia = async (idTurno, check) => {
    setIsLoading(true);
    setError(false);
    setSuccessMessage("");
  
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/asistir/${idTurno}?check=${check}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 401) {
        console.log("Token expirado");
        handleTokenExpiration();
        return;
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el turno");
      }
  
      const data = await response.json();
      setTurnos((prevTurnos) =>
        prevTurnos.map((turno) =>
          turno.id_turno === idTurno ? { ...turno, estado: check ? "Asistió" : "No asistió" } : turno
        )
      ); 
      setSuccessMessage(data.msg || "Estado del turno actualizado exitosamente.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar el turno:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
    
  };

  const getEventsForDate = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return turnos.filter(
      (turno) => new Date(turno.fecha).toISOString().split("T")[0] === formattedDate
    );
  };

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
            key={turno.id_turno || index}
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
                onClick={() => updateAsistencia(turno.id_turno, true)}
              >
                Asistió
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded-md"
                onClick={() => updateAsistencia(turno.id_turno, false)}
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

  const highlightDates = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const hasAppointments = turnos.some(
      (turno) => new Date(turno.fecha).toISOString().split("T")[0] === formattedDate
    );
    return hasAppointments ? "bg-green-300" : null;
  };

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
          {successMessage && (
            <p className="text-emerald-500 font-semibold text-center mb-4">
              {successMessage}
            </p>
          )}
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
