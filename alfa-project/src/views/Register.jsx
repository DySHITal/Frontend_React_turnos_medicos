import React, { useRef, useState } from "react";
import Navbar from './components/Navbar';
import { useNavigate } from "react-router-dom";

function Register() {
  const nombreRef = useRef("");
  const apellidoRef = useRef("");
  const correoRef = useRef("");
  const dniRef = useRef("");
  const obraSocialRef = useRef("");
  const contrasenaRef = useRef("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  function handleRegister(event) {
    event.preventDefault();
    setSuccessMessage("");

    const nombre = nombreRef.current.value;
    const apellido = apellidoRef.current.value;
    const correo = correoRef.current.value;
    const dni = dniRef.current.value;
    const obra_social = obraSocialRef.current.value;
    const contrasena = contrasenaRef.current.value;

    setIsError(false);

    if (!isLoading) {
        setIsLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre,
                apellido,
                correo,
                dni,
                obra_social,
                contrasena,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en el registro");
                }
                return response.json();
            })
            .then((data) => {

                setSuccessMessage (data.msg);
                setTimeout(() => {
                  navigate("/login");
              }, 1000);
            })
            .catch((error) => {
                console.error("Error al registrar usuario:", error);
                setIsError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
}


  return (
    <>
    <Navbar/>
    <div className="flex items-center justify-center min-h-screen bg-cyan-100">
      <div className="bg-cyan-500 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Registro</h1>

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              ref={nombreRef}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div>
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              required
              ref={apellidoRef}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ingresa tu apellido"
            />
          </div>
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              required
              ref={correoRef}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ingresa tu correo"
            />
          </div>
          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
              DNI
            </label>
            <input
              type="text"
              id="dni"
              name="dni"
              required
              ref={dniRef}
              minLength={8}
              maxLength={8}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ingresa tu DNI"
            />
          </div>
          <div>
            <label htmlFor="obra_social" className="block text-sm font-medium text-gray-700">
              Obra Social
            </label>
            <input
              type="text"
              id="obra_social"
              name="obra_social"
              required
              ref={obraSocialRef}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ingresa tu obra social"
            />
          </div>
          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              required
              ref={contrasenaRef}
              minLength={8}
              maxLength={14}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Crea una contraseña"
            />
          </div>

          {isLoading && <p className="text-teal-200 font-semibold">Registrando...</p>}
          {isError && <p className="text-red-500 font-semibold">Error al registrarse.</p>}
          {successMessage && <p className="text-teal-200 font-semibold">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-teal-200 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-sm text-cyan-700 mt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-800 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
    </>
  );
}

export default Register;
