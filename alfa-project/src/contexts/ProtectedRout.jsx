import { useAuth } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, logoutReason } = useAuth("state"); 
    const location = useLocation();

    // Redirigir al login si no está autenticado. manda un msj segun la razon guardada
    if (!isAuthenticated) {
        let message = "Necesitas iniciar sesión para acceder a esta página.";

        if (logoutReason === "expired") {
            message = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
        } else if (logoutReason === "manual") {
            message = "Has cerrado sesión exitosamente.";
        }

        return (
            <Navigate
                to="/login"
                state={{
                    from: location,
                    message,
                }}
            />
        );
    }

    return children;
}
