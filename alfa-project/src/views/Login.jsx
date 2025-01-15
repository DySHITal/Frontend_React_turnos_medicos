import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";


function Login() {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth("actions");
    
    function handleLogin(event) {
        event.preventDefault();
        setIsError(false);
        if (!isLoading) {
            setIsLoading(true);
            fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    correo: emailRef.current.value,
                    contrasena: passwordRef.current.value,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("No se pudo iniciar sesión");
                    }
                    return response.json();
                })
                .then((response) => {
                    const { access_token } = response;
                    login(access_token);
                        
                })
                .catch((error) => {
                    console.error("Error al iniciar sesión", error);
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
        <h1 className="text-2xl font-bold text-center mb-6">Inicio de Sesión</h1>
        
        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              ref={emailRef}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ingresa tu correo"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              ref={passwordRef}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {/* Mensaje de error */}
          {isLoading && <p className="text-green-500 text-sm">Cargando...</p>}
          {isError && <p className="text-red-500 text-sm">Error al cargar los datos.</p>}

          {/* Botón de Inicio de Sesión */}
          <button
            type="submit"
            className="w-full bg-teal-200 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Enlace para registrarse */}
        <p className="text-center text-sm text-cyan-700 mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-800 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
    );
}

export default Login;
