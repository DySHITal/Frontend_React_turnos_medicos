import { createContext, useReducer, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext({
    state: {},
    actions: {},
});

const ACTIONS = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT",
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOGIN:
            return {
                ...state,
                token: action.payload.token,
                userType: action.payload.userType,
                isAuthenticated: true,
                logoutReason: null, // Resetear razón al iniciar sesión
            };
        case ACTIONS.LOGOUT:
            return {
                isAuthenticated: false,
                token: null,
                userType: null,
                logoutReason: action.payload?.reason || null, // Guardar la razón
            };
        default:
            return state;
    }
}

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        token: localStorage.getItem("authToken"),
        userType: localStorage.getItem("userType"),
        isAuthenticated: localStorage.getItem("authToken") ? true : false,        
    });


    const navigate = useNavigate();
    const location = useLocation();

    const actions = {
        login: (token, userType) => {
            dispatch({ type: ACTIONS.LOGIN, payload: { token, userType } });
            localStorage.setItem("authToken", token);
            localStorage.setItem("userType", userType);
            const destination = userType === "profesional" ? "/dashboard-profesional" : "/";
            navigate(destination);
        },
        logout: () => {
            dispatch({ type: ACTIONS.LOGOUT, payload: { reason: "manual" } }); // Cierre manual
            localStorage.removeItem("authToken");
            localStorage.removeItem("userType");
            navigate("/login", {
                state: { message: "Has cerrado sesión exitosamente." },
            });
        },
        handleTokenExpiration: () => {
            dispatch({ type: ACTIONS.LOGOUT, payload: { reason: "expired" } }); // Expiración del token
            localStorage.removeItem("authToken");
            localStorage.removeItem("userType");
            navigate("/login", {
                state: { message: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." },
            });
        },
    };
    

    return (
        <AuthContext.Provider value={{ state, actions }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(type) {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context[type];
}

export { AuthContext, AuthProvider, useAuth };
