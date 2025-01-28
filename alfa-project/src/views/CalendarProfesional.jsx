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
      setError(true);
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
      <div className="space-y-4 rounded p-4  ">
        {events.map((turno) => (
          <div
            key={turno.id_turno}
            className={`p-4 rounded-lg shadow-md border-t-4 border-l-2 border-r-2 border-cyan-600 bg-teal-50 hover:bg-teal-100 ${
              turno.asistio
                ? "bg-emerald-500"
                : turno.asistio === false
                ? "bg-red-200"
                : "bg-gray-100"
            }`}
          >
            <p><strong>Hora:</strong> {turno.hora}</p>
            <p><strong>Paciente:</strong> {turno.nombre} {turno.apellido}</p>
            <p><strong>Estado del turno:</strong> {turno.estado}</p>
            <div className="mt-4">
              <button
                className="px-4 py-2 mr-3 bg-emerald-400 text-white rounded-md hover:bg-blue-500"
                onClick={() => updateAsistencia(turno.id_turno, true)}
              >
                Asistió
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-blue-700"
                onClick={() => updateAsistencia(turno.id_turno, false)}
              >
                No Asistió
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const highlightDates = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const hasAppointments = turnos.some(
      (turno) => new Date(turno.fecha).toISOString().split("T")[0] === formattedDate
    );
    return hasAppointments 
      ? 
    "bg-cyan-200 flex py-8 items-center justify-center rounded-full px-4  font-semibold text-white " 
      : 
    "flex py-8 items-center justify-center rounded-full  font-semibold px-4";
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  if (isLoading) return <p className="text-lg text-blue-500">Cargando turnos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      <section className="flex flex-col items-center p-6 bg-cyan-100 ">
        <h1 className="text-3xl font-semibold mb-6">Calendario de Turnos</h1>
        <div className="flex flex-col md:flex-row  w-full max-h-full p-9 bg-white bg-opacity-65 px-30 rounded-lg">
          {/* Calendario */}
          <div className="w-full mx-9 flex justify-center md:w-1/2 items-center rounded-lg   bg-blue-50 bg-opacity-65 ">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={highlightDates}
              className="rounded-lg shadow-md w-[600px] h-[520px] items-center grid grid-cols-30 border-t-4 border-l-2 border-r-2 my-4 border-cyan-600 border-b-0 bg-cyan-50"
            />
          </div>

          {/* Lista de turnos */}
          <div className="w-full md:w-1/2 max-w-2xl mx-0 max-h-[650px] overflow-auto rounded-lg bg-blue-50 bg-opacity-65 p-4">
            <h2 className="text-xl font-semibold mb-4">
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

        <div className="flex justify-center mt-8">
          <button className="bg-teal-300 text-blue-600 px-6 py-3 rounded-md hover:bg-teal-500 hover:text-white">
            <NavLink to="/dashboard-profesional">Volver</NavLink>
          </button>
        </div>
      </section>
    </>
  );
};

export default CalendarProfesional;
