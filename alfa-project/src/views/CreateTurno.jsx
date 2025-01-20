import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"; 
import Navbar from './components/Navbar';
import { useNavigate, NavLink } from "react-router-dom";


function CreateTurno() {
    const fechaRef = useRef("");
    const horaRef = useRef("");
    const [profesionales, setProfesionales] = useState([]);
    const [selectedProfesionalId, setSelectedProfesionalId] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const { token } = useAuth("state");
    const navigate = useNavigate();
    const { handleTokenExpiration } = useAuth("actions");

    useEffect(() => {
        const fetchProfesionales = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/get_profesionales", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    console.log("Token expirado");
                    handleTokenExpiration();
                    return;
                }

                const data = await response.json();
                setProfesionales(data || []);
            } catch (error) {
                console.error("Error al obtener los profesionales:", error);
                setIsError(true);
            }
        };

        fetchProfesionales();
    }, [token, handleTokenExpiration]);

    const handleCrearTurno = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setIsError(false);
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
                handleTokenExpiration(); 
                return;
            }
            if (response.status === 409) {
                const errorData = await response.json();
                setIsError(true);
                setSuccessMessage("");
                throw new Error(errorData.msg || "El profesional ya tiene un turno reservado en esa hora.");
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el turno");
            }

            const data = await response.json();
            
            setSuccessMessage(data.msg || "Turno creado exitosamente!");

            setTimeout(() => {
                navigate("/turnos-paciente");
            }, 1000);
        } catch (error) {
            console.error("Error al crear turno:", error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <Navbar/> 
        <div className="flex items-center flex-col min-h-screen bg-cyan-100 ">
            <div className="bg-cyan-500 shadow-lg rounded-lg p-8 w-full max-w-md m-15 mt-32">
                <h1 className="text-2xl font-bold text-center mb-6">Crear Turno Médico</h1>

                <form onSubmit={handleCrearTurno} className="space-y-6">
                    <div>
                        <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
                            Fecha
                        </label>
                        <input
                            type="date"
                            id="fecha"
                            ref={fechaRef}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
                            Hora
                        </label>
                        <input
                            type="time"
                            id="hora"
                            ref={horaRef}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                            Estado
                        </label>
                        <input
                            type="text"
                            id="estado"
                            value="Reservado"
                            readOnly
                            disabled
                            className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="profesional" className="block text-sm font-medium text-gray-700">
                            Profesional
                        </label>
                        <select
                            id="profesional"
                            value={selectedProfesionalId}
                            onChange={(e) => setSelectedProfesionalId(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>Seleccionar Profesional</option>
                            {profesionales.length > 0 ? (
                            profesionales.map((profesional) => (
                                <option 
                                    key={profesional.id_profesional} 
                                    value={profesional.id_profesional}
                                >
                                    {profesional.nombre} {profesional.apellido} - {profesional.especialidad}
                                </option>
                            ))
                        ) : (
                            <option disabled>Cargando profesionales...</option>
                        )}
                        </select>
                    </div>

                    {isLoading && <p className="text-green-500 text-sm">Creando turno...</p>}
                    {isError && <p className="text-red-500 text-sm">Error: {isError.toString()}</p>}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

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
            </div>
            <div className="flex justify-center mt-8">
          <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
            <NavLink to="/turnos-paciente">Mis Turnos</NavLink>
          </button>
          <button className="bg-teal-300 text-blue-600 px-6 py-3 mx-6 rounded-md hover:bg-blue-500 hover:text-white">
                    <NavLink to="/">Volver</NavLink>
          </button>
        </div>
        </div>
        </>
    );
}

export default CreateTurno;
