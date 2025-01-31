import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import Navbar from './components/Navbar';


function Login() {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const message = location.state?.message;
  
    const { login } = useAuth("actions");
    
    function handleLogin(event) {
        event.preventDefault();
        setIsError(false);
        if (!isLoading) {
            setIsLoading(true);
            fetch( `${import.meta.env.VITE_API_URL}login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    correo: emailRef.current.value,
                    contrasena: passwordRef.current.value,
                }),
            })
                .then(async(response) => {
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.msg || "No se pudo iniciar sesión");
                    }
                    return data;
                })
                .then((response) => {
                // Ver si respuesta es un array (profesional) o un objeto (paciente)
                  if (Array.isArray(response)) {
                      const { access_token } = response[0];
                      const userType = response[1] ? "profesional" : "paciente";
                      login(access_token, userType);
                  } else {
                      const { access_token } = response;
                      const userType = "paciente"; 
                      
                      login(access_token, userType);
                  }
                })
                .catch((error) => {
                    console.error("Error al iniciar sesión", error);
                    setIsError(error.message);
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
        <h1 className="text-2xl font-bold text-center mb-6">Inicio de Sesión</h1>
        {message && (
                <div className="alert alert-warning text-orange-500 bg-yellow-100 rounded-lg p-4 m-1 mb-4">
                    {message}
                </div>
            )}
        
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
          {isError && <p className="text-red-500 text-sm">{isError}.</p>}

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
    </>
    );
}

export default Login;
