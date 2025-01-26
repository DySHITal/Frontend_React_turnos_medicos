import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./components/Navbar";
import { NavLink } from "react-router-dom";

function TurnosList() {
  const [turnos, setTurnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { token } = useAuth("state");
  const { handleTokenExpiration } = useAuth("actions");

  useEffect(() => {
    const fetchTurnos = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await fetch("http://127.0.0.1:5000/turnos_profesional", {
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
        const fecha = new Date(turno.fecha); 
        const formattedFecha = fecha.toISOString().split('T')[0];
        const formattedHora = `${hours}:${minutes}`; 
            
            return {
              id: turno.id_turno,
              fecha: formattedFecha,
              hora: formattedHora,
              estado: turno.estado,
              nombrePaciente: turno.nombre || "N/A",
              apellidoPaciente: turno.apellido || "N/A",
            };
          });
          

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

  const actualizarAsistencia = async (idTurno, check) => {
    setIsLoading(true);
    setIsError(false);
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
          turno.id === idTurno ? { ...turno, estado: check ? "Asistió" : "No asistió" } : turno
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

  const cancelarTurno = async (idTurno, fecha, hora) => {
    console.log("f", fecha)
    console.log("h", hora)
    const [hours, minutes] = hora.split(":");
    const formattedHora = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    const turnoFechaHora = new Date(`${fecha}T${formattedHora}:00`);
    const ahora = new Date();
    const diferenciaHoras = (turnoFechaHora - ahora) / (1000 * 60 * 60);

    const noCancelable = diferenciaHoras < 24;

    if (noCancelable) {
        alert("El turno no se puede cancelar porque faltan menos de 24 horas.");
        return;
    }

    // Formatear la fecha y hora, todo es distinto de lo que tenia en pcientes 
    // pero quiere recibir eso en cancelar profesional se hizo un merengue, lo salve con esto
    const fechaFormateada = turnoFechaHora.toISOString().split('T')[0];
    const horaFormateada = `${turnoFechaHora.getHours()}:${turnoFechaHora.getMinutes().toString().padStart(2, "0")}`;

    setIsLoading(true);
    setIsError(false);
    setSuccessMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/cancelar_turno_profesional/${idTurno}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fecha: fechaFormateada,
            hora: horaFormateada,
            Razon: "Cancelado por el Profesional",
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
        prevTurnos.map((turno) =>
          turno.id === idTurno ? { ...turno, estado: turno.estado = "Cancelado por Profesional" } : turno
        )
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
      <Navbar />
      <div className="bg-cyan-100 py-8  min-h-screen ">
        <div className="max-w-5xl mx-auto bg-cyan-500 shadow-lg rounded-lg p-10 mt-16">
          <h1 className="text-2xl font-bold text-center mb-6">Mis Turnos</h1>
          {successMessage && (
            <p className="text-teal-200 font-semibold text-center mb-4">
              {successMessage}
            </p>
          )}
          <div className="h-80 overflow-y-auto"> 
            <table className="w-full table-auto border-collapse border border-cyan-500">
              <thead>
                <tr className="bg-teal-200 text-blue-600">
                  <th className="border border-cyan-500 px-4 py-2 text-left">Fecha</th>
                  <th className="border border-cyan-500 px-4 py-2 text-left">Hora</th>
                  <th className="border border-cyan-500 px-4 py-2 text-left">Estado</th>
                  <th className="border border-cyan-500 px-4 py-2 text-left">Paciente</th>
                  <th className="border border-cyan-500 px-4 py-2 text-left">Asistencia</th>
                  <th className="border border-cyan-500 px-4 py-2 text-left">Cancelar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500">
                
                    {turnos.map((turno, index) => {
                        const turnoFechaHora = new Date(`${turno.fecha}T${turno.hora}`);
                        const ahora = new Date();
                        const diferenciaHoras = (turnoFechaHora - ahora) / (1000 * 60 * 60);
                        const noCancelable = diferenciaHoras < 24;

                       
                        const formattedDate = new Date(turno.fecha).toLocaleDateString("es-ES", {
                            timeZone: "UTC",
                            day: "2-digit",
                            month: "numeric",
                            year: "numeric",
                        });
                  return (
                    <tr
                    key={turno.id || index} 
                    // key={`${turno.id}-${turno.fecha}-${turno.hora}`}
                    //   key={turno.id}
                      className="bg-cyan-100 text-black px-4 py-2 rounded-md hover:bg-teal-400 hover:text-white"
                    >
                      <td className="border border-cyan-500 px-4 py-2">{formattedDate}</td>
                      <td className="border border-cyan-500 px-4 py-2">{turno.hora}</td>

                      <td className="border border-cyan-500 px-4 py-2">{turno.estado}</td>
                      <td className="border border-cyan-500 px-4 py-2">
                        {turno.nombrePaciente} {turno.apellidoPaciente}
                      </td>
                      <td className="border-cyan-500 px-4 py-2 flex justify-between">
                        <button
                          onClick={() => actualizarAsistencia(turno.id, true)}
                          className={`bg-emerald-400 text-white px-3 py-1 rounded-md hover:bg-green-700 ${
                            noCancelable && "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          Asistió
                        </button>
                        <button
                          onClick={() => actualizarAsistencia(turno.id, false)}
                          className={`bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-indigo-500 ${
                            noCancelable && "opacity-50 cursor-not-allowed"
                          }`}
                          disabled={noCancelable} 
                        >
                          No asistió
                        </button>
                       </td>
                       <td className="border border-cyan-500 px-4 py-2">
                        <button
                         onClick={() => cancelarTurno(turno.id, turno.fecha, turno.hora)}
                         className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 ${
                           noCancelable && "opacity-50 cursor-not-allowed"
                         }`}
                         disabled={noCancelable} 
                        >
                          Cancelar
                        </button>
                       </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
          
        </div>
        <div className="flex justify-center mt-11">
            {/* <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
              <NavLink to="/crear-turno">Reservar Nuevo Turno</NavLink>
            </button> */}
            <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
              <NavLink to="/dashboard-profesional">Volver</NavLink>
            </button>
          </div>
      </div>
    </>
  );
}

export default TurnosList;
