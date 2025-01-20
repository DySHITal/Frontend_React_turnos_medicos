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
                isAuthenticated: true,
            };
        case ACTIONS.LOGOUT:
            return {
                isAuthenticated: false,
                token: null
            };
        default:
            return state;
    }
}

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        token: localStorage.getItem("authToken"),
        isAuthenticated: localStorage.getItem("authToken") ? true : false,        
    });


    const navigate = useNavigate();
    const location = useLocation();

    const actions = {
        login: (token) => {
            dispatch({ type: ACTIONS.LOGIN, payload: { token }});
            localStorage.setItem("authToken", token);
            const origin = location.state?.from?.pathname || "/";
            navigate(origin);
        },
        logout: async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/logout", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${state.token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                } else {
                    console.error("Error al cerrar sesión en el servidor");
                }
            } catch (error) {
                console.error("Error de red al cerrar sesión:", error);
            }
            dispatch({ type: ACTIONS.LOGOUT });
            localStorage.removeItem("authToken");
            navigate("/login");
        },
        handleTokenExpiration: () => {  
            dispatch({ type: "LOGOUT" });
            localStorage.removeItem("authToken");
            navigate("/login", { state: { message: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." } });
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
