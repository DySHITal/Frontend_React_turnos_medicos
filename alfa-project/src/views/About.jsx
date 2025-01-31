import { useAuth } from '../contexts/AuthContext';

function About() {
    const { userType } = useAuth("state");

    return (
        <>
<main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
  <div className="text-center">
    <h2 className="text-5xl font-bold tracking-tight text-balance text-teal-500 sm:text-7xl">Sobre nosotros</h2>
    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">En esta pagina podras encontrar informacion sobre nosotros y los servicios que ofrecemos.</h1>
    <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
    
            El Dr. Martín Ruiz, director del Centro Médico Integral, se comunicó con el equipo de
        desarrollo para solicitar el diseño de una plataforma que permita gestionar los turnos de las
        diferentes especialidades médicas del centro. El Dr. Ruiz plantea la siguiente situación.
        antiguamente, el personal administrativo gestionaba los turnos mediante llamadas telefónicas
        y una agendafísica, lo que resulta en confusiones con los horarios y dificulta el seguimiento
        de las cancelaciones y reprogramaciones.
        En baseaesto, se buscó crear una plataforma donde tanto los profesionales médicos como
        los pacientes puedan gestionar los turnos de manera eficiente.
 
    </p>
    <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
    Asi nació esta pagina.
    </p>
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <a href={userType === "profesional" ? "/dashboard-profesional" : "/"} className="rounded-md bg-teal-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Volver a pagina principal</a>
      
                
    </div>
  </div>
</main>
 </>
);
}

export default About;