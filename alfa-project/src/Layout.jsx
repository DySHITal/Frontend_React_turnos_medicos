import { Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";



export default function Layout() {
    
    return (
        <>
            <AuthProvider>
                <div className="h-screen">
                     <Outlet />
                </div>
            </AuthProvider>
            
        </>
        
    );
}