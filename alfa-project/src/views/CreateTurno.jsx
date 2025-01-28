import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./components/Navbar";
import { useNavigate, NavLink } from "react-router-dom";
import Footer from "./components/Footer";

const CreateTurno = () => {
    const fechaRef = useRef("");
    const horaRef = useRef("");
    const [profesionales, setProfesionales] = useState([]);
    const [selectedProfesionalId, setSelectedProfesionalId] = useState("");
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [horasDisponibles, setHorasDisponibles] = useState([]);
    const [selectedFecha, setSelectedFecha] = useState("");

    const { token } = useAuth("state");
    const navigate = useNavigate();
    const { handleTokenExpiration } = useAuth("actions");

    const [isError, setIsError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [diasD, setDiasD] = useState([]);//para mostrar la disponibilidad a los usuarios
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    // fecha local
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];

    // Cargar los profesionales 1ero
    useEffect(() => {
        const fetchProfesionales = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/get_profesionales", {
                    method: "GET",
                });
                const data = await response.json();
                setProfesionales(data || []);
            } catch (error) {
                console.error("Error al obtener los profesionales:", error);
            }
        };
        fetchProfesionales();
    }, []);

    // Disponibilidad del profesional
    const fetchDisponibilidad = async (idProfesional) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/disponibilidad/${idProfesional}`, {
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
                const errorData = await response.json();
                throw new Error(errorData.message || "Error");
            }

            const data = await response.json();
            setDisponibilidad(data || []);
            if (data && data.length > 0) {
                const diasDisponibles = data[0]?.dias_semana?.split(", ") || [];
                setDiasD(diasDisponibles);
            }
        } catch (error) {
            console.error("Error al obtener la disponibilidad:", error);
        }
    };

    useEffect(() => {
        if (selectedProfesionalId) {
            fetchDisponibilidad(selectedProfesionalId);
        }
    }, [selectedProfesionalId]);

    // Filtrar horarios disponibles según el día de la semana, tengo q sumar un dia xq no funciona x la hora local
    const handleFiltrarHorarios = (selectedDate) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + 1);
        const dayOfWeek = diasSemana[date.getDay()]; // Obtener el día de la semana en español
        
        console.log("Día seleccionado:", dayOfWeek);

        const availableHours = [];
        disponibilidad.forEach((horario) => {
            console.log("Días disponibles del profesional:", horario.dias_semana);
            // Verificar si el día seleccionado está entre los días disponibles del profesional
            const diasDisponibles = horario.dias_semana.split(", ");
            if (diasDisponibles.includes(dayOfWeek)) {
                // Crear los horarios disponibles entre la hora de inicio y la hora de fin
                const startHour = parseInt(horario.hora_inicio.split(":")[0]);
                const endHour = parseInt(horario.hora_fin.split(":")[0]);

                for (let hour = startHour; hour < endHour; hour++) {
                    availableHours.push(
                        `${String(hour).padStart(2, "0")}:00`,
                        `${String(hour).padStart(2, "0")}:30`
                    );
                }
            }
        });

        setHorasDisponibles(availableHours);
    };

    const handleFechaChange = (e) => {
        const selectedDate = e.target.value;
        setSelectedFecha(selectedDate);
        handleFiltrarHorarios(selectedDate);
    };

    const handleProfesionalChange = (e) => {
        setSelectedProfesionalId(e.target.value);
    };

    const handleCrearTurno = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setIsError("");
        setSuccessMessage("");
        try {
            const response = await fetch("http://127.0.0.1:5000/crear_turno", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Fecha: fechaRef.current?.value,
                    Hora: horaRef.current?.value,
                    Estado: "Reservado",
                    ID_Profesional: parseInt(selectedProfesionalId || "0", 10),
                }),
            });
            if (response.status === 401) { 
                console.log("Token expirado");
                setIsLoading(false);
                handleTokenExpiration(); 
                return;
            }
            if (response.status === 409) {
                const errorData = await response.json();
                console.error("Error 409:", errorData.msg);
                setIsError("El profesional ya tiene un turno reservado en esa hora.");
                setIsLoading(false); 
                return;
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                setIsError(errorData.msg || "Error al crear el turno");
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            setSuccessMessage(data.msg || "Turno creado exitosamente!");

            setTimeout(() => {
                navigate("/turnos-paciente");
            }, 1000);
        } catch (error) {
            console.error("Error al crear turno:", error);
        }
    };

    return (
        <>
        <div className="bg-cyan-500 min-h-screen w-full">
            <Navbar />
            <div className="bg-cyan-100 pt-8">
            <div className="flex items-center flex-col">
                <div className="bg-cyan-500 shadow-lg rounded-lg p-8 w-full max-w-md m-15 mt-32">
                    <h1 className="text-2xl font-bold text-center mb-6">Crear Turno Médico</h1>

                    <form onSubmit={handleCrearTurno} className="space-y-6">
                        <div>
                            <label htmlFor="profesional" className="block text-sm font-medium text-gray-700">
                                Profesional
                            </label>
                            <select
                                id="profesional"
                                value={selectedProfesionalId}
                                onChange={handleProfesionalChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Seleccionar Profesional</option>
                                {profesionales.map((profesional) => (
                                    <option
                                        key={profesional.id_profesional}
                                        value={profesional.id_profesional}
                                    >
                                        {profesional.nombre} {profesional.apellido} - {profesional.especialidad}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                                Fecha
                            </label>
                            <input
                                type="date"
                                id="fecha"
                                value={selectedFecha || localDate}
                                ref={fechaRef}
                                min={localDate}
                                onChange={handleFechaChange}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
                                Hora
                            </label>
                            <select
                                id="hora"
                                ref={horaRef}
                                required
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Seleccionar hora</option>
                                {horasDisponibles.map((hora) => (
                                    <option key={hora} value={hora}>
                                        {hora}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {diasD.length > 0 && (
                            <p className="mt-4 text-teal-300 text-center">
                                Días Disponibles: {diasD.join(", ")}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full px-4 py-2 rounded-md ${
                                isLoading
                                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                    : "bg-teal-200 text-blue-600 hover:bg-blue-500 hover:text-white"
                            }`}
                        >
                            {isLoading ? "Creando..." : "Crear Turno"}
                        </button>
                    </form>

                    {isError && (
                        <p className="mt-4 text-red-500 text-center">
                            {isError}
                        </p>
                    )}

                    {successMessage && (
                        <p className="mt-4 text-teal-300 text-center">
                            {successMessage}
                        </p>
                    )}
                </div>
                <div className="flex justify-center mt-12 mb-20">
                   <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
                             <NavLink to="/turnos-paciente">Mis Turnos</NavLink>
                   </button>
                   <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
                             <NavLink to="/">Volver</NavLink>
                  </button>
                </div>
                <div className="relative bottom-0 w-full ">
                    <Footer />
                </div>
        </div>
        </div>
      </div>
    </>
    );
};

export default CreateTurno;
