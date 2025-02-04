import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./components/Navbar";
import { NavLink } from "react-router-dom";
import Footer from "./components/Footer";

function TurnosPaciente() {
  const [turnos, setTurnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { token } = useAuth("state");
  const { handleTokenExpiration } = useAuth("actions");

  // fecha local
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];

  useEffect(() => {
    const fetchTurnos = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}turnos_paciente`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.log("Token expirado");
          handleTokenExpiration();
          return;
        }

        if (!response.ok) {
          throw new Error("Error al obtener los turnos");
        }

        const data = await response.json();

        const formattedTurnos = data.map((turno) => {
          const [hours, minutes] = turno.hora.split(":");
          return {
            id: turno.id_turno,
            fecha: turno.fecha,
            hora: `${hours}:${minutes}`,
            estado: turno.estado,
            nombreProfesional: turno.nombre || "N/A",
            apellidoProfesional: turno.apellido || "N/A",
          };
          
        }).filter((turno) => turno.fecha >= localDate); // Filtrar fechas anteriores a hoy
        setTurnos(formattedTurnos);
      } catch (error) {
        console.error("Error al obtener los turnos:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTurnos();
  }, [token, handleTokenExpiration]);

  const cancelarTurno = async (idTurno, fecha, hora) => {
    setIsLoading(true);
    setIsError(false);
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}cancelar_turno/${idTurno}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fecha: fecha,
            hora: hora,
            Razon: "Cancelado por el paciente",
          }),
        }
      );

      if (response.status === 401) {
        console.log("Token expirado");
        handleTokenExpiration();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        setSuccessMessage("");
        throw new Error(errorData.msg || "Error al cancelar el turno");
      }

      const data = await response.json();
      setTurnos((prevTurnos) =>
        prevTurnos.filter((turno) => turno.id !== idTurno)
      );
      setSuccessMessage(data.msg || "Turno cancelado exitosamente.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error al cancelar turno:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-cyan-100">
          <p className="text-lg text-blue-600">Cargando turnos...</p>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-cyan-100">
          <p className="text-lg text-red-500">Error al cargar los turnos.</p>
        </div>
      </>
    );
  }

  return (
    <>
    <div className="bg-cyan-500 min-h-screen">
      <Navbar />
      <div className="bg-cyan-100 pt-11   ">
        <div className="max-w-5xl mx-auto bg-cyan-500 shadow-lg rounded-lg p-10 mt-16">
          <h1 className="text-2xl font-bold text-center mb-6">Mis Turnos</h1>
          {successMessage && (
            <p className="text-teal-200 font-semibold text-center mb-4">
              {successMessage}
            </p>
          )}
          <div className="h-64 overflow-y-auto"> 
            <table className="w-full table-auto border-collapse border border-cyan-500">
              <thead>
                <tr className="bg-teal-200 text-blue-600">
                  <th className="border border-cyan-500 px-4 py-2 text-left">Fecha</th>
                  <th className="border border-cyan-500 px-4 py-2 text-left">Hora</th>
                  <th className="border border-cyan-500 px-4 py-2 text-left">Estado</th>
                  <th className="border border-cyan-500 px-4 py-2 text-left">Profesional</th>
                  <th className="border border-cyan-500 px-4 py-2 text-left">Cancelar</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map((turno) => {
                  const turnoFechaHora = new Date(`${turno.fecha}T${turno.hora}`); 
                  const ahora = new Date();
                  const diferenciaHoras = (turnoFechaHora - ahora) / (1000 * 60 * 60);

                  const noCancelable = diferenciaHoras < 24; 

                  return (
                    <tr
                      key={turno.id}
                      className={`bg-cyan-100 text-black px-4 py-2 rounded-md hover:bg-teal-400 hover:text-white ${
                        noCancelable && "opacity-80 cursor-not-allowed"
                      }`}
                    >
                      <td className="border border-cyan-500 px-4 py-2">{turno.fecha}</td>
                      <td className="border border-cyan-500 px-4 py-2">{turno.hora}</td>
                      <td className="border border-cyan-500 px-4 py-2">{turno.estado}</td>
                      <td className="border border-cyan-500 px-4 py-2">
                        {turno.nombreProfesional} {turno.apellidoProfesional}
                      </td>
                      <td className="border border-cyan-500 pl-9 py-2 flex ">
                        <button
                          onClick={() => cancelarTurno(turno.id, turno.fecha, turno.hora)}
                          className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 ${
                            noCancelable && "opacity-50 cursor-not-allowed"
                          }`}
                          disabled={noCancelable} 
                        >
                          Cancelar
                        </button>
                        {noCancelable && (
                          <p className="text-base text-red-600 mt-1 justify-center p-1">
                            *
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
                
            </table>
            
          </div>
          <p className="text-base text-red-600 mt-1 justify-center p-1">
                            *No puedes cancelar turnos con menos de 24hs de anticipación.
                          </p>
        </div>
        <div className="flex justify-center mt-12 mb-32">
            <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
              <NavLink to="/crear-turno">Reservar Nuevo Turno</NavLink>
            </button>
            <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
              <NavLink to="/">Volver</NavLink>
            </button>
         </div>
         <div className="align-bottom relative flex-row-reverse">
         <Footer />
         </div>
      </div>
      </div>
    </>
  );
}

export default TurnosPaciente;
