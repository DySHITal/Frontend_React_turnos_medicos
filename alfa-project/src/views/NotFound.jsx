import { useAuth } from '../contexts/AuthContext';

function NotFound() {
    const { userType } = useAuth("state");

    return (
        <>
<main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
  <div className="text-center">
    <p className="text-base font-semibold text-teal-500">404</p>
    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Pagina No encontrada</h1>
    <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Perdón, no pudimos encontrar la pagina que buscas.</p>
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <a href={userType === "profesional" ? "/dashboard-profesional" : "/"} className="rounded-md bg-teal-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Volver a pagina principal</a>
      
                
    </div>
  </div>
</main>
 </>
);
}

export default NotFound;