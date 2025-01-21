import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./components/Navbar";
import { NavLink } from "react-router-dom";

function TurnosPaciente() {
  const [turnos, setTurnos] = useState([]); 
  const [visibleTurnos, setVisibleTurnos] = useState(4);
  const [isLoading, setIsLoading] = useState(true); 
  const [isError, setIsError] = useState(false); 
  const [successMessage, setSuccessMessage] = useState("");

  const { token} = useAuth("state");
  const { handleTokenExpiration } = useAuth("actions");

  useEffect(() => {
    const fetchTurnos = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await fetch("http://127.0.0.1:5000/turnos_paciente", {
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
          const [hours, minutes] = turno.hora.split(":"); // para q salga la fecha en 00:00 en vez de 00:00:00
          
          return {
            id: turno.id_turno,
            fecha: turno.fecha,
            hora: `${hours}:${minutes}`,
            estado: turno.estado,
            nombreProfesional: turno.nombre || "N/A",
            apellidoProfesional: turno.apellido || "N/A",
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
  
   const mostrarMasTurnos = () => {
    setVisibleTurnos((prev) => prev + 4); 
  };

    const mostrarMenosTurnos = () => {
    setVisibleTurnos((prev) => Math.max(4, prev - 4));
  };

  const cancelarTurno = async (idTurno) => {
    setIsLoading(true);
    setIsError(false);
    setSuccessMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/cancelar_turno/${idTurno}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
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
      
      setTurnos((prevTurnos) => prevTurnos.filter((turno) => turno.id !== idTurno));
      
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
      <div className="h-full sm:h-[450px] md:h-[560px] lg:h-[890px] bg-cyan-100 py-8">
        <div className="max-w-4xl mx-auto bg-cyan-500 shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Mis Turnos</h1>
          {successMessage && (
            <p className="text-teal-200 font-semibold text-center mb-4">{successMessage}</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-teal-200 text-blue-600">
                  <th className="border border-gray-200 px-4 py-2 text-left">Fecha</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Hora</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Estado</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Profesional</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Cancelar</th>
                </tr>
              </thead>
              <tbody>
                {turnos.slice(0, visibleTurnos).map((turno) => (
                  <tr

                    key={turno.id}
                    className="bg-cyan-100 text-black px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white"
                  > 
                    <td className="border border-gray-200 px-4 py-2">{turno.fecha}</td>
                    <td className="border border-gray-200 px-4 py-2">{turno.hora}</td>
                    <td className="border border-gray-200 px-4 py-2">{turno.estado}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {turno.nombreProfesional} {turno.apellidoProfesional}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <button
                      
                        onClick={() => cancelarTurno(turno.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4">
            <button
               onClick={mostrarMenosTurnos}
              className="bg-teal-300 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-500 hover:text-white"
            >
              Mostrar Menos
            </button>
            <button
              onClick={mostrarMasTurnos}
              className="bg-teal-300 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-500 hover:text-white"
            >
              Mostrar Más
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
            <NavLink to="/crear-turno">Reservar Nuevo Turno</NavLink>
          </button>
          <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
                    <NavLink to="/">Volver</NavLink>
          </button>
        </div>
      </div>
    </>
  );
}

export default TurnosPaciente;
