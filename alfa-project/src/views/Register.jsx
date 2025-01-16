import React, { useRef, useState } from "react";

function Register() {
  const nombreRef = useRef("");
  const apellidoRef = useRef("");
  const correoRef = useRef("");
  const dniRef = useRef("");
  const obraSocialRef = useRef("");
  const contrasenaRef = useRef("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleRegister(event) {
    event.preventDefault();
    const nombre = nombreRef.current.value;
    const apellido = apellidoRef.current.value;
    const correo = correoRef.current.value;
    const dni = dniRef.current.value;
    const obra_social = obraSocialRef.current.value;
    const contrasena = contrasenaRef.current.value;

    setIsError(false);

    if (!isLoading) {
        setIsLoading(true);
        fetch("http://127.0.0.1:5000/register", {
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
                console.log("Registro exitoso", data);
                // Opcional: redirigir al login
                window.location.href = "/login";
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
              minLength={6}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Crea una contraseña"
            />
          </div>

          {/* Mensajes de estado */}
          {isLoading && <p className="text-green-500 text-sm">Registrando...</p>}
          {isError && <p className="text-red-500 text-sm">Error al registrarse.</p>}
          {isSuccess && <p className="text-green-500 text-sm">¡Registro exitoso!</p>}

          {/* Botón de Registro */}
          <button
            type="submit"
            className="w-full bg-teal-200 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white"
          >
            Registrarse
          </button>
        </form>

        {/* Enlace para iniciar sesión */}
        <p className="text-center text-sm text-cyan-700 mt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-800 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
